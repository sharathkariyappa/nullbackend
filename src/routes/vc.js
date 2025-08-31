import { Router } from "express";
import { SignJWT, importJWK, importPKCS8, importSPKI } from "jose";
import { nanoid } from "nanoid";
import { requireGitHub } from "../middleware/auth.js";
import { fetchGitHubContributorData } from "../services/github.js";
import { fetchOnchainStats } from "../services/onchain.js";
import { flaskModelScore } from "../services/scoring.js";
import { saveVC, getVC } from "../services/vcStatus.js";
import { ethers } from "ethers";
import { cfg } from "../config.js";

export const vcRouter = Router();

const ISSUER_DID = "did:web:nullproof.xyz";

async function loadPrivateKey() {
  try {
    const keyData = cfg.vcissuerkey;
    if (keyData.startsWith('{')) {
      const jwk = JSON.parse(keyData);
      
      if (jwk.kty === 'EC') {
        if (!jwk.crv || !jwk.x || !jwk.y || !jwk.d) {
          throw new Error('Invalid EC JWK: missing required fields (crv, x, y, d)');
        }
        // Ensure proper curve
        if (!['P-256', 'P-384', 'P-521', 'secp256k1'].includes(jwk.crv)) {
          throw new Error(`Unsupported EC curve: ${jwk.crv}`);
        }
        
        const base64urlRegex = /^[A-Za-z0-9_-]+$/;
        if (!base64urlRegex.test(jwk.x)) {
          throw new Error('Invalid base64url encoding in x coordinate');
        }
        if (!base64urlRegex.test(jwk.y)) {
          throw new Error('Invalid base64url encoding in y coordinate');
        }
        if (!base64urlRegex.test(jwk.d)) {
          throw new Error('Invalid base64url encoding in d (private key)');
        }
        
        if (jwk.crv === 'secp256k1') {
          if (jwk.x.length !== 43 || jwk.y.length !== 43 || jwk.d.length !== 43) {
            throw new Error(`Invalid secp256k1 coordinate lengths: x=${jwk.x.length}, y=${jwk.y.length}, d=${jwk.d.length} (expected 43 each)`);
          }
        }
        
        console.log('JWK validation passed, attempting import...');
      } else if (jwk.kty === 'RSA') {
        if (!jwk.n || !jwk.e || !jwk.d) {
          throw new Error('Invalid RSA JWK: missing required fields (n, e, d)');
        }
      }
      
      return await importJWK(jwk);
    }
    
    if (keyData.includes('-----BEGIN')) {
      if (keyData.includes('PRIVATE KEY')) {
        return await importPKCS8(keyData, 'ES256K');
      } else if (keyData.includes('PUBLIC KEY')) {
        throw new Error('Public key provided instead of private key');
      }
    }
    
    throw new Error('Unsupported key format. Use JWK JSON or PEM format.');
    
  } catch (error) {
    console.error('Key loading error:', error.message);
    throw new Error(`Failed to load private key: ${error.message}`);
  }
}

let privateKey;
let keyAlgorithm = 'ES256K';

async function initializeKey() {
  if (!privateKey) {
    privateKey = await loadPrivateKey();
    
    const keyData = cfg.vcissuerkey;
    if (keyData.startsWith('{')) {
      const jwk = JSON.parse(keyData);
      if (jwk.alg) {
        keyAlgorithm = jwk.alg;
      } else if (jwk.kty === 'EC') {
        const curveToAlg = {
          'P-256': 'ES256',
          'P-384': 'ES384',
          'P-521': 'ES512',
          'secp256k1': 'ES256K'
        };
        keyAlgorithm = curveToAlg[jwk.crv] || 'ES256K';
      } else if (jwk.kty === 'RSA') {
        keyAlgorithm = 'RS256';
      }
    }
  }
  return privateKey;
}

vcRouter.post("/issue", requireGitHub, async (req, res) => {
  const token = req.githubToken;
  try {
    const { address, signature, message, githubUsername } = req.body;

    if (!address || !signature || !message) {
      return res.status(400).json({ error: "Address, signature, and message are required" });
    }

    // 1. Verify wallet signature
    const recovered = ethers.verifyMessage(message, signature);
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: "Signature verification failed" });
    }

    // 2. Fetch score
    const [gh, oc] = await Promise.all([
      fetchGitHubContributorData(token, githubUsername),
      fetchOnchainStats(address)
    ]);
    const scoreData = await flaskModelScore(gh, oc);

    // 3. Create VC payload
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 60 * 60 * 24 * 90; // 90 days expiry
    const jti = `urn:uuid:${nanoid()}`;

    const vcPayload = {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      "type": ["VerifiableCredential", "DegenScoreCredential"],
      "credentialSubject": {
        "id": `did:pkh:eip155:1:${address}`,
        "degenScore": scoreData.score,
        "snapshotAt": new Date().toISOString(),
        ...(githubUsername && { github: githubUsername })
      },
      "credentialSchema": {
        "id": "https://nullproof.xyz/schemas/degen-score-v1.json",
        "type": "JsonSchemaValidator2018"
      },
      "credentialStatus": {
        "id": `https://api.nullproof.xyz/vc/status/${encodeURIComponent(jti)}`,
        "type": "StatusList2021Entry"
      }
    };

    // 4. Initialize key and sign VC as JWT
    const key = await initializeKey();
    
    const jwt = await new SignJWT({ vc: vcPayload })
      .setProtectedHeader({
        alg: keyAlgorithm,
        kid: `${ISSUER_DID}#keys-1`,
        typ: "JWT"
      })
      .setIssuer(ISSUER_DID)
      .setSubject(`did:pkh:eip155:1:${address}`)
      .setJti(jti)
      .setIssuedAt(now)
      .setNotBefore(now)
      .setExpirationTime(exp)
      .sign(key);

    // 5. Save VC status in DB
    await saveVC({
      vcId: jti,
      address,
      credentialHash: jwt,
      status: "active"
    });

    return res.json({ jwt, vc: vcPayload });
  } catch (err) {
    console.error("VC Issue Error:", err);
    
    // Provide more specific error messages
    if (err.message.includes('Invalid JWK') || err.message.includes('Failed to load private key')) {
      return res.status(500).json({ 
        error: "Key configuration error", 
        details: err.message 
      });
    }
    
    res.status(500).json({ error: "Failed to issue VC" });
  }
});

vcRouter.get("/status/:jti", async (req, res) => {
  try {
    const status = await getVC(req.params.jti);
    if (!status) return res.status(404).json({ revoked: false });
    return res.json({ revoked: status.status === "revoked" });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch VC status" });
  }
});

vcRouter.get("/by-wallet/:address", async (req, res) => {
  try {
    const walletAddress = req.params.address.toLowerCase();
    const vc = await getVC(walletAddress);

    if (!vc || vc.length === 0) {
      return res.status(404).json({ error: "No VC found for this wallet" });
    }

    return res.json({ vc });
  } catch (err) {
    console.error("Fetch VC by wallet error:", err);
    res.status(500).json({ error: "Failed to fetch VC for wallet" });
  }
});

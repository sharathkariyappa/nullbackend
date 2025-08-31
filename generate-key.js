import { generateKeyPair, exportJWK, SignJWT, importJWK } from 'jose';

async function main() {
  try {
    console.log('🔐 Generating secp256k1 key pair for ES256K...\n');
    
    const { privateKey, publicKey } = await generateKeyPair('ES256K');
    
    const privateJWK = await exportJWK(privateKey);
    const publicJWK = await exportJWK(publicKey);
    
    privateJWK.alg = 'ES256K';
    publicJWK.alg = 'ES256K';
    
    console.log('PRIVATE JWK (use this in your VC_ISSUER_KEY):');
    console.log('='.repeat(60));
    console.log(JSON.stringify(privateJWK, null, 2));
    
    console.log('COPY THIS EXACT LINE TO YOUR .env FILE:');
    console.log('='.repeat(60));
    console.log(`VC_ISSUER_KEY=${JSON.stringify(privateJWK)}`);
    
    console.log('PUBLIC JWK (for verification/DID document):');
    console.log('='.repeat(60));
    console.log(JSON.stringify(publicJWK, null, 2));
    
    console.log('VALIDATION:');
    console.log('='.repeat(60));
    console.log('Key type:', privateJWK.kty);
    console.log('Curve:', privateJWK.crv);
    console.log('Algorithm:', privateJWK.alg);
    console.log('x coordinate length:', privateJWK.x?.length);
    console.log('y coordinate length:', privateJWK.y?.length);
    console.log('d (private key) length:', privateJWK.d?.length);
    
    const base64urlRegex = /^[A-Za-z0-9_-]+$/;
    console.log('x is valid base64url:', base64urlRegex.test(privateJWK.x));
    console.log('y is valid base64url:', base64urlRegex.test(privateJWK.y));
    console.log('d is valid base64url:', base64urlRegex.test(privateJWK.d));
    
    console.log('TESTING KEY (creating test JWT):');
    console.log('='.repeat(60));
    
    const testKey = await importJWK(privateJWK);
    const testJWT = await new SignJWT({ test: 'payload', timestamp: Date.now() })
      .setProtectedHeader({ alg: 'ES256K', typ: 'JWT' })
      .setIssuer('test-issuer')
      .setSubject('test-subject')
      .setExpirationTime('1h')
      .sign(testKey);
    
    console.log('Test JWT created successfully!');
    console.log('JWT preview:', testJWT.substring(0, 100) + '...');
    
    console.log('SUCCESS! Your key is valid and ready to use.');
    console.log('Copy the VC_ISSUER_KEY line above to your .env file.');
    
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error('Full error:', error);
  }
}

main();
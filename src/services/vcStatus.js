import { db } from "../firebase.js";

// Save a newly issued VC to DB
export async function saveVC({ address, vcId, credentialHash, status }) {
  if (!address || !vcId || !credentialHash || !status) {
    throw new Error("Missing required fields: address, vcId, credentialHash, status");
  }

  const vcRef = db.collection("vc").doc(vcId);
  const vcDoc = await vcRef.get();

  if (vcDoc.exists) {
    throw new Error("VC with this ID already exists");
  }

  const vcData = {
    address: address.toLowerCase(),
    vcId,
    credentialHash,
    status,
    createdAt: new Date().toISOString(),
  };

  await vcRef.set(vcData);
  return { id: vcId, status };
}

// Fetch all VCs for a wallet address
export async function getVC(address) {
  if (!address) return null;

  const snapshot = await db
    .collection("vc")
    .where("address", "==", address.toLowerCase())
    .get();

  if (snapshot.empty) return null;

  return snapshot.docs[0].data();
}

// Fetch VC by VC ID
export async function getVCById(vcId) {
  if (!vcId) return null;
  const vcRef = db.collection("vc").doc(vcId);
  const snapshot = await vcRef.get();
  return snapshot.exists ? snapshot.data() : null;
}

// Update status (revocation, expiration, etc.)
export async function updateVCStatus(vcId, status) {
  if (!vcId || !status) throw new Error("vcId and status are required");

  const vcRef = db.collection("vc").doc(vcId);
  const vcDoc = await vcRef.get();

  if (!vcDoc.exists) {
    throw new Error("VC not found");
  }

  await vcRef.update({ status, updatedAt: new Date().toISOString() });
  return { id: vcId, status };
}

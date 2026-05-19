export type KycDocType = "gst" | "aadhaar" | "pan" | "portfolio_certificate";
export type KycStatus = "pending" | "under_review" | "approved" | "rejected";

export interface KycDoc {
  id: number;
  userId: number;
  docType: KycDocType;
  value: string;
  note: string;
  status: KycStatus;
  uploadedAt: string;
  reviewedAt?: string;
}

const store = new Map<number, KycDoc[]>();
let nextId = 1;

export function getKycDocs(userId: number): KycDoc[] {
  return store.get(userId) ?? [];
}

export function upsertKycDoc(userId: number, docType: KycDocType, value: string, note: string): KycDoc {
  const list = store.get(userId) ?? [];
  const doc: KycDoc = {
    id: nextId++, userId, docType, value: value.trim(),
    note: note.slice(0, 200), status: "pending",
    uploadedAt: new Date().toISOString(),
  };
  const filtered = list.filter(d => d.docType !== docType);
  store.set(userId, [...filtered, doc]);
  return doc;
}

export function reviewKycDoc(docId: number, status: KycStatus): KycDoc | null {
  for (const [uid, docs] of store.entries()) {
    const idx = docs.findIndex(d => d.id === docId);
    if (idx !== -1) {
      docs[idx] = { ...docs[idx], status, reviewedAt: new Date().toISOString() };
      store.set(uid, docs);
      return docs[idx];
    }
  }
  return null;
}

export function isVendorKycApproved(userId: number): boolean {
  const docs = store.get(userId) ?? [];
  return docs.some(d => d.status === "approved");
}

export function getAllKycDocs(): KycDoc[] {
  const all: KycDoc[] = [];
  for (const docs of store.values()) all.push(...docs);
  return all.sort((a, b) => b.id - a.id);
}

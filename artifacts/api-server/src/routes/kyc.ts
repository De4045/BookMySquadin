import { Router, type IRouter } from "express";
import { getKycDocs, upsertKycDoc, reviewKycDoc, getAllKycDocs, type KycDocType, type KycStatus } from "../lib/kycStore.js";
import { getUserById } from "../lib/usersStore.js";

const router: IRouter = Router();

function sessionUserId(req: Parameters<Parameters<typeof router.get>[1]>[0]): number | undefined {
  const session = req.session as unknown as Record<string, unknown>;
  const uid = session["userId"];
  return typeof uid === "number" ? uid : undefined;
}

function sessionRole(req: Parameters<Parameters<typeof router.get>[1]>[0]): string | undefined {
  const uid = sessionUserId(req);
  if (!uid) return undefined;
  return getUserById(uid)?.role;
}

const VALID_DOC_TYPES: KycDocType[] = ["gst", "aadhaar", "pan", "portfolio_certificate"];

router.get("/kyc", (req, res) => {
  const uid = sessionUserId(req);
  if (!uid) { res.status(401).json({ error: "Not authenticated" }); return; }
  res.json({ docs: getKycDocs(uid) });
});

router.post("/kyc", (req, res) => {
  const uid = sessionUserId(req);
  if (!uid) { res.status(401).json({ error: "Not authenticated" }); return; }
  const { docType, value, note = "" } = req.body as { docType?: string; value?: string; note?: string };
  if (!docType || !VALID_DOC_TYPES.includes(docType as KycDocType)) {
    res.status(400).json({ error: `docType must be one of: ${VALID_DOC_TYPES.join(", ")}` }); return;
  }
  if (!value?.trim()) { res.status(400).json({ error: "value is required" }); return; }
  const doc = upsertKycDoc(uid, docType as KycDocType, value, note);
  req.log.info({ uid, docType, docId: doc.id }, "KYC doc submitted");
  res.status(201).json({ doc });
});

router.get("/kyc/all", (req, res) => {
  if (sessionRole(req) !== "admin") { res.status(403).json({ error: "Admin only" }); return; }
  res.json({ docs: getAllKycDocs() });
});

router.patch("/kyc/:id/status", (req, res) => {
  if (sessionRole(req) !== "admin") { res.status(403).json({ error: "Admin only" }); return; }
  const docId = Number(req.params["id"]);
  if (isNaN(docId)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { status } = req.body as { status?: string };
  const validStatuses: KycStatus[] = ["pending", "under_review", "approved", "rejected"];
  if (!status || !validStatuses.includes(status as KycStatus)) {
    res.status(400).json({ error: `status must be one of: ${validStatuses.join(", ")}` }); return;
  }
  const doc = reviewKycDoc(docId, status as KycStatus);
  if (!doc) { res.status(404).json({ error: "Doc not found" }); return; }
  req.log.info({ docId, status }, "KYC doc reviewed");
  res.json({ doc });
});

export default router;

import { Router, type IRouter } from "express";
import { getPortfolio, addPhoto, deletePhoto } from "../lib/portfolioStore.js";
import { users } from "../lib/usersStore.js";

const router: IRouter = Router();

function sessionUserId(req: Parameters<Parameters<typeof router.get>[1]>[0]): number | undefined {
  const session = req.session as unknown as Record<string, unknown>;
  const uid = session["userId"];
  return typeof uid === "number" ? uid : undefined;
}

router.get("/portfolio", (req, res) => {
  const uid = sessionUserId(req);
  if (!uid) { res.status(401).json({ error: "Not authenticated" }); return; }
  res.json({ photos: getPortfolio(uid) });
});

router.get("/portfolio/public", (req, res) => {
  const name = (req.query["name"] as string | undefined)?.toLowerCase().trim() ?? "";
  const vendor = users.find(u => u.role === "vendor" && u.name.toLowerCase().includes(name));
  if (!vendor) { res.json({ photos: [] }); return; }
  res.json({ photos: getPortfolio(vendor.id) });
});

router.post("/portfolio", (req, res) => {
  const uid = sessionUserId(req);
  if (!uid) { res.status(401).json({ error: "Not authenticated" }); return; }
  const { url, caption = "" } = req.body as { url?: string; caption?: string };
  if (!url) { res.status(400).json({ error: "url is required" }); return; }
  try {
    const photo = addPhoto(uid, url, caption);
    req.log.info({ uid, photoId: photo.id }, "Portfolio photo added");
    res.status(201).json({ photo });
  } catch (err: unknown) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Failed" });
  }
});

router.delete("/portfolio/:id", (req, res) => {
  const uid = sessionUserId(req);
  if (!uid) { res.status(401).json({ error: "Not authenticated" }); return; }
  const photoId = Number(req.params["id"]);
  if (isNaN(photoId)) { res.status(400).json({ error: "Invalid id" }); return; }
  const ok = deletePhoto(uid, photoId);
  if (!ok) { res.status(404).json({ error: "Photo not found" }); return; }
  res.json({ success: true });
});

export default router;

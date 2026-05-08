import { Router, type IRouter } from "express";
import { VENDOR_DATA } from "../data/vendors.js";

const router: IRouter = Router();

router.get("/vendors", (req, res) => {
  const { category, city, q } = req.query as {
    category?: string;
    city?: string;
    q?: string;
  };

  let results = [...VENDOR_DATA];

  if (category) {
    results = results.filter(
      (v) => v.category.toLowerCase() === category.toLowerCase(),
    );
  }

  if (city) {
    results = results.filter(
      (v) => v.city.toLowerCase() === city.toLowerCase(),
    );
  }

  if (q) {
    const query = q.toLowerCase();
    results = results.filter((v) =>
      [v.name, v.company, v.city, v.state]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }

  const cities = [
    ...new Set(VENDOR_DATA.map((v) => v.city).filter(Boolean)),
  ].sort();

  const categories = [
    ...new Set(VENDOR_DATA.map((v) => v.category).filter(Boolean)),
  ].sort();

  res.json({
    vendors: results,
    total: results.length,
    cities,
    categories,
  });
});

export default router;

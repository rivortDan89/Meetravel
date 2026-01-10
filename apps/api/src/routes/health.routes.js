import { Router } from "express";
const router = Router();

// GET /health
router.get("/", (req, res) => {
  res.json({ status: "API OK" });
});

export default router;
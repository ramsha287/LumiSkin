// routes/progressRoutes.js
import express from "express";
import Progress from "../models/Tracking.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const progress = await Progress.create(req.body);
  res.json(progress);
});

router.get("/:routineId", async (req, res) => {
  const entries = await Progress.find({ routineId: req.params.routineId });
  res.json(entries);
});

export default router;

// routes/routines.js
import express from "express";
import Routine from "../models/Routine.js";
import mongoose from "mongoose";

const router = express.Router();

// Create routine manually
router.post("/", async (req, res) => {
  try {
    const routine = await Routine.create({
      userId: req.body.userId,   // ✅ consistent field
      name: req.body.name,
      steps: req.body.steps
    });
    res.json(routine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get routines for a user
router.get("/:userId", async (req, res) => {
  try {
    const routines = await Routine.find({ userId: req.params.userId }); // ✅ fixed field name
    res.json(routines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate routine automatically
router.post("/generate/:userId", async (req, res) => {
  try {
    // ✅ match the field name in your analysis collection
    const analysis = await mongoose.connection.db
      .collection("analysis")
      .findOne({ user_id: req.params.userId });

    if (!analysis) {
      return res.status(404).json({ error: "No analysis found for this user" });
    }

    let routineSteps = [];

    // ✅ use schema shape (object with product/time/order)
    const addStep = (product, time = "morning") => {
      routineSteps.push({ product, time, order: routineSteps.length + 1 });
    };

    // Skin type
    if (analysis.skin_profile?.skin_type === "oily") {
      addStep("Gel-based cleanser");
      addStep("Oil-free moisturizer");
      addStep("Sunscreen SPF 50", "morning");
    } else if (analysis.skin_profile?.skin_type === "dry") {
      addStep("Hydrating cleanser");
      addStep("Thick moisturizer");
      addStep("Sunscreen SPF 30", "morning");
    } else if (analysis.skin_profile?.skin_type === "sensitive") {
      addStep("Gentle cleanser");
      addStep("Fragrance-free moisturizer");
      addStep("Mineral sunscreen", "morning");
    } else {
      addStep("Foam cleanser");
      addStep("Light moisturizer");
      addStep("Sunscreen SPF 40", "morning");
    }

    // Acne
    if (["mild", "moderate"].includes(analysis.skin_profile?.acne)) {
      addStep("Salicylic acid toner");
    } else if (analysis.skin_profile?.acne === "severe") {
      addStep("Consult dermatologist for treatment");
    }

    // Pigmentation
    if (analysis.skin_profile?.hyperpigmentation) {
      addStep("Vitamin C serum");
    }

    // Wrinkles
    if (analysis.skin_profile?.wrinkles) {
      addStep("Retinol (night use)", "night");
    }

    // Save routine
    const routine = await Routine.create({
      userId: req.params.userId,
      name: "Auto-generated routine",
      steps: routineSteps,
    });

    res.json(routine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update routine (add step OR overwrite steps)
router.patch("/:routineId", async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.routineId);
    if (!routine) return res.status(404).json({ error: "Routine not found" });

    if (req.body.step) {
      // Add single step
      routine.steps.push({
        product: req.body.step,
        time: "morning",
        order: routine.steps.length + 1,
        completed: false,
      });
    } else if (req.body.steps) {
      // Replace entire steps array
      routine.steps = req.body.steps;
    }

    await routine.save();
    res.json(routine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//delete routine
router.delete("/:routineId", async (req, res) => {
  try {
    const routine = await Routine.findByIdAndDelete(req.params.routineId);
    if (!routine) return res.status(404).json({ error: "Routine not found" });
    res.json(routine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//edit routine name
router.put("/:routineId", async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.routineId);
    if (!routine) return res.status(404).json({ error: "Routine not found" });
    routine.name = req.body.name;
    await routine.save();
    res.json(routine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




export default router;

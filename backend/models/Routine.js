// models/Routine.js
import mongoose from "mongoose";

const routineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  steps: [
    {
      product: String,
      time: { type: String, enum: ["morning", "night"] },
      order: Number
    }
  ]
}, { timestamps: true });

export default mongoose.model("Routine", routineSchema);

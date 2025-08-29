// models/Progress.js
import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  routineId: { type: mongoose.Schema.Types.ObjectId, ref: "Routine" },
  photo : { 
    data: Buffer,
    contentType: String
   }, 
  analysis: Object,   // reuse saved analysis (pores, acne, skin tone, etc.)
}, { timestamps: true });

export default mongoose.model("Progress", progressSchema);

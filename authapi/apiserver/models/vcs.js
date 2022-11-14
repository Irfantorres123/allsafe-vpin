import mongoose from "mongoose";

const VCSSchema = new mongoose.Schema({
  matrix: String,
  charset: String,
  rows: Number,
  cols: Number,
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
});

const CallSchema = new mongoose.Schema({
  serialNumbers: { type: Array, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  failed_count: { type: Number, default: 0 },
});
export const VCSModel = mongoose.model("VCS", VCSSchema);
export const CallModel = mongoose.model("Call", CallSchema);

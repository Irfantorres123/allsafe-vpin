import mongoose from "mongoose";

const CodeSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  vcs: { type: mongoose.Schema.Types.ObjectId, ref: "VCS" },
  used: { type: Boolean, default: false },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Code", CodeSchema);

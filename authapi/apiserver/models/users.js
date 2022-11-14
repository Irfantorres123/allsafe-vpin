import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  admin: { type: Boolean, default: false },
  accountNumber: { type: String, default: "" },
  service: { type: mongoose.Types.ObjectId, ref: "Service" },
});

export const User = mongoose.model("User", UserSchema);

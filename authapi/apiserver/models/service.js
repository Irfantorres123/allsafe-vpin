import mongoose from "mongoose";
const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  token: { type: String, required: true, unique: true },
});

const Service = mongoose.model("Service", ServiceSchema);
export default Service;

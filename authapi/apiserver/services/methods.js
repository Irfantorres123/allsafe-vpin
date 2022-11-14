import Service from "../models/service.js";
import { v4 } from "uuid";
export async function existsService(name) {
  if (!name) throw new Error("No name provided");
  let service = await Service.findOne({ name }).exec();
  if (!service) return false;
  return true;
}
//Could cause an error if v4 returns the same token, but its highly unlikely
export async function createService(name, description) {
  if (!name) throw new Error("No name provided");
  let token = generateAppToken();
  let service = await Service.create({
    name: name,
    description: description,
    token: token,
  });
  return [service, token];
}

export function generateAppToken() {
  return v4();
}

export async function fetchAllServices() {
  let services = await Service.find().exec();
  return services;
}

export async function verifyService(req, res, next) {
  try {
    let serviceId = req.headers["x-service-id"];
    if (!serviceId) next(createHttpError(401, "No service id provided"));
    let service = await Service.findOne({ token: serviceId }).exec();
    if (!service) {
      next(createHttpError(401, "Invalid serviceId"));
      return;
    }
    req.service = service;
    next();
  } catch (err) {
    console.log(err);
    next(createHttpError(500));
  }
}

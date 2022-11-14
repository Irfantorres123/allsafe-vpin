import { User } from "../models/users.js";
export async function createUser(
  identifier,
  accountNumber,
  serviceId,
  admin = false
) {
  if (!identifier) throw new Error("No identifier provided");
  let user = await User.create({
    identifier: identifier,
    admin: admin,
    service: serviceId,
    accountNumber: accountNumber,
  });
  return user;
}

export async function createAdminUser(identifier) {
  let user = await User.create({ identifier: identifier, admin: true });
  return user;
}

export async function existsUser(identifier, accountNumber, serviceId) {
  if (!identifier) throw new Error("No identifier provided");
  let user = await User.findOne({
    identifier: identifier,
    service: serviceId,
    accountNumber: accountNumber,
  }).exec();
  if (!user) return false;
  return user;
}

export async function getUser(identifier, serviceId) {
  if (!identifier) throw new Error("No identifier provided");
  let user = await User.findOne({
    identifier: identifier,
    service: serviceId,
    admin: serviceId === undefined ? true : false,
  }).exec();
  if (!user) throw new Error("No user found");
  return user;
}

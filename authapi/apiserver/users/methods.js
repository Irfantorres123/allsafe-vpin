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
  let user =
    (await User.findOne({
      identifier: identifier,
      service: serviceId,
    }).exec()) ||
    (await User.findOne({
      accountNumber: accountNumber,
      service: serviceId,
    }));
  if (!user) return false;
  return user;
}

export async function getUser(identifier, serviceId) {
  if (!identifier) throw new Error("No identifier provided");
  let user =
    (await await User.findOne({
      identifier: identifier,
      service: serviceId,
      admin: serviceId === undefined ? true : false,
    }).exec()) ||
    (await User.findOne({
      accountNumber: accountNumber,
      service: serviceId,
      admin: serviceId === undefined ? true : false,
    }));
  if (!user) throw new Error("No user found");
  return user;
}

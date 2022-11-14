import crypto from "crypto";
import jwt from "jsonwebtoken";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(dirname(fileURLToPath(import.meta.url)));
//returns the sha256 hash in hex format of the concatenation of all strings passed to it
export function sha256(...params) {
  params.forEach((param) => {
    if (typeof param !== "string")
      throw Error("The parameters should be of type String");
  });
  let hash = crypto.createHash("sha256");
  hash.update(...params.join(""));
  return hash.digest("hex");
}

export async function pbkdf2(string, salt, iterations, length, digest) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      string,
      salt,
      iterations,
      length,
      digest,
      function (err, hashedPassword) {
        if (err) {
          reject("Error while computing password hash");
        }
        resolve(hashedPassword.toString("hex"));
      }
    );
  });
}

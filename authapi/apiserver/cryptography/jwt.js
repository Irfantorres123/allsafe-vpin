import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const __rootdir = dirname(__dirname);

export function generateJsonWebToken(payload) {
  var privateKey = fs.readFileSync(
    path.join(__rootdir, "sslcert", "key.pem"),
    "utf8"
  );
  return jwt.sign(payload, privateKey, { algorithm: "RS256", expiresIn: "1d" });
}

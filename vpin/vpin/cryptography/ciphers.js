import crypto from "crypto-js";
var aes_key = "d0b0f3e1ec32a1d08ae1fb4a9373ef94";
export function encrypt(data) {
  return crypto.AES.encrypt(data, aes_key).toString();
}
export function decrypt(data) {
  return crypto.AES.decrypt(data, aes_key);
}

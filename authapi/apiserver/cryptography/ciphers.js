import crypto from "crypto";
var ivString = "1d08ae1fb4a9373ef94d0b0f3e1ec32a";

var aes_key = Buffer.from(process.env.AES_KEY, "hex");
var iv = Buffer.from(ivString, "hex");
//data must be a buffer
export function encrypt(data) {
  let cipher = crypto.createCipheriv("aes-256-cbc", aes_key, iv);
  return Buffer.concat([cipher.update(data), cipher.final()]);
}
//data must be a buffer
export function decrypt(data) {
  let decipher = crypto.createDecipheriv("aes-256-cbc", aes_key, iv);
  return Buffer.concat([decipher.update(data), decipher.final()]);
}

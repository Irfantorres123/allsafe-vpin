import crypto from "crypto";

export function generateRandomCharacters(charset, length) {
  var result = "";
  var charsetLength = charset.length;
  for (var i = 0; i < length; i++) {
    result += charset.charAt(crypto.randomInt(charsetLength));
  }
  return result;
}

export function alphaNumericString(length) {
  return generateRandomCharacters(
    "abcdefghijklmnopqrstuvwxyz0123456789",
    length
  );
}

export function numericString(length) {
  return generateRandomCharacters("0123456789", length);
}

export function asciiString(length) {
  return crypto.randomBytes(length).toString("ascii");
}

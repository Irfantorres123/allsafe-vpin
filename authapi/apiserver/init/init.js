import { readFileSync } from "fs";
import { User } from "../models/users.js";
import { createService, existsService } from "../services/methods.js";
import { createAdminUser, existsUser, getUser } from "../users/methods.js";
function fetchPublicKey() {
  try {
    var publicKey = readFileSync("sslcert/pubkey.pem", "utf-8");
    return publicKey;
  } catch (err) {
    throw new Error("Couldn't read public key\n" + err);
  }
}

function fetchPrivateKey() {
  try {
    var privateKey = readFileSync("sslcert/key.pem", "utf-8");
    return privateKey;
  } catch (err) {
    throw new Error("Couldn't read private key.\n" + err);
  }
}

export function fetchSSLCredentials() {
  var privateKey = fetchPrivateKey();
  var certificate;
  try {
    certificate = readFileSync("sslcert/server.crt", "utf8");
  } catch (err) {
    console.warn("Couldn't read ssl certificate");
  }

  return { key: privateKey, cert: certificate };
}
//run when app is started
export async function initialize() {
  let admin = await existsUser("admin");
  if (!admin) admin = await createAdminUser("admin");
  console.log(admin._id);
  const bankList = {
    BOB: "Bank of Baroda",
    BOI: "Bank of India",
    CAN: "Canara Bank",
    CBI: "Central Bank of India",
    CIT: "Citi Bank",
    CNB: "Corporation Bank",
    AXB: "Axis Bank",
    SBI: "State Bank of India",
    UNI: "Union Bank",
    UBI: "United Bank of India",
    HDFC: "HDFC Bank",
    ICICI: "ICICI Bank",
    IDBI: "IDBI Bank",
  };
  Object.keys(bankList).forEach(async (key) => {
    if (await existsService(bankList[key])) return;
    await createService(bankList[key]);
  });
}

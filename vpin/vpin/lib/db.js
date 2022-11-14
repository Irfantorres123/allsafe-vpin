import AsyncStorage from "@react-native-async-storage/async-storage";
import { encrypt } from "../cryptography/ciphers";

const DOMAIN = "http://192.168.150.88:5000";
async function loadVCS(code) {
  try {
    let response = await fetch(`${DOMAIN}/vcs/code?code=${code}`);
    let data = await response.json();
    return { status: "success", data: data };
  } catch (err) {
    return { status: "error", error: err.message };
  }
}

async function storeObjectinDB(obj) {
  let objString = JSON.stringify(obj);
  await AsyncStorage.setItem(obj.appName, objString);
}

async function storeVCSLocally(data, userId, username) {
  let {
    matrix,
    charset,
    rows,
    cols,
    serviceName: appName,
    serviceDescription: appDescription,
    serviceId,
  } = data;
  try {
    if (!matrix) throw new Error("No matrix provided");
    if (!charset) throw new Error("No charset provided");
    if (!rows) throw new Error("No rows provided");
    if (!cols) throw new Error("No cols provided");
    let matrixString = JSON.stringify(matrix);
    let encryptedMatrixString = encrypt(matrixString);
    let vcsObject = {
      id: serviceId,
      matrix: encryptedMatrixString,
      charset: charset,
      rows: rows,
      cols: cols,
      appName: appName,
      appDescription: appDescription,
      userId: userId,
      username: username,
    };
    await storeObjectinDB(vcsObject);
    return { status: "success" };
  } catch (err) {
    return { status: "error", error: err.message };
  }
}

export async function loadAndStoreVCS(code, userId, username) {
  let vcsLoadResult = await loadVCS(code);
  if (vcsLoadResult.status === "success") {
    let vcsStorageResult = await storeVCSLocally(
      vcsLoadResult.data,
      userId,
      username
    );
    if (vcsStorageResult.status === "success") {
      return { status: "success" };
    }
    return { status: "error", error: vcsStorageResult.error };
  }
  return { status: "error", error: vcsLoadResult.error };
}

export async function loadVCSFromDb() {}

import { VCSModel } from "../models/vcs.js";
import { CallModel } from "../models/vcs.js";
import { encrypt, decrypt } from "../cryptography/ciphers.js";
import { charsets, generateVCS, loadVCS } from "./vcs.js";
import { alphaNumericString } from "../cryptography/random.js";
import Code from "../models/code.js";
import Service from "../models/service.js";

export async function createVCSAndGetCode(userId, appId) {
  let vcs = generateVCS(charsets.ALPHANUMERIC, 2, 10, 10);
  let code = await storeVCSandGetLinkCode(vcs, userId, appId);
  return code;
}

async function generateLinkCode(vcsId, serviceId, userId) {
  if (!vcsId) throw new Error("No vcsId provided");
  let code = alphaNumericString(32);
  await Code.create({
    vcs: vcsId,
    token: code,
    service: serviceId,
    user: userId,
  });
  return code;
}

export async function fetchVCSFromCode(code) {
  if (!code) throw new Error("No code provided");
  let codeQueryResults = await Code.findOne({ token: code })
    .populate("vcs")
    .exec();
  if (!codeQueryResults) throw new Error("Code not found ");
  if (codeQueryResults.used) throw new Error("Code already used");
  await Code.updateOne({ token: code }, { used: true }).exec();
  let app = await Service.findById(codeQueryResults.service).exec();
  let vcs = codeQueryResults.vcs;
  vcs.matrix = decrypt(Buffer.from(vcs.matrix, "base64"));
  return [vcs, app];
}

export async function storeVCSandGetLinkCode(vcs, userId, serviceId) {
  if (!vcs) throw new Error("No vcs provided");
  let vcsObject = await storeVCSinDb(
    vcs.matrix,
    vcs.charset,
    vcs.rows,
    vcs.cols,
    userId
  );

  return await generateLinkCode(vcsObject._id, serviceId, userId);
}

export async function storeVCSinDb(matrix, charset, rows, cols, userId) {
  if (!userId) throw new Error("No userId provided");
  if (!matrix) throw new Error("No matrix provided");
  if (!charset) throw new Error("No charset provided");
  if (!rows) throw new Error("No rows provided");
  if (!cols) throw new Error("No cols provided");
  let matrixString = JSON.stringify(matrix);
  let encryptedMatrixString = encrypt(Buffer.from(matrixString));
  let vcs = VCSModel.create({
    matrix: encryptedMatrixString.toString("base64"),
    charset: charset,
    rows: rows,
    cols: cols,
    user: userId,
  });
  if (!vcs) throw new Error("Couldn't create VCS ");
  return vcs;
}

export async function retrieveVCSfromDb(userId) {
  let vcs = await VCSModel.findOne({
    user: userId,
  }).exec();
  if (!vcs) throw new Error("No VCS found");
  let matrixString = vcs.matrix;
  let decryptedMatrixString = decrypt(Buffer.from(matrixString, "base64"));
  let matrix = JSON.parse(decryptedMatrixString);
  return loadVCS(vcs.charset, vcs.rows, vcs.cols, matrix);
}

export async function storeCallinDb(call, response, user) {
  let callObject = await CallModel.create({
    serialNumbers: call.serialNumbers,
    response: response,
    user: user._id,
  });
  if (!callObject) throw new Error("Couldn't create Call ");
  return callObject;
}

export async function verifyCallResponse(response, userId) {
  if (!response) return false;
  let call = await getCall(userId);
  let expectedResponse = call.response;
  if (response === expectedResponse) return true;
  return false;
}
//Fetch last call made upto 5 minutes ago
export async function getCall(userId) {
  let call = await CallModel.find({
    user: userId,
    createdAt: { $gte: new Date(Date.now() - minutesToMilliseconds(1)) },
  })
    .sort({ _id: -1 })
    .limit(1);
  if (!call) {
    throw new Error("No call found");
  }
  return call[0];
}

function minutesToMilliseconds(min) {
  return min * 60 * 1000;
}

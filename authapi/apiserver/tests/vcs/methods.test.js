import { charsets, generateVCS, VCS, loadVCS } from "../../vcs/vcs.js";
import * as vcsMethods from "../../vcs/methods.js";
import * as userMethods from "../../users/methods.js";
import { decodeCall } from "../../vcs/call.js";

test("Tests if vcs is stored in database", async () => {
  let vcs = generateVCS(charsets.ALPHANUMERIC, 4, 10, 10);
  let user = await userMethods.createUser("vcstest", undefined, true);
  await vcsMethods.storeVCSinDb(
    vcs.matrix,
    vcs.charset,
    vcs.rows,
    vcs.cols,
    user._id
  );
  let retrievedVCS = await vcsMethods.retrieveVCSfromDb(user._id);
  let isIdentical = vcs.isIdentical(retrievedVCS);
  expect(isIdentical).toBe(true);
});

test("Tests call storage and retrieval", async () => {
  let vcs = generateVCS(charsets.ALPHANUMERIC, 4, 10, 10);
  let user = await userMethods.createUser("calltest", undefined, true);
  await vcsMethods.storeVCSinDb(
    vcs.matrix,
    vcs.charset,
    vcs.rows,
    vcs.cols,
    user._id
  );
  let call = vcs.generateCall(4);
  let response = decodeCall(call, vcs);
  await vcsMethods.storeCallinDb(call, response, user._id);
  let verified = await vcsMethods.verifyCallResponse(response, user._id);
  expect(verified).toBe(true);
});

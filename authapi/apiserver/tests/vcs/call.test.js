import { generateVCS, charsets } from "../../vcs/vcs.js";

test("Tests if call is created correctly", () => {
  let vcs1 = generateVCS(charsets.ALPHANUMERIC, 4, 10, 10);
  let call1 = vcs1.generateCall(4);
  expect(call1.serialNumberLength).toBe(2);
  expect(call1.serialNumbers.length).toBe(4);
  let vcs2 = generateVCS(charsets.ALPHANUMERIC, 4, 11, 11);
  let call2 = vcs2.generateCall(7);
  expect(call2.serialNumberLength).toBe(4);
  expect(call2.serialNumbers.length).toBe(7);
});

import { charsets, generateVCS, VCS, loadVCS } from "../../vcs/vcs.js";
import { Call } from "../../vcs/call.js";
test("Tests VCS generation to produce VCS of expected dimensions and character units", () => {
  let vcs = generateVCS(charsets.ALPHANUMERIC, 4, 4, 4);
  expect(vcs.rows).toBe(4);
  expect(vcs.cols).toBe(4);
  expect(vcs.matrix.length).toBe(4);
  for (let i = 0; i < vcs.matrix.length; i++) {
    expect(vcs.matrix[i].length).toBe(4);
  }
});

test("Checks if character units contain characters from given character set", () => {
  let vcs = generateVCS(charsets.ALPHANUMERIC, 4, 10, 10);

  for (let i = 0; i < vcs.rows; i++) {
    for (let j = 0; j < vcs.cols; j++) {
      expect(vcs.matrix[i][j].length).toBe(4);
      for (let k = 0; k < vcs.matrix[i][j].length; k++) {
        expect(vcs.matrix[i][j][k]).toMatch(
          new RegExp(`[${charsets.ALPHANUMERIC}]`)
        );
      }
    }
  }
});

test("Checks if vcs toString method returns a string", () => {
  let vcs = generateVCS(charsets.ALPHANUMERIC, 4, 10, 10);
  expect(typeof vcs.toString()).toBe("string");
});

test("Checks if vcs reverseCharset function returns an object of expected size", () => {
  let vcs = generateVCS(charsets.ALPHANUMERIC, 4, 10, 10);
  expect(typeof vcs.reverseCharset()).toBe("object");
  expect(Object.keys(vcs.reverseCharset()).length).toBe(vcs.charset.length);
});

test("Checks if the call generation function returns an instance of Call", () => {
  let vcs = generateVCS(charsets.ALPHANUMERIC, 4, 10, 10);
  let call = vcs.generateCall(4);
  expect(call).toBeInstanceOf(Call);
});

test("Check if loadVCS function returns an instance of VCS and check if objects are identical", () => {
  let vcs = generateVCS(charsets.ALPHANUMERIC, 4, 10, 10);
  let loadedVCS = loadVCS(charsets.ALPHANUMERIC, 10, 10, vcs.matrix);
  expect(loadedVCS).toBeInstanceOf(VCS);
  let isIdentical = vcs.isIdentical(loadedVCS);
  expect(isIdentical).toBe(true);
  expect(loadedVCS.revMap).toEqual(vcs.revMap);
});

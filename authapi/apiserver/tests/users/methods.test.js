import * as methods from "../../users/methods.js";

test("Tests if user is created", async () => {
  let random = Math.random().toString();
  let username = "usertest" + random;
  let user = await methods.createUser(username, undefined, true);
  expect(user.identifier).toBe(username);
  expect(user.admin).toBe(true);
});

test("Tests if user exists check works", async () => {
  let random = Math.random().toString();
  let username = "usertest" + random;
  await methods.createUser(username, undefined, true);
  let testUserExists = await methods.existsUser(username);
  expect(testUserExists).toBe(true);
});

test("Tests if fetching user works", async () => {
  let random = Math.random().toString();
  let username = "usertest" + random;
  await methods.createUser(username);
  let userObj = await methods.getUser(username);
  expect(userObj.identifier).toBe(username);
});

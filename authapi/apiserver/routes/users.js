import express from "express";
import Service from "../models/service.js";
import { loadVCS } from "../vcs/vcs.js";
import { decodeCall } from "../vcs/call.js";
import { createUser, existsUser, getUser } from "../users/methods.js";
import { createVCSAndGetCode, retrieveVCSfromDb } from "../vcs/methods.js";
import createHttpError from "http-errors";
import { verifyService } from "../services/methods.js";
var router = express.Router();

/*
x-service-id header should be equal to service id allocated to the app
body must contain a unique username for the app
adds user to database associated with this app
*/
router.post("/v1/register", verifyService, async (req, res, next) => {
  try {
    let service = req.service;
    let { username, accountNumber } = req.body;
    let user = await existsUser(username, accountNumber, service._id);
    if (!user)
      user = await createUser(username, accountNumber, service._id, false);
    let code = await createVCSAndGetCode(user._id, service._id);
    res.json({
      code: code,
      userId: user._id,
    });
  } catch (err) {
    console.log(err);
    next(createHttpError(500));
  }
});

router.post("/v1/authenticate", verifyService, async (req, res, next) => {
  try {
    let service = req.service;
    let { username } = req.body;
    let user = await getUser(username, service._id);
    if (!user) {
      return res.status(401).json({
        error: "User does not exist",
      });
    }
    let vcsObject = await retrieveVCSfromDb(user._id);
    if (!vcsObject) {
      return res.status(401).json({
        error: "User does not have a VCS",
      });
    }
    let call = vcsObject.generateCall(4);
    let response = decodeCall(call, vcsObject);
    res.json({
      call: call.serialNumbers.join(""),
      response: response,
    });
  } catch (err) {
    console.log(err);
    next(createHttpError(500, err.message));
  }
});
export default router;

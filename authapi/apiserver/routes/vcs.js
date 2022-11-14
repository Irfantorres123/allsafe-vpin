import express from "express";
import createHttpError from "http-errors";
import { User } from "../models/users.js";
import { verifyService } from "../services/methods.js";
import { getUser } from "../users/methods.js";
import { decodeCall } from "../vcs/call.js";
import {
  fetchVCSFromCode,
  getCall,
  retrieveVCSfromDb,
  storeCallinDb,
  verifyCallResponse,
} from "../vcs/methods.js";
var router = express.Router();

router.get("/code", async (req, res, next) => {
  try {
    let { code } = req.query;
    let [vcs, service] = await fetchVCSFromCode(code);
    res.json({
      matrix: JSON.parse(vcs.matrix),
      charset: vcs.charset,
      rows: vcs.rows,
      cols: vcs.cols,
      serviceName: service.name,
      serviceDescription: service.description,
      serviceId: service._id,
    });
  } catch (err) {
    console.log(err);
    next(createHttpError(500, err.message));
  }
});

router.get("/call", async (req, res, next) => {
  try {
    let { userId } = req.query;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        error: "User does not exist",
      });
    }
    let vcsObject = await retrieveVCSfromDb(userId);
    if (!vcsObject) {
      return res.status(401).json({
        error: "User does not have a VCS",
      });
    }
    let call = await getCall(userId);
    res.json({
      call: call,
    });
  } catch (err) {
    console.log(err);
    next(createHttpError(500, err.message));
  }
});

router.get("/generate-call", verifyService, async (req, res, next) => {
  try {
    let service = req.service;
    let { username } = req.query;
    let user = await getUser(username, service._id);

    let vcsObject = await retrieveVCSfromDb(user._id);
    if (!vcsObject) {
      return res.status(401).json({
        error: "User does not have a VCS",
      });
    }
    let call = vcsObject.generateCall(4);
    let response = decodeCall(call, vcsObject);
    console.log(user._id);
    await storeCallinDb(call, response, user._id);
    res.json({
      status: "success",
    });
  } catch (err) {
    console.log(err);
    next(createHttpError(500, err.message));
  }
});

router.get("/verify", verifyService, async (req, res, next) => {
  try {
    let service = req.service;
    let { username, response } = req.query;
    let user = await getUser(username, service._id);
    let verified = await verifyCallResponse(response, user._id);
    if (verified) {
      res.json({
        status: "success",
      });
    } else {
      res.json({
        status: "failure",
      });
    }
  } catch (err) {
    console.log(err);
    next(createHttpError(500, err.message));
  }
});

export default router;
/*
["Qi", "9r", "4q", "oB", "up", "5E", "Zj", "TC", "Ms", "rD"],
["dX", "gz", "aB", "jy", "3v", "YK", "4e", "tB", "2N", "P4"],
["Qw", "mq", "7x", "5e", "7s", "PO", "Ej", "d4", "yS", "ql"],
["7V", "75", "pz", "NI", "r8", "RW", "0s", "ra", "3m", "bS"],
["v4", "Ge", "S6", "lM", "Yx", "5W", "Nk", "gg", "SW", "4c"],
["X1", "Lx", "Pu", "fU", "bf", "0J", "FB", "Qg", "GD", "4k"],
["P2", "oG", "2n", "AM", "qd", "Am", "Hp", "fQ", "1Z", "Wz"],
["LD", "Fn", "f6", "yQ", "XW", "R9", "Bj", "jJ", "Ub", "E4"],
["SU", "aJ", "wL", "MK", "wx", "ir", "jK", "kA", "SC", "bX"],
["wH", "lC", "xZ", "ZC", "jr", "v1", "u9", "3r", "YC", "g0"];

23080269
5eMs4qWz
*/

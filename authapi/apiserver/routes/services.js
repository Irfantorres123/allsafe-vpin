import express from "express";
import createHttpError from "http-errors";
import {
  createService,
  existsService,
  fetchAllServices,
} from "../services/methods.js";
import { User } from "../models/users.js";
var router = express.Router();

function verifyAdmin(req, res, next) {
  try {
    let adminId = req.headers["x-admin-id"];
    let user = User.findOne({ _id: adminId, admin: true });
    if (!user) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
    next();
  } catch (err) {
    next(createHttpError(500));
  }
}
//Should probably log which admin registered the app
router.post("/register", verifyAdmin, async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (await existsService(name)) {
      return res.status(400).json({
        error: "App name already exists",
      });
    }
    const [service, token] = await createService(name, description);
    res.json({ appToken: token });
  } catch (err) {
    console.log(err);
    next(createHttpError(500));
  }
});

router.get("/list", async (req, res, next) => {
  try {
    const services = await fetchAllServices();
    res.json(services);
  } catch (err) {
    next(createHttpError(500));
  }
});

export default router;

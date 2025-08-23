import express from "express";
import * as dotenv from "dotenv";
import { encrypt, decrypt } from "../utils/functions/encryption.js";
import User from "../mongodb/models/user.js";

dotenv.config();

const router = express.Router();

/* router.route("/").get(async (req, res) => {
  res.status(200).json({ success: true, message: "route is working" });
}); */

router.route("/").post(async (req, res) => {
  try {
    const { sub, name, picture } = req.body;

    let response;
    const doesUserExist = await User.findOne({ sub });

    if (!doesUserExist) {
      response = await User.create({
        sub,
        name,
        userPhoto: picture,
        apiKey: null,
      });
    } else {
      response = "user already exists";
    }

    const sessionObj = {
      sub,
      name,
      picture,
    };

    /* Object.keys(sessionObj).forEach((key) => {
      req.session[key] = sessionObj[key];
    }); */

    req.session.user = sessionObj;
    req.session.save();

    res.status(201).send({ success: true, message: response });
  } catch (error) {
    res.status(500).send({ success: false, message: "Server error: " + error });
  }
});


export default router;

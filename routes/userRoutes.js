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

    Object.keys(sessionObj).forEach((key) => {
      req.session[key] = sessionObj[key];
    });

    req.session.save();

    res.status(201).send({ success: true, message: response });
  } catch (error) {
    res.status(500).send({ success: false, message: "Server error: " + error });
  }
});

router
  .route("/api-key/:userId?")
  .get(async (req, res) => {
    const { userId } = req.params;

    if (!userId && userId == "") {
      res.status(400).json({
        success: false,
        message: "User id not found",
      });

      return;
    }

    const user = await User.findOne({ sub: userId });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "User does not exist",
      });
      return;
    }

    //success
    const decryptedApiKey =
      decrypt(`${user.apiKey}`) ?? typeof user?.apiKey === "string"
        ? user.apiKey
        : "";
    res.status(200).json({
      success: true,
      message: "Api key retrieval successful",
      data: {
        sub: user.sub,
        apiKey: decryptedApiKey,
      },
    });
  })
  .post(async (req, res) => {
    try {
      const { sub, apiKey } = req.body;

      if (!sub || !apiKey) {
        res.status(400).json({
          success: false,
          message: "Required payload missing: sub or apiKey",
        });
      }

      const user = await User.findOne({ sub: sub });

      if (!user) {
        res.status(500).json({
          success: false,
          message: "The user was not found to update the api key to",
        });
        return;
      }

      const encryptedApiKey = encrypt(apiKey);
      const updateRes = await User.updateOne(
        { sub },
        { $set: { apiKey: encryptedApiKey } }
      );
      console.log(updateRes);

      if (!updateRes || !updateRes.acknowledged) {
        res.status(500).json({
          success: false,
          message: "The api key could not be updated",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Api key updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Server: Unknown error caught: ${error}`,
      });
    }
  });

export default router;

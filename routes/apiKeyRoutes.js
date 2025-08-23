import express from "express";
import User from "../mongodb/models/user.js";
import { encrypt, decrypt } from "../utils/functions/encryption.js";

const apiKeyRoutes = express.Router();

apiKeyRoutes
  .route("/:userId?")
  .get(async (req, res) => {
    const { userId } = req.params;
    console.log('apikey', userId);
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
    let decryptedApiKey = decrypt(`${user.apiKey}`) ?? "";

    if (!decryptedApiKey) {
      decryptedApiKey = "";
    }

    console.log("decrypted key: ", decryptedApiKey);
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

export default apiKeyRoutes;

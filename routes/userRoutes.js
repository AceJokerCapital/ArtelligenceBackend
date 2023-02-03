import express from 'express';
import * as dotenv from 'dotenv';

import User from '../mongodb/models/user.js';

dotenv.config();

const router = express.Router();

router.route('/').post(async (req, res) => {


   try {

      const { sub, name, picture } = req.body;

      let response;
      const doesUserExist = await User.findOne({ sub });

      if (doesUserExist == '') {
         response = await User.create({
            sub: sub,
            name: name,
            userPhoto: picture,
         })
      } else {

         response = 'user already exists';

      }

      res.status(201).send({ success: true, message: response });

   } catch (error) {

      res.status(500).send({ success: false, message: 'Server error: ' + error })
   }

})





export default router;
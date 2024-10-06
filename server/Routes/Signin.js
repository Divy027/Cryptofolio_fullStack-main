const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

const jwtSecret = process.env.SECRET;

const { body } = require("express-validator");

router.post(
  "/Signin",
  body("email", "invalid email").isEmail(),
  body("password", "too small").isLength({ min: 5 }),
  async (req, res) => {
    try {
      const username = req.body.email;
      const pswd = req.body.password;
      console.log(pswd);
      let userdata = await User.findOne({ email: username });
      console.log({ userdata });

      if(!userdata) res.send("No such user found");

      const data = {
        user: {
          id: userdata._id,
        },
      };
      const authToken = jwt.sign(data, jwtSecret);

      const comparepswd = await bcrypt.compare(pswd, userdata.password);
      console.log(comparepswd);
      if (userdata && comparepswd) {
        res.send({ userdata, authToken });
      } else {
        res.send("No such user found");
      }
    } catch (error) {
      console.log(error);
      
    }
  }
);

module.exports = router;

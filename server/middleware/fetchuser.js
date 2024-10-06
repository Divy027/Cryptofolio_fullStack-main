const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

const jwtSecret = process.env.SECRET;

const fetchuser = (req, res,next) => {
  const authToken = req.body.Token;
  if (!authToken) {
    console.log("token notfound");
  }
  try {
    const data = jwt.verify(authToken, jwtSecret);
    req.user=data.user;
    next();
    
  } catch (e) {}
};
module.exports = { fetchuser };

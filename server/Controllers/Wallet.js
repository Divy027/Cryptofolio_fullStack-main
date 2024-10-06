const Transaction = require("../models/Transactions");
const Wallet = require("../models/Wallet");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

const jwtSecret = process.env.SECRET;

const getwalletAmount = async (req, res) => {
  console.log(req.body);
  const authToken = req.body.login;
  const userdata = jwt.verify(authToken, jwtSecret);
  console.log(userdata.user.id);
  console.log("we will get amount");

  await Wallet.find({ UserId: userdata.user.id }).then(async (data) => {
    console.log(data);
    res.send(data);
  });
};
const getallTransaction = async (req, res) => {
  console.log(req.body);
  const authToken = req.body.login;
  const userdata = jwt.verify(authToken, jwtSecret);
  console.log(userdata.user.id);
  console.log("we will get all Transaction");

  let dataempty=[];
  await Transaction.find({ UserId: userdata.user.id }).then(async (data) => {
    console.log(
      "-----------------------------we will get all Transaction--------------------------------------"
    );
    if(data.length!==0){

      console.log(data[0].Transaction);
      res.send(data[0].Transaction);
    }else{
      res.send(dataempty);
    }
  });
};

module.exports = { getwalletAmount, getallTransaction };

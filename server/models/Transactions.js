//table
const mongoose = require("mongoose");

const subTransaction = new mongoose.Schema({
  img:{ type: String, require: true },
  CoinId: { type: String, require: true },
  CoinName: { type: String, require: true },
  Quantity: { type: Number, require: true },
  Amount: { type: Number, require: true },
  Price: { type: Number, require: true },
  Date: { type: String },
  type: { type: String },
});

const transactionSchema = new mongoose.Schema({
  UserId: {
    type: String,
    require: true,
  },
  Transaction: [subTransaction]
});

module.exports = mongoose.model("transaction", transactionSchema);

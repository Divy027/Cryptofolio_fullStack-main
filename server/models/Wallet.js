const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  UserId: {
    type: String,
    require: true,
  },
  Amount: {
    type: Number,
  },
  Invested: {
    type: Number,
  },
});

module.exports = mongoose.model("wallet", walletSchema);

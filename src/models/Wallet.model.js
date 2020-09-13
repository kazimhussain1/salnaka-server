const mongoose = require("mongoose");

const walletSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  capitalAmount: {
    type: Number,
    required: false,
    default: 0,
  },
  currentAmount: {
    type: Number,
    required: false,
    default: 0,
  },
});

module.exports = mongoose.model("Wallet", walletSchema);

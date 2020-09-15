const mongoose = require("mongoose");

const packageSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: [
    {
      type: String,
      required: true,
    },
  ],
  profitRange: {
    start: {
      type: Number,
      required: true,
    },
    end: {
      type: Number,
      required: true,
    },
  },
  profitRate: {
    type: Number,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Package", packageSchema);

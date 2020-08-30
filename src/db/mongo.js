const mongoose = require("mongoose");


mongoose
  .connect("mongodb://localhost", { useNewUrlParser: true , useUnifiedTopology: true})
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = mongoose.Connection;

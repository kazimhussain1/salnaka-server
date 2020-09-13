const mongoose = require("mongoose");


mongoose
  .connect("mongodb://localhost/salnaka_db", 
            { useNewUrlParser: true ,
              useUnifiedTopology: true, 
              useFindAndModify:false,
              useCreateIndex: true
          })
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = mongoose.Connection;
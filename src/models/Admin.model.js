const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
          username: {
            type: String,
            required: true,
          },
          type:{
            type: String,
            default: "admin"
          },
          password: {
            type: String,
            required: true
          },
                    
    }, {
      timestamps: true,
      versionKey: false,
    }
);

module.exports = mongoose.model("Admin", adminSchema);
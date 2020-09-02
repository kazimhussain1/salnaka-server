const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
          },
          lastName: {
            type: String,
            required: true
          },
          username: {
            type: String,
            required: true,
          },
          email: {
            type: String,
            required: true,
          },
          password: {
            type: String,
            required: true
          },
          phone:{
            type: Number,
            required: true
          },
          wallet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Wallet",
            required: true
          },
          package: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Package",
            required: false,
            default: false
          },
          verified: {
            type: Boolean,
            required: false,
            default: false
          },
          profilePhotoUrl: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Media",
            required: false,
            default: "NO PHOTO"
          },
          type:{
              seller:{
                  type: Boolean,
                  required: false,
                  default: false
              },
              ad_publisher:{
                  type: Boolean,
                  required: false,
                  default: false
              },
              earner:{
                  type: Boolean,
                  required: false,
                  default: false
              },
              buyer:{
                type:Boolean,
                required: false,
                default: false
              }
          },
          
          
    }, {
      timestamps: true,
      versionKey: false,
    }
);

module.exports = mongoose.model("User", userSchema);
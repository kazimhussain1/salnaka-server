const Admin = require("../models/admin.model");
const User = require("../models/user.model");
const Package = require("../models/package.model");
const Wallet = require("../models/wallet.model");
const Media = require("../models/media.model");

const bcrypt = require("bcryptjs");

const { sign } = require("jsonwebtoken");
const { TOKEN_EXPIRATION_TIME } = require("../config");
const { findOne, update } = require("../models/user.model");

module.exports = {
  async loginAdmin(req, res) {
    const { username, password } = req.body;

    try {
      // See if admin exists
      const admin = await Admin.findOne({
        username: username,
      });

      if (!admin) {
        return res.status(401).json({
          errors: [
            {
              code: 401,
              msg: "Invalid Credentials",
            },
          ],
        });
      }

      const isMatch = await bcrypt.compare(password, admin.password);

      if (!isMatch) {
        return res.status(401).json({
          errors: [
            {
              code: 401,
              msg: "Invalid Credentials",
            },
          ],
        });
      }

      // Return jsonwebtoken
      const payload = {
        admin: {
          _id: admin._id,
        },
      };

      sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: TOKEN_EXPIRATION_TIME,
        },
        (err, token) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              error: err.toString(),
            });
          }

          const adminObject = admin.toObject();

          delete adminObject["password"];

          const success = {
            token,
            admin: adminObject,
          };

          res.status(200).json({
            success,
          });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).json(
        {
          errors: [err.toString()],
        },
        null
      );
    }
  },
  async createAdmin(req, res) {
    const { username, password } = req.body;

    try {
      // See if user exists
      let admin = await Admin.findOne({
        username,
      });

      if (admin) {
        return res.status(409).json({
          errors: [
            {
              code: 409,
              msg: "Username taken",
            },
          ],
        });
      }

      admin = new User({
        username,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);

      await admin.save();
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        errors: [
          {
            code: 500,
            msg: err.toString(),
          },
        ],
      });
    }
  },

  async deleteAdmin(req, res) {},

  async getUser(req, res) {
    try {
      const id = req.params.userId;
      console.log(id);

      let user = await User.findOne({
        _id: id,
      }).populate("package");
      console.log(user);
      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid Credentials",
            },
          ],
        });
      }

      const userObject = user.toObject();
      delete userObject["password"];

      const success = {
        user: userObject,
      };

      res.status(200).json({
        success,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        errors: [
          {
            code: 500,
            msg: err.toString(),
          },
        ],
      });
    }
  },
  async getUsers(req, res) {
    try {
      const users = await User.find().select("-password");

      if (!users) {
        return res.status(400).json({
          errors: [
            {
              msg: "No user found",
            },
          ],
        });
      }

      res.status(200).json({
        users,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        errors: [
          {
            code: 500,
            msg: err.toString(),
          },
        ],
      });
    }
  },
  async pendingPackageStatus(req, res) {
    try {
      const users = await User.find({
        packageStatus: "Pending",
      }).select("-password");

      if (!users) {
        return res.status(400).json({
          errors: [
            {
              msg: "No user found",
            },
          ],
        });
      }

      res.status(200).json({
        users,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        errors: [
          {
            code: 500,
            msg: err.toString(),
          },
        ],
      });
    }
  },
  async updateUser(req, res) {
    try {
      const {
        userId,
        firstName,
        lastName,
        phone,
        referralCode,
        referredFrom,
        package,
        packageStatus,
        type,
        verified,
      } = req.body;

      let user = await User.findOne({
        _id: userId,
      }).populate("package");
      // .populate("profilePhoto");

      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg: "No user with ID " + userId,
            },
          ],
        });
      }

      let updateQuery = {};

      if (firstName) updateQuery.firstName = firstName;
      if (lastName) updateQuery.lastName = lastName;
      if (phone) updateQuery.phone = phone;
      if (packageStatus) updateQuery.packageStatus = packageStatus;

      if (type) {
        const temp = {
          seller: type.seller,
          ad_publisher: type.ad_publisher,
          earner: type.earner,
          buyer: type.buyer,
        };
        updateQuery.type = temp;
      }
      if (verified) updateQuery.verified = verified;

      if (referralCode) {
        const checkRefCode = await findOne({
          referralCode: referralCode,
        });
        if (checkRefCode) {
          return res.status(401).json({
            errors: [
              {
                code: 401,
                msg: "Referral code already assigned",
              },
            ],
          });
        }
        // user.referralCode = referralCode;
        updateQuery.referralCode = referralCode;
        // await user.save();
      }

      if (referredFrom) {
        const checkReferred = await User.findOne({
          _id: referredFrom,
        });
        if (!checkReferred) {
          return res.status(401).json({
            errors: [
              {
                code: 401,
                msg: "No such person is registered, cannot be referred",
              },
            ],
          });
        }
        updateQuery.referredFrom = referredFrom;
        // user.referredFrom = referredFrom;
        // await user.save();
      }

      if (package) {
        const checkPackage = await Package.findOne({
          name: package,
        });

        if (!checkPackage) {
          return res.status(401).json({
            errors: [
              {
                code: 401,
                msg: "No such package found, invalid package",
              },
            ],
          });
        }
        updateQuery.package = checkPackage._id;
        // user.package = checkPackage._id
        // user.save();
      }

      // if(req.file){
      //     // const newMedia = new Media({
      //         console.log(req.file, userId)

      //     // });
      // }
      // if (req.fileRelativeUrl) updateQuery.profilePhotoUrl = req.fileRelativeUrl;

      // const userObject = user.toObject();
      // userObject.profilePhotoUrl =
      //     "http://" + req.header("host") + "/" + req.fileRelativeUrl;
      // delete userObject["password"];
      // delete userObject["__v"];
      user = await User.findOneAndUpdate(
        {
          _id: userId,
        },
        updateQuery,
        {
          new: true,
        }
      ).select("-password");

      const success = {
        user: user,
      };

      res.status(200).json({
        success,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        errors: [
          {
            code: 500,
            msg: err.toString(),
          },
        ],
      });
    }
  },

  async deleteUser(req, res) {
    try {
      const id = req.body.id;

      let user = await User.findById(id);
      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg: "No user with ID " + id,
            },
          ],
        });
      }
      // with user, wallet, media, transactions will also be deleted
      await Wallet.findOneAndDelete({
        _id: user.Wallet,
      });
      // before deleting media its content from local folder must be deleted.
      // await Media.findOneAndDelete({
      //     _id: user.profilePhoto
      // });
      await User.findByIdAndDelete(id);

      res.status(200).json({
        msg: "User with id " + id + " has been deleted",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        errors: [
          {
            code: 500,
            msg: err.toString(),
          },
        ],
      });
    }
  },
};

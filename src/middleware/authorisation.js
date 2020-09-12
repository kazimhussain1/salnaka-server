const Admin = require("../models/admin.model");

module.exports = async function (req, res, next) {
  const { username } = req.body;

  try {
    let admin = await Admin.findOne({
      username,
    });

    if (!admin) {
      return res.status(400).json({
        errors: [
          {
            msg: "Invalid Credentials",
          },
        ],
      });
    }

    if (admin.type !== "superAdmin") {
      return res.status(400).json({
        errors: [
          {
            msg: "Not authorised",
          },
        ],
      });
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      msg: "Token is not valid",
    });
  }
};

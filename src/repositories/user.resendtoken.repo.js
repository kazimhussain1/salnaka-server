const EmailVerification = require("../models/emailVerification.model");
const User = require("../models/user.model");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.resendToken = async (req, res) => {
  try {
    let user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(400).json({
        errors: [
          {
            code: 400,
            msg: "We were unable to find a user with that email.",
          },
        ],
      });
    }

    if (user.verified) {
      return res.status(400).json({
        code: 400,
        msg: "This user has already been verified. Please sign in.",
      });
    }

    let emailVerificationToken = new EmailVerification({
      _userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    await emailVerificationToken.save();

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USERNAME_SENDMAIL,
        pass: process.env.PASSWORD,
      },
    });
    var mailOptions = {
      from: "no-reply@salnaka.com",
      to: user.email,
      subject: "SALNAKA - Account Verification Link",
      text:
        "Hi " +
        user.firstName +
        ",\n\n" +
        "Please verify your account by clicking the link: \nhttp://" +
        req.headers.host +
        "/api" +
        "/user" +
        "/confirmation/" +
        emailVerificationToken.token +
        ".\n",
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: {
        msg: "A verification email has been sent to " + user.email + ".",
      },
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
};

const User = require("../models/User.model");
const Wallet = require("../models/Wallet.model");
const Package = require("../models/Package.model");
const EmailVerification = require("../models/EmailVerification.model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const referralCodeGenerator = require("referral-code-generator");

const {
    sign
} = require("jsonwebtoken");
const {
    TOKEN_EXPIRATION_TIME
} = require("../config");

module.exports = {
    async checkRefCode(req, res) {
        const refCode = req.body.referralCode;

        try {
            let user = await User.findOne({
                $or: [{
                    referralCode: refCode,
                }, ],
            }).populate("profilePhotoUrl");

            if (!user) {
                return res.status(401).json({
                    errors: [{
                        code: 404,
                        message: "Referral code is invalid",
                    }, ],
                });
            }
            const userObject = user.toObject();
            const success = {
                firstName: userObject["firstName"],
                lastName: userObject["lastName"],

                photo: userObject["profilePhotoUrl"],
            };

            res.status(200).json({
                success,
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                errors: [{
                    code: 500,
                    message: err.toString(),
                }, ],
            });
        }
    },

    async createUser(req, res) {
        const {
            firstName,
            lastName,
            email,
            password,
            phone,
        } = req.body;

        try {
            // See if user exists
            let user = await User.findOne({
                email: email,
            });

            if (user) {

                return res.status(409).json({
                    errors: [{
                        code: 409,
                        message: "Email address taken",
                    }, ],
                });

            }

            let new_wallet = new Wallet({
                current_amount: 0
            });

            let ref_code;
            let is_ref_code = 12;
            while (is_ref_code) {
                ref_code = referralCodeGenerator.alphaNumeric("uppercase", 3, 1);
                is_ref_code = await User.findOne({
                    $or: [{
                        referralCode: ref_code,
                    }, ],
                });
            }

            user = new User({
                firstName,
                lastName,

                email,
                password,
                phone,
                wallet: new_wallet._id,
                referralCode: ref_code,
            });

            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            new_wallet.user = user._id;

            await new_wallet.save();

            // Verification Token
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
                subject: "Account Verification Token",
                text: "Hi " +
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
                    message: "A verification link has been sent to your email. Please verify your account and sign in.",
                },
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                errors: [{
                    code: 500,
                    message: err.toString(),
                }, ],
            });
        }
    },

    async loginUser(req, res) {
        const {
            email,
            password
        } = req.body;

        try {
            // See if user exists
            const user = await User.findOne({
                    email,
                },

            );

            if (!user) {
                return res.status(401).json({
                    errors: [{
                        code: 401,
                        message: "Invalid Credentials haha",
                    }, ],
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({
                    errors: [{
                        code: 401,
                        message: "Invalid Credentials haha",
                    }, ],
                });
            }

            if (!user.verified) {
                return res.status(401).json({
                    errors: [{
                        code: 401,
                        message: "Your account has not been verified.",
                    }, ],
                });
            }

            // Return jsonwebtoken
            const payload = {
                user: {
                    _id: user._id,
                },
            };

            sign(
                payload,
                process.env.JWT_SECRET, {
                    expiresIn: TOKEN_EXPIRATION_TIME,
                },
                (err, token) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({
                            error: err.toString(),
                        });
                    }

                    const userObject = user.toObject();

                    delete userObject["password"];

                    const success = {
                        token,
                        user: userObject,
                    };

                    res.status(200).json({
                        success,
                    });
                }
            );
        } catch (err) {
            console.error(err);
            res.status(500).json({
                    errors: [err.toString()],
                },
                null
            );
        }
    },

    async getProfile(req, res) {
        const id = req.user.id;

        let user = await User.findOne({
            _id: id,
        });

        if (!user) {
            return res.status(400).json({
                errors: [{
                    msg: "Invalid Credentials haha",
                }, ],
            });
        }

        user = User.populate([user], {
            path: "workspace",
        });

        const userObject = user.toObject();
        delete userObject["password"];

        const success = {
            user: userObject,
        };

        res.status(200).json({
            success,
        });
    },

    async updateProfile(req, res) {
        const id = req.user.id;

        const {
            firstName,
            lastName,
           
        } = req.body;

        let updateQuery = {};

        if (firstName) updateQuery.firstName = firstName;
        if (lastName) updateQuery.lastName = lastName;
        if (req.fileRelativeUrl) updateQuery.profilePhotoUrl = req.fileRelativeUrl;

        const user = await User.findOneAndUpdate({
                _id: id,
            },
            updateQuery, {
                new: true,
            }
        );

        const userObject = user.toObject();
        userObject.profilePhotoUrl =
            "http://" + req.header("host") + "/" + req.fileRelativeUrl;
        delete userObject["password"];
        delete userObject["__v"];

        const success = {
            user: userObject,
        };

        res.status(200).json({
            success,
        });
    },

    async packageSelection(req, res) {
        const {
            _id,
            package
        } = req.body;
        try {
            let packages = await Package.findOne({
                name: package,
            });

            let user = await User.findOneAndUpdate({
                _id: _id,
            }, {
                package: packages.id,
                packageStatus: "Pending",
            }).populate("package");

            if (!user) {
                return res.status(400).json({
                    errors: [{
                        msg: "Invalid Credentials",
                    }, ],
                });
            }

            const userObject = user.toObject();
            delete userObject["password"];

            const success = {
                message: "Status Pending. Waiting for approval of package from admin.",
                package: package,
                user: userObject,
            };

            res.status(200).json({
                success,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                    errors: [err.toString()],
                },
                null
            );
        }
    },

    async changePassword(req, res) {
        const id = req.user.id;

        let user = await User.findOne({
            _id: id,
        });

        user = await User.findOneAndUpdate({
            _id: id,
        }, {
            password,
        }, {
            new: true,
        });

        if (!user) {
            return res.status(400).json({
                errors: [{
                    msg: "Invalid Credentials haha",
                }, ],
            });
        }

        const userObject = user.toObject();
        delete userObject["password"];
        delete userObject["__v"];

        const success = {
            user: userObject,
        };

        res.status(200).json({
            success,
        });
    },
};
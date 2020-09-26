const User = require('../models/user.model');
const Wallet = require('../models/wallet.model');
const Package = require('../models/package.model');
const EmailVerification = require('../models/emailVerification.model');
const Media = require('../models/media.model');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const referralCodeGenerator = require('referral-code-generator');
const { existsSync, mkdirSync, unlink } = require('fs');
const { sign } = require('jsonwebtoken');
const { TOKEN_EXPIRATION_TIME } = require('../config');

module.exports = {
    async checkRefCode(req, res) {
        const refCode = req.body.referralCode;

        try {
            let user = await User.findOne({
                $or: [
                    {
                        referralCode: refCode,
                    },
                ],
            }).populate('profilePhoto');

            if (!user) {
                return res.status(401).json({
                    errors: [
                        {
                            code: 404,
                            msg: 'Referral code is invalid',
                        },
                    ],
                });
            }
            const userObject = user.toObject();
            const success = {
                firstName: userObject['firstName'],
                lastName: userObject['lastName'],

                photo: userObject['profilePhoto'],
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

    async createUser(req, res) {
        const { firstName, lastName, email, password, phoneCode, phone, refCode } = req.body;

        try {
            // See if user exists
            let user = await User.findOne({
                email: email,
            });

            if (user) {
                return res.status(409).json({
                    errors: [
                        {
                            code: 409,
                            msg: 'Email address taken',
                        },
                    ],
                });
            }

            let new_wallet = new Wallet({
                currentAmount: 0,
            });

            let ref_code;
            let is_ref_code = 12;
            while (is_ref_code) {
                ref_code = referralCodeGenerator.alphaNumeric('uppercase', 3, 1);
                is_ref_code = await User.findOne({
                    $or: [
                        {
                            referralCode: ref_code,
                        },
                    ],
                });
            }

            user = new User({
                firstName,
                lastName,
                email,
                password,
                phoneCode,
                phone,
                wallet: new_wallet._id,
                referralCode: ref_code,
            });

            if (refCode) {
                let userReferralFrom = await User.findOne({
                    referralCode: refCode,
                });

                if (userReferralFrom) {
                    user.referredFrom = userReferralFrom._id;
                }
            }

            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            new_wallet.user = user._id;

            // Verification Token
            let emailVerificationToken = new EmailVerification({
                _userId: user._id,
                token: crypto.randomBytes(16).toString('hex'),
            });
            await emailVerificationToken.save();

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.USERNAME_SENDMAIL,
                    pass: process.env.PASSWORD,
                },
            });
            var mailOptions = {
                from: 'no-reply@salnaka.com',
                to: user.email,
                subject: 'Account Verification Token',
                text:
                    'Hi ' +
                    user.firstName +
                    ',\n\n' +
                    'Please verify your account by clicking the link: \nhttp://' +
                    req.headers.host +
                    '/api' +
                    '/user' +
                    '/confirmation/' +
                    emailVerificationToken.token +
                    '.\n',
            };

            await transporter.sendMail(mailOptions);

            await user.save();
            await new_wallet.save();

            res.status(201).json({
                success: {
                    msg: 'A verification link has been sent to your email. Please verify your account and sign in.',
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
    },

    async loginUser(req, res) {
        const { email, password } = req.body;

        try {
            // See if user exists
            console.log('in login');
            const user = await User.findOne({
                email,
            })
                .populate('wallet')
                .populate('profilePhoto')
                .populate('package');

            if (!user) {
                return res.status(401).json({
                    errors: [
                        {
                            code: 401,
                            msg: 'Invalid Credentials',
                        },
                    ],
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({
                    errors: [
                        {
                            code: 401,
                            msg: 'Invalid Credentials',
                        },
                    ],
                });
            }

            if (!user.verified) {
                return res.status(401).json({
                    errors: [
                        {
                            code: 401,
                            msg: 'Your account has not been verified.',
                        },
                    ],
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

                    const userObject = user.toObject();
                    delete userObject['password'];

                    const success = {
                        token,
                        user: userObject,
                    };

                    res.status(200).json({
                        success,
                    });
                },
            );
        } catch (err) {
            console.error(err);
            res.status(500).json(
                {
                    errors: [err.toString()],
                },
                null,
            );
        }
    },

    async getProfile(req, res) {
        try {
            const id = req.user.id;

            let user = await User.findOne({
                _id: id,
            })
                .populate('package')
                .populate('wallet')
                .populate('accountInfo.nicImages');

            if (!user) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'Invalid Credentials',
                        },
                    ],
                });
            }

            const userObject = user.toObject();
            delete userObject['password'];

            userObject.accountInfo.nicImages.forEach((image) => (image.url = process.env.HOST_NAME + image.url));

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

    async updateProfile(req, res) {
        try {
            const id = req.user.id;

            const {
                firstName,
                lastName,
                phone,
                phoneCode,
                address,
                fathersName,
                accountHolderName,
                accountNumber,
                bankName,
                nicNumber,
            } = req.body;

            let updateQuery = {};

            if (firstName) updateQuery.firstName = firstName;
            if (lastName) updateQuery.lastName = lastName;
            if (phone) updateQuery.phone = phone;
            if (phoneCode) updateQuery.phoneCode = phoneCode;
            if (fathersName) updateQuery.fathersName = fathersName;
            if (address) updateQuery.address = address;

            const accountInfo = req.user.accountInfo || {};

            if (accountHolderName) accountInfo.accountHolderName = accountHolderName;
            if (accountNumber) accountInfo.accountNumber = accountNumber;
            if (bankName) accountInfo.bankName = bankName;
            if (nicNumber) accountInfo.nicNumber = nicNumber;

            updateQuery.accountInfo = accountInfo;

            // if (req.fileRelativeUrl) updateQuery.profilePhoto.url = req.fileRelativeUrl; //issue

            const user = await User.findOneAndUpdate(
                {
                    _id: id,
                },
                updateQuery,
                {
                    new: true,
                },
            )
                .populate('accountInfo.nicImages')
                .populate('wallet')
                .populate('package')
                .select('-password');

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

    async updateAccountInfo(req, res) {
        try {
            const {} = req.body;

            req.user.accountInfo = {
                accountHolderName,
                fathersName,
                accountNumber,
                bankName,
                nicNumber,
            };

            await req.user.save();

            res.status(200).json({
                success: {
                    msg: 'Account info successfully updated!',
                    accountInfo: req.user.accountInfo,
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
    },

    async uploadNIC(req, res) {
        try {
            if (req.files && req.files.length === 2) {
                const media = [];
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    const image = new Media({
                        name: file.originalname,
                        mimeType: file.mimetype,
                        url: file.fileRelativeUrl,
                        size: file.size,
                    });
                    await image.save();
                    media.push(image);
                }

                if (!req.user.accountInfo) {
                    req.user.accountInfo = {};
                }
                //get ids of media object
                req.user.accountInfo.nicImages = media.map((image) => image._id);
                await req.user.save();

                //convert relative url to absolute url
                media.forEach((image) => (image.url = process.env.HOST_NAME + image.url));

                res.status(200).json({
                    success: {
                        msg: 'Images uploaded successfully!',
                        nic: media,
                    },
                });
            } else {
                res.status(400).json({
                    errors: [
                        {
                            code: 400,
                            msg: '2 NIC images are required: front and back',
                        },
                    ],
                });
            }
        } catch (err) {
            console.error(err);
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

    async packageSelection(req, res) {
        const { _id, package } = req.body;
        try {
            let packages = await Package.findOne({
                _id,
            });

            if (!packages) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'Package ' + package + ' not found',
                        },
                    ],
                });
            }

            let user = await User.findOneAndUpdate(
                {
                    _id: req.user.id,
                },
                {
                    package: packages.id,
                    packageStatus: 'Pending',
                    orderDate: new Date(),
                },
            ).populate('package');

            if (!user) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'Invalid Credentials',
                        },
                    ],
                });
            }

            const userObject = user.toObject();
            delete userObject['password'];

            const success = {
                msg: 'Status Pending. Waiting for approval of package from admin.',
                package: package,
                user: userObject,
            };

            res.status(200).json({
                success,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                errors: [{ code: 500, msg: err.toString() }],
            });
        }
    },

    async changePassword(req, res) {
        try {
            const id = req.user.id;

            let { currentPassword, newPassword } = req.body;
            console.log(currentPassword, newPassword);
            let user = await User.findOne({
                _id: id,
            });

            if (!user) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'Invalid Credentials',
                        },
                    ],
                });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);

            if (!isMatch) {
                return res.status(401).json({
                    errors: [
                        {
                            code: 401,
                            msg: 'Invalid Credentials',
                        },
                    ],
                });
            }

            const salt = await bcrypt.genSalt(10);
            newPassword = await bcrypt.hash(newPassword, salt);

            user = await User.findOneAndUpdate(
                {
                    _id: id,
                },
                {
                    password: newPassword,
                },
                {
                    new: true,
                },
            );

            const userObject = user.toObject();
            delete userObject['password'];
            delete userObject['__v'];

            const success = {
                user: userObject,
            };

            res.status(200).json({
                success,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                errors: [{ code: 500, msg: err.toString() }],
            });
        }
    },

    async getPackage(req, res) {
        try {
            let package = await Package.find({});

            const success = {
                packages: package,
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
};

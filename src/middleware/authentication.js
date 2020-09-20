const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Admin = require('../models/admin.model');

module.exports = {
    async userAuth(req, res, next) {
        // Get token from header
        let token = req.header('authorization');
        // check if not token
        if (!token) {
            return res.status(401).json({
                msg: 'No token, authorization denied',
            });
        }

        // Verify token
        schemePlusToken = token.split(' ');

        try {
            if (schemePlusToken[0] === 'Bearer') {
                token = schemePlusToken[1]; 
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await (await User.findById(decoded.user._id)).populate('wallet');
                if (!user)
                    return res.status(403).json({
                        msg: 'Token is not valid',
                    });

                req.user = user;
                next();
            } else {
                res.status(401).json({
                    msg: 'Token is not valid',
                });
            }
        } catch (err) {
            console.log(err.toString());
            res.status(401).json({
                msg: 'Token is not valid',
            });
        }
    },
    async adminAuth(req, res, next) {
        // Get token from header
        let token = req.header('authorization');
        // check if not token
        if (!token) {
            return res.status(401).json({
                msg: 'No token, authorization denied',
            });
        }

        // Verify token
        schemePlusToken = token.split(' ');

        try {
            if (schemePlusToken[0] === 'Bearer') {
                token = schemePlusToken[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const admin = await Admin.findById(decoded.admin._id);
                if (!admin)
                    return res.status(403).json({
                        msg: 'Token is not valid',
                    });

                req.admin = admin;
                next();
            } else {
                res.status(401).json({
                    msg: 'Token is not valid',
                });
            }
        } catch (err) {
            console.log(err);
            res.status(401).json({
                msg: 'Token is not valid',
            });
        }
    },
};

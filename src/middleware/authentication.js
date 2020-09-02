const jwt = require('jsonwebtoken');
const User = require("../models/User.model");

module.exports = async function (req, res, next) {
    // Get token from header
    let token = req.header('authorization');
    // check if not token
    if (!token) {
        return res.status(401).json({
            message: 'No token, authorization denied'
        });
    }

    // Verify token
    schemePlusToken = token.split(' ');

    try {
        if (schemePlusToken[0] === 'Bearer') {

            token = schemePlusToken[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.user._id);
            if (!user) return res.status(403).json({
                message: 'Token is not valid'
            });

            req.user = user;
            next();

        } else {
            res.status(401).json({
                message: 'Token is not valid'
            });
        }

    } catch (err) {
        console.log(err)
        res.status(401).json({
            message: 'Token is not valid'
        });
    }
}
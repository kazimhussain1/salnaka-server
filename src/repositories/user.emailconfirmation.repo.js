const Token = require('../models/EmailVerification.model');
const User = require('../models/User.model');


exports.confirmationPost = async (req, res) => {
    try{
        let token = req.params.token;
        console.log(token)
        token = await Token.findOne({
            token: token
        });
        if (!token) {
            return res.status(400).json({
                errors: [{
                    code: 400,
                    message: "We were unable to find a valid token. Your token may have expired.",
                }, ],

            });
        }

        let user = await User.findOne({
            _id: token._userId
        });
        if (!user) {
            return res.status(400).json({
                errors: [{
                    code: 400,
                    message: "We were unable to find a user for this token.",
                }, ],

            });
        }

        if(user.verified) {
            return res.status(400).json({
                code: 400,
                message: "This user has already been verified."
            });
        }

        user.verified = true;
        await user.save();
        
        res.status(200).json({
            message: "The account has been verified. Please log in."
        })

        
    }catch (err) {
        console.error(err.message);
        res.status(500).json({
            errors: [{
                code: 500,
                message: err.toString(),
            }, ],

        });
    }
}

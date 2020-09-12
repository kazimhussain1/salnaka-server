const User = require("../models/User.model");
const Wallet = require("../models/Wallet.model");
const Transaction = require("../models/Transaction.model");

module.exports = {
    async getWallet(req, res) {
        try{
            const id = req.user.id;

            let user = await User.findOne({
                _id: id,
            }).populate("wallet")
            .select("-password");

            if (!user) {
                return res.status(400).json({
                    errors: [{
                        msg: "Invalid Credentials",
                    }, ],
                });
            }

            const userObject = user.toObject();
            
            const success = {
                wallet: userObject["wallet"],
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

    async getTransactionHistory (req,res){
     try{
            const id = req.user.id;

            let user = await User.findOne({
                _id: id,
            })
            .select("-password");

            if (!user) {
                return res.status(400).json({
                    errors: [{
                        msg: "Invalid Credentials",
                    }, ],
                });
            }

            let allTransactions = Transaction.find({
                user_id: user.id 
            });

            
            if (!allTransactions) {
                return res.status(400).json({
                    errors: [{
                        msg: "No Transactions found",
                    }, ],
                });
            }

            
            
            const success = {
                transactions: allTransactions,
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
    }


}
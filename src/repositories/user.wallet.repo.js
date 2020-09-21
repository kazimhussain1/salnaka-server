const User = require('../models/user.model');
const Wallet = require('../models/wallet.model');
const Transaction = require('../models/transaction.model');
const { transactionConstants } = require('../constants');

module.exports = {
    async getWallet(req, res) {
        try {
            const id = req.user.id;

            let user = await User.findOne({
                _id: id,
            })
                .populate('wallet')
                .select('-password');

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

            const success = {
                wallet: userObject['wallet'],
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

    async getTransactionHistory(req, res) {
        try {
            const id = req.user.id;

            let user = await User.findOne({
                _id: id,
            }).select('-password');

            if (!user) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'Invalid Credentials',
                        },
                    ],
                });
            }

            let allTransactions = await Transaction.find({
                user: user.id,
            }).populate({ path: 'user', populate: { path: 'package' } });

            if (!allTransactions) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'No Transactions found',
                        },
                    ],
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
                errors: [
                    {
                        code: 500,
                        msg: err.toString(),
                    },
                ],
            });
        }
    },

    async withdrawAmount(req, res) {
        try {
            const { amount } = req.body;
            const user = req.user;

            if (user.wallet.currentAmount < amount) {
                return res.status(403).json({
                    errors: [
                        {
                            code: 403,
                            msg: 'Not enough funds',
                        },
                    ],
                });
            }

            const transaction = await new Transaction({
                user: user._id,
                wallet: user.wallet._id,
                amount: amount,
                date: new Date(),
                action: transactionConstants.OUTGOING,
                status: 'Pending',
                description: `Withdrawal by user`,
            });
            await transaction.save();

            res.status(200).json({
                success: {
                    msg: 'Your withdrawal is Pending approval by Admin.',
                    transaction,
                },
            });
        } catch (err) {
            return res.status(500).json({
                errors: [
                    {
                        code: 500,
                        msg: err,
                    },
                ],
            });
        }
    },
};

const User = require('../models/user.model');
const Wallet = require('../models/wallet.model');
const Transaction = require('../models/transaction.model');
const { transactionConstants } = require('../constants');

module.exports = {
    async getWallet(req, res) {
        try {
            const wallets = await Wallet.find({}).populate({ path: 'user', populate: { path: 'package' } });

            res.status(200).json({
                success: wallets,
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
            const id = req.params.walletId;

            let wallet = await Wallet.findOne({
                _id: id,
            }).populate({ path: 'user', populate: { path: 'package' } });

            if (!wallet) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'Wallet not found',
                        },
                    ],
                });
            }

            let allTransactions = await Transaction.find({
                wallet: wallet._id,
            });

            const success = {
                wallet,
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

    async getAllTransactionHistory(req, res) {
        try {
            let allTransactions = await Transaction.find({});

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

    async addProfit() {
        try {
            let date = new Date();
            date.setDate(date.getDate() - 5);
            date.setHours(23);
            date.setMinutes(59);
            date.setSeconds(59);
            const users = await User.find({
                packageStatus: 'Approved',
                package: {
                    $exists: true,
                    $ne: null,
                },
                approvalDate: { 
                    $exists: true,
                    $ne: null,
                    $lt: date,
                },
            })
                .populate('package')
                .populate('wallet');

            console.log(users);

            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                profit =
                    (user.wallet.capitalAmount * (user.package.profitRate / 100)) / 30 +
                    user.wallet.capitalAmount / 180;
                let transaction = await new Transaction({
                    user: user._id,
                    wallet: user.wallet._id,
                    amount: profit,
                    date: new Date(),
                    action: transactionConstants.INCOMING,
                    status: 'Approved',
                    description: `Daily profit @ ${user.package.profitRate}% plus invested amount return`,
                });
                await transaction.save();

                await Wallet.findByIdAndUpdate(
                    {
                        _id: user.wallet._id,
                    },
                    {
                        currentAmount: user.wallet.currentAmount + profit,
                    },
                );
            }
        } catch (err) {
            console.error(err);
        }
    },

    async getPendingTransactions(req, res) {
        try {
            const transactions = await Transaction.find({
                status: 'Pending',
            })
                .populate({ path: 'user', populate: { path: 'package' } })
                .populate('wallet');

            res.status(200).json({
                success: {
                    transactions,
                },
            });
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

    async updateTransactionStatus(req, res) {
        try {
            const { transactionId, transactionStatus } = req.body;

            const transaction = await Transaction.findOne({
                _id: transactionId,
                status: 'Pending',
            }).populate('wallet');

            if (!transaction) {
                return res.status(404).json({
                    errors: [
                        {
                            code: 404,
                            msg: 'Pending transaction not found',
                        },
                    ],
                });
            }
            const wallet = transaction.wallet;

            if (transactionStatus === 'Approved') {
                if (wallet.currentAmount < transaction.amount && transaction.action === transactionConstants.OUTGOING) {
                    return res.status(403).json({
                        errors: [
                            {
                                code: 403,
                                msg: 'Not enough balance to approve transaction',
                            },
                        ],
                    });
                }

                if (transaction.action === transactionConstants.OUTGOING) {
                    wallet.currentAmount -= transaction.amount;
                } else {
                    wallet.currentAmount += transaction.amount;
                }
                await wallet.save();
            }

            transaction.status = transactionStatus;
            await transaction.save();

            res.status(200).json({
                success: {
                    transaction,
                },
            });
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
};

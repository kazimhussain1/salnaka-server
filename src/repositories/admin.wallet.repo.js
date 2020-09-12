const User = require("../models/user.model");
const Wallet = require("../models/wallet.model");
const Transaction = require("../models/transaction.model");

module.exports = {
  async getWallet(req, res) {
    try {
      const wallets = await Wallet.find({})
      .populate("user");

    
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
      });

      if (!wallet) {
        return res.status(400).json({
          errors: [
            {
              msg: "Wallet not found",
            },
          ],
        });
      }

      let allTransactions = Transaction.find({
        wallet_id: wallet.id,
      });

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
};

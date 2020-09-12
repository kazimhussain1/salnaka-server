const User = require("../models/user.model");
const Wallet = require("../models/wallet.model");
const Transaction = require("../models/transaction.model");

module.exports = {
  async getWallet(req, res) {
    try {
      const wallets = await Wallet.find({});

      if (!wallets) {
        return res.status(400).json({
          errors: [
            {
              msg: "No wallets found",
            },
          ],
        });
      }

      res.status(200).json({
        wallets,
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
      const id = req.params.userId;

      let user = await User.findOne({
        _id: id,
      }).select("-password");

      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid Credentials",
            },
          ],
        });
      }

      let allTransactions = Transaction.find({
        user_id: user.id,
      });

      if (!allTransactions) {
        return res.status(400).json({
          errors: [
            {
              msg: "No Transactions found",
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
};

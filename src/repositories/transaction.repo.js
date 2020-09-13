const User = require("../models/user.model");
const Wallet = require("../models/wallet.model");
const Transaction = require("../models/transaction.model");
const { transactionConstants } = require("../constants");

module.exports = {
    async profit() {
        try{
            
            const users = await User.find({
                packageStatus: "Approved",
                package: { $exists: true, $ne: null }
            }).populate("package")
              .populate("wallet");

            for(let i=0; i < users.length; i++){
                const user = users[i];
                profit = (user.wallet.capitalAmount * (user.package.profitRate/100))/30
                    let transaction = await new Transaction({
                        user_id: user._id,
                        wallet_id: user.wallet._id,
                        amount: profit,
                        date: new Date(),
                        action: transactionConstants.INCOMING,
                        description: "Daily profit @ " + user.package.profitRate +"%" 
                    });
                    await transaction.save()

                    
                    await Wallet.findByIdAndUpdate({
                            _id: user.wallet._id
                        },
                        {
                            currentAmount: user.wallet.currentAmount + profit 
                        }
                    );
            }
       } catch (err) {
        console.error(err);
      }
    }
}
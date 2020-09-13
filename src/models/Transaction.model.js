const mongoose = require('mongoose');

const transaction_historySchema = mongoose.Schema(
    {   
        user_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        wallet_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Wallet",
            required: true
            },
        amount:{
            type: Number,
            required: true
        },
        date:{
            type: Date,
            required: true
        },
       
        action:{ //whether incoming or outgoing
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true
        }

});

module.exports = mongoose.model("Transaction_History", transaction_historySchema);
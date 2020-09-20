const mongoose = require('mongoose');

const transaction_historySchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        wallet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Wallet',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        action: {
            //whether incoming or outgoing
            type: String,
            required: true,
        },
        status: {
            //Approved, Pending or Denied
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

module.exports = mongoose.model('Transaction_History', transaction_historySchema);

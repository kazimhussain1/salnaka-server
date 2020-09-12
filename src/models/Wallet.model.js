const mongoose = require('mongoose');

const walletSchema = mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        capital_amount:{
            type: Number,
            required: false,
            default: 0
        },
        current_amount:{
            type: Number,
            required: false,
            default: false
        }
});

module.exports = mongoose.model("Wallet", walletSchema);
const mongoose = require('mongoose');

const walletSchema = mongoose.Schema(
    {
        user_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        current_amount:{
            type: Number,
            required: false,
            default: false
        }
});

module.exports = mongoose.model("Wallet", walletSchema);
const mongoose = require('mongoose');

const earningSchema = mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        wallet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Wallet",
            required: true
            },
        total_ads_earning:{
            type: Number,
            required: true,
        },
        total_product_service_earning:{
            type: Number,
            required: true,
        },
        total_earning:{
            type: Number,
            required: true,
        }
});

module.exports = mongoose.model("TotalEarning", earningSchema);
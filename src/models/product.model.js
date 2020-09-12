const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        user_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title:{
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
        media:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Media",
            required: true
        }],
        price:{
            type: Number,
            required: true,
        }
});

module.exports = mongoose.model("Product", productSchema);
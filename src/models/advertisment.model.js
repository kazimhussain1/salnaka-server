2const mongoose = require('mongoose');

const adsSchema = mongoose.Schema(
    {
        url:{
            type: String,
            required: true
        },
        publisher_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        category:[{
            type: String,
            required: true
        }]
    }
);

module.exports = mongoose.model("Advertisment", adsSchema);
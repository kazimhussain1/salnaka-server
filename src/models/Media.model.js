const mongoose = require('mongoose');

const mediaSchema = mongoose.Schema(
    {
        mimeType:{
            type: String,
            required: true
        },
        name:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        },
        size:{
            type: String,
            required: true
        },
        dimension:{
            type: String,
            required: true
        },
    }
);

module.exports = mongoose.model("Media", mediaSchema);
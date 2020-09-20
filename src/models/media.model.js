const mongoose = require('mongoose');

const mediaSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        mimeType: {
            type: String,
            required: true,
        },
        
        url: {
            type: String,
            required: true,
        },
        size: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

module.exports = mongoose.model('Media', mediaSchema);

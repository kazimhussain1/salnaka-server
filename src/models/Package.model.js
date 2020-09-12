const mongoose = require('mongoose');

const packageSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        description:[
            {
                type: String,
                required: true,
            }
        ],
        profitRate:{
            type: number,
            required: true,
        },
        price:{
            type: String,
            required: true,
        }
});

module.exports = mongoose.model("Package", packageSchema);
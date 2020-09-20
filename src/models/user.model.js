const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        wallet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Wallet',
            required: true,
        },
        referralCode: {
            type: String,
            required: true,
        },
        referredFrom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
            default: null,
        },
        package: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Package',
            required: false,
            default: null,
        },
        packageStatus: {
            type: String,
            required: false,
            default: null,
        },
        orderDate: {
            type: Date,
            required: false,
            default: null,
        },
        approvalDate: {
            type: Date,
            required: false,
            default: null,
        },
        verified: {
            type: Boolean,
            required: false,
            default: false,
        },
        profilePhoto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media',
            required: false,
            default: null,
        },
        type: {
            seller: {
                type: Boolean,
                required: false,
                default: false,
            },
            ad_publisher: {
                type: Boolean,
                required: false,
                default: false,
            },
            earner: {
                type: Boolean,
                required: false,
                default: false,
            },
            buyer: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        accountInfo:{
            accountHolderName:{
                type: String,
                required: false,
                default: null,
            },
            fathersName:{
                type: String,
                required: false,
                default: null,
            },
            accountNumber:{
                type: String,
                required: false,
                default: null,
            },
            bankName:{
                type: String,
                required: false,
                default: null,
            },
            nicNumber:{
                type: String,
                required: false,
                default: null,
            },
            nicImages:[{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Media',
                required: false,
            }]
        }
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

module.exports = mongoose.model('User', userSchema);

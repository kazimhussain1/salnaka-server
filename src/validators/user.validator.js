const { body, param, oneOf, check } = require('express-validator');
const errorHandler = require('./errorHandler');

module.exports = {
    validateReferralCode: () => [
        check('referralCode')
            .exists()
            .withMessage('Referral code is required')
            .matches(/^[a-zA-Z0-9]{6}$/)
            .withMessage('Please provide a valid referral code'),

        errorHandler,
    ],
    validateRegistration: () => [
        body('firstName')
            .exists()
            .withMessage('firstName is required')
            .matches(/^[a-z0-9_. A-Z]{1,16}$/)
            .withMessage('Please provide a valid firstName'),

        body('lastName')
            .exists()
            .withMessage('lastName is required')
            .matches(/^[a-z0-9_. A-Z]{1,16}$/)
            .withMessage('Please provide a valid lastName'),

        body('email')
            .exists()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please provide a valid email address'),

        body('password')
            .exists()
            .withMessage('Password is required')
            .isLength({
                min: 8,
            })
            .withMessage('Password must be at least 8 characters in length')
            .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
            .withMessage('Password should contain at least one letter, one number and one special character'),

        body('phone').exists().isNumeric().withMessage('Phone number is required'),
        // .matches(
        //   /^\(?([0-9]{4})\)?[-]{1}?([0-9]{3})[-]{1}?([0-9]{4})$/
        // )
        // .withMessage("Phone number must be in this format XXXX-XXX-XXXX"
        // ),

        errorHandler,
    ],

    validateLogin: () => [
        body('email')
            .exists()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please provide a avalid email address'),

        body('password', 'Password is required').exists(),

        errorHandler,
    ],

    validateChangePassword: () => [
        check('currentPassword')
            .exists()
            .withMessage('Password is required')
            .isLength({
                min: 8,
            })
            .withMessage('Password must be at least 8 characters in length')
            .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
            .withMessage('Password should contain at least one letter, one number and one special character'),

        check('newPassword')
            .exists()
            .withMessage('Password is required')
            .isLength({
                min: 8,
            })
            .withMessage('Password must be at least 8 characters in length')
            .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
            .withMessage('Password should contain at least one letter, one number and one special character'),

        errorHandler,
    ],
    validateEmail: () => [
        body('email')
            .exists()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please provide a valid email address'),

        errorHandler,
    ],

    validateUpdate: () => [
        body('firstName')
            .optional()
            .matches(/^[a-z0-9_. A-Z]{1,16}$/)
            .withMessage('Please provide a valid firstName'),

        body('lastName')
            .optional()
            .matches(/^[a-z0-9_. A-Z]{1,16}$/)
            .withMessage('Please provide a valid lastName'),

        body('phone').optional().isNumeric().withMessage('Phone number is required'),

        body('accountHolderName')
            .exists()
            .withMessage('accountHolderName is required')
            .bail()
            .isString()
            .withMessage('Please provide a valid accountHolderName'),

        body('fathersName')
            .exists()
            .withMessage('fathersName is required')
            .bail()
            .isString()
            .withMessage('Please provide a valid fathersName'),

        body('accountNumber')
            .exists()
            .withMessage('accountNumber is required')
            .bail()
            .isString()
            .matches(/^[0-9]*$/)
            .withMessage('Please provide a valid accountNumber'),

        body('bankName')
            .exists()
            .withMessage('bankName is required')
            .bail()
            .isString()
            .withMessage('Please provide a valid bankName'),

        body('nicNumber')
            .exists()
            .withMessage('nicNumber is required')
            .bail()
            .isString()
            .matches(/^[0-9]*$/)
            .withMessage('Please provide a valid nicNumber'),

        errorHandler,
    ],

    validateAccountInfoUpdate: () => [
        body('accountHolderName')
            .exists()
            .withMessage('accountHolderName is required')
            .bail()
            .isString()
            .withMessage('Please provide a valid accountHolderName'),

        body('fathersName')
            .exists()
            .withMessage('fathersName is required')
            .bail()
            .isString()
            .withMessage('Please provide a valid fathersName'),

        body('accountNumber')
            .exists()
            .withMessage('accountNumber is required')
            .bail()
            .isString()
            .matches(/^[0-9]*$/)
            .withMessage('Please provide a valid accountNumber'),

        body('bankName')
            .exists()
            .withMessage('bankName is required')
            .bail()
            .isString()
            .withMessage('Please provide a valid bankName'),

        body('nicNumber')
            .exists()
            .withMessage('nicNumber is required')
            .bail()
            .isString()
            .matches(/^[0-9]*$/)
            .withMessage('Please provide a valid nicNumber'),

        errorHandler,
    ],

    validateWithdrawal: () => [
        body('amount')
            .exists()
            .withMessage('amount is required')
            .bail()
            .isNumeric()
            .withMessage('amount must be a number'),

        errorHandler,
    ],
};

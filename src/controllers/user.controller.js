const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authentication');
const userValidators = require('../validators/user.validator');
const UserRepo = require('../repositories/user.repo');
const UserWalletRepo = require('../repositories/user.wallet.repo');
//const multer = require("../middleware/multer");
const confirmationPost = require('../repositories/user.emailconfirmation.repo');
const { resendToken } = require('../repositories/user.resendtoken.repo');

const { getMulterMiddleware, handleMulterError } = require('../middleware/multer');

// const upload = multer.getMulterMiddleware(
//     "profilePhoto",
//     "public/media/",
//     false
// );

// @route   POST api/user/register
// @desc    Register user
// @access  Public
router.post('/checkrefcode', userValidators.validateReferralCode(), UserRepo.checkRefCode);
router.post('/register', userValidators.validateRegistration(), UserRepo.createUser);

router.get('/confirmation/:token', confirmationPost.confirmationPost);
router.post('/resend', userValidators.validateEmail(), resendToken);

// @route   POST api/user/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', userValidators.validateLogin(), UserRepo.loginUser);

router.use(authMiddleware.userAuth);

router.get('/', UserRepo.getProfile);

router.put('/', userValidators.validateUpdate(), UserRepo.updateProfile);
router.put('/updateAccountInfo', userValidators.validateAccountInfoUpdate(), UserRepo.updateAccountInfo);
router.post(
    '/uploadNIC',
    [getMulterMiddleware('nicImages', 'public/media/nic/', false, 2), handleMulterError],
    UserRepo.uploadNIC,
);
router.get('/packages', UserRepo.getPackage);
router.put('/packageSelection', UserRepo.packageSelection);
// router.put("/", upload, UserRepo.updateProfile);

router.post('/changePassword', userValidators.validateChangePassword(), UserRepo.changePassword);

//User Wallet
router.get('/wallet', UserWalletRepo.getWallet);
router.get('/transactionHistory', UserWalletRepo.getTransactionHistory);
router.post('/withdraw-amount', userValidators.validateWithdrawal(), UserWalletRepo.withdrawAmount);

module.exports = router;

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authentication");
const userValidators = require("../validators/user.validator");
const User = require("../models/User.model");
const UserRepo = require("../repositories/user.repo");
const multer = require("../middleware/multer");

const upload = multer.getMulterMiddleware(
    "profilePhoto",
    "public/media/",
    false
);

// @route   POST api/user/register
// @desc    Register user
// @access  Public
router.post("/checkrefcode",userValidators.validateReferralCode(), UserRepo.checkRefCode);
router.post("/register",userValidators.validateRegistration(),  UserRepo.createUser);



// @route   POST api/user/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", userValidators.validateLogin(), UserRepo.loginUser);

router.use(authMiddleware);

router.get("/", UserRepo.getProfile);
router.put("/", UserRepo.updateProfile);
router.put("/packageSelection", UserRepo.packageSelection);
// router.put("/", upload, UserRepo.updateProfile);
router.post("/changePassword", userValidators.validateChangePassword, UserRepo.changePassword);
module.exports = router;
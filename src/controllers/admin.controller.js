const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authentication");
const adminValidators = require("../validators/admin.validators");
const adminRepo = require("../repositories/admin.repo");
const adminWalletRepo = require("../repositories/admin.wallet.repo");
const adminPackageRepo = require("../repositories/admin.package.repo");
// const {getMulterMiddleware, handleMulterError} = require("../middleware/multer");


router.post("/login", adminValidators.validateLogin(), adminRepo.loginAdmin);

router.use(authMiddleware.adminAuth);

//get user
router.get("/User/:userId", adminRepo.getUser);

//get users
router.get("/Users", adminRepo.getUsers);

//get user with package status pending
router.get("/pendingStatus", adminRepo.pendingPackageStatus);

//update users
router.put("/updateUser",adminValidators.validateUpdate(),adminRepo.updateUser);
//, [... getMulterMiddleware('profilePhoto','public/media/',true,1), handleMulterError] 

//delete users
router.delete("/user", adminRepo.deleteUser);

//get wallet
router.get("/wallet", adminWalletRepo.getWallet);
router.get("/wallet/:userId", adminWalletRepo.getTransactionHistory);

// create package
router.post("/package",adminValidators.createPackage() ,adminPackageRepo.createPackage);

//delete package
router.delete("/package",adminValidators.deletePackage() ,adminPackageRepo.deletePackage);

//update package
router.put("/package",adminValidators.updatePackage() ,adminPackageRepo.updatePackage);

//get package
router.get("/package",adminPackageRepo.getPackage);

//add admin
router.post("/register",adminValidators.validateRegistration(), adminRepo.createAdmin)

//delete admin

//update admin



module.exports = router;

// add package model
// delete package model
// update package model

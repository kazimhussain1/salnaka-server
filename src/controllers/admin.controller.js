const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authentication");
const adminValidators = require("../validators/admin.validators");
const AdminRepo = require("../repositories/admin.repo");


router.post("/login", adminValidators.validateLogin(), AdminRepo.loginAdmin);

router.use(authMiddleware.adminAuth);

//get user
router.get("/User/:userId", AdminRepo.getUser);

//get users
router.get("/Users", AdminRepo.getUsers);

//get user with package status pending
router.get("/pendingStatus", AdminRepo.pendingPackageStatus);

//get wallet

//update users
router.put("/updateUser", adminValidators.validateUpdate() ,AdminRepo.updateUser);

//delete users
router.delete("/user", AdminRepo.deleteUser);


//add admin
//router.post("/register",adminValidators.validateRegistration(), AdminRepo.createAdmin)

//delete admin

//update admin



module.exports = router;

// add package model
// delete package model
// update package model

const express = require("express");
const router = express.Router();
const supportValidators = require("../validators/support.validators");
const supportRepo = require("../repositories/support.repo");


// @route   POST api/support/

router.post("/", supportValidators.supportForm(), supportRepo.sendMessage);

module.exports = router;
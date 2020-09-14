const express = require("express");
const router = express.Router();
const publicRepo = require("../repositories/public.repo");


// @route   POST api/support/

router.get("/packages", publicRepo.getPackages);

module.exports = router;
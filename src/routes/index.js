const router = require("express").Router();
const user = require("../controllers/user.controller");
// const authentication = require("../middleware/authentication");


router.use("/user", user);

// router.use(authentication);


module.exports = router;
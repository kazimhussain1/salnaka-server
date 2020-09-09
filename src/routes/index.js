const router = require("express").Router();
const user = require("../controllers/user.controller");
const admin = require("../controllers/admin.controller");
// const authentication = require("../middleware/authentication");


router.use("/user", user);
router.use("/console",admin);

// router.use(authentication);


module.exports = router;
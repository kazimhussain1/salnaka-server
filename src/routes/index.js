const router = require("express").Router();
const user = require("../controllers/user.controller");
const admin = require("../controllers/admin.controller");
const support = require("../controllers/support.controller");
const publicRoutes = require("../controllers/public.controller")
// const authentication = require("../middleware/authentication")

router.use('/public',publicRoutes)

router.use("/user", user);
router.use("/console",admin);
router.use("/support", support)

// router.use(authentication);


module.exports = router;
const router = require("express").Router();

const { register, login } = require("../controller/authcontroller");
const { refresh } = require("../controller/refreshToken");
const { authLimiter } = require("../middlewares/rateLimiters");

router.route("/register").post(authLimiter,register);
router.route("/login").post(authLimiter,login);
router.route("/refresh").post(refresh);

module.exports = router;

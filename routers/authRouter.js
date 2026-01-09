const router = require("express").Router();

const { register, login } = require("../controller/authcontroller");
const {refresh} = require("../utils/refreshToken");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/refresh").post(refresh);

module.exports = router;

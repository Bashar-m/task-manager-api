const router = require("express").Router();
const protect = require("../middlewares/protect");
const allowedTo = require("../middlewares/allowedTo");
const getUserId = require("../middlewares/getUserId");

const {
  createUser,
  getAllUser,
  getOneUser,
  updateOneUser,
  deleteOneUser,
  getMyData,
} = require("../controller/userController");

router.route("/getMe").get(protect,getUserId, getMyData);
router.use(protect, allowedTo("admin"));
router.route("/").post(createUser).get(getAllUser);
router.route("/:id").get(getOneUser).patch(updateOneUser).delete(deleteOneUser);

module.exports = router;

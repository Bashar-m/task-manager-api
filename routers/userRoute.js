const router = require("express").Router();

const {
  createUser,
  getAllUser,
  getOneUser,
  updateOneUser,
  deleteOneUser,
} = require("../controller/userController");

router.route("/").post(createUser).get(getAllUser);
router.route("/:id").get(getOneUser).patch(updateOneUser).delete(deleteOneUser);

module.exports = router;

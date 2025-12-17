const router = require("express").Router();

const {
  createCategory,
  getAllCategory,
  getOneCategory,
  updateOneCategory,
  deleteOneCategory,
} = require("../controller/categoryController");

router.route("/").post(createCategory).get(getAllCategory);
router
  .route("/:id")
  .get(getOneCategory)
  .patch(updateOneCategory)
  .delete(deleteOneCategory);

module.exports = router;

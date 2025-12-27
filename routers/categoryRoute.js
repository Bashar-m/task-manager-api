const router = require("express").Router();


const protect = require("../middlewares/protect");
const {
  createCategory,
  getAllCategory,
  getOneCategory,
  updateOneCategory,
  deleteOneCategory,
} = require("../controller/categoryController");

router.route("/").post(protect, createCategory).get(protect, getAllCategory);
router
  .route("/:id")
  .get(protect, getOneCategory)
  .patch(protect, updateOneCategory)
  .delete(protect, deleteOneCategory);
module.exports = router;

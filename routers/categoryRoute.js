const router = require("express").Router();


const protect = require("../middlewares/protect");

const validate = require("../middlewares/validateMiddleware");
const {getCategoryById} =require("../validators/category.schema")
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
  .get(protect,validate(getCategoryById , "params"), getOneCategory)
  .patch(protect, updateOneCategory)
  .delete(protect, deleteOneCategory);
module.exports = router;

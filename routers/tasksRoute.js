const protect = require("../middlewares/protect");

const router = require("express").Router();
const {
  createTask,
  getAllTasks,
  deleteOneTask,
  getOneTask,
  updateOneTask,
} = require("../controller/tasksController");

router.route("/").post(protect, createTask).get(protect, getAllTasks);
router
  .route("/:id")
  .get(protect, getOneTask)
  .patch(protect, updateOneTask)
  .delete(protect, deleteOneTask);

module.exports = router;

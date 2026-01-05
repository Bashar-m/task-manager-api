const protect = require("../middlewares/protect");

const router = require("express").Router();

const uploadTaskImage = require("../middlewares/uploadTaskImage");
const resizeTaskImage = require("../middlewares/resizeTaskImage");

const {
  createTask,
  getAllTasks,
  deleteOneTask,
  getOneTask,
  updateOneTask,
} = require("../controller/tasksController");

router
  .route("/")
  .post(protect, uploadTaskImage, resizeTaskImage, createTask)
  .get(protect, getAllTasks);
router
  .route("/:id")
  .get(protect, getOneTask)
  .patch(protect, uploadTaskImage, resizeTaskImage, updateOneTask)
  .delete(protect, deleteOneTask);

module.exports = router;

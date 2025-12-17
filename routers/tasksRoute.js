const router = require("express").Router();
const {
  createTask,
  getAllTasks,
  getOneTask,
  updateOneTask,
  deleteOneTask,
} = require("../controller/tasksController");

router.route("/").post(createTask).get(getAllTasks);
router.route("/:id").get(getOneTask).patch(updateOneTask).delete(deleteOneTask);
module.exports = router;

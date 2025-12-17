const router = require("express").Router();
const {
  createTask,
  getAllTasks,
  getOneTask,
} = require("../controller/tasksController");

router.post("/", createTask);
router.get("/", getAllTasks);
router.get("/:id", getOneTask);
module.exports = router;

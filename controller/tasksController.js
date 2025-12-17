const Task = require("../models/tasksModel");

const {
  createOne,
  getAll,
  getOne,
  deleteOne,
  updateOne,
} = require("../controller/handlersFactory");

exports.createTask = createOne(Task);

exports.getAllTasks = getAll(Task);

exports.getOneTask = getOne(Task);

exports.updateOneTask = updateOne(Task);

exports.deleteOneTask = deleteOne(Task);

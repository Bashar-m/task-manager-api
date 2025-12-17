const apiError = require("../utils/apiError");
const Features = require("../utils/apiFeatures");
const asyncHandler = require("express-async-handler");
const Task = require("../models/tasksModel");

exports.createTask = asyncHandler(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json({ data: task });
});
exports.getAllTasks = asyncHandler(async (req, res, next) => {
  const totalDocuments = await Task.countDocuments();

  const features = new Features(Task.find(), req.query)
    .filter()
    .sort()
    .search()
    .limitFields()
    .paginate(totalDocuments);

  const { results: tasks, pagination } = await features.execute();
  if (!tasks || tasks.length === 0) {
    return next(new apiError("No tasks found", 404));
  }

  res.status(200).json({
    results: tasks.length,
    pagination,
    data: tasks,
  });
});

exports.getOneTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findById(id);

  if (!task) {
    return next(new apiError(`no task on this id : ${id}`));
  }

  res.status(200).json({ data: task });
});


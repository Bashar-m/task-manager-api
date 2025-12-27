const Task = require("../models/tasksModel");
const asyncHandler = require("express-async-handler");
const TaskService = require("../services/taskService");
const getPagination = require("../utils/getPagination");
const { httpStatus } = require("../constants");

exports.createTask = asyncHandler(async (req, res, next) => {
  const task = await Task.create({ ...req.body, owner: req.user._id });
  res.status(httpStatus.CREATED).json({ data: task });
});

exports.getAllTasks = asyncHandler(async (req, res, next) => {
  const { pagination, criteria } = getPagination(req.query);

  const tasks = await TaskService.getByCriteria(
    req.user._id,
    criteria,
    pagination
  );

  res.status(httpStatus.OK).json(tasks);
});

exports.getOneTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
  res.status(httpStatus.OK).json({ data: task });
});

exports.updateOneTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  res.status(httpStatus.OK).json({ data: task });
});

exports.deleteOneTask = asyncHandler(async (req, res, next) => {
  await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  res.status(httpStatus.NO_CONTENT).send();
});

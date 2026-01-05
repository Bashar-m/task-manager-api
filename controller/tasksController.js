const Task = require("../models/tasksModel");
const asyncHandler = require("express-async-handler");
const TaskService= require("../services/taskService");
const getPagination = require("../utils/getPagination");
const { httpStatus } = require("../constants");

exports.createTask = asyncHandler(async (req, res, next) => {
  const task = await TaskService.createOne(req.user._id, req.body);
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
  const task = await TaskService.getOne(req.params.id, req.user._id);
  res.status(httpStatus.OK).json({ data: task });
});

exports.updateOneTask = asyncHandler(async (req, res, next) => {

  const task = await TaskService.update(
    req.params.id,
    req.user._id,
    req.body
  );
  res.status(httpStatus.OK).json({ data: task });
});

exports.deleteOneTask = asyncHandler(async (req, res, next) => {
  await TaskService.delete(req.params.id, req.user._id);
  res.status(httpStatus.NO_CONTENT).send();
});

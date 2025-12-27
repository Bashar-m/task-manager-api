const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const UserService = require("../services/userService");
const getPagination = require("../utils/getPagination");
const { httpStatus } = require("../constants");


exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create({ ...req.body });
  res.status(httpStatus.CREATED).json({ data: user });
});

exports.getAllUser = asyncHandler(async (req, res, next) => {
  const { pagination } = getPagination(req.query);
  const users = await UserService.paginate({}, pagination);
  res.status(httpStatus.OK).json(users);
});

exports.getOneUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id });
  res.status(httpStatus.OK).json({ data: user });
});

exports.updateOneUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(httpStatus.OK).json({ data: user });
});

exports.deleteOneUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete({ _id: req.params.id });
  res.status(httpStatus.NO_CONTENT).send();
});
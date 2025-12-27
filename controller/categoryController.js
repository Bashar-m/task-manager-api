const Category = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");
const CategoryService = require("../services/categoryService");
const getPagination = require("../utils/getPagination");
const { httpStatus } = require("../constants");

exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create({ ...req.body, owner: req.user._id });
  res.status(httpStatus.CREATED).json({ data: category });
});

exports.getAllCategory = asyncHandler(async (req, res) => {
  const { pagination } = getPagination(req.query);

  const categories = await CategoryService.paginate(
    { owner: req.user._id },
    pagination
  );

  res.status(httpStatus.OK).json(categories);
});

exports.getOneCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });
  res.status(httpStatus.OK).json({ data: category });
});

exports.updateOneCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(
    {
      _id: req.params.id,
      owner: req.user._id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(httpStatus.OK).json({ data: category });
});

exports.deleteOneCategory = asyncHandler(async (req, res, next) => {
  await Category.findByIdAndDelete({ _id: req.params.id, owner: req.user._id });
  res.status(httpStatus.NO_CONTENT).send();
});

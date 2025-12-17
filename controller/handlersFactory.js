const ApiError = require("../utils/apiError");
const Features = require("../utils/apiFeatures");
const apiError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    const totalDocuments = await Model.countDocuments();

    const features = new Features(Model.find(), req.query)
      .filter()
      .sort()
      .search()
      .limitFields()
      .paginate(totalDocuments);

    const { results: result, pagination } = await features.execute();
    if (!result || result.length === 0) {
      return next(new apiError("No category found", 404));
    }

    res.status(200).json({
      results: result.length,
      pagination,
      data: result,
    });
  });
exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (!document) {
      return next(
        new ApiError(`no document for this id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ status: "success", data: document });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document) {
      return next(
        new ApiError(`no document for this id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ status: "success", data: document });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(
        new ApiError(`no document for this id ${req.params.id}`, 404)
      );
    }
    res.status(204).json({ status: "success", message: "Deleted" });
  });

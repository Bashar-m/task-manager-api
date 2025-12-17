const apiFeatures = require("../utils/apiFeatures");
const apiError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getAll = (Model, popOpretons) =>
  asyncHandler(async (req, res, next0) => {
    const document = await apiFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    if (!document) {
      return next(new apiError("No documents found", 404));
    }
    if (popOpretons) {
      document.populate(popOpretons);
    }
    res.status(200).json({
      results: document.length,
      pagination: apiFeatures.paginate(req, document),
      data: document,
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

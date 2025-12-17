const Category = require("../models/categoryModel");

const {
  createOne,
  getAll,
  getOne,
  deleteOne,
  updateOne,
} = require("../controller/handlersFactory");

exports.createCategory = createOne(Category);

exports.getAllCategory = getAll(Category);

exports.getOneCategory = getOne(Category);

exports.updateOneCategory = updateOne(Category);

exports.deleteOneCategory = deleteOne(Category);

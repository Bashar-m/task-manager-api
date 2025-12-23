const User = require("../models/userModel");


const {
  createOne,
  getAll,
  getOne,
  deleteOne,
  updateOne,
} = require("../controller/handlersFactory");

exports.createUser = createOne(User);

exports.getAllUser = getAll(User);

exports.getOneUser = getOne(User);

exports.updateOneUser = updateOne(User);

exports.deleteOneUser = deleteOne(User);

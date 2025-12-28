const joi = require("./joi");

exports.createCategory = joi.object({
  name: joi.string().min(3).max(50).required(),
});

exports.getCategoryById = joi.object({
  id: joi.objectId().required(),
});
exports.updateCategory = joi.object({
  id: joi.objectId().required(),
  name: joi.string().min(3).max(50).optional(),
});
exports.deleteCategory = joi.object({
  id: joi.objectId().required(),
});

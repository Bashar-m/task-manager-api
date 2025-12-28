const joi = require("joi");
const mongoose = require("mongoose");

joi.objectId = () =>
  joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.message("Invalid id format");
    }
    return value;
  });

joi.search = () =>
  joi.string().trim().min(1).max(100).messages({
    "string.min": "'{#label}' should have at least {#limit} characters",
    "string.max": "'{#label}' should have at most {#limit} characters",
  });

joi.pagination = () =>
  joi.object({
    page: joi.number().integer().min(1).default(1),
    limit: joi.number().integer().min(1).max(100).default(50),
    sort: joi.string().valid("asc", "desc").default("desc"),
  });

module.exports = joi;

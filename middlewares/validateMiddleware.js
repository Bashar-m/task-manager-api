const httpStatus = require("../constants/httpStatus");
const ApiError = require("../utils/ApiError");



const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });


    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      return next(new ApiError(message, httpStatus.BAD_REQUEST));
    }


    req[property] = value;
    next();

  };
};

module.exports = validate;

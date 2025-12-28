const httpStatus = require("../constants/httpStatus");

const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });
    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return res.status(httpStatus.BAD_REQUEST).json({ errors: errorDetails });
    }
    req[property] = value;
    next();
  };
};

module.exports = validate;

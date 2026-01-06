const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const { httpStatus } = require("../constants/index");

const allowedTo = (...allowedRoles) =>
  asyncHandler(async (req, res, next) => {
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return next(
        new ApiError(
          "You are not allowed to access this route",
          httpStatus.FORBIDDEN
        )
      );
    }

    next();
  });

module.exports = allowedTo;

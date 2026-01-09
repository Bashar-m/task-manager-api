const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const ApiError = require("../utils/apiError");
const { createAccessToken } = require("../utils/createToken");
const { httpStatus } = require("../constants/index");

exports.refresh = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError("No refresh token", httpStatus.UNAUTHORIZED);
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  const newAccessToken = createAccessToken(decoded.id);

  res.status(200).json({
    token: newAccessToken,
  });
});

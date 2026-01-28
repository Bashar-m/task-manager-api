const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not logged in. Please login to access this route",
        401
      )
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    return next(new ApiError("Invalid token", 401));
  }

  const currentUser = await User.findById(decoded.id || decoded._id || decoded.userId);

  if (!currentUser) {
    return next(
      new ApiError("The user that belongs to this token no longer exists", 401)
    );
  }

  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed their password. Please login again.",
          401
        )
      );
    }
  }

  req.user = currentUser;

  next();
});

module.exports = protect;

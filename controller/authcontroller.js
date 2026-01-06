const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ApiError("User already exists", 400));
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = createToken(user._id);

  res.status(201).json({
    status: "Account created successfully",
    data: user,
    token,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  const token = createToken(user._id);

  res.status(200).json({
    status: "Login successful",
    data: user,
    token,
  });
});

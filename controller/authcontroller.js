const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const verifyCaptcha = require("../utils/captchaVerifier");
const {
  createAccessToken,
  createRefreshToken,
} = require("../utils/createToken");
const { httpStatus } = require("../constants/index");

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
  const { email, password, captchaToken } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  if (user.isLocked()) {
    const remainingTime = user.getRemainingLockTime();

    return res.status(httpStatus.LOCKED).json({
      status: "LOCKED",
      retryAfter: remainingTime,
      message: "Account locked. Try again later.",
    });
  }

  if (user.loginAttempts >= 3) {
    if (!captchaToken) {
     return res.status(httpStatus.BAD_REQUEST).json({
        requireCaptcha: true,
        message: "Captcha required after multiple failed attempts",
      });
    }
    await verifyCaptcha(captchaToken);
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    await user.handleFailedLogin();
    throw new ApiError("Incorrect email or password", httpStatus.UNAUTHORIZED);
  }

  await user.resetLoginAttempts();

  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken(user._id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: "Login successful",
    data: user,
    token: accessToken,
  });
});

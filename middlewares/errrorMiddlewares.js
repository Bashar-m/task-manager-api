const ApiError = require("../utils/ApiError");
const { httpStatus } = require("../constants/index");
const logger = require("../utils/logger");



// Error handling functions for different error types 
const handleJWTError = () =>
  new ApiError("Invalid token. Please log in again!", httpStatus.UNAUTHORIZED);

const handleJWTExpiredError = () =>
  new ApiError(
    "Your token has expired! Please log in again.",
    httpStatus.UNAUTHORIZED
  );

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new ApiError(message, httpStatus.BAD_REQUEST);
};

const handleDuplicateFieldsDB = (err) => {
  const value = Object.values(err.keyValue)[0];
  return new ApiError(`Duplicate field value: ${value}`, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new ApiError(message, httpStatus.BAD_REQUEST);
};


// Error response functions for development and production environments 
const sendErrorDev = (err, req, res) => {
  return res.status(err.statusCode).json({
    status: err.status || "error",
    error: err,
    message: err.message || "internal server error",
    stack: err.stack,
  });
};


// Production error handling 
const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or other unknown error: don't leak error details
  // 1) Log error
  logger.error("ERROR 💥", err);
  // 2) Send generic message
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: "Something went very wrong!",
  });
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "local") {
    if (err.name === "CastError") err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") err = handleValidationErrorDB(err);
    if (err.name === "JsonWebTokenError") err = handleJWTError();
    if (err.name === "TokenExpiredError") err = handleJWTExpiredError();

    sendErrorDev(err, req, res);

  } else {

    let error = { ...err };
    error.message = err.message;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError") error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(err, req, res);
  }
};


module.exports = globalErrorHandler;

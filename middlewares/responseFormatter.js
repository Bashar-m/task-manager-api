module.exports = (req, res, next) => {
  res.success = (data, statusCode = 200) => {
    res.status(statusCode).json({
      status: "success",
      data,
    });
  };

  res.error = (message, statusCode = 500) => {
    res.status(statusCode).json({
      status: "error",
      message,
    });
  };

  next();
};

const getUserId = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

module.exports = getUserId;

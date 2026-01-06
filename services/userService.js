const { httpStatus } = require("../constants");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const BaseService = require("./BaseService");

class UserService extends BaseService {
  constructor() {
    super(User);
  }

   async getMe(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError("No data found", httpStatus.NOT_FOUND);
    }
    return user;
  }
}

module.exports = new UserService();

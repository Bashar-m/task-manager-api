const User = require("../models/userModel");
const BaseService = require("./BaseService");

class UserService extends BaseService {
  constructor() {
    super(User);
  }
}

module.exports = new UserService();
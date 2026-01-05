const Category = require("../models/categoryModel");
const BaseService = require("./BaseService");
class CategoryService extends BaseService {

  constructor() {
    super(Category);
  }
}

module.exports = new CategoryService();
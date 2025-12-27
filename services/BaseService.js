const { has } = require("lodash");

class BaseService {
  constructor(Model) {
    this.Model = Model;
  }

  async paginate(filter = {}, pagination = {}) {
    const skip = Number(pagination.skip) || 0;
    const limit = Number(pagination.limit) || 50;
    const sort = pagination.sort || { _id: -1 };

    const data = await this.Model.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const total = await this.Model.countDocuments(filter);

    return {
      pagination: {
        total,
        skip,
        limit,
        hasNext: skip + limit < total,
        hasPrev: skip > 0,
      },
      data,
    };
  }
}

module.exports = BaseService;

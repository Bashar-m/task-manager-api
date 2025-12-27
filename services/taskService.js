const Task = require("../models/tasksModel");

class TaskService {
  static async getByCriteria(userId, criteria, pagination) {
    const query = {
      ...criteria,
      owner: userId,
    };

    if (criteria.search) {
      query.title = { $regex: criteria.search, $options: "i" };
      delete criteria.search;
    }

    Object.assign(query, criteria);
    const skip = Number(pagination.skip) || 0;
    const limit = Number(pagination.limit) || 50;
    const sort = pagination.sort || { _id: -1 };

    const data = await Task.find(query).skip(skip).limit(limit).sort(sort);

    const total = await Task.countDocuments(query);

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

module.exports = TaskService;

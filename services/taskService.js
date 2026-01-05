const ApiError = require("../utils/ApiError");
const { httpStatus } = require("../constants/index");
const path = require("path");
const fs = require("fs");
const Task = require("../models/tasksModel");
const logger = require("../utils/logger");
class TaskService {

  /* =======================
     GET BY CRITERIA
  ======================= */

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

  /* =======================
         create TASK
  ======================= */

  static async createOne(userId, data) {
    return await Task.create({ ...data, owner: userId });
  }

  /* =======================
     GET ONE TASK
======================= */
  static async getOne(taskId, userId) {
    return await Task.findOne({ _id: taskId, owner: userId });
  }

  /* =======================
         UPDATE TASK
  ======================= */

  static async update(taskId, userId, data = {}) {

    const oldTask = await Task.findOne({ _id: taskId, owner: userId });

  if (!oldTask) {
    throw new ApiError("Task not found", httpStatus.NOT_FOUND);
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { $set: data },
    { new: true, runValidators: true }
  );

  // الشرط: وجود صورة قديمة + وجود صورة جديدة في الطلب + الصورة الجديدة مختلفة عن القديمة
  if (oldTask.image && data.image && oldTask.image !== data.image) {
    // استخدم path.resolve لضمان المسار من جذر المشروع
    const oldImagePath = path.join(process.cwd(),"uploads",oldTask.image);

    // التحقق ثم الحذف غير المتزامن
    fs.access(oldImagePath, fs.constants.F_OK, (err) => {
      if (!err) {
        fs.unlink(oldImagePath, (unlinkErr) => {
          if (unlinkErr) logger.error(`Failed to delete image at ${oldImagePath}:`, unlinkErr);
        });
      }
    });
  }

  return updatedTask;
}

  /* =======================
      DELETE TASK + IMAGE
  ======================= */
  static async delete(taskId, userId) {
    const task = await Task.findOne({ _id: taskId, owner: userId });
    if (!task) {
      throw new ApiError("Task not found", httpStatus.NOT_FOUND);
    }

    if (task.image) {
      const imagePath = path.join(process.cwd(),"uploads", task.image);
       
      fs.access(imagePath , (err)=>{
        if(!err){
          fs.unlink(imagePath , unlinkError=>{
            logger.error(`Failed to delete image at ${imagePath}:`, unlinkError)
          })
        }
      })
    }
    await Task.deleteOne({ _id: taskId });
  }
}

module.exports = TaskService;

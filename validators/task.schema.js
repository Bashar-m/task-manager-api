const Joi = require("./joi");

exports.createTask = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(5).required(),
  category: Joi.objectId().optional(),
  priority: Joi.string().valid(
    "high priority",
    "medium priority",
    "low priority",
    "no priority"
  ),
  status: Joi.string().valid("pending", "in-progress", "completed", "overdue"),
  dueDate: Joi.date().required(),
});

exports.getTasks = Joi.object({
  search: Joi.search().optional(),
  status: Joi.string()
    .valid("pending", "in-progress", "completed", "overdue")
    .optional(),
  priority: Joi.string().optional(),
}).concat(Joi.pagination());

exports.getTaskById = Joi.object({
  _id: Joi.objectId().required(),
});

exports.updateTask = Joi.object({
  _id: Joi.objectId().required(),
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().min(5).optional(),
  category: Joi.objectId().optional(),
  priority: Joi.string()
    .valid("high priority", "medium priority", "low priority", "no priority")
    .optional(),
  status: Joi.string()
    .valid("pending", "in-progress", "completed", "overdue")
    .optional(),
  dueDate: Joi.date().optional(),
});

exports.deleteTask = Joi.object({
  taskId: Joi.objectId().required(),
});

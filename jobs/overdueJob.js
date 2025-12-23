const Task = require("../models/tasksModel");
const logger = require("../utils/logger");

module.exports = async () => {
  const now = new Date();

  try {
    const result = await Task.updateMany(
      {
        status: "pending",
        dueDate: { $lt: now }, 
      },
      { status: "overdue" } 
    );

   
    logger.info(`⏱ Updated ${result.modifiedCount} overdue tasks`);
  } catch (error) {
    logger.error("❌ Error updating overdue tasks:", error);
  }
};


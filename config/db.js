const mongoose = require("mongoose");
const logger = require("../utils/logger");

const dbConnection = async () => {
  try {
    mongoose.connect(process.env.DB_URL).then((conn) => {
      logger.info(`Database Connected: ${conn.connection.host}`);
    });
  } catch (err) {
    logger.error(`❌ Database Error: ${err.message}`);
    // في دوكر، نريد للتطبيق أن ينهار إذا لم يجد القاعدة ليعيد دوكر تشغيله
    process.exit(1);
  }
};

module.exports = dbConnection;

const mongoose = require("mongoose"); // أضف هذا
const dotenv = require("dotenv");    // أضف هذا
const overdueQueue = require("./overdueQueue");
const overdueJob = require("../jobs/overdueJob");
const logger = require("../utils/logger");

// 1. تحميل الإعدادات من ملف الـ env
const envFile = process.env.NODE_ENV === "docker" ? "docker.env" : "local.env";
dotenv.config({ path: envFile });

// 2. الاتصال بقاعدة البيانات باستخدام الرابط من ملف الـ env
// تأكد أن الرابط هو mongodb://mongo_db:27017/task-manager
mongoose.connect(process.env.DB_URL)
  .then(() => logger.info("✅ Worker connected to MongoDB"))
  .catch((err) => logger.error("❌ Worker DB Connection Error:", err));

logger.info("⏱ Setting up overdue tasks worker...");

// 3. إعداد المعالج للمهام في الطابور
overdueQueue.process(
  async()=>{
    await overdueJob();
  }
)
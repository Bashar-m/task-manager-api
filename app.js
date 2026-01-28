// معالجة ال (أخطاء برمجية قاتلة في الكود المتزامن).
process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1); //دوكر سيعيد التشغيل تلقائياً
});

const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

// 1) تحميل متغيرات البيئة)
const envFile = process.env.NODE_ENV === "docker" ? "docker.env" : "local.env";
dotenv.config({ path: `config/${envFile}` });

// 2) استيراد الملفات التي تعتمد على متغيرات البيئة (بعد dotenv)
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const dbConnection = require("./config/db");
const logger = require("./utils/logger");
const mountRoutes = require("./routers/routersIndex");
const security = require("./middlewares/security.middleware");
const globalErrorHandler = require("./middlewares/errrorMiddlewares");

// 3) الاتصال بقاعدة البيانات
dbConnection();

const app = express();

// 4) Middlewares الأساسية
app.use(cookieParser());

// حماية
security(app);

// 5) Logging (في بيئة التطوير فقط)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  logger.info(`Mode: ${process.env.NODE_ENV}`);
}

// 6) توجيه المسارات
mountRoutes(app);

// 7) معالج الأخطاء)
app.use(globalErrorHandler);

// 8) المهام المجدولة (Cron Jobs)
/*
setInterval(() => {
  overdueQueue.add({});
  logger.info("🕒 Cron: Added overdue check job");
}, 60 * 1000); 
*/

// 9) تشغيل السيرفر
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const server = app.listen(PORT, HOST, () => {
  logger.info(`🚀 Server is running at http://${HOST}:${PORT}`);
});

// التعامل مع الأخطاء التي تحدث خارج نطاق Express (مثل فشل الاتصال بالقاعدة)
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => {
    logger.info("Server closed. Process exiting...");
    process.exit(1); // دوكر سيعيد التشغيل تلقائيا بسبب restart: always
  });
});

// التعامل مع إشارة الإغلاق من دوكر (docker stop)
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    logger.info("Process terminated.");
  });
});

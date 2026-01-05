const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const globalErrorHandler = require("./middlewares/errrorMiddlewares");
const dbConnection = require("./config/db");
const logger = require("./utils/logger");
const mountRoutes = require("./routers/routersIndex");
const app = express();

app.use(express.json());
//configure env variables

const envFile = process.env.NODE_ENV === "docker" ? "docker.env" : "local.env";
dotenv.config({ path: `config/${envFile}` });

//database connection
dbConnection();

//environment specific middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

//mount all routes
mountRoutes(app);
//global error handling middleware
app.use(globalErrorHandler);

// setInterval(() => {
//   overdueQueue.add({});
//   logger.info("🕒 Cron: Added overdue check job");
// }, 60 * 1000); // كل دقيقة


//start the server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () => {
  logger.info(`Server is running at http://${HOST}:${PORT}`);
});

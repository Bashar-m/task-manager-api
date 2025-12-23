const tasksRoute = require("./tasksRoute");
const categoryRoute = require("./categoryRoute");
const userRoute = require("./userRoute");
const authRoute = require("./authRouter");

const mountRoutes = (app) => {
  app.use("/api/v1/task", tasksRoute);
  app.use("/api/v1/category", categoryRoute);
  app.use("/api/v1/user", userRoute);
  app.use("/api/v1/auth", authRoute);
};

module.exports = mountRoutes;

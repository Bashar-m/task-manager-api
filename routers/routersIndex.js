const tasksRoute = require("./tasksRoute");
const categoryRoute = require("./categoryRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/task", tasksRoute);
  app.use("/api/v1/category", categoryRoute);
};

module.exports = mountRoutes;

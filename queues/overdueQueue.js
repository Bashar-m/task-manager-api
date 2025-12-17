const Queue = require("bull");

const overdueQueue = new Queue("overdue-check", {
  redis: {
    host: "redis",   // اسم الخدمة في docker-compose
    port: 6379,
    maxRetriesPerRequest: null,
  },
});

module.exports = overdueQueue;

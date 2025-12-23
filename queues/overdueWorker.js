const mongoose = require("mongoose"); 
const dotenv = require("dotenv");    
const overdueQueue = require("./overdueQueue");
const overdueJob = require("../jobs/overdueJob");
const logger = require("../utils/logger");


const envFile = process.env.NODE_ENV === "docker" ? "docker.env" : "local.env";
dotenv.config({ path: envFile });

// mongodb://mongo_db:27017/task-manager
mongoose.connect(process.env.DB_URL)
  .then(() => logger.info("✅ Worker connected to MongoDB"))
  .catch((err) => logger.error("❌ Worker DB Connection Error:", err));

logger.info("⏱ Setting up overdue tasks worker...");

// إعداد المعالج للمهام في الطابور
overdueQueue.process(
  async()=>{
    await overdueJob();
  }
)
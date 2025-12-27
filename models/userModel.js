const mongoose = require("mongoose");

const userShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  myTasks: {
    type: mongoose.Schema.ObjectId,
    ref: "Tasks",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

module.exports = mongoose.model("User", userShema);

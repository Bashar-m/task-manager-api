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

userShema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model("User", userShema);

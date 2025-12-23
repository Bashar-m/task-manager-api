const mongoose = require("mongoose");

const tasksSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },
    priority: {
      type: String,
      enum: ["high priority", "medium priority", "low priority", "no priority"],
      default: "medium priority",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "overdue"],
      default: "pending",
    },
    dueDate: { type: Date, required: true, default: Date.now() },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tasks", tasksSchema);

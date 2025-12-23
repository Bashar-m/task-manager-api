const mongoose = require("mongoose");

const categorySchemh = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
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

module.exports = mongoose.model("Category", categorySchemh);

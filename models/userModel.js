const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    /* =========================
       🔐 Security Fields
    ========================= */

    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

/* =========================
   Middlewares (Hooks)
========================= */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
});

/* =========================
   Instance Methods (Functions)
========================= */

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

userSchema.methods.getRemainingLockTime = function () {
  if (!this.lockUntil) return 0;

  return Math.ceil((this.lockUntil - Date.now()) / 1000);
};

userSchema.methods.handleFailedLogin = async function () {
  this.loginAttempts += 1;

  if (this.lastLoginAt >= 5) {
    this.lockUntil = Date.now() + 15 * 60 * 1000;
  }

  return await this.save();
};

userSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.lockUntil = null;
  this.lastLoginAt = new Date();

  return await this.save();
};

const User = mongoose.model("User", userSchema);

module.exports = User;

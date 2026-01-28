const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
      select: false, // لا تظهر كلمة السر في الاستعلامات العادية
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
// تشفير كلمة السر تلقائياً قبل الحفظ
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
});

/* =========================
   Instance Methods (Functions)
========================= */

// مقارنة كلمة السر المدخلة بالمشفرة
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// التأكد إذا كان الحساب مقفلاً حالياً
userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// حساب الوقت المتبقي لفك القفل بالثواني
userSchema.methods.getRemainingLockTime = function () {
  if (!this.lockUntil) return 0;
  return Math.ceil((this.lockUntil - Date.now()) / 1000);
};

// التعامل مع محاولات الدخول الفاشلة
userSchema.methods.handleFailedLogin = async function () {
  // زيادة العداد
  this.loginAttempts += 1;

  // إذا وصلت المحاولات لـ 5، يتم قفل الحساب لمدة 15 دقيقة
  if (this.loginAttempts >= 5) {
    this.lockUntil = Date.now() + 15 * 60 * 1000;
  }

  return await this.save();
};

// إعادة تعيين المحاولات عند تسجيل الدخول الناجح
userSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.lockUntil = null;
  this.lastLoginAt = new Date();

  return await this.save();
};

const User = mongoose.model("User", userSchema);
module.exports = User;
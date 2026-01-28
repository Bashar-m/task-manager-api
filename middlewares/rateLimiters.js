const rateLimit = require("express-rate-limit");

// حماية السيرفر ككل من الإغراق (DDoS Protection)
exports.globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: {
    status: "fail",
    error: "Too many requests from this IP. Please try again after 15 minutes.",
  },
});

// حماية بوابة تسجيل الدخول (Brute-force Protection)
exports.authLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 دقيقة
  max: 5, // 5 محاولات فاشلة فقط
  message: {
    status: "fail",
    error:
      "Too many failed login attempts. Account locked for this IP for 30 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // لا يحسب محاولات الدخول الناجحة
});

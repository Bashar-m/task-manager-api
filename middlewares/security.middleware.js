const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const hpp = require("hpp");
const { globalLimiter } = require("./rateLimiters");

/**
 * إعدادات الحماية (Security Configuration)
 * ---------------------------------------
 * هذا الملف يعمل كدرع حماية للسيرفر ضد أشهر هجمات الويب.
 * يتم استدعاؤه في app.js وتمرير نسخة الـ app إليه.
 */
module.exports = (app) => {
  // 1) Security Headers (بواسطة Helmet)
  // تقوم بضبط الـ HTTP Headers لمنع هجمات مثل XSS و Clickjacking
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          // 'self' تعني: لا تقبل موارد (صور/سكربتات) إلا من نفس السيرفر الخاص بي
          defaultSrc: ["'self'"],
          // السماح بالسكربتات الداخلية وكود الجافاسكربت الخاص بموقعك فقط
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          // imgSrc: تحديد من أين يمكن للمتصفح تحميل الصور
          // data: يسمح بالصور المشفرة (Base64)
          // https://res.cloudinary.com: يسمح بالصور المخزنة على كلاوديناري
          imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
          // ترقية أي طلب HTTP ضعيف إلى HTTPS تلقائياً للأمان
          upgradeInsecureRequests: [],
        },
      },
    })
  );

  app.use(globalLimiter);

  // 2) CORS (Cross-Origin Resource Sharing)
  // تحديد المواقع (Front-end) التي يُسمح لها بسحب بيانات من هذا السيرفر
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : [];

  app.use(
    cors({
      origin: function (origin, callback) {
        // !origin: تسمح بالأدوات التي لا تملك رابط مثل (Postman أو تطبيقات الموبايل)
        // allowedOrigins.includes(origin): التأكد أن رابط الموقع موجود في القائمة البيضاء بالـ .env
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Access denied by CORS policy"));
        }
      },
      // credentials: true: ضروري جداً للسماح بإرسال واستقبال الـ Cookies (Refresh Token)
      credentials: true,
    })
  );

  // 3) Body Parsing & Protection
  // تحديد حجم البيانات القادمة لمنع هجمات إغراق السيرفر (DoS)
  app.use(require("express").json({ limit: "10mb" }));

  // 4) Mongo Sanitize
  // يحمي من هجوم NoSQL Injection (منع استخدام رموز مثل $ أو . في الـ Query)
  // مثال: يمنع الهاكر من كتابة {"email": {"$gt": ""}} لتسجيل الدخول بدون كلمة مرور
  
  //app.use(mongoSanitize());

  // 5) HPP (HTTP Parameter Pollution)
  // يحمي من تكرار المعاملات في الرابط، مثل: /api/users?role=admin&role=user
  // يضمن أن السيرفر يأخذ معامل واحد فقط ويمنع التلاعب بالصلاحيات
  app.use(hpp());
};

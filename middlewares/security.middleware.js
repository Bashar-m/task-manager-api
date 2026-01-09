const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");
const hpp = require("hpp");

module.exports = (app) => {
  // 1) Security Headers
  app.use(helmet());

  // 2) CORS
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : [];

  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );

  // 3) Body parsing & protection
  app.use(require("express").json({ limit: "10mb" }));
  app.use(mongoSanitize());
  app.use(xss());
  app.use(hpp());
};

const axios = require("axios");
const ApiError = require("./apiError");
const httpStatus = require("../constants/httpStatus");

const verifyCaptchaToken = async function (token) {
  if (!token) {
    throw new ApiError("Captcha token is required", httpStatus.BAD_REQUEST);
  }

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        },
        timeout: 5000, // حمابه الخادم من التاخير
      }
    );

    if (!response.data.success) {
      throw new ApiError("Invalid Captcha", httpStatus.FORBIDDEN);
    }
    return true;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    // التعامل مع أخطاء الشبكة أو تعطل سيرفر جوجل
    throw new ApiError(
      "Captcha service unavailable",
      httpStatus.SERVICE_UNAVAILABLE
    );
  }
};

module.exports = verifyCaptchaToken;

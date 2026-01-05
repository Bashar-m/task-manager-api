const multer = require("multer");
const ApiError = require("../utils/ApiError");
const { httpStatus } = require("../constants/index");

// Set up storage engine
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new ApiError("Only image files are allowed!", httpStatus.BAD_REQUEST),
      false
    );
  }
};

// Initialize multer with storage engine and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

// Middleware to handle single image upload
const uploadTaskImage = upload.single("image");
module.exports = uploadTaskImage;
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const resizeTaskImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const uploadDir = path.join(__dirname, "../uploads/tasks");
  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Define the filename and path
  const filename = `task-${uuidv4()}-${Date.now()}.jpeg`;
  const uploadPath = path.join(uploadDir, filename);

  await sharp(req.file.buffer)
    .resize(800, 800, {
      fit: sharp.fit.inside,
      position: sharp.strategy.entropy,
    })
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile(uploadPath);

  // Save the filename to req.file for further processing
  req.body.image = `tasks/${filename}`;

  next();
});

module.exports = resizeTaskImage;
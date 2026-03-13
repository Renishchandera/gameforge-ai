// middlewares/upload.middleware.js
const multer = require("multer");
require("dotenv").config();

// Configure multer for memory storage
const storage = multer.memoryStorage();

// Get allowed file types from env
const ALLOWED_TYPES = (process.env.ALLOWED_FILE_TYPES || 
  "image/jpeg,image/png,image/gif,application/pdf,application/zip,text/plain"
).split(",");

// Get max file size from env (default 10MB)
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024;

// File filter
const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${ALLOWED_TYPES.join(", ")}`), false);
  }
};

// File size limit from env
const limits = {
  fileSize: MAX_FILE_SIZE
};

const upload = multer({
  storage,
  fileFilter,
  limits
});

// Error handling wrapper
upload.handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: `File too large. Max size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

module.exports = upload;
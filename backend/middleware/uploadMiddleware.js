const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Multer Upload Middleware
 * Handles image uploads with validation, storage, and file processing
 */

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter for image validation
const fileFilter = (req, file, cb) => {
  // Check file type
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }

  // Check file extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error('Invalid file extension. Allowed: ' + allowedExtensions.join(', ')), false);
  }

  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    return cb(new Error('File size too large. Maximum 5MB allowed.'), false);
  }

  cb(null, true);
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1 // Only one file at a time
  }
});

/**
 * Middleware for single image upload
 * Used for skin analysis photos
 */
const uploadSingleImage = upload.single('image');

/**
 * Middleware for multiple image uploads
 * Used for before/after photos or progress tracking
 */
const uploadMultipleImages = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 5 // Maximum 5 files
  }
}).array('images', 5);

/**
 * Error handling middleware for upload errors
 */
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'Maximum file size is 5MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files',
        message: 'Maximum 5 files allowed'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Unexpected file field',
        message: 'Please use the correct field name for file upload'
      });
    }
  }

  if (error.message.includes('Only image files are allowed')) {
    return res.status(400).json({
      error: 'Invalid file type',
      message: 'Only image files (jpg, jpeg, png, gif, bmp, webp) are allowed'
    });
  }

  if (error.message.includes('Invalid file extension')) {
    return res.status(400).json({
      error: 'Invalid file extension',
      message: error.message
    });
  }

  if (error.message.includes('File size too large')) {
    return res.status(400).json({
      error: 'File too large',
      message: 'Maximum file size is 5MB'
    });
  }

  console.error('Upload error:', error);
  res.status(500).json({
    error: 'Upload failed',
    message: 'An error occurred while uploading the file'
  });
};

/**
 * Middleware to validate image dimensions and quality
 * This can be extended to check image dimensions, aspect ratio, etc.
 */
const validateImage = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'No image provided',
      message: 'Please upload an image file'
    });
  }

  // Add image metadata to request
  req.imageInfo = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path: req.file.path
  };

  next();
};

/**
 * Cleanup middleware to remove uploaded files on error
 */
const cleanupUpload = (req, res, next) => {
  // Store original send function
  const originalSend = res.send;

  // Override send function to cleanup on error
  res.send = function(data) {
    if (res.statusCode >= 400 && req.file) {
      // Remove uploaded file on error
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    originalSend.call(this, data);
  };

  next();
};

/**
 * Get file URL for uploaded image
 * @param {String} filename - Uploaded filename
 * @returns {String} Public URL for the image
 */
const getFileUrl = (filename) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  return `${baseUrl}/uploads/${filename}`;
};

/**
 * Delete uploaded file
 * @param {String} filepath - Path to the file
 */
const deleteFile = (filepath) => {
  if (fs.existsSync(filepath)) {
    fs.unlink(filepath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
  }
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  handleUploadError,
  validateImage,
  cleanupUpload,
  getFileUrl,
  deleteFile,
  uploadsDir
}; 
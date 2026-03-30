const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getComponents,
  getComponent,
  createComponent,
  updateComponentStatus,
  getPendingComponents,
  getMyComponents,
  deleteComponent,
  unlockComponent,
} = require('../controllers/componentController');
const { protect, authorize, optionalProtect } = require('../middleware/auth');

const router = express.Router();

// Multer config for video uploads (temp storage before Cloudinary)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.mp4', '.webm', '.mov'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .mp4, .webm, .mov video files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

// IMPORTANT: Specific paths MUST come before /:id to avoid matching "feed" as an id
router.get('/feed/my', protect, getMyComponents);
router.get('/feed/pending', protect, authorize('admin'), getPendingComponents);

// Public routes
router.get('/', optionalProtect, getComponents);

// Create — admin or creator with video upload
router.post('/', protect, authorize('admin', 'creator'), upload.single('video'), createComponent);

// Delete — strictly Admin for safety
router.post('/:id/unlock', protect, unlockComponent);
router.delete('/:id', protect, authorize('admin'), deleteComponent);

// Admin status update
router.patch('/:id/status', protect, authorize('admin'), updateComponentStatus);

// Single component (must be LAST because :id catches everything)
router.get('/:id', getComponent);

module.exports = router;

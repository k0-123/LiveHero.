const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 100,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Landing Page', 'SaaS', 'Portfolio', 'E-Commerce', 'Web App', 'Dashboard', 'Blog', 'Agency'],
  },
  videoUrl: {
    type: String,
    required: [true, 'A 5-second showcase video is required'],
  },
  videoPublicId: {
    type: String, // Cloudinary public_id for deletion
  },
  codePrompt: {
    type: String,
    required: [true, 'Code or prompt content is required'],
  },
  isPremium: {
    type: Boolean,
    default: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  downloads: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  heightClass: {
    type: String,
    default: 'h-[320px]',
    enum: ['h-[240px]', 'h-[260px]', 'h-[320px]', 'h-[340px]', 'h-[400px]', 'h-[450px]'],
  },
}, { timestamps: true });

// Index for efficient queries
componentSchema.index({ status: 1, createdAt: -1 });
componentSchema.index({ creatorId: 1 });

module.exports = mongoose.model('Component', componentSchema);

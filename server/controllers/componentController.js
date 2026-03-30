const Component = require('../models/Component');
const asyncHandler = require('../middleware/async');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// @desc    Get all active components
// @route   GET /api/components
exports.getComponents = asyncHandler(async (req, res, next) => {
  let query = { status: 'approved' };
  
  // If user is logged in, also show their own pending submissions
  if (req.user) {
    query = { 
      $or: [
        { status: 'approved' },
        { creatorId: req.user._id, status: 'pending' }
      ]
    };
  }

  const components = await Component.find(query).sort({ createdAt: -1 });

  // Hide codePrompt for non-premium users if the component is premium
  const isUserPremium = req.user?.isPremium || false;

  const data = components.map(c => {
    const comp = c.toObject();
    const isOwner = req.user && comp.creatorId.toString() === req.user._id.toString();
    const isAdmin = req.user?.role === 'admin';
    
    if (comp.isPremium && !isUserPremium && !isAdmin && !isOwner) {
      comp.codePrompt = null; // hide the prompt
    }
    return comp;
  });

  res.status(200).json({ success: true, data });
});

// @desc    Get single component
// @route   GET /api/components/:id
exports.getComponent = asyncHandler(async (req, res, next) => {
  const component = await Component.findById(req.params.id);
  if (!component) return res.status(404).json({ success: false, message: 'Not found' });

  const comp = component.toObject();
  const isUserPremium = req.user?.isPremium || false;
  const isOwner = req.user && comp.creatorId.toString() === req.user._id.toString();
  const isAdmin = req.user?.role === 'admin';

  if (comp.isPremium && !isUserPremium && !isAdmin && !isOwner) {
    comp.codePrompt = null; // hide the prompt
  }

  res.status(200).json({ success: true, data: comp });
});

// @desc    Create component (Admin or Creator)
// @route   POST /api/components
exports.createComponent = asyncHandler(async (req, res, next) => {
  const { title, category, codePrompt, isPremium, heightClass } = req.body;

  try {
    let videoUrl = '/hero-bg.mp4';
    let videoPublicId = '';

    // Handle video upload to Cloudinary (ONLY IF CONFIGURED)
    if (req.file) {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'REPLACE_ME') {
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: 'video',
          folder: 'livehero/components',
        });
        videoUrl = result.secure_url;
        videoPublicId = result.public_id;
        
        // Clean up local file after upload
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } else {
        // Use local file as URL fallback
        console.log('Using local fallback for video:', req.file.filename);
        videoUrl = `/uploads/${req.file.filename}`;
      }
    }

    const component = await Component.create({
      title,
      category,
      videoUrl,
      videoPublicId,
      codePrompt,
      isPremium: String(isPremium) === 'true',
      heightClass,
      creatorId: req.user._id,
      status: req.user.role === 'admin' ? 'approved' : 'pending' // Admin goes live immediately
    });

    res.status(201).json({ success: true, data: component });
  } catch (err) {
    console.error('Create error:', err);
    res.status(500).json({ success: false, message: 'Failed to create component' });
  }
});

// @desc    Update component status (Admin Only)
// @route   PATCH /api/components/:id/status
exports.updateComponentStatus = asyncHandler(async (req, res, next) => {
  const component = await Component.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!component) return res.status(404).json({ success: false, message: 'Not found' });
  res.status(200).json({ success: true, data: component });
});

// @desc    Get pending components for review (Admin Only)
// @route   GET /api/components/feed/pending
exports.getPendingComponents = asyncHandler(async (req, res, next) => {
  const components = await Component.find({ status: 'pending' }).populate('creatorId', 'name email');
  
  // Transform for frontend
  const data = components.map(c => ({
    ...c.toObject(),
    creator: c.creatorId
  }));

  res.status(200).json({ success: true, data });
});

// @desc    Get components for current creator user
// @route   GET /api/components/feed/my
exports.getMyComponents = asyncHandler(async (req, res, next) => {
  const components = await Component.find({ creatorId: req.user._id });
  res.status(200).json({ success: true, data: components });
});

// @desc    Delete component (Admin Only)
// @route   DELETE /api/components/:id
exports.deleteComponent = asyncHandler(async (req, res, next) => {
  const component = await Component.findById(req.params.id);
  if (!component) return res.status(404).json({ success: false, message: 'Not found' });

  // If local file, delete it
  if (component.videoUrl && component.videoUrl.startsWith('/uploads/')) {
    const fileName = component.videoUrl.split('/').pop();
    const filePath = `c:/Users/Karan/OneDrive/Desktop/LiveHero/server/uploads/${fileName}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await component.deleteOne();
  res.status(200).json({ success: true, message: 'Component removed' });
});

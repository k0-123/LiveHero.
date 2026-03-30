require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Component = require('./models/Component');

const MONGO_URI = 'mongodb://localhost:27017/livehero';

const seedComponents = async () => {
  try {
    console.log('--- SEEDING HERO COMPONENTS ---');
    await mongoose.connect(MONGO_URI);
    
    await Component.deleteMany({});
    const admin = await User.findOne({ email: 'admin@livehero.com' });

    await Component.insertMany([
      {
        title: 'Space Voyage',
        category: 'Landing Page',
        videoUrl: '/hero-bg.mp4',
        codePrompt: 'A cinematic landing page with parallax stars, floating astronaut 3D model.',
        isPremium: true,
        creatorId: admin._id,
        status: 'approved',
        heightClass: 'h-[320px]',
      },
      {
        title: 'NeoVision',
        category: 'Landing Page',
        videoUrl: '/hero-bg.mp4',
        codePrompt: 'Ultra-dark hero with split typography and looping video background.',
        isPremium: true,
        creatorId: admin._id,
        status: 'approved',
        heightClass: 'h-[450px]',
      },
      {
        title: 'Pulse Architecture',
        category: 'Portfolio',
        videoUrl: '/hero-bg.mp4',
        codePrompt: 'Minimal portfolio with horizontal scroll gallery.',
        isPremium: false,
        creatorId: admin._id,
        status: 'approved',
        heightClass: 'h-[340px]',
      }
    ]);

    console.log('DONE! 3 cinematic components live.');
    process.exit(0);
  } catch (err) {
    console.error('FAILED:', err.message);
    process.exit(1);
  }
};

seedComponents();

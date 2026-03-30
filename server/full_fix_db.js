const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Component = require('./models/Component');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB. Resetting collections...');

    // Clear everything
    await User.deleteMany({});
    await Component.deleteMany({});

    // Create Admin
    const admin = await User.create({
      name: 'LiveHero Admin',
      email: 'admin@livehero.com',
      password: 'admin123',
      role: 'admin',
      isPremium: true,
      plan: 'creator'
    });
    console.log('Admin account created: admin@livehero.com / admin123');

    // Create Sample Components
    const components = [
      {
        title: 'DeepSpace Voyage',
        category: 'Landing Page',
        videoUrl: '/hero-bg.mp4',
        codePrompt: 'Create a cinematic parallax landing page with deep space aesthetics...',
        isPremium: false,
        creatorId: admin._id,
        status: 'approved',
        heightClass: 'h-[400px]'
      },
      {
        title: 'Glassmorphism Sidebar',
        category: 'SaaS',
        videoUrl: '/hero-bg.mp4',
        codePrompt: 'Create a highly blurred glassmorphism sidebar for a SaaS dashboard...',
        isPremium: true,
        creatorId: admin._id,
        status: 'approved',
        heightClass: 'h-[320px]'
      }
    ];

    await Component.insertMany(components);
    console.log('Sample components seeded. All good!');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();

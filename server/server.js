const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const connectDB = require('./config/db');
const compression = require('compression');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Catch unhandled errors immediately to log them in Render
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  process.exit(1);
});

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Security & Performance
app.use(helmet({
  contentSecurityPolicy: false, 
}));
app.use(compression());

// CORS — allow all origins but strictly reflect them for credentials support
app.use(cors({
  origin: function (origin, callback) {
    // Return true to allow any origin while supporting credentials
    callback(null, true);
  },
  credentials: true,
}));

// JSON body parser for everything
// JSON body parser for everything else
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===================
//   API Routes
// ===================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/components', require('./routes/componentRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/affiliates', require('./routes/affiliateRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'alive', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n  LiveHero Server running on port ${PORT}`);
  console.log(`  Health: http://localhost:${PORT}/api/health\n`);
});

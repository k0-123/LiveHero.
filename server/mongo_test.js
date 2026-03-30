const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load .env from the server directory
require('dotenv').config();

console.log('Testing URI Presence:', process.env.MONGO_URI ? 'URI FOUND' : 'NOT FOUND');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('--- SURGICAL SUCCESS ---');
    console.log('MongoDB Connected: Atlas Cluster 0');
    process.exit(0);
  })
  .catch(err => {
    console.error('--- SURGICAL ERROR DETECTED ---');
    console.error('Message:', err.message);
    if (err.message.includes('ETIMEDOUT') || err.message.includes('Selection timeout')) {
      console.error('DIAGNOSIS: IP Access Denied. Whitelist 0.0.0.0/0 in Atlas Dash.');
    } else if (err.message.includes('Authentication failed')) {
      console.error('DIAGNOSIS: Wrong Password. Check MONGO_URI.');
    }
    process.exit(1);
  });

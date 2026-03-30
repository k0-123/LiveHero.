const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from the server directory
const envPath = 'c:/Users/Karan/OneDrive/Desktop/LiveHero/server/.env';
dotenv.config({ path: envPath });

console.log('Testing URI:', process.env.MONGO_URI ? 'URI FOUND' : 'NOT FOUND');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('SUCCESS: Atlas Connected!');
    process.exit(0);
  })
  .catch(err => {
    console.error('ERROR DETECTED:');
    console.error(err.message);
    process.exit(1);
  });

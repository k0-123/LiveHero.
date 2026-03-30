const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('Testing MONGO_URI:', process.env.MONGO_URI);

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('--- MongoDB Connection Successful! ---');
    
    // Check if we can reach the users collection
    const count = await mongoose.connection.db.collection('users').countDocuments();
    console.log(`Current User count: ${count}`);
    
    process.exit(0);
  } catch (err) {
    console.error('--- MongoDB Connection FAILED! ---');
    console.error(err);
    process.exit(1);
  }
};

test();

const mongoose = require('mongoose');
const dns = require('dns');

// Force Google DNS to fix local ISP SRV resolution issues (but skip on Render)
if (!process.env.RENDER) {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch(e) {}
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

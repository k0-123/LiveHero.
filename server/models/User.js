const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'creator', 'admin'], default: 'user' },
  isPremium: { type: Boolean, default: false },
  plan: { type: String, enum: ['free', 'unlimited', 'power', 'creator'], default: 'free' },
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  referralsCount: { type: Number, default: 0 },
  allowedDownloads: { type: Number, default: 0 },
  usedDownloads: { type: Number, default: 0 },
  unlockedComponents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Component' }],
}, { timestamps: true });

// Pre-save hook to generate unique referral code
userSchema.pre('save', async function(next) {
  if (this.isNew && !this.referralCode) {
    const crypto = require('crypto');
    this.referralCode = 'LH-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    
    // Check for collisions just in case
    const User = mongoose.model('User');
    let exists = await User.findOne({ referralCode: this.referralCode });
    while (exists) {
      this.referralCode = 'LH-' + crypto.randomBytes(3).toString('hex').toUpperCase();
      exists = await User.findOne({ referralCode: this.referralCode });
    }
  }
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  // Plain text for now to match seed - but usually would use bcrypt
  return enteredPassword === this.password;
};

userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

module.exports = mongoose.model('User', userSchema);

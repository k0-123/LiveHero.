const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');
const express = require('express');
const router = express.Router();

// @desc    Get my affiliate stats
// @route   GET /api/affiliates/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Get total referral payouts
    const payouts = await Transaction.find({
      userId: req.user._id,
      type: 'referral_payout',
      status: 'completed',
    });

    const totalEarned = payouts.reduce((sum, t) => sum + t.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        referralCode: user.referralCode,
        referralsCount: user.referralsCount,
        totalEarned, // in cents
        pendingBalance: user.earnings,
        commissionRate: 40,
        cookieWindow: 90,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

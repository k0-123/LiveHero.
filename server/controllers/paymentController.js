const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const PLAN_PRICES = {
  unlimited: 1900, // ₹19
  power: 9900,
  creator: 12900,
};

// @desc    Create Razorpay Order
// @route   POST /api/payments/checkout
// @access  Private
const createCheckout = async (req, res) => {
  try {
    const { plan } = req.body;

    // No more ₹0 free plan, everything goes through Razorpay now
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: PLAN_PRICES[plan],
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await Transaction.create({
      userId: req.user._id,
      type: 'purchase',
      amount: PLAN_PRICES[plan],
      plan,
      razorpayOrderId: order.id,
      status: 'pending',
    });

    res.status(200).json({ success: true, orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error("Razorpay Create Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Check if transaction is already processed to prevent double-granting
      const existingTx = await Transaction.findOne({ razorpayOrderId: razorpay_order_id, status: 'completed' });
      if (existingTx) {
        return res.status(200).json({ success: true, message: 'Payment already processed' });
      }

      // Payment is successful
      const user = await User.findById(req.user._id);
      
      user.isPremium = true;
      user.plan = plan;
      if (plan === 'unlimited') {
        // Boosted as per user request: giving unlimited access (100 slots)
        user.allowedDownloads = (user.allowedDownloads || 0) + 100;
      }
      if (plan === 'creator') user.role = 'creator';
      await user.save();

      const transaction = await Transaction.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'completed', razorpayPaymentId: razorpay_payment_id },
        { new: true }
      );

      // Handle referral commission (40%)
      if (user.referredBy && transaction) {
        const commission = Math.floor(transaction.amount * 0.4);
        const referrer = await User.findById(user.referredBy);
        if (referrer) {
          referrer.earnings += commission;
          referrer.referralsCount = (referrer.referralsCount || 0) + 1; // Fix: increment referral count
          await referrer.save();

          await Transaction.create({
            userId: referrer._id,
            type: 'referral_earned', // Changed to referral_earned for clarity
            amount: commission,
            status: 'completed',
          });
        }
      }

      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
const getPaymentHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createCheckout, verifyPayment, getPaymentHistory };

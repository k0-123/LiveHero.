const express = require('express');
const { createCheckout, verifyPayment, getPaymentHistory } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/checkout', protect, createCheckout);
router.post('/verify', protect, verifyPayment);
router.get('/history', protect, getPaymentHistory);

module.exports = router;

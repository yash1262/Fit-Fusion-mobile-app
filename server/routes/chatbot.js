const express = require('express');
const {
  sendMessage,
  getFitnessAdvice,
} = require('../controllers/chatbotController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/message', protect, sendMessage);
router.post('/advice', protect, getFitnessAdvice);

module.exports = router;

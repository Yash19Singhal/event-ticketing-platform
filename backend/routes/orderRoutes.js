const express = require('express');
const router = express.Router();

const {
  createOrder,
  confirmOrder,
  getMyTickets,
  getEventStats,
  getSalesByType,
} = require('../controllers/orderController');

const { protect, organizer } = require('../middleware/authMiddleware');

router.post('/create-order', protect, createOrder);
router.post('/confirm-order', protect, confirmOrder);
router.get('/my-tickets', protect, getMyTickets);

router.get('/stats/:eventId', protect, organizer, getEventStats);
router.get('/stats/by-type/:eventId', protect, organizer, getSalesByType);

module.exports = router;

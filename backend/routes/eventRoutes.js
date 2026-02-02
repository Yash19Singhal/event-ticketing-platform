const express = require('express');
const router = express.Router();

const {
  createEvent,
  getEvents,
  getEventById,
  getMyEvents,
  getEventAttendees,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');

const { protect, organizer } = require('../middleware/authMiddleware');

router.get('/my-events', protect, organizer, getMyEvents);
router.get('/:eventId/attendees', protect, organizer, getEventAttendees);


router.get('/', getEvents);
router.get('/:id', getEventById);


router.post('/', protect, organizer, createEvent);
router.put('/:id', protect, organizer, updateEvent);
router.delete('/:id', protect, organizer, deleteEvent);

module.exports = router;

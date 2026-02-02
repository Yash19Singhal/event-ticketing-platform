const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

const Event = require('../models/eventModel');
const Ticket = require('../models/ticketModel');


const getEvents = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.keyword) {
    filter.$or = [
      { title: { $regex: req.query.keyword, $options: 'i' } },
      { description: { $regex: req.query.keyword, $options: 'i' } },
    ];
  }

  if (req.query.date) {
    const searchDate = new Date(req.query.date);
    const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

    filter.date = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  }

  const events = await Event.find(filter).sort({ date: 1 });
  res.status(200).json(events);
});


const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  res.status(200).json(event);
});


const createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, location, ticketTypes, image } = req.body;

  if (!title || !description || !date || !location || !ticketTypes) {
    res.status(400);
    throw new Error('Please provide all required event fields');
  }

  if (title.length < 3) {
    res.status(400);
    throw new Error('Title must be at least 3 characters long');
  }

  if (description.length < 10) {
    res.status(400);
    throw new Error('Description must be at least 10 characters long');
  }

  const eventDate = new Date(date);
  if (isNaN(eventDate.getTime()) || eventDate < new Date()) {
    res.status(400);
    throw new Error('Please provide a valid future date');
  }

  if (!Array.isArray(ticketTypes) || ticketTypes.length === 0) {
    res.status(400);
    throw new Error('Event must have at least one ticket type');
  }

  for (const ticket of ticketTypes) {
    if (
      !ticket.name ||
      ticket.price === undefined ||
      ticket.quantity === undefined
    ) {
      res.status(400);
      throw new Error('Each ticket type must have name, price, and quantity');
    }

    if (ticket.price < 0 || ticket.quantity < 1) {
      res.status(400);
      throw new Error(
        'Ticket price must be >= 0 and quantity must be at least 1'
      );
    }
  }
  

  const event = await Event.create({
    organizer: req.user.id,
    title,
    description,
    date,
    location,
    ticketTypes,
    image, 
  });

  res.status(201).json(event);
});


const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (event.organizer.toString() !== req.user.id) {
    res.status(403);
    throw new Error('User not authorized to update this event');
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedEvent);
});


const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (event.organizer.toString() !== req.user.id) {
    res.status(403);
    throw new Error('User not authorized to delete this event');
  }

  await event.deleteOne();
  res.status(200).json({ message: 'Event removed successfully' });
});


const getMyEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ organizer: req.user.id }).sort({
    createdAt: -1,
  });

  res.status(200).json(events);
});


const getEventAttendees = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (event.organizer.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to view attendees');
  }

  const attendees = await Ticket.aggregate([
    { $match: { event: new mongoose.Types.ObjectId(eventId) } },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'attendeeDetails',
      },
    },
    { $unwind: '$attendeeDetails' },
    {
      $lookup: {
        from: 'events',
        localField: 'event',
        foreignField: '_id',
        as: 'eventDetails',
      },
    },
    { $unwind: '$eventDetails' },
    {
      $project: {
        _id: 0,
        ticketId: '$_id',
        attendeeName: '$attendeeDetails.name',
        attendeeEmail: '$attendeeDetails.email',
        ticketTypeName: {
          $let: {
            vars: {
              ticketTypeObj: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: '$eventDetails.ticketTypes',
                      as: 'type',
                      cond: { $eq: ['$$type._id', '$ticketType'] },
                    },
                  },
                  0,
                ],
              },
            },
            in: '$$ticketTypeObj.name',
          },
        },
      },
    },
  ]);

  res.status(200).json(attendees);
});

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getEventAttendees,
};


const mongoose = require('mongoose');

const ticketTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ticket type must have a name'],
  },
  price: {
    type: Number,
    required: [true, 'Ticket type must have a price'],
    min: [0, 'Price cannot be negative'], 
  },
  quantity: {
    type: Number,
    required: [true, 'Ticket type must have a quantity'],
    min: [0, 'Quantity cannot be negative'],
  },
});

const eventSchema = new mongoose.Schema(
  {
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true, 
    },
    description: {
      type: String,
      required: [true, 'Please provide an event description'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide the event date'],
    },
    location: {
      type: String,
      required: [true, 'Please provide the event location'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an event image URL'],
    },
    ticketTypes: [ticketTypeSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
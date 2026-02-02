

const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    
    order: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Order',
    },
    
    event: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Event',
    },
    
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    
    ticketType: {
      type: String,
      required: true,
    },
    
    uniqueCode: {
      type: String,
      required: true,
      unique: true,
    },
    
    isCheckedIn: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Ticket', ticketSchema);
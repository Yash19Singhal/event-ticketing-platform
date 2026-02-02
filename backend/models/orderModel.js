const mongoose = require('mongoose');

const purchasedTicketSchema = new mongoose.Schema({
  ticketType: {
    type: String,
    required: true,
  },
  
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
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
    totalAmount: {
      type: Number,
      required: [true, 'Order must have a total amount.'],
    },
    tickets: [purchasedTicketSchema],
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('Order', orderSchema);
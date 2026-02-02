const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const QRCode = require('qrcode');
const mongoose = require('mongoose');

const Event = require('../models/eventModel');
const Order = require('../models/orderModel');
const Ticket = require('../models/ticketModel');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = asyncHandler(async (req, res) => {
  const { eventId, tickets } = req.body;

  if (!eventId || !tickets || tickets.length === 0) {
    res.status(400);
    throw new Error('Missing eventId or tickets');
  }

  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  let totalAmount = 0;

  for (const item of tickets) {
    const ticketType = event.ticketTypes.id(item.ticketTypeId);
    if (!ticketType) {
      res.status(400);
      throw new Error('Invalid ticket type');
    }
    totalAmount += ticketType.price * item.quantity;
  }

  const order = await razorpay.orders.create({
    amount: totalAmount * 100,
    currency: 'INR',
    receipt: `event_${eventId}_${Date.now()}`,
  });

  res.status(201).json(order);
});

const confirmOrder = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    eventId,
    tickets,
  } = req.body;

  const userId = req.user.id;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error('Incomplete payment details');
  }

  const sign = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error('Payment verification failed');
  }

  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  let totalAmount = 0;

  for (const item of tickets) {
    const ticketType = event.ticketTypes.id(item.ticketTypeId);
    if (!ticketType) {
      throw new Error('Invalid ticket type');
    }
    totalAmount += ticketType.price * item.quantity;
  }

  for (const item of tickets) {
    const query = {
      _id: eventId,
      'ticketTypes._id': item.ticketTypeId,
      'ticketTypes.quantity': { $gte: item.quantity },
    };

    const update = {
      $inc: { 'ticketTypes.$.quantity': -item.quantity },
    };

    const updateResult = await Event.updateOne(query, update);

    if (updateResult.modifiedCount === 0) {
      res.status(400);
      throw new Error(
        `Tickets for '${event.ticketTypes.id(item.ticketTypeId).name}' just sold out`
      );
    }
  }

  const order = await Order.create({
    user: userId,
    event: eventId,
    totalAmount,
    tickets: tickets.map(t => ({
      ticketType: t.ticketTypeId,
      quantity: t.quantity,
      price: event.ticketTypes.id(t.ticketTypeId).price,
    })),
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
  });

  if (!order) {
    res.status(500);
    throw new Error('Failed to create order document');
  }

  const createdTickets = [];

  for (const item of order.tickets) {
    for (let i = 0; i < item.quantity; i++) {
      const ticket = new Ticket({
        order: order._id,
        user: userId,
        event: eventId,
        ticketType: item.ticketType,
      });

      ticket.uniqueCode = ticket._id.toString();
      ticket.qrCode = await QRCode.toDataURL(ticket.uniqueCode);

      await ticket.save();
      createdTickets.push(ticket);
    }
  }

  res.status(201).json({
    message: 'Order confirmed successfully',
    order,
    tickets: createdTickets,
  });
});

const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ user: req.user.id })
    .populate({
      path: 'event',
      select: 'title date location image',
    })
    .sort({ createdAt: -1 });

  if (!tickets || tickets.length === 0) {
    res.status(404);
    throw new Error('No tickets found for this user');
  }

  res.status(200).json(tickets);
});

const getEventStats = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const organizerId = req.user.id;

  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (event.organizer.toString() !== organizerId) {
    res.status(403);
    throw new Error('Not authorized to view stats for this event');
  }

  const stats = await Order.aggregate([
    {
      $match: {
        event: new mongoose.Types.ObjectId(eventId),
      },
    },
    {
      $group: {
        _id: '$event',
        totalRevenue: { $sum: '$totalAmount' },
        totalTicketsSold: { $sum: { $sum: '$tickets.quantity' } },
      },
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
        totalTicketsSold: 1,
      },
    },
  ]);

  if (stats.length > 0) {
    res.status(200).json(stats[0]);
  } else {
    res.status(200).json({
      totalRevenue: 0,
      totalTicketsSold: 0,
    });
  }
});

const getSalesByType = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const organizerId = req.user.id;

  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (event.organizer.toString() !== organizerId) {
    res.status(403);
    throw new Error('Not authorized to access stats for this event');
  }

  const salesByType = await Order.aggregate([
    {
      $match: {
        event: new mongoose.Types.ObjectId(eventId),
      },
    },
    {
      $unwind: '$tickets',
    },
    {
      $group: {
        _id: '$tickets.ticketType',
        totalSold: { $sum: '$tickets.quantity' },
      },
    },
    {
      $lookup: {
        from: 'events',
        let: { ticketTypeId: '$_id' },
        pipeline: [
          { $match: { _id: new mongoose.Types.ObjectId(eventId) } },
          { $unwind: '$ticketTypes' },
          {
            $match: {
              $expr: { $eq: ['$ticketTypes._id', '$$ticketTypeId'] },
            },
          },
          {
            $project: {
              _id: 0,
              name: '$ticketTypes.name',
            },
          },
        ],
        as: 'ticketTypeInfo',
      },
    },
    {
      $project: {
        _id: 0,
        label: { $arrayElemAt: ['$ticketTypeInfo.name', 0] },
        value: '$totalSold',
      },
    },
  ]);

  res.status(200).json(salesByType);
});

module.exports = {
  createOrder,
  confirmOrder,
  getMyTickets,
  getEventStats,
  getSalesByType,
};

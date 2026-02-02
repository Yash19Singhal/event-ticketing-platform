require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');


connectDB();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/api/health', (req, res) => {
  res.json({ message: 'API is running...' });
});

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/orders', orderRoutes);


app.use('/api/upload', uploadRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

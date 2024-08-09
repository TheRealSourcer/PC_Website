// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define Order Schema
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  status: { type: String, required: true },
  eta: { type: Date, required: true }
});

const Order = mongoose.model('Order', orderSchema);

// API route to get order status
app.get('/api/order/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Seed the database with initial orders
async function seedDatabase() {
  const orders = [
    { orderNumber: 'Order1', status: 'Processing', eta: new Date('2024-08-15') },
    { orderNumber: 'Order2', status: 'Shipped', eta: new Date('2024-08-10') },
    { orderNumber: 'Order3', status: 'Delivered', eta: new Date('2024-08-05') }
  ];

  try {
    for (const order of orders) {
      await Order.findOneAndUpdate({ orderNumber: order.orderNumber }, order, { upsert: true });
    }
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const session = require('express-session');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const bodyParser = require('body-parser');
const path = require('path');


// Update the static file serving middleware
app.use('/Server/Media', express.static(path.join(__dirname, 'Server', 'Media')));

// Enhanced security headers
app.use(helmet());

// Body parsing middleware
app.use(express.json());

// Middleware to parse plain text bodies
app.use(bodyParser.text({ type: 'text/plain' }));

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true,
    sameSite: 'strict'
  }
}));

// CORS configuration
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://checkout.stripe.com'];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use('/Media', express.static(path.join(__dirname, 'Media')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use("/create-checkout-session", limiter);

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

// Move this to a database in a real application
const BASE_URL = 'https://your-domain.com'; // Replace with your actual domain

const storeItems = new Map([
  [1, { priceInCents: 64999, name: "Smoother", image: `/Server/Media/smoother/smoother1.jpg` }],
  [2, { priceInCents: 99999, name: "Beast", image: `/Server/Media/beast/beast1.jpg` }],
  [3, { priceInCents: 129999, name: "Terminator", image: `/Server/Media/terminator/terminator1.jpg` }],
  [4, { priceInCents: 199999, name: "Spaceship", image: `/Server/Media/spaceship/spaceship1.jpg` }]
]);

app.post('/api/purchase', (req, res) => {
    const productId = req.body.product_id;
    
    // Check if product ID is present
    if (!productId) {
        return res.status(400).send({ error: 'Product ID is required' });
    }

    // Process the purchase logic here
    console.log('Product ID received:', productId);

    // Send a success response
    res.status(200).send({ message: 'Purchase successful', product_id: productId });
});


app.post("/create-checkout-session", async (req, res) => {
  try {
    // Validate input
    if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(400).json({ error: "Invalid items array" });
    }

    const lineItems = req.body.items.map(item => {
      const productId = parseInt(item.productId, 10);
      const storeItem = storeItems.get(productId);
      if (!storeItem) {
        throw new Error(`Invalid product id: ${productId}`);
      }
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        throw new Error(`Invalid quantity for product id: ${productId}`);
      }
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: storeItem.name,
            images: [`${req.protocol}://${req.get('host')}${storeItem.image}`],
          },
          unit_amount: storeItem.priceInCents,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL}/Client/src/index.html`,
      cancel_url: `${process.env.CLIENT_URL}/Client/src/index.html`,
      
    });

    // Store the Stripe session ID in the Express session
    req.session.stripeSessionId = session.id;

    res.json({ url: session.url });

  } catch (e) {
    console.error('Checkout error:', e);
    res.status(500).json({ error: "An error occurred during checkout" });
  }
});

// Webhook to handle successful payments
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // Fulfill the order
    // This is where you would update your database, send confirmation emails, etc.
    console.log('Payment successful for session:', session.id);
  }

  res.json({received: true});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

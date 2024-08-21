require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require('express-session');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');

// Initialize Express
const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import the Review model
const Review = require('./models/Review');

// Update the static file serving middleware
app.use('/Media', express.static(path.join(__dirname, 'Media')));

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

// FedEx API configuration
const FEDEX_API_URL = 'https://apis-sandbox.fedex.com';
const FEDEX_CLIENT_ID = process.env.FEDEX_CLIENT_ID;
const FEDEX_CLIENT_SECRET = process.env.FEDEX_CLIENT_SECRET;

// Function to get FedEx access token
async function getFedExAccessToken() {
    try {
        const response = await axios.post(`${FEDEX_API_URL}/oauth/token`, 
            `grant_type=client_credentials&client_id=${FEDEX_CLIENT_ID}&client_secret=${FEDEX_CLIENT_SECRET}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting FedEx access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// FedEx tracking endpoint
app.post('/track', async (req, res) => {
    try {
        const { trackingNumber } = req.body;
        const accessToken = await getFedExAccessToken();
        const trackingResponse = await axios.get(`${FEDEX_API_URL}/track/v1/trackingnumbers`, {
            params: { trackingNumber },
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        res.json(trackingResponse.data);
    } catch (error) {
        console.error('Error fetching tracking data:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch tracking data' });
    }
});

// API rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use(limiter);

// Reviews API routes

// Get all reviews
app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// Add a new review
app.post('/api/reviews', async (req, res) => {
  try {
      // Make sure the body contains all necessary fields
      const { title, content, rating, product } = req.body;
      if (!title || !content || !rating || !product) {
          return res.status(400).json({ error: 'Missing required fields' });
      }

      const newReview = new Review({
          title,
          content,
          rating,
          productName: product, // Ensure this matches the schema
          reviewType: 'product' // or 'website' based on your logic
      });

      await newReview.save();
      res.status(201).json(newReview);
  } catch (err) {
      console.error('Failed to save review:', err.message);
      res.status(400).json({ error: 'Failed to save review' });
  }
});

// Update usefulness
app.post('/api/reviews/usefulness', async (req, res) => {
  const { reviewId, userUUID, type } = req.body;

  if (!userUUID || !type || !['like', 'dislike', 'remove'].includes(type)) {
      return res.status(400).json({ error: 'Invalid input' });
  }

  try {
      const review = await Review.findById(reviewId);
      if (!review) {
          return res.status(404).json({ error: 'Review not found' });
      }

      const currentVote = review.userVotes.get(userUUID);

      if (type === 'remove') {
          // Remove vote
          if (!currentVote) {
              return res.status(400).json({ error: 'No vote to remove' });
          }

          if (currentVote === 'like') {
              review.thumbsUp -= 1;
          } else if (currentVote === 'dislike') {
              review.thumbsDown -= 1;
          }

          review.userVotes.delete(userUUID);

      } else if (currentVote) {
          // Toggle vote
          if (currentVote === type) {
              // If same vote, remove vote
              if (type === 'like') {
                  review.thumbsUp -= 1;
              } else if (type === 'dislike') {
                  review.thumbsDown -= 1;
              }

              review.userVotes.delete(userUUID);
          } else {
              // Switch from like to dislike or vice versa
              if (currentVote === 'like') {
                  review.thumbsUp -= 1;
              } else if (currentVote === 'dislike') {
                  review.thumbsDown -= 1;
              }

              if (type === 'like') {
                  review.thumbsUp += 1;
              } else if (type === 'dislike') {
                  review.thumbsDown += 1;
              }

              review.userVotes.set(userUUID, type);
          }

      } else {
          // New vote
          if (type === 'like') {
              review.thumbsUp += 1;
          } else if (type === 'dislike') {
              review.thumbsDown += 1;
          }

          review.userVotes.set(userUUID, type);
      }

      const updatedReview = await review.save();
      res.json(updatedReview);
  } catch (err) {
      res.status(500).json({ error: 'Failed to update review usefulness' });
  }
});




app.post('/api/reviews/:id/vote', async (req, res) => {
  try {
      const { voteType } = req.body;
      const review = await Review.findById(req.params.id);

      if (!review) {
          return res.status(404).json({ error: 'Review not found' });
      }

      if (voteType === 'like') {
          review.thumbsUp += 1;
      } else if (voteType === 'dislike') {
          review.thumbsDown += 1;
      } else {
          return res.status(400).json({ error: 'Invalid vote type' });
      }

      await review.save();
      res.json({ thumbsUp: review.thumbsUp, thumbsDown: review.thumbsDown });
  } catch (err) {
      res.status(500).json({ error: 'Failed to update vote' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'An internal error occurred' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


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
const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);




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
app.use(bodyParser.json());

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
const allowedOrigins = [process.env.CLIENT_URL, 'https://checkout.stripe.com'];
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
        
        const trackingResponse = await axios.post(`${FEDEX_API_URL}/track/v1/trackingnumbers`, {
            trackingInfo: [
                {
                    trackingNumberInfo: {
                        trackingNumber: trackingNumber
                    }
                }
            ]
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(trackingResponse.data);
    } catch (error) {
        console.error('Error fetching tracking data:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch tracking data' });
    }
});

const createFedExOrder = async (lineItems, customerEmail) => {
    const tokenResponse = await axios.post('https://apis.fedex.com/oauth/token', {
        grant_type: 'client_credentials',
        client_id: process.env.FEDEX_CLIENT_ID_REST,
        client_secret: process.env.FEDEX_CLIENT_SECRET_REST,
    });

    const accessToken = tokenResponse.data.access_token;

    const orderDetails = {
        accountNumber: process.env.FEDEX_ACCOUNT_NUMBER,
        // Add other necessary details like shipper, recipient, package details, etc.
        // This will be based on the FedEx API documentation
    };

    const fedexResponse = await axios.post(
        'https://apis.fedex.com/ship/v1/shipments',
        orderDetails,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (fedexResponse.status === 200) {
        console.log('FedEx order created successfully:', fedexResponse.data);
    } else {
        throw new Error('Failed to create FedEx order');
    }
};


// API rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use(limiter);

// Reviews API routes
app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

app.post('/api/reviews', async (req, res) => {
    try {
        const { title, content, rating, product } = req.body;
        if (!title || !content || !rating || !product) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newReview = new Review({
            title,
            content,
            rating,
            productName: product,
            reviewType: 'product'
        });

        await newReview.save();
        res.status(201).json(newReview);
    } catch (err) {
        console.error('Failed to save review:', err.message);
        res.status(400).json({ error: 'Failed to save review' });
    }
});

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
            if (currentVote === type) {
                if (type === 'like') {
                    review.thumbsUp -= 1;
                } else if (type === 'dislike') {
                    review.thumbsDown -= 1;
                }

                review.userVotes.delete(userUUID);
            } else {
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

// Stripe Checkout route
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { items } = req.body;

        // Create a Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.price * 100, // Convert dollars to cents
                },
                quantity: item.quantity,
            })),
            automatic_tax: {
                enabled: true,
            },
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/Success`,
            cancel_url: `${process.env.CLIENT_URL}/Cancel`,
        });

        // Send the session ID to the client
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating Checkout Session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the successful payment event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Extract relevant information from the session
        const { customer_email, line_items } = session;

        // Call your function to create a FedEx order
        try {
            await createFedExOrder(line_items, customer_email);
        } catch (error) {
            console.error('Error creating FedEx order:', error);
            return res.status(500).send('Internal Server Error');
        }
    }

    res.json({ received: true });
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

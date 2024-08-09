/*require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const session = require('express-session');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios'); // Add this for making HTTP requests to FedEx API

// ... (keep your existing middleware setup)

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

// FedEx API configuration
const FEDEX_API_URL = 'https://apis-sandbox.fedex.com'; // Use the production URL in live environment
const FEDEX_CLIENT_ID = process.env.FEDEX_CLIENT_ID;
const FEDEX_CLIENT_SECRET = process.env.FEDEX_CLIENT_SECRET;

// Function to get FedEx access token
async function getFedExAccessToken() {
  try {
    const response = await axios.post(`${FEDEX_API_URL}/oauth/token`, {
      grant_type: 'client_credentials',
      client_id: FEDEX_CLIENT_ID,
      client_secret: FEDEX_CLIENT_SECRET
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting FedEx access token:', error);
    throw error;
  }
}

// Function to create a FedEx shipment
async function createFedExShipment(orderDetails) {
  const accessToken = await getFedExAccessToken();
  
  try {
    const response = await axios.post(`${FEDEX_API_URL}/ship/v1/shipments`, orderDetails, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating FedEx shipment:', error);
    throw error;
  }
}

// Function to generate a unique order number
function generateOrderNumber() {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// ... (keep your existing storeItems map)

app.post("/create-checkout-session", async (req, res) => {
  try {
    // ... (keep your existing checkout session creation logic)

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL}/client/index/index.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/client/index/index.html`,
    });

    // Generate a unique order number
    const orderNumber = generateOrderNumber();

    // Store the Stripe session ID and order number in the Express session
    req.session.stripeSessionId = session.id;
    req.session.orderNumber = orderNumber;

    res.json({ url: session.url, orderNumber: orderNumber });

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
    
    // Retrieve the order details
    const orderDetails = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items']
    });

    // Create a FedEx shipment
    try {
      const fedExShipment = await createFedExShipment({
        // Add FedEx shipment details here based on the order
        // This is a simplified example and needs to be adjusted based on FedEx API requirements
        shipment: {
          shipper: {
            address: {
              streetLines: ['1234 Main St'],
              city: 'Memphis',
              stateOrProvinceCode: 'TN',
              postalCode: '38116',
              countryCode: 'US'
            }
          },
          recipient: {
            address: {
              streetLines: [orderDetails.shipping.address.line1],
              city: orderDetails.shipping.address.city,
              stateOrProvinceCode: orderDetails.shipping.address.state,
              postalCode: orderDetails.shipping.address.postal_code,
              countryCode: orderDetails.shipping.address.country
            }
          },
          requestedShipment: {
            shipDatestamp: new Date().toISOString().split('T')[0],
            serviceType: 'STANDARD_OVERNIGHT',
            packagingType: 'YOUR_PACKAGING',
            weight: {
              units: 'LB',
              value: 1 // Adjust based on actual product weight
            }
          }
        }
      });

      // Store the FedEx tracking number with the order
      // You would typically save this to your database
      console.log('FedEx Tracking Number:', fedExShipment.output.transactionShipments[0].masterTrackingNumber);

    } catch (error) {
      console.error('Error creating FedEx shipment:', error);
    }

    // Fulfill the order (update database, send confirmation emails, etc.)
    console.log('Payment successful for session:', session.id);
  }

  res.json({received: true});
});

// New endpoint to get order status
app.get('/api/order-status/:orderNumber', async (req, res) => {
  const { orderNumber } = req.params;

  // Here you would typically look up the order in your database
  // and retrieve the associated FedEx tracking number

  // For this example, we'll use a mock tracking number
  const trackingNumber = 'mock123456789';

  try {
    const accessToken = await getFedExAccessToken();
    const response = await axios.get(`${FEDEX_API_URL}/track/v1/trackingnumbers`, {
      params: { trackingInfo: trackingNumber },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Extract relevant tracking information
    const trackingInfo = response.data.output.completeTrackResults[0].trackResults[0];

    res.json({
      orderNumber,
      trackingNumber,
      status: trackingInfo.latestStatusDetail.description,
      estimatedDelivery: trackingInfo.estimatedDeliveryTimeWindow.window.ends
    });
  } catch (error) {
    console.error('Error fetching order status:', error);
    res.status(500).json({ error: 'Unable to fetch order status' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));*/
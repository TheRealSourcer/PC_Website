const nodemailer = require('nodemailer'); // or another email library

// Configure your email transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOrderTrackingEmail = async (recipientEmail, trackingNumber) => {
  const mailOptions = {
    from: 'your-email@example.com',
    to: recipientEmail,
    subject: 'Your FedEx Order Tracking Number',
    text: `Your FedEx tracking number is: ${trackingNumber}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendOrderTrackingEmail };

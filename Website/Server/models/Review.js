const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productName: String,
  userName: String,
  title: String,
  content: String,
  rating: Number,
  reviewType: String, // "product" or "website"
  thumbsUp: { type: Number, default: 0 },
  thumbsDown: { type: Number, default: 0 },
  userVotes: { // Track user votes
    type: Map,
    of: String, // 'like' or 'dislike'
    default: {}
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);

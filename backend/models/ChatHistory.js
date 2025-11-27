const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  sessionId: String,
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  context: {
    lastSearchQuery: String,
    preferredLocation: String,
    preferredCategory: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000, // 30 days TTL
  },
});

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
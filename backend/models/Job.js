const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [String],
  responsibilities: [String],
  skills: [String],
  category: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: String,
  experience: String,
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time',
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'in-progress'],
    default: 'open',
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deadline: Date,
});

// Indexes for better search performance
jobSchema.index({ title: 'text', description: 'text', company: 'text' });
jobSchema.index({ category: 1, location: 1 });

module.exports = mongoose.model('Job', jobSchema);
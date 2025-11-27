// backend/routes/applications.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/applications - Submit job application (Private)
router.post('/', protect, async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Validate to match your current backend requirement
    if (!jobId || !coverLetter) {
      return res.status(400).json({ message: 'Job ID and cover letter are required' });
    }
    if (!isValidId(jobId)) {
      return res.status(400).json({ message: 'Invalid Job ID' });
    }
    if (typeof coverLetter !== 'string' || coverLetter.trim().length < 100) {
      return res.status(400).json({ message: 'Cover letter must be at least 100 characters' });
    }

    // Validate job
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Check duplicate
    const existing = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create application
    const user = await User.findById(req.user._id);
    const app = await Application.create({
      job: jobId,
      applicant: req.user._id,
      coverLetter: coverLetter.trim(),
      resume: user?.resume || null,
      status: 'pending'
    });

    // SAFE applicants update (supports counter or array)
    try {
      if (Array.isArray(job.applicants)) {
        await Job.findByIdAndUpdate(jobId, { $addToSet: { applicants: app._id } });
      } else if (typeof job.applicants === 'number' || typeof job.applicants === 'undefined') {
        await Job.findByIdAndUpdate(jobId, { $inc: { applicants: 1 } });
      }
    } catch (updateErr) {
      console.error('Non-fatal: failed to update job applicants field', updateErr);
    }

    const populated = await Application.findById(app._id)
      .populate('job', 'title company location jobType salary')
      .populate('applicant', 'name email phone');

    return res.status(201).json({
      message: 'Application submitted successfully',
      application: populated
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }
    console.error('Application submission error:', error);
    return res.status(500).json({ message: 'Server error while submitting application' });
  }
});

// Shared handler for "my applications"
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location jobType salary status createdAt')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/applications/my (Private)
router.get('/my', protect, getMyApplications);

// GET /api/applications/my-applications (Private, alias)
router.get('/my-applications', protect, getMyApplications);

// GET /api/applications/admin/all (Admin)
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const { status, jobId } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (jobId && jobId !== 'all' && isValidId(jobId)) query.job = jobId;

    const applications = await Application.find(query)
      .populate('job', 'title company location jobType type salary')
      .populate('applicant', 'name email phone skills experience education location resume')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/applications/:id (Admin)
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: 'Invalid application ID' });

    const application = await Application.findById(id)
      .populate('job', 'title company location jobType salary description requirements')
      .populate('applicant', 'name email phone skills experience education location resume');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    res.json(application);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/applications/:id/status (Admin)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, note } = req.body;
    if (!isValidId(id)) return res.status(400).json({ message: 'Invalid application ID' });

    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'interview', 'rejected', 'hired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findByIdAndUpdate(
      id,
      { status, notes: notes || note || '', updatedAt: Date.now() },
      { new: true, runValidators: true }
    )
      .populate('job', 'title company')
      .populate('applicant', 'name email');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    res.json({ message: 'Application status updated successfully', application });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/applications/:id (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: 'Invalid application ID' });

    const application = await Application.findById(id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const jobId = application.job;
    await application.deleteOne();

    try {
      if (isValidId(jobId)) {
        await Job.findByIdAndUpdate(jobId, { $inc: { applicants: -1 } });
      }
    } catch (decErr) {
      console.error('Non-fatal: failed to decrement job applicants', decErr);
    }

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/applications/job/:jobId (Admin)
router.get('/job/:jobId', protect, admin, async (req, res) => {
  try {
    const { jobId } = req.params;
    if (!isValidId(jobId)) return res.status(400).json({ message: 'Invalid Job ID' });

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email phone skills experience education location resume')
      .populate('user', 'name email phone skills experience education location'); // legacy fallback if any
    res.json(applications);
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/applications/my/:id (Private)
router.delete('/my/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: 'Invalid application ID' });

    const application = await Application.findOne({ _id: id, applicant: req.user._id });
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const jobId = application.job;
    await application.deleteOne();

    try {
      if (isValidId(jobId)) {
        await Job.findByIdAndUpdate(jobId, { $inc: { applicants: -1 } });
      }
    } catch (decErr) {
      console.error('Non-fatal: failed to decrement job applicants', decErr);
    }

    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
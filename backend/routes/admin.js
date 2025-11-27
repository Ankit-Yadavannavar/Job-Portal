// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { protect, admin } = require('../middleware/auth');

// GET /api/admin/users - list users (Admin)
router.get('/users', protect, admin, async (req, res) => {
  try {
    const { fields = '' } = req.query;
    let q = User.find().sort({ createdAt: -1 });
    q = fields === 'names' ? q.select('_id name email createdAt role') : q.select('-password');
    const users = await q.exec();
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/stats - dashboard stats (Admin)
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const [totalUsers, totalJobs, totalApplications] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayUsers, todayApplications, applicationsByStatus] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: today } }),
      Application.countDocuments({ createdAt: { $gte: today } }),
      Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    res.json({
      totalUsers,
      totalJobs,
      totalApplications,
      todayUsers,
      todayApplications,
      applicationsByStatus,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
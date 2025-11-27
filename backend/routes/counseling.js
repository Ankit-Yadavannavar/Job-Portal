const express = require('express');
const router = express.Router();
const Counseling = require('../models/Counseling');
const { protect, admin } = require('../middleware/auth');

// @route   POST /api/counseling
// @desc    Submit counseling request
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const counseling = await Counseling.create({
      name,
      email,
      phone,
      message,
      user: req.user?._id || null,
    });

    res.status(201).json({
      message: 'Counseling request submitted successfully',
      counseling,
    });
  } catch (error) {
    console.error('Counseling submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/counseling
// @desc    Get all counseling requests
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const requests = await Counseling.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Get counseling error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/counseling/:id
// @desc    Update counseling status
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const counseling = await Counseling.findByIdAndUpdate(
      req.params.id,
      { status, adminNote },
      { new: true }
    );

    if (!counseling) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({
      message: 'Status updated successfully',
      counseling,
    });
  } catch (error) {
    console.error('Update counseling error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/counseling/:id
// @desc    Delete counseling request
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const counseling = await Counseling.findByIdAndDelete(req.params.id);

    if (!counseling) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Delete counseling error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
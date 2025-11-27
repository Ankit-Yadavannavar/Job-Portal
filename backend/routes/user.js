const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/user/:id - get user profile
router.get('/:id', protect, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/user/:id - update profile (name locked after registration)
router.put('/:id', protect, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Lock name + prevent privilege/password updates here
    if (req.body.name) delete req.body.name;
    if (req.body.role) delete req.body.role;
    if (req.body.password) delete req.body.password;

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (e) {
    console.error('Update user error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/user/:id/resume - replace resume (deletes old file)
router.put('/:id/resume', protect, upload.single('resume'), async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete old resume if exists
    if (user.resume) {
      const oldPath = path.join(process.cwd(), user.resume);
      if (fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch {}
      }
    }

    // Set new resume
    user.resume = req.file ? req.file.path.replace(/\\/g, '/') : null;
    await user.save();

    res.json({ message: 'Resume updated', resume: user.resume });
  } catch (e) {
    console.error('Resume update error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/user/:id/resume - delete resume (no upload)
router.delete('/:id/resume', protect, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.resume) {
      const filePath = path.join(process.cwd(), user.resume);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch {}
      }
      user.resume = null;
      await user.save();
    }

    res.json({ message: 'Resume removed', resume: null });
  } catch (e) {
    console.error('Resume delete error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { searchPgrkam } = require('../utils/pgrkamService');

// GET /api/pgrkam/search?query=&location=&page=&limit=
router.get('/search', async (req, res) => {
  try {
    const { query = '', location = '', page = 1, limit = 10 } = req.query;
    const jobs = await searchPgrkam({
      query: String(query),
      location: String(location),
      page: Number(page),
      limit: Number(limit),
    });
    res.json({ count: jobs.length, jobs });
  } catch (err) {
    console.error('PGRKAM search error:', err.message);
    res.status(500).json({ message: 'Failed to fetch jobs from PGRKAM' });
  }
});

module.exports = router;
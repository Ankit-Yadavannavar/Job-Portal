const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const { searchPgrkam } = require('../utils/pgrkamService');

/**
 * Heuristic intent extraction: role/category + location
 */
const extractJobIntent = (text) => {
  const lower = (text || '').toLowerCase();

  // common roles/keywords – extend as needed
  const roleMatch = lower.match(
    /\b(react|node|full[-\s]?stack|frontend|backend|java|python|data\s?analyst|analyst|designer|devops|marketing|sales|hr|account|it|engineer|developer|tester|qa)\b/
  );

  const locationMatch = lower.match(/\b(?:in|near|at)\s+([a-z\s]+)\b/i);
  const location = locationMatch ? locationMatch[1].trim() : null;

  const role = roleMatch ? roleMatch[1] : null;
  return { role, location };
};

const isJobQuery = (text) => {
  const lower = (text || '').toLowerCase();
  return (
    lower.includes('job') ||
    lower.includes('vacancy') ||
    lower.includes('opening') ||
    lower.startsWith('find jobs') ||
    lower.startsWith('find me') ||
    lower.startsWith('show me') ||
    lower.startsWith('search jobs')
  );
};

/**
 * Internal jobs fallback search
 */
async function searchInternal({ role, location, userPrefs, limit = 5 }) {
  const query = { status: 'open' };
  const or = [];

  // Use explicit role or user preference category
  const roleText = role || userPrefs?.category || '';

  if (roleText) {
    const rx = new RegExp(roleText, 'i');
    or.push(
      { title: rx },
      { description: rx },
      { company: rx },
      { category: rx }
    );
  }
  if (or.length) query.$or = or;

  const locText = location || userPrefs?.location || '';
  if (locText) {
    query.location = new RegExp(locText, 'i');
  }

  const jobs = await Job.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('title company location salary type createdAt');

  return jobs;
}

/**
 * POST /api/chat
 * Accepts: { message, language, userId, context }
 * Returns: { message, jobs? }
 */
router.post('/', async (req, res) => {
  try {
    const { message = '', language = 'en', userId } = req.body;

    if (!message.trim()) {
      return res.json({
        message:
          language === 'hi'
            ? 'कृपया कुछ लिखें, मैं मदद करने के लिए यहाँ हूँ।'
            : language === 'pa'
            ? 'ਕਿਰਪਾ ਕਰਕੇ ਕੁਝ ਲਿਖੋ, ਮੈਂ ਮਦਦ ਲਈ ਇੱਥੇ ਹਾਂ।'
            : "Please type something, I'm here to help.",
      });
    }

    // Job search branch
    if (isJobQuery(message)) {
      let { role, location } = extractJobIntent(message);

      // Load user preferences if logged in
      let userPrefs = {};
      if (userId) {
        const u = await User.findById(userId).select('jobPreferences');
        if (u?.jobPreferences) userPrefs = u.jobPreferences;
      }

      // 1) Try PGRKAM first
      let pgJobs = [];
      try {
        const pgrkamResults = await searchPgrkam({
          query: role || '',
          location: location || '',
          limit: 5,
        });

        pgJobs = (pgrkamResults || []).map((j) => ({
          title: j.title,
          company: j.company,
          location: j.location,
          postedAt: j.postedAt,
          externalUrl: j.externalUrl, // Chat UI will open this on PGRKAM
        }));
      } catch (e) {
        console.warn('PGRKAM fetch failed:', e.message);
      }

      if (pgJobs.length > 0) {
        const intro =
          language === 'hi'
            ? 'मैंने Punjab Rozgar Platform पर ये नौकरियां ढूंढी हैं:'
            : language === 'pa'
            ? 'ਮੈਂ Punjab Rozgar Platform ’ਤੇ ਇਹ ਨੌਕਰੀਆਂ ਲੱਭੀਆਂ ਹਨ:'
            : 'Here are some jobs from Punjab Rozgar Platform:';
        return res.json({ message: intro, jobs: pgJobs });
      }

      // 2) Fallback to internal portal jobs
      const internal = await searchInternal({ role, location, userPrefs, limit: 5 });

      if (internal.length > 0) {
        const intro2 =
          language === 'hi'
            ? 'Punjab Rozgar Platform पर आपकी खोज के अनुसार नौकरी नहीं मिली, लेकिन हमारे पोर्टल पर ये नौकरियां उपलब्ध हैं:'
            : language === 'pa'
            ? 'Punjab Rozgar Platform ’ਤੇ ਕੁਝ ਨਹੀਂ ਮਿਲਿਆ, ਪਰ ਸਾਡੇ ਪੋਰਟਲ ’ਤੇ ਇਹ ਨੌਕਰੀਆਂ ਹਨ:'
            : "Couldn't find Jobs on Punjab Rozgar Platform, but here are jobs on our portal:";
        const formatted = internal.map((j) => ({
          _id: j._id,
          title: j.title,
          company: j.company,
          location: j.location,
          postedAt: new Date(j.createdAt).toLocaleDateString(),
          // optionally add salary/type
          salary: j.salary,
          type: j.type,
        }));
        return res.json({ message: intro2, jobs: formatted });
      }

      // 3) If nothing found anywhere
      const none =
        language === 'hi'
          ? 'क्षमा करें, Punjab Rozgar Platform और हमारे पोर्टल पर भी कोई नौकरी नहीं मिली।'
          : language === 'pa'
          ? 'ਮਾਫ ਕਰਨਾ, Punjab Rozgar Platform ਤੇ ਵੀ ਅਤੇ ਸਾਡੇ ਪੋਰਟਲ ’ਤੇ ਵੀ ਕੋਈ ਨੌਕਰੀ ਨਹੀਂ ਮਿਲੀ।'
          : "Sorry, I couldn't find any jobs on Punjab Rozgar Platform or our portal for that search.";
      return res.json({ message: none });
    }

    // Non-job fallback
    const fallback =
      language === 'hi'
        ? 'मैं आपकी नौकरी खोज में मदद कर सकता हूँ। लिखकर देखें: "Chandigarh में IT jobs"'
        : language === 'pa'
        ? 'ਮੈਂ ਤੁਹਾਡੀ ਨੌਕਰੀ ਖੋਜ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਲਿਖ ਕੇ ਵੇਖੋ: "Chandigarh ਵਿੱਚ IT jobs"'
        : 'I can help you find jobs. Try typing: "IT jobs in Chandigarh"';
    return res.json({ message: fallback });
  } catch (err) {
    console.error('Chat error:', err.message);
    return res.status(500).json({
      message:
        language === 'hi'
          ? 'क्षमा करें, कुछ समस्या आ गई। कृपया थोड़ी देर बाद पुनः प्रयास करें।'
          : language === 'pa'
          ? 'ਮਾਫ ਕਰਨਾ, ਕੋਈ ਸਮੱਸਿਆ ਆ ਗਈ। ਕੁਝ ਸਮੇਂ ਬਾਅਦ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।'
          : 'Sorry, something went wrong. Please try again in a moment.',
    });
  }
});

module.exports = router;
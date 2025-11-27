const natural = require('natural');
const TfIdf = natural.TfIdf;

/**
 * Calculate match score between job and candidate
 * @param {Object} job - Job document
 * @param {Object} user - User document
 * @returns {Number} Match score (0-100)
 */
exports.calculateMatchScore = (job, user) => {
  let score = 0;
  let totalWeight = 0;

  // 1. Skills matching (40% weight)
  const skillsWeight = 40;
  if (job.skills && user.skills) {
    const matchedSkills = job.skills.filter(skill =>
      user.skills.some(userSkill =>
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    const skillsScore = (matchedSkills.length / job.skills.length) * skillsWeight;
    score += skillsScore;
  }
  totalWeight += skillsWeight;

  // 2. Location matching (20% weight)
  const locationWeight = 20;
  if (job.location && user.jobPreferences?.location) {
    if (job.location.toLowerCase().includes(user.jobPreferences.location.toLowerCase())) {
      score += locationWeight;
    }
  }
  totalWeight += locationWeight;

  // 3. Job category matching (20% weight)
  const categoryWeight = 20;
  if (job.category && user.jobPreferences?.category) {
    if (job.category.toLowerCase() === user.jobPreferences.category.toLowerCase()) {
      score += categoryWeight;
    }
  }
  totalWeight += categoryWeight;

  // 4. Job type matching (10% weight)
  const typeWeight = 10;
  if (job.type && user.jobPreferences?.jobType) {
    if (job.type === user.jobPreferences.jobType) {
      score += typeWeight;
    }
  }
  totalWeight += typeWeight;

  // 5. Experience level matching (10% weight)
  const experienceWeight = 10;
  if (job.experience && user.experience) {
    // Simple heuristic: extract years from strings
    const jobYears = parseInt(job.experience.match(/\d+/)?.[0] || 0);
    const userYears = parseInt(user.experience.match(/\d+/)?.[0] || 0);
    
    if (userYears >= jobYears) {
      score += experienceWeight;
    } else if (userYears >= jobYears - 1) {
      score += experienceWeight * 0.5;
    }
  }
  totalWeight += experienceWeight;

  return Math.round(score);
};

/**
 * Use NLP to extract keywords from job description and resume
 */
exports.extractKeywords = (text) => {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text.toLowerCase());
  
  // Remove stop words
  const stopwords = natural.stopwords;
  const filtered = tokens.filter(word => !stopwords.includes(word));
  
  return filtered;
};

/**
 * Calculate semantic similarity using TF-IDF
 */
exports.calculateSemanticSimilarity = (jobDescription, userProfile) => {
  const tfidf = new TfIdf();
  
  tfidf.addDocument(jobDescription);
  tfidf.addDocument(userProfile);
  
  // This is a simplified similarity measure
  // In production, consider using cosine similarity
  let similarity = 0;
  const terms = this.extractKeywords(jobDescription);
  
  terms.forEach(term => {
    tfidf.tfidfs(term, (i, measure) => {
      if (i === 0 && measure > 0) {
        similarity += measure;
      }
    });
  });
  
  return Math.min(similarity * 10, 100); // Normalize to 0-100
};
const axios = require('axios');
const cheerio = require('cheerio');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 60 * 5 }); // 5 minutes cache

// NOTE: PGRKAM doesn't publish a stable public API; this scraper parses the HTML.
// You may need to adjust SELECTORS if PGRKAM changes their markup.
// Always follow their terms of use and be respectful with request frequency.

const ORIGIN = 'https://www.pgrkam.com';

// Heuristic URL builder — adjust params according to PGRKAM site structure.
function buildSearchUrl({ query = '', location = '', page = 1 }) {
  // Attempted job search path (verify on your end and adjust):
  // Example: https://www.pgrkam.com/job-seeker/job-search?job_title=react&district=Chandigarh&page=1
  const params = new URLSearchParams();
  if (query) params.set('job_title', query);
  if (location) params.set('district', location);
  params.set('page', page.toString());
  return `${ORIGIN}/job-seeker/job-search?${params.toString()}`;
}

// Parse PGRKAM results — tune these selectors if page changes.
function parseJobs(html) {
  const $ = cheerio.load(html);
  const jobs = [];

  // Try a few common patterns (adjust as needed)
  const cards = $('.job-card, .job-list-item, .views-row, .job-item, .result-item');
  if (cards.length === 0) {
    // Fallback if presented as table
    $('table tr').each((_, tr) => {
      const tds = $(tr).find('td');
      const title = $(tds).eq(0).text().trim();
      const company = $(tds).eq(1).text().trim();
      const location = $(tds).eq(2).text().trim();
      const link = $(tds).eq(0).find('a').attr('href');

      if (title && link) {
        jobs.push({
          title,
          company: company || '',
          location: location || '',
          externalUrl: new URL(link, ORIGIN).href,
        });
      }
    });
    return jobs;
  }

  cards.each((_, el) => {
    const $el = $(el);
    const title =
      $el.find('.job-title a, .job-title, h3 a, h3, a').first().text().trim() ||
      $el.find('a').first().text().trim();

    let relLink =
      $el.find('.job-title a, h3 a, a[href*="job"]').first().attr('href') ||
      $el.find('a').first().attr('href');

    const company =
      $el.find('.company, .employer, .job-company').first().text().trim() || '';
    const location =
      $el.find('.location, .job-location, .address').first().text().trim() || '';
    const postedAt =
      $el.find('.posted-date, .date, time').first().text().trim() || '';

    if (title && relLink) {
      if (!relLink.startsWith('http')) relLink = new URL(relLink, ORIGIN).href;
      jobs.push({
        title,
        company,
        location,
        postedAt,
        externalUrl: relLink,
      });
    }
  });

  return jobs;
}

async function searchPgrkam({ query = '', location = '', page = 1, limit = 10 }) {
  const key = `pgrkam:${query}:${location}:${page}:${limit}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const url = buildSearchUrl({ query, location, page });
  const { data } = await axios.get(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36',
      Referer: ORIGIN,
    },
    timeout: 15000,
  });

  const results = parseJobs(data).slice(0, limit);
  cache.set(key, results);
  return results;
}

module.exports = { searchPgrkam };
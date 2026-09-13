import https from 'node:https';
import crypto from 'node:crypto';

class NoticesService {
  constructor() {
    this.cachedNotices = [];
    this.lastFetchTime = null;
    this.CACHE_TTL = 15 * 60 * 1000; // 15 minutes cache
    this.isFetching = false;
  }

  fetchLiveHtml(url, timeoutMs = 12000) {
    return new Promise((resolve, reject) => {
      const req = https.get(
        url,
        {
          rejectUnauthorized: false, // JUT portal uses self-signed / incomplete chain certificate
          timeout: timeoutMs,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          }
        },
        (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            const redirectUrl = new URL(res.headers.location, url).href;
            return this.fetchLiveHtml(redirectUrl, timeoutMs).then(resolve).catch(reject);
          }
          if (res.statusCode !== 200) {
            return reject(new Error(`HTTP ${res.statusCode}`));
          }
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve(data));
        }
      );

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Live portal connection timed out'));
      });
      req.on('error', reject);
    });
  }

  async fetchNotices() {
    // Return cache if valid
    if (this.cachedNotices.length > 0 && this.lastFetchTime && Date.now() - this.lastFetchTime < this.CACHE_TTL) {
      return this.cachedNotices;
    }

    // Prevent concurrent fetches
    if (this.isFetching) {
      return this.cachedNotices;
    }

    this.isFetching = true;

    try {
      const html = await this.fetchLiveHtml('https://jutranchi.ac.in/');
      const newNotices = [];

      // Extract all anchor tags linking to pdfs
      const anchorRegex = /<a\b[^>]*href=["']([^"']+\.pdf(?:\?[^"']*)?)["'][^>]*>([\s\S]*?)<\/a>/gi;
      let match;
      let count = 0;

      while ((match = anchorRegex.exec(html)) !== null && count < 30) {
        let docUrl = match[1].trim();
        const rawContent = match[2];

        // Ensure full absolute URL
        if (!docUrl.startsWith('http://') && !docUrl.startsWith('https://')) {
          docUrl = new URL(docUrl, 'https://jutranchi.ac.in/').href;
        }

        // Exclude static foundational acts/amendments so only dynamic university notifications appear
        if (docUrl.includes('JharkhandTechnicalUniversityAct2011') || docUrl.includes('Act-Amendments')) {
          continue;
        }

        // Clean inner text: remove HTML tags and normalize whitespace
        const cleanTitle = rawContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        if (cleanTitle.length < 8) continue;

        // Extract date from content if present, e.g. "12 Sep 2026", "22 Aug 2026", "18/01/2026"
        const dateMatch = cleanTitle.match(/\b(\d{1,2}[\/\-\s](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|[0-9]{1,2})[\/\-\s]\d{2,4})\b/i);
        const date = dateMatch ? dateMatch[1] : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        // Categorize based on real title
        let category = 'Official Notice';
        const lower = cleanTitle.toLowerCase();
        if (lower.includes('exam') || lower.includes('result') || lower.includes('scrutiny')) {
          category = 'Examinations';
        } else if (lower.includes('admission') || lower.includes('ph.d') || lower.includes('m.tech') || lower.includes('scholar')) {
          category = 'Academic / Research';
        } else if (lower.includes('recruitment') || lower.includes('vacancy') || lower.includes('post')) {
          category = 'Recruitment';
        } else if (lower.includes('tender') || lower.includes('quotation')) {
          category = 'Tenders';
        }

        newNotices.push({
          id: crypto.createHash('md5').update(docUrl).digest('hex'),
          title: cleanTitle,
          date,
          category,
          documentUrl: docUrl,
          sourceUrl: 'https://jutranchi.ac.in/',
          source: 'Jharkhand University of Technology (JUT)',
          isNew: count < 3
        });
        count++;
      }

      // Deduplicate by document URL
      if (newNotices.length > 0) {
        const uniqueNotices = Array.from(new Map(newNotices.map((item) => [item.documentUrl, item])).values());
        this.cachedNotices = uniqueNotices.slice(0, 15);
        this.lastFetchTime = Date.now();
      }
    } catch (error) {
      console.warn('Real live notice fetch notice:', error.message);
    } finally {
      this.isFetching = false;
    }

    // Return live notices (or empty array if live fetch couldn't connect - zero hardcoded records per RULE.md)
    return this.cachedNotices;
  }
}

export const noticesService = new NoticesService();
export default noticesService;

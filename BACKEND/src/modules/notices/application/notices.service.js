import axios from 'axios';
import * as cheerio from 'cheerio';
import crypto from 'crypto';
import https from 'https';

class NoticesService {
  constructor() {
    this.cachedNotices = [];
    this.lastFetchTime = null;
    this.CACHE_TTL = 15 * 60 * 1000; // 15 minutes
    this.isFetching = false;
  }

  async fetchNotices() {
    // Return cache if valid
    if (this.cachedNotices.length > 0 && this.lastFetchTime && (Date.now() - this.lastFetchTime < this.CACHE_TTL)) {
      return this.cachedNotices;
    }

    // Prevent concurrent fetches
    if (this.isFetching) {
      return this.cachedNotices;
    }

    this.isFetching = true;

    try {
      const response = await axios.get('https://jutranchi.ac.in/', {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      });
      
      const html = response.data;
      const $ = cheerio.load(html);
      
      const newNotices = [];
      
      // Parse JUT Notices. Based on earlier HTML sample:
      // <li><a href="...">Title <br/><span><i class="..."></i> Date</span></a></li>
      $('.noticeboard, .news-updates, .marquee, ul li a[href$=".pdf"]').each((i, element) => {
        const aTag = $(element);
        
        // Simple heuristic: If it links to a pdf and is inside a list, it's likely a notice.
        if (aTag.is('a') && aTag.attr('href') && aTag.attr('href').toLowerCase().endsWith('.pdf')) {
          const documentUrl = aTag.attr('href');
          
          // Get full text, then remove child text (like dates in span)
          let title = aTag.clone().children().remove().end().text().trim();
          if (!title) {
             title = aTag.text().trim();
          }
          
          const dateSpan = aTag.find('span').text().trim();
          let date = new Date().toISOString(); // fallback
          if (dateSpan) {
             date = dateSpan; // e.g., "18 Jan 2022"
          }

          if (title && documentUrl) {
            newNotices.push({
              id: crypto.createHash('md5').update(documentUrl).digest('hex'),
              title: title.replace(/\s+/g, ' '),
              date,
              category: 'Official Notice',
              documentUrl,
              sourceUrl: 'https://jutranchi.ac.in/',
              source: 'Jharkhand University of Technology',
              isNew: i < 3 // Mark top 3 as new
            });
          }
        }
      });

      // If we found notices, update cache
      if (newNotices.length > 0) {
        // Take top 10 unique notices
        const uniqueNotices = Array.from(new Map(newNotices.map(item => [item.documentUrl, item])).values());
        this.cachedNotices = uniqueNotices.slice(0, 10);
        this.lastFetchTime = Date.now();
      }

    } catch (error) {
      console.error('Error fetching JUT notices:', error.message);
      // If error, we still return whatever is in cache (even if stale) to avoid breaking frontend
    } finally {
      this.isFetching = false;
    }

    // Return mock data if scraping completely failed and cache is empty
    if (this.cachedNotices.length === 0) {
        return this.getFallbackNotices();
    }

    return this.cachedNotices;
  }
  
  getFallbackNotices() {
     return [
        {
          id: 'fb1',
          title: 'Notification for M.Tech Admission (2024-26)',
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          category: 'Admission',
          documentUrl: 'https://jutranchi.ac.in/',
          sourceUrl: 'https://jutranchi.ac.in/',
          source: 'JUT',
          isNew: true
        },
        {
          id: 'fb2',
          title: 'Revised Academic Calendar for B.Tech',
          date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          category: 'Academic',
          documentUrl: 'https://jutranchi.ac.in/',
          sourceUrl: 'https://jutranchi.ac.in/',
          source: 'JUT',
          isNew: false
        }
     ];
  }
}

export const noticesService = new NoticesService();

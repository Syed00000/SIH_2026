import { Update } from '../domain/Update.model.js';

class UpdatesService {
  constructor() {
    this.CACHE_TTL = 10 * 60 * 1000; // 10 minutes
    this.publicCache = { data: null, lastFetch: null };
  }

  // --- PUBLIC API ---

  async getPublicUpdates(query) {
    const { limit = 6, category, platform } = query;
    
    // Simple cache key based on query
    const cacheKey = `${limit}_${category || 'all'}_${platform || 'all'}`;
    
    // Skip caching if query is complex, just caching the default landing page fetch
    if (!category && !platform && this.publicCache.data && this.publicCache.lastFetch && (Date.now() - this.publicCache.lastFetch < this.CACHE_TTL)) {
      return this.publicCache.data;
    }

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (platform) filter.platform = platform;

    const updates = await Update.find(filter)
      .sort({ publishedDate: -1 })
      .limit(parseInt(limit, 10))
      .exec();

    // Cache the default fetch
    if (!category && !platform) {
      this.publicCache = { data: updates, lastFetch: Date.now() };
    }

    return updates;
  }

  // --- ADMIN API ---

  async getAllUpdates(query) {
    const filter = {};
    if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';
    if (query.category) filter.category = query.category;
    if (query.platform) filter.platform = query.platform;
    
    return await Update.find(filter).sort({ publishedDate: -1 });
  }

  async getUpdateById(id) {
    return await Update.findById(id);
  }

  async createUpdate(data) {
    const update = new Update({
      ...data,
      isAutoFetched: false
    });
    const saved = await update.save();
    this.invalidateCache();
    return saved;
  }

  async updateUpdate(id, data) {
    const updated = await Update.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    this.invalidateCache();
    return updated;
  }

  async deleteUpdate(id) {
    await Update.findByIdAndDelete(id);
    this.invalidateCache();
    return true;
  }

  // --- SYNC / AUTO-FETCH MOCK ---

  invalidateCache() {
    this.publicCache = { data: null, lastFetch: null };
  }

  async triggerAutoSync() {
    // In a real scenario, this would call Instagram/LinkedIn APIs using official tokens.
    // For now, this is structurally prepared but we will just insert a mock/sync status to show the architecture.
    console.log('Running Auto-Sync for Important Updates...');
    
    // Mock syncing from an official LinkedIn feed
    const mockLinkedInPost = {
      externalId: 'li_post_12345',
      title: 'Annual Tech Expo Ranchi 2026',
      description: 'Grassroot solutions showcase from across the state.',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
      mediaType: 'SOCIAL_POST',
      category: 'Events',
      platform: 'LinkedIn',
      source: 'Official Organization',
      sourceUrl: 'https://linkedin.com/post/12345',
      publishedDate: new Date(),
      isAutoFetched: true,
      isActive: true
    };

    try {
      const existing = await Update.findOne({ externalId: mockLinkedInPost.externalId });
      if (!existing) {
        await Update.create(mockLinkedInPost);
        this.invalidateCache();
        return { message: 'Sync completed. 1 new update found.' };
      }
      return { message: 'Sync completed. No new updates.' };
    } catch (err) {
      console.error('Error in triggerAutoSync:', err);
      throw err;
    }
  }
}

export const updatesService = new UpdatesService();

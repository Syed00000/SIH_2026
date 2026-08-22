class InMemoryCache {
  constructor() {
    this.store = new Map();
  }

  async get(key) {
    const item = this.store.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return JSON.parse(item.value);
  }

  async set(key, value, ttlSeconds = 300) {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(key, {
      value: JSON.stringify(value),
      expiresAt
    });
    return true;
  }

  async delete(key) {
    return this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

export const cache = new InMemoryCache();
export default cache;

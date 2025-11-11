import redis from '../config/redis.js';

export class CacheOptimizer {
  static async cacheResponse(key, data, expiration = 3600) { // 1 hour default
    try {
      await redis.setex(
        key,
        expiration,
        JSON.stringify({
          data,
          timestamp: Date.now(),
          expiresAt: Date.now() + (expiration * 1000)
        })
      );
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  static async getCachedResponse(key) {
    try {
      const cached = await redis.get(key);
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      
      // Check if cache is still valid
      if (Date.now() > parsed.expiresAt) {
        await redis.del(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static async cacheWithStrategy(key, fetchFunction, strategy = 'standard') {
    const strategies = {
      standard: 3600, // 1 hour
      short: 300,     // 5 minutes
      long: 86400,    // 24 hours
      user: 1800      // 30 minutes
    };

    const expiration = strategies[strategy] || strategies.standard;

    // Try to get from cache first
    const cached = await this.getCachedResponse(key);
    if (cached) {
      return cached;
    }

    // Fetch fresh data
    const freshData = await fetchFunction();
    
    // Cache the result
    await this.cacheResponse(key, freshData, expiration);
    
    return freshData;
  }

  static async batchCache(keys, fetchFunction, expiration = 3600) {
    const results = {};
    const keysToFetch = [];

    // Check cache for all keys
    for (const key of keys) {
      const cached = await this.getCachedResponse(key);
      if (cached) {
        results[key] = cached;
      } else {
        keysToFetch.push(key);
      }
    }

    // Fetch missing keys
    if (keysToFetch.length > 0) {
      const freshData = await fetchFunction(keysToFetch);
      
      // Cache new results
      for (const key of keysToFetch) {
        if (freshData[key]) {
          results[key] = freshData[key];
          await this.cacheResponse(key, freshData[key], expiration);
        }
      }
    }

    return results;
  }

  static async invalidatePattern(pattern) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return keys.length;
    } catch (error) {
      console.error('Cache invalidation error:', error);
      return 0;
    }
  }

  static async getCacheStats() {
    try {
      const info = await redis.info();
      const keys = await redis.keys('*');
      
      return {
        totalKeys: keys.length,
        memoryUsage: info.split('\r\n').find(line => line.startsWith('used_memory:')),
        hitRate: info.split('\r\n').find(line => line.startsWith('keyspace_hits:'))
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      return null;
    }
  }
}
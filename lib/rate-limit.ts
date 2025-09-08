import { LRUCache } from 'lru-cache';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000, // 1 minute
  });

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;

        if (isRateLimited) {
          reject(new Error('Rate limit exceeded'));
        } else {
          resolve();
        }
      }),
    limit: async (token: string, limit: number = 10) => {
      try {
        await rateLimit().check(limit, token);
        return { success: true };
      } catch {
        return { success: false };
      }
    },
  };
}

// Export a default instance
export const rateLimiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60000, // 1 minute
});

// Simple rate limiter for API routes
export const rateLimit = {
  limit: async (identifier: string, limit: number = 10) => {
    // In production, you would use Redis or a database
    // For now, we'll use a simple in-memory cache
    const cache = new Map<string, { count: number; resetTime: number }>();
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    
    const key = identifier;
    const record = cache.get(key);
    
    if (!record || now > record.resetTime) {
      cache.set(key, { count: 1, resetTime: now + windowMs });
      return { success: true };
    }
    
    if (record.count >= limit) {
      return { success: false };
    }
    
    record.count++;
    return { success: true };
  }
};

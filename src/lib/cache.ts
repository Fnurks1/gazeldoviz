import { CacheConfig } from '@/types';

// Cache configuration
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  staleTime: 5 * 60 * 1000, // 5 dakika - veri bu süre taze sayılır
  cacheTime: 30 * 60 * 1000, // 30 dakika - veri cache'de bu süre tutulur
  refetchInterval: 5 * 60 * 1000, // 5 dakika - background refresh
};

export const HISTORICAL_CACHE_CONFIG: CacheConfig = {
  staleTime: 60 * 60 * 1000, // 1 saat
  cacheTime: 24 * 60 * 60 * 1000, // 24 saat
};

// Query keys
export const QUERY_KEYS = {
  rates: (base: string) => ['rates', base] as const,
  conversion: (from: string, to: string, amount: number) =>
    ['conversion', from, to, amount] as const,
  historical: (from: string, to: string, days: number) =>
    ['historical', from, to, days] as const,
  currencies: ['currencies'] as const,
};

// Local storage keys
export const STORAGE_KEYS = {
  favorites: 'gazel-doviz-favorites',
  theme: 'gazel-doviz-theme',
  lastUpdate: 'gazel-doviz-last-update',
  recentConversions: 'gazel-doviz-recent-conversions',
};

// API cache helper
export class ApiCache {
  private cache: Map<string, { data: any; timestamp: number }>;
  private maxAge: number;

  constructor(maxAge: number = 5 * 60 * 1000) {
    this.cache = new Map();
    this.maxAge = maxAge;
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    
    if (age > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  has(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;

    const age = Date.now() - cached.timestamp;
    if (age > this.maxAge) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

// Global cache instance
export const apiCache = new ApiCache();

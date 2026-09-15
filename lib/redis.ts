// In-memory fallback cache for lightweight caching without external Redis dependency
const memoryCache = new Map<string, { val: any; expiresAt: number }>();

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const item = memoryCache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      memoryCache.delete(key);
      return null;
    }
    return item.val as T;
  } catch {
    return null;
  }
}

export async function setCached<T>(key: string, val: T, ex = 900) {
  try {
    memoryCache.set(key, { val, expiresAt: Date.now() + ex * 1000 });
  } catch {}
}

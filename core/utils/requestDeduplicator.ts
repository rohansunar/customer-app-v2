/**
 * Request Deduplicator Utility
 *
 * Prevents duplicate API calls for the same request key.
 * Useful for preventing rapid-fire requests from causing multiple identical API calls.
 *
 * Usage:
 * ```typescript
 * const result = await requestDeduplicator.execute('get-product-123', () =>
 *   apiClient.get('/products/123')
 * );
 * ```
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles request deduplication
 * - Open-Closed: Easy to extend with new deduplication strategies
 * - Dependency Inversion: Works with any Promise-based request function
 */

type PendingRequest = {
  key: string;
  promise: Promise<unknown>;
  timestamp: number;
};

export class RequestDeduplicator {
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private readonly maxAge: number;

  /**
   * @param maxAge - Maximum age of cached requests in milliseconds (default: 5 seconds)
   *                 Requests older than this will be considered stale and allowed to execute
   */
  constructor(maxAge: number = 5000) {
    this.maxAge = maxAge;
  }

  /**
   * Executes a request if not already pending for the same key.
   * If a request with the same key is pending, returns the existing promise.
   *
   * @param key - Unique identifier for the request
   * @param requestFn - Function that returns a Promise
   * @returns Promise resolving to the request result
   */
  async execute<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    const now = Date.now();
    const existing = this.pendingRequests.get(key);

    // Check if there's a pending request that's still valid
    if (existing) {
      const age = now - existing.timestamp;

      // If request is still pending and not stale, return existing promise
      if (age < this.maxAge) {
        return existing.promise as Promise<T>;
      }

      // Request is stale, remove it and allow new request
      this.pendingRequests.delete(key);
    }

    // Create new request
    const promise = requestFn()
      .finally(() => {
        // Clean up after request completes
        this.pendingRequests.delete(key);
      })
      .catch((error) => {
        // Re-throw error to maintain expected behavior
        throw error;
      });

    // Store pending request
    this.pendingRequests.set(key, {
      key,
      promise,
      timestamp: now,
    });

    return promise;
  }

  /**
   * Clears all pending requests.
   * Useful for cleanup or when user navigates away.
   */
  clear(): void {
    this.pendingRequests.clear();
  }

  /**
   * Checks if a request is currently pending for the given key.
   */
  isPending(key: string): boolean {
    const existing = this.pendingRequests.get(key);
    if (!existing) return false;

    const age = Date.now() - existing.timestamp;
    return age < this.maxAge;
  }

  /**
   * Gets the number of currently pending requests.
   */
  getPendingCount(): number {
    return this.pendingRequests.size;
  }
}

/**
 * Singleton instance for application-wide use
 */
export const requestDeduplicator = new RequestDeduplicator(5000);

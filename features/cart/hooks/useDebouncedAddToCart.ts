/**
 * Debounced Add to Cart Hook
 *
 * This hook wraps useAddToCart to prevent rapid successive API calls
 * when users click the "Add to Cart" button multiple times quickly.
 *
 * DEBOUNCING PATTERN:
 * Without debouncing: Click-Click-Click → API-API-API (3 requests)
 * With debouncing:  Click-Click-Click → API (1 request after delay)
 *
 * This prevents:
 * - Duplicate items in cart from rapid clicks
 * - Unnecessary API calls and server load
 * - Race conditions from concurrent requests
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles debouncing logic
 * - Open-Closed: Easy to customize debounce behavior
 * - Composition: Wraps useAddToCart without modifying it
 *
 * @param debounceMs - Time in milliseconds to wait between requests
 *                     (default: 500ms - balances responsiveness with safety)
 *
 * @returns Mutation object with debounced mutate function
 *
 * @example
 * ```typescript
 * const { mutate, isPending, isDebounced } = useDebouncedAddToCart(500);
 *
 * // Safe to call rapidly - will only execute one request
 * mutate({ productId: 'prod-123', quantity: 1 });
 *
 * // Check if a request is queued
 * if (isDebounced) {
 *   // Another request is waiting to execute
 * }
 * ```
 */

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useAddToCart } from './useAddToCart';
import { AddToCartData } from '../types';

/**
 * Hook that debounces add-to-cart operations to prevent rapid multiple requests.
 *
 * @param debounceMs - Milliseconds to wait between requests (default: 500)
 * @returns Mutation object with enhanced debounced mutate function
 */
export function useDebouncedAddToCart(debounceMs: number = 500) {
  // Wrapped mutation hook for actual API calls
  const addToCartMutation = useAddToCart();

  // Refs for managing debounce state without triggering re-renders
  const lastRequestRef = useRef<number>(0);
  const pendingRef = useRef<AddToCartData | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // State for tracking debounce status (triggers re-renders)
  const [isDebounced, setIsDebounced] = useState(false);

  /**
   * Cleanup effect - runs on component unmount
   * Ensures any pending timeout is cleared to prevent memory leaks
   */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  /**
   * Debounced mutate function
   *
   * Logic:
   * 1. If enough time has passed since last request → execute immediately
   * 2. If too soon → queue the latest request and schedule execution
   * 3. Only the most recent request in the queue is kept
   *
   * @param data - The add-to-cart data to debounce
   */
  const debouncedMutate = useCallback(
    (data: AddToCartData) => {
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestRef.current;

      if (timeSinceLastRequest >= debounceMs) {
        /**
         * Case 1: Enough time has passed
         * Execute immediately and reset debounce state
         */
        lastRequestRef.current = now;
        pendingRef.current = null;
        setIsDebounced(false);

        // Clear any pending timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        // Execute the actual mutation
        addToCartMutation.mutate(data);
      } else {
        /**
         * Case 2: Too soon - queue the request
         * Keep only the most recent request (overwrite previous)
         */
        pendingRef.current = data;
        setIsDebounced(true);

        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Schedule execution after remaining debounce period
        timeoutRef.current = setTimeout(() => {
          if (pendingRef.current) {
            // Execute the queued request
            addToCartMutation.mutate(pendingRef.current);
            pendingRef.current = null;
            lastRequestRef.current = Date.now();
            setIsDebounced(false);
          }
          timeoutRef.current = null;
        }, debounceMs - timeSinceLastRequest);
      }
    },
    [addToCartMutation, debounceMs],
  );

  /**
   * Returns the mutation object with:
   * - All original mutation properties from useAddToCart
   * - debouncedMutate: The debounced version of mutate
   * - isDebounced: Whether a request is currently queued
   */
  return {
    ...addToCartMutation,
    mutate: debouncedMutate,
    isDebounced,
  };
}

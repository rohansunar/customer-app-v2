import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSplashDurationProps {
  /** Default duration in milliseconds */
  duration?: number;
  /** Callback when duration completes */
  onComplete: () => void;
}

interface UseSplashDurationReturn {
  /** Remaining time in milliseconds */
  remainingTime: number;
  /** Whether the duration has completed */
  isComplete: boolean;
  /** Start the duration timer */
  start: () => void;
  /** Reset the duration timer */
  reset: () => void;
}

export function useSplashDuration({
  duration = 2500,
  onComplete,
}: UseSplashDurationProps): UseSplashDurationReturn {
  const [remainingTime, setRemainingTime] = useState(duration);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = useCallback(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Start new timer
    timerRef.current = setTimeout(() => {
      setIsComplete(true);
      onComplete();
    }, duration);
  }, [duration, onComplete]);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setRemainingTime(duration);
    setIsComplete(false);
  }, [duration]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { remainingTime, isComplete, start, reset };
}

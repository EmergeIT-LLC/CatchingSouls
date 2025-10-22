import { useEffect, useRef } from 'react';

/**
 * Simple async throttle wrapper (returns a wrapper that ignores calls
 * within `wait` ms or while a call is running).
 */
export function throttleAsync(fn, wait = 2000) {
  let last = 0;
  let running = false;
  return async function (...args) {
    const now = Date.now();
    if (running || now - last < wait) return;
    last = now;
    running = true;
    try {
      return await fn(...args);
    } finally {
      running = false;
    }
  };
}

/**
 * React hook version that keeps `fn` reference fresh to avoid stale closures.
 * Usage: const throttled = useThrottleAsync(fn, 2000);
 * then call: await throttled(...args)
 */
export function useThrottleAsync(fn, wait = 2000) {
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const wrapperRef = useRef(null);
  if (!wrapperRef.current) {
    wrapperRef.current = async (...args) => {
      const now = Date.now();
      if (wrapperRef.current.running || now - (wrapperRef.current.last || 0) < wait) return;
      wrapperRef.current.last = now;
      wrapperRef.current.running = true;
      try {
        return await fnRef.current(...args);
      } finally {
        wrapperRef.current.running = false;
      }
    };
    wrapperRef.current.last = 0;
    wrapperRef.current.running = false;
  }

  return wrapperRef.current;
}

export default throttleAsync;
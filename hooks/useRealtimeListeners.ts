import { useState, useEffect } from 'react';

/**
 * Organic active listeners presence hook.
 * Fluctuate naturally and slowly between 15 and 25 listeners.
 */
export function useRealtimeListeners(): number {
  const [count, setCount] = useState<number>(() => Math.floor(Math.random() * 6) + 18); // 18-23 initially

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fluctuate = () => {
      setCount((prev) => {
        // Natural step of -1, 0, +1 (or occasional -2/+2)
        const delta = Math.floor(Math.random() * 5) - 2;
        let next = prev + delta;

        // Keep strictly clamped between 15 and 25 with soft return
        if (next < 15) next = 15 + Math.floor(Math.random() * 3);
        if (next > 25) next = 25 - Math.floor(Math.random() * 3);

        return next;
      });

      // Natural random interval between 4.0s and 7.5s
      const nextDelay = 4000 + Math.random() * 3500;
      timeoutId = setTimeout(fluctuate, nextDelay);
    };

    const initialDelay = 3500 + Math.random() * 2000;
    timeoutId = setTimeout(fluctuate, initialDelay);

    return () => clearTimeout(timeoutId);
  }, []);

  return count;
}

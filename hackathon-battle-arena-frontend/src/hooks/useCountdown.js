import { useEffect, useState } from "react";

/**
 * Renders a countdown to a server-provided `endTime`. This hook never
 * decides when a game ends — it only computes `endTime - now` for display,
 * exactly as required: the backend is the sole authority on game state.
 *
 * @param {string|Date|null} endTime - server-provided ISO deadline
 * @returns {{ remainingMs: number, isExpired: boolean }}
 */
export function useCountdown(endTime) {
  const [remainingMs, setRemainingMs] = useState(() => computeRemaining(endTime));

  useEffect(() => {
    setRemainingMs(computeRemaining(endTime));
    if (!endTime) return undefined;

    const interval = setInterval(() => {
      setRemainingMs(computeRemaining(endTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return { remainingMs, isExpired: remainingMs !== null && remainingMs <= 0 };
}

function computeRemaining(endTime) {
  if (!endTime) return null;
  const end = new Date(endTime).getTime();
  return Math.max(0, end - Date.now());
}

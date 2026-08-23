import { Timer } from "lucide-react";
import { useCountdown } from "../../hooks/useCountdown";
import { formatDuration } from "../../utils/formatters";

const TEN_MIN = 10 * 60 * 1000;
const FIVE_MIN = 5 * 60 * 1000;

export default function TimerDisplay({ endTime, liveRemainingMs, className = "" }) {
  const { remainingMs: computedMs } = useCountdown(endTime);
  // Prefer the server-pushed `game:timer` tick when available (kept in
  // GameContext), fall back to the locally computed endTime-now value —
  // either way this is only ever a *display* of the server's clock.
  const remainingMs = liveRemainingMs ?? computedMs;

  if (remainingMs === null) {
    return (
      <div className={`flex items-center gap-2 text-arena-muted ${className}`}>
        <Timer className="h-5 w-5" />
        <span className="font-mono text-xl">--:--</span>
      </div>
    );
  }

  const state = remainingMs > TEN_MIN ? "normal" : remainingMs > FIVE_MIN ? "warning" : "critical";
  const colorClass = { normal: "text-arena-accent", warning: "text-arena-warning", critical: "text-arena-danger animate-pulse-slow" }[state];

  return (
    <div className={`flex items-center gap-2 ${colorClass} ${className}`} role="timer" aria-live="polite">
      <Timer className="h-5 w-5" />
      <span className="font-mono text-2xl font-bold tabular-nums">{formatDuration(remainingMs)}</span>
    </div>
  );
}

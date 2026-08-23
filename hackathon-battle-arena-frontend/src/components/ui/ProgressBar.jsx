export default function ProgressBar({ value = 0, max = 100, color = "primary", className = "", showLabel = false }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const colorClass = { primary: "bg-arena-primary", accent: "bg-arena-accent", warning: "bg-arena-warning", danger: "bg-arena-danger" }[color] || "bg-arena-primary";
  return (
    <div className={className}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-arena-surface2">
        <div className={`h-full rounded-full ${colorClass} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <p className="mt-1 text-xs text-arena-muted">{Math.round(pct)}%</p>}
    </div>
  );
}

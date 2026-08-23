const COLORS = {
  primary: "bg-arena-primary/15 text-arena-primary border border-arena-primary/30",
  accent: "bg-arena-accent/15 text-arena-accent border border-arena-accent/30",
  warning: "bg-arena-warning/15 text-arena-warning border border-arena-warning/30",
  danger: "bg-arena-danger/15 text-arena-danger border border-arena-danger/30",
  neutral: "bg-arena-surface2 text-arena-muted border border-arena-border",
};

export default function Badge({ children, color = "neutral", className = "" }) {
  return <span className={`badge-pill ${COLORS[color] || COLORS.neutral} ${className}`}>{children}</span>;
}

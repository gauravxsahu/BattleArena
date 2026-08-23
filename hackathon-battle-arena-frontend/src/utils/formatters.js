export function formatNumber(n) {
  if (n === null || n === undefined) return "0";
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatSignedNumber(n) {
  if (n === null || n === undefined) return "+0";
  return n > 0 ? `+${formatNumber(n)}` : formatNumber(n);
}

export function formatPercent(value, total) {
  if (!total) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

export function formatWinRate(wins, losses) {
  const total = (wins || 0) + (losses || 0);
  if (total === 0) return "—";
  return `${Math.round(((wins || 0) / total) * 100)}%`;
}

export function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatDate(dateInput) {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

export function formatTime(dateInput) {
  if (!dateInput) return "";
  return new Date(dateInput).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function initials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function truncate(str, length = 80) {
  if (!str) return "";
  return str.length > length ? `${str.slice(0, length)}…` : str;
}

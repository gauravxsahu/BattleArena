import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({ message, className = "" }) {
  if (!message) return null;
  return (
    <div className={`flex items-start gap-2 rounded-xl border border-arena-danger/30 bg-arena-danger/10 px-4 py-3 text-sm text-arena-danger ${className}`} role="alert">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

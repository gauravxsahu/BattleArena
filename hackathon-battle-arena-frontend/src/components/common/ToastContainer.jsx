import { CheckCircle2, Info, AlertTriangle, XCircle, X } from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";

const ICONS = { success: CheckCircle2, info: Info, warning: AlertTriangle, error: XCircle };
const COLORS = {
  success: "border-arena-accent/40 text-arena-accent",
  info: "border-arena-primary/40 text-arena-primary",
  warning: "border-arena-warning/40 text-arena-warning",
  error: "border-arena-danger/40 text-arena-danger",
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.variant] || Info;
        return (
          <div
            key={toast.id}
            role="status"
            className={`glass-panel flex items-start gap-3 border p-4 shadow-card animate-slide-up ${COLORS[toast.variant] || COLORS.info}`}
          >
            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="flex-1 text-sm text-arena-text">{toast.message}</p>
            <button onClick={() => dismissToast(toast.id)} aria-label="Dismiss notification" className="text-arena-muted hover:text-arena-text">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

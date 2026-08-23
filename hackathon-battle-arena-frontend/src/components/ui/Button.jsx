import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  danger: "btn-danger",
  ghost: "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-arena-muted transition-colors hover:text-arena-text hover:bg-arena-surface2 disabled:opacity-50 disabled:pointer-events-none",
};

export default function Button({
  children,
  variant = "primary",
  isLoading = false,
  disabled = false,
  className = "",
  type = "button",
  icon: Icon,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${VARIANTS[variant] || VARIANTS.primary} ${className}`}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}

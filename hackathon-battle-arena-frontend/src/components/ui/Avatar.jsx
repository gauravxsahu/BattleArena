import { initials } from "../../utils/formatters";

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-2xl",
};

export default function Avatar({ name, src, size = "md", online = false, className = "" }) {
  const sizeClass = SIZES[size] || SIZES.md;
  return (
    <div className={`relative shrink-0 ${className}`}>
      {src ? (
        <img src={src} alt={name} className={`${sizeClass} rounded-full object-cover border border-arena-border`} />
      ) : (
        <div
          className={`${sizeClass} flex items-center justify-center rounded-full border border-arena-border bg-gradient-to-br from-arena-primary/30 to-arena-accent/20 font-bold text-arena-text`}
        >
          {initials(name)}
        </div>
      )}
      {online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-arena-accent ring-2 ring-arena-bg" />}
    </div>
  );
}

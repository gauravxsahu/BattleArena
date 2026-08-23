export default function Card({ children, className = "", glass = false, ...props }) {
  return (
    <div className={`${glass ? "glass-panel" : "card"} p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

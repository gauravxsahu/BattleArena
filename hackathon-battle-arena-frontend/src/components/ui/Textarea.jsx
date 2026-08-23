import { forwardRef } from "react";

const Textarea = forwardRef(function Textarea({ label, error, className = "", id, ...props }, ref) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="label-text">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        ref={ref}
        className={`input-field min-h-[120px] resize-y ${error ? "border-arena-danger focus:border-arena-danger" : ""} ${className}`}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-arena-danger">{error}</p>}
    </div>
  );
});

export default Textarea;

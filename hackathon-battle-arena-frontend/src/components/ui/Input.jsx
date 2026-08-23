import { forwardRef } from "react";

const Input = forwardRef(function Input({ label, error, icon: Icon, className = "", id, ...props }, ref) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="label-text">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-arena-muted" />}
        <input
          id={inputId}
          ref={ref}
          className={`input-field ${Icon ? "pl-10" : ""} ${error ? "border-arena-danger focus:border-arena-danger" : ""} ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-arena-danger">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;

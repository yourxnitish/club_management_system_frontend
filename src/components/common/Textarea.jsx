import React, { forwardRef } from 'react';

export const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    rows = 4,
    className = '',
    helperText,
    id,
    ...props
  },
  ref
) {
  const textareaId = id || props.name || Math.random().toString();

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-semibold uppercase tracking-wider text-navy-800 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`w-full rounded border bg-white px-3.5 py-2 text-sm text-ink-primary placeholder:text-ink-muted transition-colors focus:border-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900 disabled:bg-gray-50 ${
          error ? 'border-status-error focus:border-status-error focus:ring-status-error' : 'border-border'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-status-error font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-ink-secondary">{helperText}</p>}
    </div>
  );
});

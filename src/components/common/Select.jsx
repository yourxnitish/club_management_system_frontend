import React, { forwardRef } from 'react';

export const Select = forwardRef(function Select(
  {
    label,
    error,
    options = [],
    placeholder = 'Select an option',
    className = '',
    helperText,
    id,
    ...props
  },
  ref
) {
  const selectId = id || props.name || Math.random().toString();

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-navy-800 mb-1.5">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`w-full rounded border bg-white px-3.5 py-2 text-sm text-ink-primary transition-colors focus:border-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900 disabled:bg-gray-50 ${
          error ? 'border-status-error focus:border-status-error focus:ring-status-error' : 'border-border'
        } ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const value = typeof opt === 'object' ? opt.value : opt;
          const label = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      {error && <p className="mt-1 text-xs text-status-error font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-ink-secondary">{helperText}</p>}
    </div>
  );
});

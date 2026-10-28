import React from 'react';

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`bg-white rounded-lg border border-border shadow-classic transition-all duration-200 ${
        hover ? 'hover:shadow-elevated hover:border-navy-900/20' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', title, subtitle, action }) {
  return (
    <div className={`p-5 sm:p-6 border-b border-border flex items-start justify-between gap-4 ${className}`}>
      <div>
        {title && <h3 className="font-serif text-lg font-semibold text-navy-900">{title}</h3>}
        {subtitle && <p className="text-xs text-ink-secondary mt-0.5">{subtitle}</p>}
        {children}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-5 sm:p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`p-4 sm:p-6 border-t border-border bg-ivory-50/50 rounded-b-lg flex items-center justify-between gap-3 ${className}`}>
      {children}
    </div>
  );
}

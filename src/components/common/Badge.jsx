import React from 'react';

export function Badge({ children, variant = 'neutral', size = 'sm', className = '' }) {
  const variants = {
    neutral: 'bg-gray-100 text-ink-secondary border-gray-200',
    primary: 'bg-navy-900/10 text-navy-900 border-navy-900/20',
    success: 'bg-forest-600/10 text-forest-700 border-forest-600/30 font-medium',
    warning: 'bg-status-warning/10 text-status-warning border-status-warning/30 font-medium',
    error: 'bg-status-error/10 text-status-error border-status-error/30 font-medium',
    info: 'bg-status-info/10 text-status-info border-status-info/30 font-medium',
    gold: 'bg-gold/15 text-gold-dark border-gold/30 font-medium',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 rounded',
    md: 'text-xs px-2.5 py-1 rounded-md',
    lg: 'text-sm px-3 py-1 rounded-md',
  };

  return (
    <span className={`inline-flex items-center gap-1 border ${variants[variant] || variants.neutral} ${sizes[size] || sizes.sm} ${className}`}>
      {children}
    </span>
  );
}

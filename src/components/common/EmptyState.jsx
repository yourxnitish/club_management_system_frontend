import React from 'react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon,
  title = 'No items found',
  description = 'There are no records to display at this time.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`text-center py-12 px-4 rounded-lg border border-dashed border-border bg-ivory-50/50 ${className}`}>
      {Icon && (
        <div className="mx-auto w-12 h-12 rounded-full bg-navy-900/5 flex items-center justify-center text-navy-800 mb-3.5">
          <Icon className="w-6 h-6 text-navy-800" />
        </div>
      )}
      <h3 className="font-serif text-base font-semibold text-navy-900">{title}</h3>
      <p className="mt-1 text-sm text-ink-secondary max-w-sm mx-auto">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Card } from '../common/Card';

export function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'navy' }) {
  const iconColors = {
    navy: 'bg-navy-900/10 text-navy-900 border-navy-900/20',
    forest: 'bg-forest-600/10 text-forest-700 border-forest-600/30',
    gold: 'bg-gold/20 text-gold-dark border-gold/40',
    blue: 'bg-status-info/10 text-status-info border-status-info/30',
  };

  return (
    <Card className="p-5 flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-secondary mb-1">{title}</p>
        <h4 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900">{value ?? '—'}</h4>
        {subtitle && <p className="text-xs text-ink-secondary mt-1">{subtitle}</p>}
        {trend && (
          <p className="text-xs text-forest-700 font-medium mt-2 flex items-center gap-1">
            <span>{trend}</span>
          </p>
        )}
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-lg border flex items-center justify-center shrink-0 ${iconColors[color] || iconColors.navy}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </Card>
  );
}

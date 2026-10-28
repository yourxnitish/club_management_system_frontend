import React from 'react';
import { Card } from '../common/Card';
import { StarRating } from './StarRating';
import { formatDateTime } from '../../utils/formatters';

export function FeedbackCard({ feedback }) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-navy-900/10 text-navy-900 flex items-center justify-center font-bold text-xs shrink-0">
            {feedback.userName?.[0] || 'S'}
          </div>
          <div>
            <h5 className="text-xs font-bold text-navy-900">{feedback.userName}</h5>
            {feedback.eventTitle && (
              <p className="text-[11px] text-ink-secondary">Event: {feedback.eventTitle}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <StarRating rating={feedback.rating} size="sm" />
          <span className="text-[10px] text-ink-secondary mt-1">{formatDateTime(feedback.createdAt)}</span>
        </div>
      </div>
      {feedback.comments && (
        <p className="text-xs text-ink-primary leading-relaxed mt-3 pl-10 border-l-2 border-gold/40 italic">
          "{feedback.comments}"
        </p>
      )}
    </Card>
  );
}

import React from 'react';
import { EventCard } from './EventCard';
import { CardSkeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { Calendar } from 'lucide-react';

export function EventGrid({ events = [], loading = false, onRegisterClick, onFeedbackClick }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No Events Found"
        description="There are currently no events matching your criteria or time range."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onRegisterClick={onRegisterClick}
          onFeedbackClick={onFeedbackClick}
        />
      ))}
    </div>
  );
}

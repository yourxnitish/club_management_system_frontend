import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Calendar, MapPin, Users, Star, Clock } from 'lucide-react';
import { formatDateTime, getStatusBadgeVariant } from '../../utils/formatters';

export function EventCard({ event, onRegisterClick, onFeedbackClick }) {
  const isPast = new Date(event.startTime) < new Date();
  const isFull = event.registeredCount >= event.capacity;

  return (
    <Card hover className="flex flex-col h-full overflow-hidden group">
      {/* Banner */}
      <div className="relative h-44 bg-navy-900 overflow-hidden">
        {event.bannerUrl ? (
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-navy-900 text-gold/30 font-serif text-3xl font-bold">
            {event.title[0]}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        {/* Club Tag */}
        <div className="absolute top-3 left-3">
          <Badge variant="gold" size="sm" className="bg-navy-900/90 text-gold border-gold/40 backdrop-blur-xs font-semibold">
            {event.clubName}
          </Badge>
        </div>

        {/* Status Tag */}
        <div className="absolute top-3 right-3">
          <Badge variant={getStatusBadgeVariant(event.status)} size="sm" className="backdrop-blur-xs">
            {event.status}
          </Badge>
        </div>

        {/* Date Monogram badge */}
        <div className="absolute bottom-3 left-3 bg-white text-navy-900 px-3 py-1.5 rounded-lg shadow-sm border border-border text-center">
          <span className="block text-[10px] uppercase font-bold text-forest-700">
            {new Date(event.startTime).toLocaleDateString('en-US', { month: 'short' })}
          </span>
          <span className="block text-base font-serif font-bold text-navy-900 leading-none">
            {new Date(event.startTime).getDate()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-lg font-bold text-navy-900 group-hover:text-forest-700 transition line-clamp-1">
            <Link to={`/events/${event.slug || event.id}`}>{event.title}</Link>
          </h3>

          <div className="mt-3 space-y-1.5 text-xs text-ink-secondary">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-forest-700 shrink-0" />
              <span>{formatDateTime(event.startTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-navy-800 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-ink-secondary shrink-0" />
              <span>
                {event.registeredCount} / {event.capacity} seats filled
                {isFull && <span className="text-status-warning font-semibold ml-1">(Capacity Reached)</span>}
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs text-ink-secondary leading-relaxed line-clamp-2">
            {event.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-border/80 flex items-center gap-2">
          <Link to={`/events/${event.slug || event.id}`} className="flex-1">
            <Button variant="secondary" size="sm" className="w-full">
              Details
            </Button>
          </Link>

          {!isPast && onRegisterClick && (
            <Button
              variant={event.userRegistered ? 'ghost' : 'forest'}
              size="sm"
              disabled={event.userRegistered || isFull}
              onClick={() => onRegisterClick(event)}
            >
              {event.userRegistered ? 'Registered' : isFull ? 'Full' : 'RSVP'}
            </Button>
          )}

          {isPast && onFeedbackClick && event.userRegistered && (
            <Button variant="accent" size="sm" onClick={() => onFeedbackClick(event)}>
              <Star className="w-3.5 h-3.5 fill-current" />
              Review
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

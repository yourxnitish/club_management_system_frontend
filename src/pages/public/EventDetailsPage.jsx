import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { feedbackService } from '../../services/feedbackService';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { EventRegistrationModal } from '../../components/events/EventRegistrationModal';
import { EventFeedbackModal } from '../../components/events/EventFeedbackModal';
import { FeedbackCard } from '../../components/feedback/FeedbackCard';
import { formatDateTime, getStatusBadgeVariant } from '../../utils/formatters';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  CheckCircle,
  ArrowLeft,
  Share2,
  AlertCircle
} from 'lucide-react';

export function EventDetailsPage() {
  const { slugOrId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isStudent } = useAuth();

  const [event, setEvent] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const loadEvent = async () => {
    setLoading(true);
    try {
      let eventData;
      if (!isNaN(slugOrId)) {
        eventData = await eventService.getById(slugOrId);
      } else {
        eventData = await eventService.getBySlug(slugOrId);
      }
      setEvent(eventData);

      // Load feedbacks
      const reviews = await feedbackService.getForEvent(eventData.id);
      setFeedbacks(reviews || []);
    } catch (err) {
      console.error('Failed to load event details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvent();
  }, [slugOrId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-navy-900 border-t-gold rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-ink-secondary">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-navy-900">Event Not Found</h2>
        <p className="text-sm text-ink-secondary mt-2 mb-6">
          The requested collegiate activity could not be found or has concluded.
        </p>
        <Link to="/events">
          <Button variant="secondary" icon={ArrowLeft}>
            Back to Calendar
          </Button>
        </Link>
      </div>
    );
  }

  const isPast = new Date(event.startTime) < new Date();
  const isFull = event.registeredCount >= event.capacity;
  const capacityPercent = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  return (
    <div className="pb-20">
      {/* Banner */}
      <div className="relative h-72 sm:h-96 bg-navy-900 overflow-hidden">
        {event.bannerUrl ? (
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gold/20 font-serif text-6xl font-bold">
            {event.title[0]}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/50 to-transparent" />

        <div className="absolute top-6 left-6 z-10">
          <Link to="/events">
            <Button variant="secondary" size="sm" icon={ArrowLeft} className="bg-white/80 backdrop-blur-xs">
              All Events
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Card Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="bg-white rounded-xl shadow-elevated border border-border p-6 sm:p-10 mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-border">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Link to={`/clubs/${event.clubId}`}>
                  <Badge variant="gold" size="md" className="hover:underline">
                    {event.clubName}
                  </Badge>
                </Link>
                <Badge variant={getStatusBadgeVariant(event.status)} size="md">
                  {event.status}
                </Badge>
                {event.averageRating && (
                  <Badge variant="neutral" size="md">
                    <Star className="w-3.5 h-3.5 fill-gold text-gold mr-1" />
                    {event.averageRating} ({event.feedbackCount || feedbacks.length} Reviews)
                  </Badge>
                )}
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-navy-900">
                {event.title}
              </h1>
            </div>

            {/* RSVP / Review Action */}
            <div className="flex items-center gap-3">
              {!isPast && (
                event.userRegistered ? (
                  <div className="flex items-center gap-2 bg-forest-600/10 text-forest-700 px-4 py-2 rounded-lg border border-forest-600/20 font-semibold text-xs">
                    <CheckCircle className="w-4 h-4" />
                    Registered (Confirmed RSVP)
                  </div>
                ) : isStudent ? (
                  <Button
                    variant="forest"
                    size="lg"
                    disabled={isFull}
                    onClick={() => setIsRegModalOpen(true)}
                  >
                    {isFull ? 'Waitlist / Full' : 'Reserve Your Seat'}
                  </Button>
                ) : !isAuthenticated ? (
                  <Button
                    variant="forest"
                    size="lg"
                    onClick={() => navigate('/login?redirect=/events/' + (event.slug || event.id))}
                  >
                    Sign In to RSVP
                  </Button>
                ) : null
              )}

              {isPast && isStudent && event.userRegistered && (
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => setIsFeedbackModalOpen(true)}
                  icon={Star}
                >
                  Write Review
                </Button>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 text-xs text-ink-secondary">
            <div>
              <span className="block text-ink-muted uppercase tracking-wider text-[10px] mb-1">
                Scheduled Time
              </span>
              <p className="font-medium text-navy-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-forest-700 shrink-0" />
                {formatDateTime(event.startTime)}
              </p>
            </div>
            <div>
              <span className="block text-ink-muted uppercase tracking-wider text-[10px] mb-1">
                Location & Room
              </span>
              <p className="font-medium text-navy-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-navy-800 shrink-0" />
                {event.location}
              </p>
            </div>
            <div>
              <span className="block text-ink-muted uppercase tracking-wider text-[10px] mb-1">
                Registration Deadline
              </span>
              <p className="font-medium text-navy-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gold shrink-0" />
                {formatDateTime(event.registrationDeadline || event.startTime)}
              </p>
            </div>
            <div>
              <span className="block text-ink-muted uppercase tracking-wider text-[10px] mb-1">
                Seat Availability
              </span>
              <p className="font-medium text-navy-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-ink-secondary shrink-0" />
                {event.registeredCount} / {event.capacity} Registered ({capacityPercent}%)
              </p>
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  capacityPercent >= 90 ? 'bg-status-warning' : 'bg-forest-700'
                }`}
                style={{ width: `${capacityPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Event Description */}
            <Card className="p-6 sm:p-8">
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-4 pb-3 border-b border-border">
                Event Overview & Schedule
              </h3>
              <div className="prose prose-sm text-ink-primary max-w-none leading-relaxed whitespace-pre-line text-sm">
                {event.description}
              </div>
            </Card>

            {/* Attendee Reviews */}
            <div>
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-4">
                Attendee Feedback & Reviews ({feedbacks.length})
              </h3>
              {feedbacks.length === 0 ? (
                <Card className="p-8 text-center text-xs text-ink-secondary">
                  No student reviews submitted for this event yet.
                </Card>
              ) : (
                <div className="space-y-4">
                  {feedbacks.map((f) => (
                    <FeedbackCard key={f.id} feedback={f} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-5">
              <h4 className="font-serif text-base font-bold text-navy-900 mb-3">Host Society</h4>
              <p className="text-xs text-ink-secondary leading-relaxed mb-4">
                This event is presented by the <strong>{event.clubName}</strong>. Members of this club enjoy priority seating and team project access.
              </p>
              <Link to={`/clubs/${event.clubId}`}>
                <Button variant="secondary" size="sm" className="w-full">
                  Visit Club Page
                </Button>
              </Link>
            </Card>

            <Card className="p-5 bg-ivory-50/70 border-gold/30">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-navy-900">Attendance Policy</h5>
                  <p className="text-[11px] text-ink-secondary mt-1 leading-relaxed">
                    Please arrive 10 minutes prior to scheduled start time. Attendance is verified by club executives at the venue entrance.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {isRegModalOpen && (
        <EventRegistrationModal
          event={event}
          isOpen={isRegModalOpen}
          onClose={() => setIsRegModalOpen(false)}
          onSuccess={loadEvent}
        />
      )}

      {/* Feedback Modal */}
      {isFeedbackModalOpen && (
        <EventFeedbackModal
          event={event}
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          onSuccess={loadEvent}
        />
      )}
    </div>
  );
}

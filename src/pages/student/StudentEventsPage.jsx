import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationService } from '../../services/registrationService';
import { useToast } from '../../hooks/useToast';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { EventFeedbackModal } from '../../components/events/EventFeedbackModal';
import { formatDateTime, getStatusBadgeVariant } from '../../utils/formatters';
import { Calendar, MapPin, Star, Trash2, Clock, CheckCircle } from 'lucide-react';

export function StudentEventsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventForFeedback, setSelectedEventForFeedback] = useState(null);
  const toast = useToast();

  const loadRegistrations = async () => {
    setLoading(true);
    try {
      const data = await registrationService.getMyRegistrations();
      setRegistrations(data || []);
    } catch (err) {
      console.error('Failed to load registrations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  const handleCancelRegistration = async (id, eventTitle) => {
    if (!window.confirm(`Are you sure you want to cancel your registration for ${eventTitle}?`)) {
      return;
    }
    try {
      await registrationService.cancel(id);
      toast.success('Registration cancelled.');
      loadRegistrations();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel registration.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900">
            My Event RSVPs & History
          </h1>
          <p className="text-xs text-ink-secondary mt-1">
            Track confirmed registrations, upcoming schedules, and submit event evaluations.
          </p>
        </div>
        <Link to="/events">
          <Button variant="accent" size="sm" icon={Calendar}>
            Browse More Events
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-ink-secondary">
          Loading event RSVPs...
        </div>
      ) : registrations.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Event RSVPs Found"
          description="You haven't reserved a seat for any campus events yet."
          actionLabel="View Campus Calendar"
          onAction={() => window.location.href = '/events'}
        />
      ) : (
        <div className="space-y-4">
          {registrations.map((r) => {
            const isPast = new Date(r.eventStartTime) < new Date();
            return (
              <Card key={r.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-forest-700">
                      {r.clubName}
                    </span>
                    <Badge variant={getStatusBadgeVariant(r.status)} size="sm">
                      {r.status}
                    </Badge>
                    {r.attended && (
                      <Badge variant="success" size="sm">
                        <CheckCircle className="w-3 h-3 mr-1" /> Attended & Verified
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-serif text-base font-bold text-navy-900">
                    <Link to={`/events/${r.eventId}`} className="hover:text-forest-700 transition">
                      {r.eventTitle}
                    </Link>
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-ink-secondary flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-forest-700" />
                      {formatDateTime(r.eventStartTime)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-navy-800" />
                      {r.eventLocation}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <Link to={`/events/${r.eventId}`}>
                    <Button variant="secondary" size="sm">
                      Event Page
                    </Button>
                  </Link>

                  {isPast && (
                    <Button
                      variant="accent"
                      size="sm"
                      icon={Star}
                      onClick={() => setSelectedEventForFeedback({ id: r.eventId, title: r.eventTitle })}
                    >
                      Feedback
                    </Button>
                  )}

                  {!isPast && r.status === 'REGISTERED' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancelRegistration(r.id, r.eventTitle)}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Cancel RSVP
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {selectedEventForFeedback && (
        <EventFeedbackModal
          event={selectedEventForFeedback}
          isOpen={!!selectedEventForFeedback}
          onClose={() => setSelectedEventForFeedback(null)}
          onSuccess={loadRegistrations}
        />
      )}
    </div>
  );
}

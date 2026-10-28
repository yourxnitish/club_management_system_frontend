import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { useAuth } from '../../hooks/useAuth';
import { EventGrid } from '../../components/events/EventGrid';
import { EventFilter } from '../../components/events/EventFilter';
import { EventRegistrationModal } from '../../components/events/EventRegistrationModal';
import { EventFeedbackModal } from '../../components/events/EventFeedbackModal';

export function EventsDirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isStudent } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventForReg, setSelectedEventForReg] = useState(null);
  const [selectedEventForFeedback, setSelectedEventForFeedback] = useState(null);

  const search = searchParams.get('search') || '';
  const timeRange = searchParams.get('timeRange') || 'upcoming';

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getAll({
        search: search || undefined,
        upcoming: timeRange === 'upcoming' ? true : timeRange === 'past' ? false : undefined,
        status: 'PUBLISHED',
        size: 50,
      });
      setEvents(data.content || data || []);
    } catch (err) {
      console.error('Failed to load events', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search, timeRange]);

  const handleSearchChange = (val) => {
    const params = new URLSearchParams(searchParams);
    if (val) params.set('search', val);
    else params.delete('search');
    setSearchParams(params);
  };

  const handleTimeRangeChange = (val) => {
    const params = new URLSearchParams(searchParams);
    if (val) params.set('timeRange', val);
    else params.delete('timeRange');
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchParams({});
  };

  const handleRegisterClick = (event) => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/events');
      return;
    }
    setSelectedEventForReg(event);
  };

  const handleFeedbackClick = (event) => {
    setSelectedEventForFeedback(event);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title */}
      <div className="mb-8 text-center sm:text-left">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-dark block mb-1">
          Calendar of Activities
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900">
          Campus Events & Competitions
        </h1>
        <p className="mt-2 text-sm text-ink-secondary max-w-2xl">
          Participate in hackathons, symposiums, photography masterclasses, and parliamentary debates organized by recognized student societies.
        </p>
      </div>

      {/* Filter */}
      <EventFilter
        search={search}
        onSearchChange={handleSearchChange}
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        onReset={handleReset}
      />

      {/* Grid */}
      <EventGrid
        events={events}
        loading={loading}
        onRegisterClick={isStudent ? handleRegisterClick : null}
        onFeedbackClick={isStudent ? handleFeedbackClick : null}
      />

      {/* Registration Modal */}
      {selectedEventForReg && (
        <EventRegistrationModal
          event={selectedEventForReg}
          isOpen={!!selectedEventForReg}
          onClose={() => setSelectedEventForReg(null)}
          onSuccess={fetchEvents}
        />
      )}

      {/* Feedback Modal */}
      {selectedEventForFeedback && (
        <EventFeedbackModal
          event={selectedEventForFeedback}
          isOpen={!!selectedEventForFeedback}
          onClose={() => setSelectedEventForFeedback(null)}
          onSuccess={fetchEvents}
        />
      )}
    </div>
  );
}

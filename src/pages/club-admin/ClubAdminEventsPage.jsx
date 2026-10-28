import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { clubService } from '../../services/clubService';
import { eventService } from '../../services/eventService';
import { useToast } from '../../hooks/useToast';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EventForm } from '../../components/forms/EventForm';
import { formatDateTime, getStatusBadgeVariant } from '../../utils/formatters';
import { PlusCircle, Calendar, MapPin, Users, Edit3, Trash2 } from 'lucide-react';

export function ClubAdminEventsPage() {
  const [searchParams] = useSearchParams();
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(searchParams.get('create') === 'true');
  const [editingEvent, setEditingEvent] = useState(null);
  const toast = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const managedClubs = await clubService.getMyManagedClubs();
      setClubs(managedClubs || []);

      if (managedClubs && managedClubs.length > 0) {
        const eventsData = await eventService.getAll({
          clubId: managedClubs[0].id,
          size: 50,
        });
        setEvents(eventsData.content || eventsData || []);
      }
    } catch (err) {
      console.error('Failed to load events', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateEvent = async (formData) => {
    try {
      await eventService.create(formData);
      toast.success('Event published successfully!');
      setIsCreateModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to create event.');
    }
  };

  const handleCancelEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to cancel the event "${title}"?`)) {
      return;
    }
    try {
      await eventService.cancel(id);
      toast.success('Event cancelled.');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel event.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900">
            Event Management & Scheduling
          </h1>
          <p className="text-xs text-ink-secondary mt-1">
            Organize workshops, hackathons, and meetings for your assigned clubs.
          </p>
        </div>
        <Button variant="forest" size="sm" icon={PlusCircle} onClick={() => setIsCreateModalOpen(true)}>
          Create New Event
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-ink-secondary">Loading events...</div>
      ) : events.length === 0 ? (
        <Card className="p-12 text-center text-xs text-ink-secondary">
          No events created yet. Click "Create New Event" to schedule your first activity.
        </Card>
      ) : (
        <div className="space-y-4">
          {events.map((e) => (
            <Card key={e.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="gold" size="sm">
                    {e.clubName}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(e.status)} size="sm">
                    {e.status}
                  </Badge>
                </div>
                <h3 className="font-serif text-lg font-bold text-navy-900">{e.title}</h3>
                <div className="flex items-center gap-4 text-xs text-ink-secondary flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-forest-700" />
                    {formatDateTime(e.startTime)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-navy-800" />
                    {e.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-ink-secondary" />
                    {e.registeredCount} / {e.capacity} RSVPs
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  disabled={e.status === 'CANCELLED'}
                  onClick={() => handleCancelEvent(e.id, e.title)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Cancel
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Club Event"
          maxWidth="max-w-2xl"
        >
          <EventForm
            clubs={clubs}
            onSubmit={handleCreateEvent}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}

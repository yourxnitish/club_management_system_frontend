import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../components/common/Card';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { RegistrationTable } from '../../components/tables/RegistrationTable';
import { clubService } from '../../services/clubService';
import { eventService } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import { useToast } from '../../context/ToastContext';
import { Users, UserCheck, UserX, Calendar, CheckCircle } from 'lucide-react';

export default function ClubAdminAttendancePage() {
  const { showToast } = useToast();
  const [clubs, setClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  
  const [registrations, setRegistrations] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  // Load clubs managed by this admin
  useEffect(() => {
    async function fetchClubs() {
      try {
        setLoadingClubs(true);
        const data = await clubService.getMyClubs();
        setClubs(data || []);
        if (data && data.length > 0) {
          setSelectedClubId(String(data[0].id));
        }
      } catch (err) {
        showToast('Failed to load managed clubs', 'error');
      } finally {
        setLoadingClubs(false);
      }
    }
    fetchClubs();
  }, [showToast]);

  // Load events for selected club
  useEffect(() => {
    if (!selectedClubId) {
      setEvents([]);
      setSelectedEventId('');
      return;
    }

    async function fetchClubEvents() {
      try {
        setLoadingEvents(true);
        const data = await eventService.getByClub(selectedClubId, { page: 0, size: 50 });
        const eventList = data.content || [];
        setEvents(eventList);
        if (eventList.length > 0) {
          setSelectedEventId(String(eventList[0].id));
        } else {
          setSelectedEventId('');
          setRegistrations([]);
        }
      } catch (err) {
        showToast('Failed to load events for this club', 'error');
      } finally {
        setLoadingEvents(false);
      }
    }
    fetchClubEvents();
  }, [selectedClubId, showToast]);

  // Load registrations for selected event
  const fetchRegistrations = useCallback(async () => {
    if (!selectedEventId) {
      setRegistrations([]);
      return;
    }
    try {
      setLoadingRegistrations(true);
      const data = await registrationService.getEventRegistrations(selectedEventId, { page, size: 10 });
      setRegistrations(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      showToast('Failed to load event registrations', 'error');
    } finally {
      setLoadingRegistrations(false);
    }
  }, [selectedEventId, page, showToast]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const handleToggleAttendance = async (registrationId, attended) => {
    try {
      await registrationService.updateAttendance(registrationId, attended);
      showToast(attended ? 'Attendee marked as present' : 'Attendee marked as absent', 'success');
      fetchRegistrations();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update attendance status', 'error');
    }
  };

  const selectedEvent = events.find((e) => String(e.id) === String(selectedEventId));
  const attendedCount = registrations.filter((r) => r.attended).length;
  const totalCount = registrations.length;
  const attendanceRate = totalCount > 0 ? Math.round((attendedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-navy-900">Attendance Verification</h1>
        <p className="text-sm text-ink-secondary mt-1">
          Review event check-ins and verify student attendance records in real time.
        </p>
      </div>

      {/* Selectors */}
      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary mb-1">
              Select Club
            </label>
            {loadingClubs ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={selectedClubId}
                onChange={(e) => {
                  setSelectedClubId(e.target.value);
                  setPage(0);
                }}
                disabled={clubs.length === 0}
              >
                {clubs.length === 0 && <option value="">No managed clubs found</option>}
                {clubs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.category})
                  </option>
                ))}
              </Select>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary mb-1">
              Select Event
            </label>
            {loadingEvents ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={selectedEventId}
                onChange={(e) => {
                  setSelectedEventId(e.target.value);
                  setPage(0);
                }}
                disabled={events.length === 0}
              >
                {events.length === 0 && <option value="">No events found for this club</option>}
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} — {new Date(ev.startTime).toLocaleDateString()}
                  </option>
                ))}
              </Select>
            )}
          </div>
        </div>
      </Card>

      {/* Event Overview & Quick Stats */}
      {selectedEvent && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-navy-900/10 text-navy-900 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-ink-secondary">Event Capacity</p>
              <p className="text-lg font-bold text-navy-900">
                {selectedEvent.registrationCount} / {selectedEvent.capacity}
              </p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-ink-secondary">Page Attendees</p>
              <p className="text-lg font-bold text-navy-900">{totalCount}</p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-forest/10 text-forest flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-ink-secondary">Verified Present</p>
              <p className="text-lg font-bold text-forest">{attendedCount}</p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-ink-secondary">Attendance Rate</p>
              <p className="text-lg font-bold text-navy-900">{attendanceRate}%</p>
            </div>
          </Card>
        </div>
      )}

      {/* Registrations & Attendance Table */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-navy-900">Registered Students</h2>
            <p className="text-xs text-ink-secondary mt-0.5">
              Click &quot;Mark Present&quot; to verify student participation or &quot;Mark Absent&quot; to revoke verification.
            </p>
          </div>
          {selectedEvent && (
            <Badge variant="navy">Status: {selectedEvent.status}</Badge>
          )}
        </div>

        <RegistrationTable
          registrations={registrations}
          loading={loadingRegistrations}
          onToggleAttendance={handleToggleAttendance}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
}

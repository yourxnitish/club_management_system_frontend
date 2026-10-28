import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { statService } from '../../services/statService';
import { membershipService } from '../../services/membershipService';
import { registrationService } from '../../services/registrationService';
import { announcementService } from '../../services/announcementService';
import { StatCard } from '../../components/dashboard/StatCard';
import { MembershipStatusWidget } from '../../components/dashboard/MembershipStatusWidget';
import { QuickActionsWidget } from '../../components/dashboard/QuickActionsWidget';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatDateTime, getStatusBadgeVariant } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import {
  Compass,
  Calendar,
  CheckSquare,
  Clock,
  Bell,
  ArrowRight
} from 'lucide-react';

export function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [statsData, mems, regs, anncs] = await Promise.all([
          statService.getDashboardStats(),
          membershipService.getMyMemberships(),
          registrationService.getMyRegistrations(),
          announcementService.getFeed(4),
        ]);
        setStats(statsData);
        setMemberships(mems || []);
        setRegistrations(regs || []);
        setAnnouncements(anncs || []);
      } catch (err) {
        console.error('Failed to load student dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-xl p-6 sm:p-8 text-white shadow-elevated border border-gold/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-1">
            Student Involvement Portal
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Welcome, {user?.fullName || 'Student'}
          </h2>
          <p className="text-xs text-gray-300 mt-1 max-w-xl">
            Track your collegiate affiliations, register for campus competitions, and view verified attendance records.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/clubs">
            <Button variant="accent" size="sm">
              Discover Clubs
            </Button>
          </Link>
          <Link to="/events">
            <Button variant="secondary" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Find Events
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Memberships"
          value={stats?.myJoinedClubsCount ?? 0}
          subtitle="Official society rosters"
          icon={Compass}
          color="navy"
        />
        <StatCard
          title="Events Registered"
          value={stats?.myRegisteredEventsCount ?? 0}
          subtitle="RSVPs on record"
          icon={Calendar}
          color="forest"
        />
        <StatCard
          title="Events Attended"
          value={stats?.myAttendedEventsCount ?? 0}
          subtitle="Verified check-ins"
          icon={CheckSquare}
          color="gold"
        />
        <StatCard
          title="Pending Applications"
          value={stats?.myPendingRequestsCount ?? 0}
          subtitle="Awaiting club review"
          icon={Clock}
          color="blue"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Event RSVPs */}
          <Card>
            <CardHeader
              title="My Upcoming Event RSVPs"
              subtitle="Scheduled campus events you are attending"
              action={
                <Link to="/student/events" className="text-xs text-forest-700 hover:text-forest-800 font-semibold flex items-center gap-1">
                  All Registrations <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              }
            />
            <CardBody className="p-0">
              {registrations.length === 0 ? (
                <div className="p-8 text-center text-xs text-ink-secondary">
                  You have not registered for any upcoming events.{' '}
                  <Link to="/events" className="text-forest-700 font-semibold hover:underline">
                    Browse the calendar
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {registrations.slice(0, 4).map((r) => (
                    <div key={r.id} className="p-4 flex items-center justify-between gap-4">
                      <div>
                        <h5 className="text-xs font-bold text-navy-900">{r.eventTitle}</h5>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-ink-secondary">
                          <span>{r.clubName}</span>
                          <span>•</span>
                          <span>{formatDateTime(r.eventStartTime)}</span>
                          <span>•</span>
                          <span>{r.eventLocation}</span>
                        </div>
                      </div>
                      <Badge variant={getStatusBadgeVariant(r.status)}>{r.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Announcements Feed */}
          <Card>
            <CardHeader
              title="Campus & Society Announcements"
              subtitle="Notices broadcasted to your clubs and university"
              action={
                <Link to="/student/announcements" className="text-xs text-forest-700 hover:text-forest-800 font-semibold flex items-center gap-1">
                  View Notice Board <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              }
            />
            <CardBody className="p-0">
              {announcements.length === 0 ? (
                <div className="p-8 text-center text-xs text-ink-secondary">
                  No announcements at this time.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {announcements.map((a) => (
                    <div key={a.id} className="p-4 hover:bg-ivory/50 transition">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-forest-700">
                          {a.clubName ? a.clubName : 'University Broadcast'}
                        </span>
                        <Badge variant={getStatusBadgeVariant(a.priority)} size="sm">
                          {a.priority}
                        </Badge>
                      </div>
                      <h5 className="text-xs font-bold text-navy-900">{a.title}</h5>
                      <p className="text-xs text-ink-secondary mt-1 line-clamp-2 leading-relaxed">
                        {a.content}
                      </p>
                      <span className="block text-[10px] text-ink-muted mt-2">
                        {formatDateTime(a.createdAt)} • By {a.authorName}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          <MembershipStatusWidget memberships={memberships} />
          <QuickActionsWidget />
        </div>
      </div>
    </div>
  );
}

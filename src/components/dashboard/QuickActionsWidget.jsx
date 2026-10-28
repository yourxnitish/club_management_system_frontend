import React from 'react';
import { Card, CardHeader, CardBody } from '../common/Card';
import { Link } from 'react-router-dom';
import { Compass, Calendar, User, Bell, PlusCircle, CheckSquare } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../constants/roles';

export function QuickActionsWidget() {
  const { user } = useAuth();

  const getActions = () => {
    if (user?.role === ROLES.SYSTEM_ADMIN) {
      return [
        { label: 'Create New Club', path: '/admin/clubs?create=true', icon: PlusCircle, color: 'text-forest-700 bg-forest-600/10' },
        { label: 'Manage Users', path: '/admin/users', icon: User, color: 'text-navy-900 bg-navy-900/10' },
        { label: 'Assign Club Admins', path: '/admin/assignments', icon: Compass, color: 'text-gold-dark bg-gold/15' },
        { label: 'System Audit Logs', path: '/admin/logs', icon: Bell, color: 'text-status-info bg-status-info/10' },
      ];
    }
    if (user?.role === ROLES.CLUB_ADMIN) {
      return [
        { label: 'Create Club Event', path: '/club-admin/events?create=true', icon: PlusCircle, color: 'text-forest-700 bg-forest-600/10' },
        { label: 'Review Join Requests', path: '/club-admin/members', icon: User, color: 'text-navy-900 bg-navy-900/10' },
        { label: 'Take Attendance', path: '/club-admin/attendance', icon: CheckSquare, color: 'text-gold-dark bg-gold/15' },
        { label: 'Publish Announcement', path: '/club-admin/announcements?create=true', icon: Bell, color: 'text-status-info bg-status-info/10' },
      ];
    }
    // STUDENT
    return [
      { label: 'Discover New Clubs', path: '/clubs', icon: Compass, color: 'text-forest-700 bg-forest-600/10' },
      { label: 'Upcoming Campus Events', path: '/events', icon: Calendar, color: 'text-navy-900 bg-navy-900/10' },
      { label: 'My Event RSVPs', path: '/student/events', icon: CheckSquare, color: 'text-gold-dark bg-gold/15' },
      { label: 'Campus Announcements', path: '/student/announcements', icon: Bell, color: 'text-status-info bg-status-info/10' },
    ];
  };

  const actions = getActions();

  return (
    <Card>
      <CardHeader title="Quick Actions" subtitle="Frequently used shortcuts for your account" />
      <CardBody className="grid grid-cols-2 gap-3 p-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.label}
              to={act.path}
              className="p-3 rounded-lg border border-border hover:border-navy-900/30 hover:bg-ivory/60 transition flex flex-col items-start gap-2.5 group"
            >
              <div className={`p-2 rounded-md ${act.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-navy-900 group-hover:text-forest-700 transition">
                {act.label}
              </span>
            </Link>
          );
        })}
      </CardBody>
    </Card>
  );
}

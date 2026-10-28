import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES, ROLE_LABELS } from '../../constants/roles';
import {
  LayoutDashboard,
  Users,
  Compass,
  Calendar,
  CheckSquare,
  Bell,
  User,
  Shield,
  FileText,
  MessageSquare,
  Award,
  Layers,
  LogOut,
  X
} from 'lucide-react';

export function DashboardSidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();

  const getLinks = () => {
    if (user?.role === ROLES.SYSTEM_ADMIN) {
      return [
        { label: 'Platform Overview', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'User Directory', path: '/admin/users', icon: Users },
        { label: 'Manage All Clubs', path: '/admin/clubs', icon: Compass },
        { label: 'Club Admin Assignments', path: '/admin/assignments', icon: Award },
        { label: 'System Audit Logs', path: '/admin/logs', icon: Layers },
        { label: 'Administrative Reports', path: '/admin/reports', icon: FileText },
      ];
    }

    if (user?.role === ROLES.CLUB_ADMIN) {
      return [
        { label: 'Club Operations', path: '/club-admin/dashboard', icon: LayoutDashboard },
        { label: 'Managed Clubs', path: '/club-admin/clubs', icon: Compass },
        { label: 'Membership Requests', path: '/club-admin/members', icon: Users },
        { label: 'Club Events & RSVP', path: '/club-admin/events', icon: Calendar },
        { label: 'Record Attendance', path: '/club-admin/attendance', icon: CheckSquare },
        { label: 'Publish Announcements', path: '/club-admin/announcements', icon: Bell },
        { label: 'Member Feedback', path: '/club-admin/feedback', icon: MessageSquare },
      ];
    }

    // Default: STUDENT
    return [
      { label: 'Student Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
      { label: 'My Club Memberships', path: '/student/clubs', icon: Compass },
      { label: 'My Event RSVPs', path: '/student/events', icon: Calendar },
      { label: 'Attendance Records', path: '/student/attendance', icon: CheckSquare },
      { label: 'Announcements Feed', path: '/student/announcements', icon: Bell },
      { label: 'Student Profile', path: '/student/profile', icon: User },
    ];
  };

  const links = getLinks();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-navy-900 text-white">
      {/* Brand Header */}
      <div className="p-6 border-b border-navy-800 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-navy-800 border border-gold/40 flex items-center justify-center text-gold">
            <Shield className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h2 className="font-serif text-sm font-bold text-white tracking-tight">College Club</h2>
            <span className="text-[10px] uppercase tracking-widest text-gold-dark font-medium block">
              University Portal
            </span>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User Badge */}
      <div className="p-4 mx-4 my-4 rounded-lg bg-navy-800/60 border border-navy-700/50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold font-semibold text-sm">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
          ) : (
            user?.firstName?.[0] || 'U'
          )}
        </div>
        <div className="overflow-hidden">
          <h4 className="text-xs font-semibold text-white truncate">{user?.fullName}</h4>
          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-gold/15 text-gold-light mt-0.5">
            {ROLE_LABELS[user?.role] || user?.role}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gold text-navy-900 font-semibold shadow-xs'
                    : 'text-gray-300 hover:bg-navy-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Public Link & Logout */}
      <div className="p-4 border-t border-navy-800 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-400 hover:text-gold transition rounded"
        >
          <Compass className="w-4 h-4" />
          <span>Public Campus Portal</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 transition rounded"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30 shadow-elevated">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-navy-900/60 backdrop-blur-xs" onClick={onClose} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-navy-900">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

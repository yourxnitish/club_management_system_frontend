import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';

// Layouts
import { PublicLayout } from '../components/layout/PublicLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

// Public Pages (Named Exports)
import { HomePage } from '../pages/public/HomePage';
import { ClubsDirectoryPage } from '../pages/public/ClubsDirectoryPage';
import { ClubDetailsPage } from '../pages/public/ClubDetailsPage';
import { EventsDirectoryPage } from '../pages/public/EventsDirectoryPage';
import { EventDetailsPage } from '../pages/public/EventDetailsPage';
import { AboutPage } from '../pages/public/AboutPage';

// Auth Pages (Named Exports)
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { UnauthorizedPage } from '../pages/auth/UnauthorizedPage';

// Student Pages (Named Exports)
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { StudentClubsPage } from '../pages/student/StudentClubsPage';
import { StudentEventsPage } from '../pages/student/StudentEventsPage';
import { StudentAttendancePage } from '../pages/student/StudentAttendancePage';
import { StudentAnnouncementsPage } from '../pages/student/StudentAnnouncementsPage';
import { StudentProfilePage } from '../pages/student/StudentProfilePage';

// Club Admin Pages
import { ClubAdminDashboard } from '../pages/club-admin/ClubAdminDashboard';
import { ClubAdminClubsPage } from '../pages/club-admin/ClubAdminClubsPage';
import { ClubAdminMembersPage } from '../pages/club-admin/ClubAdminMembersPage';
import { ClubAdminEventsPage } from '../pages/club-admin/ClubAdminEventsPage';
import ClubAdminAttendancePage from '../pages/club-admin/ClubAdminAttendancePage';
import ClubAdminAnnouncementsPage from '../pages/club-admin/ClubAdminAnnouncementsPage';
import ClubAdminFeedbackPage from '../pages/club-admin/ClubAdminFeedbackPage';

// System Admin Pages (Default Exports)
import SystemAdminDashboard from '../pages/system-admin/SystemAdminDashboard';
import SystemAdminUsersPage from '../pages/system-admin/SystemAdminUsersPage';
import SystemAdminClubsPage from '../pages/system-admin/SystemAdminClubsPage';
import SystemAdminAssignmentsPage from '../pages/system-admin/SystemAdminAssignmentsPage';
import SystemAdminLogsPage from '../pages/system-admin/SystemAdminLogsPage';
import SystemAdminReportsPage from '../pages/system-admin/SystemAdminReportsPage';

// Error Pages (Default Exports)
import NotFoundPage from '../pages/errors/NotFoundPage';
import ServerErrorPage from '../pages/errors/ServerErrorPage';

function DashboardIndexRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === ROLES.SYSTEM_ADMIN) return <Navigate to="/system-admin/dashboard" replace />;
  if (user.role === ROLES.CLUB_ADMIN) return <Navigate to="/club-admin/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages with PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/clubs" element={<ClubsDirectoryPage />} />
        <Route path="/clubs/:slug" element={<ClubDetailsPage />} />
        <Route path="/events" element={<EventsDirectoryPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>

      {/* Auth Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/server-error" element={<ServerErrorPage />} />

      {/* Authenticated Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Dynamic /dashboard redirector */}
        <Route path="/dashboard" element={<DashboardIndexRedirect />} />

        {/* Dashboard Shell */}
        <Route element={<DashboardLayout />}>
          {/* Student Hub */}
          <Route
            element={
              <RoleRoute allowedRoles={[ROLES.STUDENT, ROLES.CLUB_ADMIN, ROLES.SYSTEM_ADMIN]} />
            }
          >
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/clubs" element={<StudentClubsPage />} />
            <Route path="/student/events" element={<StudentEventsPage />} />
            <Route path="/student/attendance" element={<StudentAttendancePage />} />
            <Route path="/student/announcements" element={<StudentAnnouncementsPage />} />
            <Route path="/student/profile" element={<StudentProfilePage />} />
          </Route>

          {/* Club Administrator Operations */}
          <Route
            element={<RoleRoute allowedRoles={[ROLES.CLUB_ADMIN, ROLES.SYSTEM_ADMIN]} />}
          >
            <Route path="/club-admin/dashboard" element={<ClubAdminDashboard />} />
            <Route path="/club-admin/clubs" element={<ClubAdminClubsPage />} />
            <Route path="/club-admin/members" element={<ClubAdminMembersPage />} />
            <Route path="/club-admin/events" element={<ClubAdminEventsPage />} />
            <Route path="/club-admin/attendance" element={<ClubAdminAttendancePage />} />
            <Route path="/club-admin/announcements" element={<ClubAdminAnnouncementsPage />} />
            <Route path="/club-admin/feedback" element={<ClubAdminFeedbackPage />} />
          </Route>

          {/* System Administrator Governance */}
          <Route element={<RoleRoute allowedRoles={[ROLES.SYSTEM_ADMIN]} />}>
            <Route path="/system-admin/dashboard" element={<SystemAdminDashboard />} />
            <Route path="/system-admin/users" element={<SystemAdminUsersPage />} />
            <Route path="/system-admin/clubs" element={<SystemAdminClubsPage />} />
            <Route path="/system-admin/assignments" element={<SystemAdminAssignmentsPage />} />
            <Route path="/system-admin/logs" element={<SystemAdminLogsPage />} />
            <Route path="/system-admin/reports" element={<SystemAdminReportsPage />} />
          </Route>
        </Route>
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { StatCard } from '../../components/dashboard/StatCard';
import { RecentActivityList } from '../../components/dashboard/RecentActivityList';
import { statService } from '../../services/statService';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Compass,
  Calendar,
  ClipboardList,
  Star,
  Activity,
  ShieldCheck,
  Building,
  UserPlus,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const CATEGORY_COLORS = ['#14243A', '#246B50', '#C6A15B', '#203750', '#2F5F9F', '#7C3AED'];

export default function SystemAdminDashboard() {
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await statService.getDashboardStats();
        setStats(data);
      } catch (err) {
        showToast('Failed to load system dashboard telemetry', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [showToast]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  // Prepare chart data
  const categoryData = stats?.clubsByCategory
    ? Object.entries(stats.clubsByCategory).map(([name, value]) => ({ name, value }))
    : [];

  const trendData = stats?.monthlyRegistrationsTrend || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-navy-900 text-white rounded-xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-navy-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> System Governance Console
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Institutional Oversight & Management
          </h1>
          <p className="text-sm text-gray-300 mt-2 leading-relaxed">
            Monitor university club governance, approve organizations, manage role assignments, and review campus-wide student participation analytics.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Building}
          label="Registered Clubs"
          value={stats?.totalClubs || 0}
          helperText={`${stats?.activeClubs || 0} active & approved`}
          variant="primary"
        />
        <StatCard
          icon={Users}
          label="Total Student Body"
          value={stats?.totalStudents || 0}
          helperText="Enrolled university accounts"
          variant="forest"
        />
        <StatCard
          icon={Calendar}
          label="Campus Events"
          value={stats?.totalEvents || 0}
          helperText={`${stats?.upcomingEvents || 0} scheduled upcoming`}
          variant="gold"
        />
        <StatCard
          icon={Star}
          label="Campus Satisfaction"
          value={`${stats?.averageFeedbackRating?.toFixed(1) || '0.0'} / 5.0`}
          helperText="Average post-event review rating"
          variant="navy"
        />
      </div>

      {/* Quick Admin Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/system-admin/users"
          className="p-4 bg-white border border-border rounded-lg shadow-sm hover:border-navy-900 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-navy-900/10 text-navy-900 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-navy-900 group-hover:text-gold transition-colors">
                Manage User Directory
              </h4>
              <p className="text-xs text-ink-secondary">Review roles and account statuses</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-ink-secondary group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/system-admin/clubs"
          className="p-4 bg-white border border-border rounded-lg shadow-sm hover:border-forest transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-forest/10 text-forest flex items-center justify-center font-bold">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-navy-900 group-hover:text-forest transition-colors">
                Register / Edit Clubs
              </h4>
              <p className="text-xs text-ink-secondary">Charter new university clubs</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-ink-secondary group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/system-admin/assignments"
          className="p-4 bg-white border border-border rounded-lg shadow-sm hover:border-gold transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-navy-900 group-hover:text-gold transition-colors">
                Assign Club Admins
              </h4>
              <p className="text-xs text-ink-secondary">Delegate leadership permissions</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-ink-secondary group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <div>
              <h3 className="font-serif text-lg font-bold text-navy-900">Clubs by Category</h3>
              <p className="text-xs text-ink-secondary">Distribution of registered university student organizations</p>
            </div>
          </div>
          {categoryData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.name} (${entry.value})`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-xs text-ink-secondary py-16 text-center">No category telemetry available.</p>
          )}
        </Card>

        {/* Monthly Registration Trends */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <div>
              <h3 className="font-serif text-lg font-bold text-navy-900">Registration Activity Trends</h3>
              <p className="text-xs text-ink-secondary">RSVP volume across recent academic terms</p>
            </div>
          </div>
          {trendData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <XAxis dataKey="month" stroke="#697586" fontSize={11} />
                  <YAxis stroke="#697586" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#14243A',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="registrations" fill="#246B50" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-xs text-ink-secondary py-16 text-center">No registration trend records found.</p>
          )}
        </Card>
      </div>

      {/* Platform Recent Audit Trail */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
          <div>
            <h3 className="font-serif text-lg font-bold text-navy-900">Institutional Activity Log</h3>
            <p className="text-xs text-ink-secondary">Recent administrative and user actions across the platform</p>
          </div>
          <Link to="/system-admin/logs" className="text-xs font-semibold text-navy-900 hover:text-gold flex items-center gap-1">
            View full log <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <RecentActivityList activities={stats?.recentActivities || []} />
      </Card>
    </div>
  );
}

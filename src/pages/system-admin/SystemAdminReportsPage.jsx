import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { statService } from '../../services/statService';
import { useToast } from '../../context/ToastContext';
import {
  FileText,
  Download,
  Printer,
  TrendingUp,
  Award,
  Users,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export default function SystemAdminReportsPage() {
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const data = await statService.getDashboardStats();
        setStats(data);
      } catch (err) {
        showToast('Failed to load analytical reports', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [showToast]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const categoryData = stats?.clubsByCategory
    ? Object.entries(stats.clubsByCategory).map(([name, count]) => ({ name, count }))
    : [];

  return (
    <div className="space-y-8 print:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy-900">
            Institutional Engagement Reports
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            Official summary metrics of student involvement, club performance, and campus event outcomes.
          </p>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <Button variant="secondary" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" /> Print Summary
          </Button>
        </div>
      </div>

      {/* KPI Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-t-4 border-t-navy-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
            Verified Student Body
          </p>
          <p className="text-2xl font-bold text-navy-900 mt-2">{stats?.totalStudents || 0}</p>
          <p className="text-[11px] text-ink-secondary mt-1">Active student accounts</p>
        </Card>

        <Card className="p-5 border-t-4 border-t-forest">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
            Campus Clubs Chartered
          </p>
          <p className="text-2xl font-bold text-forest mt-2">{stats?.totalClubs || 0}</p>
          <p className="text-[11px] text-ink-secondary mt-1">
            {stats?.activeClubs || 0} currently in active standing
          </p>
        </Card>

        <Card className="p-5 border-t-4 border-t-gold">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
            Attendance Verification Rate
          </p>
          <p className="text-2xl font-bold text-navy-900 mt-2">
            {stats?.overallAttendanceRate ? `${stats.overallAttendanceRate.toFixed(1)}%` : '0%'}
          </p>
          <p className="text-[11px] text-ink-secondary mt-1">
            {stats?.totalAttendance || 0} verified check-ins of {stats?.totalRegistrations || 0} RSVPs
          </p>
        </Card>

        <Card className="p-5 border-t-4 border-t-blue-600">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
            Average Experience Score
          </p>
          <p className="text-2xl font-bold text-navy-900 mt-2">
            {stats?.averageFeedbackRating ? `${stats.averageFeedbackRating.toFixed(1)} / 5.0` : 'N/A'}
          </p>
          <p className="text-[11px] text-ink-secondary mt-1">Based on student post-event ratings</p>
        </Card>
      </div>

      {/* Breakdown Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Table */}
        <Card className="p-6">
          <h3 className="font-serif text-lg font-bold text-navy-900 mb-2">
            Clubs by Academic & Interest Category
          </h3>
          <p className="text-xs text-ink-secondary mb-4">
            Total chartered student organizations segmented by academic discipline and extracurricular domain.
          </p>
          <div className="divide-y divide-border">
            {categoryData.map((item) => (
              <div key={item.name} className="py-2.5 flex items-center justify-between text-xs">
                <span className="font-semibold text-navy-900">{item.name}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-navy-900/10 text-navy-900 font-bold">
                  {item.count} {item.count === 1 ? 'Club' : 'Clubs'}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* High Participation Organizations */}
        <Card className="p-6">
          <h3 className="font-serif text-lg font-bold text-navy-900 mb-2">
            Top University Organizations
          </h3>
          <p className="text-xs text-ink-secondary mb-4">
            Organizations with leading student membership rosters and active campus engagement.
          </p>
          <div className="divide-y divide-border">
            {stats?.topClubs && stats.topClubs.length > 0 ? (
              stats.topClubs.map((club, idx) => (
                <div key={club.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold font-bold text-[10px] flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="font-semibold text-navy-900">{club.name}</span>
                  </div>
                  <span className="text-ink-secondary">
                    {club.memberCount || 0} members • {club.eventCount || 0} events
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-ink-secondary py-8 text-center">
                No active club statistics recorded.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

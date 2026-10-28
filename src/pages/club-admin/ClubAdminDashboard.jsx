import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { statService } from '../../services/statService';
import { clubService } from '../../services/clubService';
import { membershipService } from '../../services/membershipService';
import { StatCard } from '../../components/dashboard/StatCard';
import { QuickActionsWidget } from '../../components/dashboard/QuickActionsWidget';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { MemberTable } from '../../components/tables/MemberTable';
import { useToast } from '../../hooks/useToast';
import { Link } from 'react-router-dom';
import {
  Compass,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  Shield,
  PlusCircle
} from 'lucide-react';

export function ClubAdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [managedClubs, setManagedClubs] = useState([]);
  const [pendingMemberships, setPendingMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, clubs] = await Promise.all([
        statService.getDashboardStats(),
        clubService.getMyManagedClubs(),
      ]);
      setStats(statsData);
      setManagedClubs(clubs || []);

      if (clubs && clubs.length > 0) {
        const memData = await membershipService.getClubMemberships(clubs[0].id, { status: 'PENDING', size: 5 });
        setPendingMemberships(memData.content || memData || []);
      }
    } catch (err) {
      console.error('Failed to load club admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await membershipService.review(id, 'APPROVED');
      toast.success('Membership request approved.');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Approval failed.');
    }
  };

  const handleReject = async (id) => {
    try {
      await membershipService.review(id, 'REJECTED');
      toast.success('Membership request rejected.');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Rejection failed.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-xl p-6 sm:p-8 text-white shadow-elevated border border-gold/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-1">
            Executive Leadership Portal
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Club Operations: {user?.fullName}
          </h2>
          <p className="text-xs text-gray-300 mt-1 max-w-xl">
            Manage your assigned organizations, review prospective student applicants, coordinate events, and publish society news.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/club-admin/events">
            <Button variant="accent" size="sm" icon={PlusCircle}>
              Schedule Event
            </Button>
          </Link>
          <Link to="/club-admin/members">
            <Button variant="secondary" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Review Members
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Assigned Clubs"
          value={stats?.myManagedClubsCount ?? managedClubs.length}
          subtitle="Clubs under your oversight"
          icon={Compass}
          color="navy"
        />
        <StatCard
          title="Total Club Members"
          value={stats?.totalMembers ?? 0}
          subtitle="Approved active members"
          icon={Users}
          color="forest"
        />
        <StatCard
          title="Pending Join Requests"
          value={stats?.pendingMembershipRequestsCount ?? pendingMemberships.length}
          subtitle="Require executive decision"
          icon={Clock}
          color="gold"
        />
        <StatCard
          title="Campus Events"
          value={stats?.totalEvents ?? 0}
          subtitle="Organized this term"
          icon={Calendar}
          color="blue"
        />
      </div>

      {/* 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Managed Clubs Overview */}
          <Card>
            <CardHeader
              title="My Assigned Student Organizations"
              subtitle="Societies you currently direct as verified administrator"
              action={
                <Link to="/club-admin/clubs" className="text-xs text-forest-700 hover:text-forest-800 font-semibold flex items-center gap-1">
                  Manage Settings <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              }
            />
            <CardBody className="p-0">
              {managedClubs.length === 0 ? (
                <div className="p-8 text-center text-xs text-ink-secondary">
                  No clubs currently assigned to your account.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {managedClubs.map((club) => (
                    <div key={club.id} className="p-5 flex items-center justify-between gap-4 hover:bg-ivory/50 transition">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-navy-900 text-gold flex items-center justify-center font-serif text-lg font-bold shrink-0">
                          {club.logoUrl ? (
                            <img src={club.logoUrl} alt={club.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            club.name[0]
                          )}
                        </div>
                        <div>
                          <h4 className="font-serif text-base font-bold text-navy-900">{club.name}</h4>
                          <span className="text-xs text-ink-secondary block mt-0.5">
                            {club.category} • {club.memberCount || 0} Members • {club.location || 'Campus'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link to={`/club-admin/events?clubId=${club.id}`}>
                          <Button variant="secondary" size="sm">
                            Events
                          </Button>
                        </Link>
                        <Link to={`/club-admin/members?clubId=${club.id}`}>
                          <Button variant="forest" size="sm">
                            Roster
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Pending Applications Quick Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-lg font-bold text-navy-900">
                Pending Membership Applications
              </h3>
              <Link to="/club-admin/members" className="text-xs text-forest-700 font-semibold hover:underline">
                View Full Roster &rarr;
              </Link>
            </div>
            <MemberTable
              memberships={pendingMemberships}
              loading={loading}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActionsWidget />

          <Card className="p-5 bg-ivory-50/70 border-gold/30">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-navy-900">Executive Responsibilities</h4>
                <p className="text-[11px] text-ink-secondary mt-1 leading-relaxed">
                  Club administrators are responsible for reviewing student membership applications within 7 calendar days and recording physical attendance after each scheduled club workshop.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

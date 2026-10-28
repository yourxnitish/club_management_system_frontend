import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { clubService } from '../../services/clubService';
import { eventService } from '../../services/eventService';
import { membershipService } from '../../services/membershipService';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { EventCard } from '../../components/events/EventCard';
import { MembershipRequestModal } from '../../components/clubs/MembershipRequestModal';
import { getStatusBadgeVariant } from '../../utils/formatters';
import {
  Calendar,
  MapPin,
  Mail,
  Users,
  Clock,
  Star,
  CheckCircle,
  ArrowLeft,
  Shield
} from 'lucide-react';

export function ClubDetailsPage() {
  const { slugOrId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isStudent } = useAuth();

  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membershipStatus, setMembershipStatus] = useState(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  useEffect(() => {
    async function loadClubData() {
      setLoading(true);
      try {
        let clubData;
        if (!isNaN(slugOrId)) {
          clubData = await clubService.getById(slugOrId);
        } else {
          clubData = await clubService.getBySlug(slugOrId);
        }
        setClub(clubData);

        // Load upcoming events for this club
        const eventData = await eventService.getAll({
          clubId: clubData.id,
          upcoming: true,
          status: 'PUBLISHED',
          size: 6,
        });
        setEvents(eventData.content || eventData || []);

        // If authenticated student, check membership status
        if (isAuthenticated && isStudent) {
          const memberships = await membershipService.getMyMemberships();
          const existing = memberships.find((m) => m.clubId === clubData.id);
          if (existing) {
            setMembershipStatus(existing.status);
          }
        }
      } catch (err) {
        console.error('Failed to load club details', err);
      } finally {
        setLoading(false);
      }
    }
    loadClubData();
  }, [slugOrId, isAuthenticated, isStudent]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-navy-900 border-t-gold rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-ink-secondary">Loading club charter and activities...</p>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-navy-900">Club Not Found</h2>
        <p className="text-sm text-ink-secondary mt-2 mb-6">
          The requested collegiate organization could not be located.
        </p>
        <Link to="/clubs">
          <Button variant="secondary" icon={ArrowLeft}>
            Back to Directory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Banner Header */}
      <div className="relative h-72 sm:h-96 bg-navy-900 overflow-hidden">
        {club.bannerUrl ? (
          <img
            src={club.bannerUrl}
            alt={club.name}
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gold/20 font-serif text-6xl font-bold">
            {club.name[0]}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/50 to-transparent" />

        {/* Back link */}
        <div className="absolute top-6 left-6 z-10">
          <Link to="/clubs">
            <Button variant="secondary" size="sm" icon={ArrowLeft} className="bg-white/80 backdrop-blur-xs">
              All Clubs
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Profile Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="bg-white rounded-xl shadow-elevated border border-border p-6 sm:p-10 mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-border">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-navy-900 text-gold border-2 border-white shadow-lg overflow-hidden flex items-center justify-center font-serif text-3xl font-bold shrink-0">
                {club.logoUrl ? (
                  <img src={club.logoUrl} alt={club.name} className="w-full h-full object-cover" />
                ) : (
                  club.name[0]
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <Badge variant="gold" size="md">
                    {club.category}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(club.status)} size="md">
                    {club.status}
                  </Badge>
                </div>
                <h1 className="font-serif text-2xl sm:text-4xl font-bold text-navy-900">
                  {club.name}
                </h1>
              </div>
            </div>

            {/* Join CTA */}
            <div>
              {membershipStatus ? (
                <div className="flex items-center gap-2 bg-ivory px-4 py-2 rounded-lg border border-border">
                  <span className="text-xs text-ink-secondary">Membership Status:</span>
                  <Badge variant={getStatusBadgeVariant(membershipStatus)} size="md">
                    {membershipStatus}
                  </Badge>
                </div>
              ) : isStudent ? (
                <Button
                  variant="forest"
                  size="lg"
                  onClick={() => setIsJoinModalOpen(true)}
                  icon={CheckCircle}
                >
                  Apply for Membership
                </Button>
              ) : !isAuthenticated ? (
                <Button
                  variant="forest"
                  size="lg"
                  onClick={() => navigate('/login?redirect=/clubs/' + (club.slug || club.id))}
                >
                  Sign In to Join Club
                </Button>
              ) : null}
            </div>
          </div>

          {/* Quick Details Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 text-xs text-ink-secondary">
            <div>
              <span className="block text-ink-muted uppercase tracking-wider text-[10px] mb-1">
                Meeting Schedule
              </span>
              <p className="font-medium text-navy-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-forest-700 shrink-0" />
                {club.meetingSchedule || 'Scheduled per event'}
              </p>
            </div>
            <div>
              <span className="block text-ink-muted uppercase tracking-wider text-[10px] mb-1">
                Headquarters / Room
              </span>
              <p className="font-medium text-navy-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-navy-800 shrink-0" />
                {club.location || 'Campus Center'}
              </p>
            </div>
            <div>
              <span className="block text-ink-muted uppercase tracking-wider text-[10px] mb-1">
                Official Email
              </span>
              <p className="font-medium text-navy-900 flex items-center gap-1.5 truncate">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                {club.contactEmail}
              </p>
            </div>
            <div>
              <span className="block text-ink-muted uppercase tracking-wider text-[10px] mb-1">
                Community Size
              </span>
              <p className="font-medium text-navy-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-ink-secondary shrink-0" />
                {club.memberCount || 0} Registered Members
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Charter */}
            <Card className="p-6 sm:p-8">
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-4 pb-3 border-b border-border">
                About the Organization & Charter
              </h3>
              <div className="prose prose-sm text-ink-primary max-w-none space-y-4 leading-relaxed whitespace-pre-line text-sm">
                {club.description}
              </div>
            </Card>

            {/* Upcoming Club Events */}
            <div>
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-4">
                Upcoming Club Events ({events.length})
              </h3>
              {events.length === 0 ? (
                <Card className="p-8 text-center text-xs text-ink-secondary">
                  No upcoming public events scheduled for this club.
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar (1 col) */}
          <div className="space-y-6">
            {/* Executive Committee */}
            <Card>
              <CardHeader title="Club Leadership" subtitle="Assigned Executive Officers" />
              <CardBody className="divide-y divide-border p-0">
                {!club.admins || club.admins.length === 0 ? (
                  <div className="p-4 text-xs text-ink-secondary text-center">
                    Admin assignment pending review.
                  </div>
                ) : (
                  club.admins.map((adm) => (
                    <div key={adm.id} className="p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-navy-900 text-gold font-bold flex items-center justify-center shrink-0">
                        {adm.firstName?.[0]}
                      </div>
                      <div className="overflow-hidden">
                        <h5 className="text-xs font-bold text-navy-900 truncate">{adm.fullName}</h5>
                        <p className="text-[11px] text-ink-secondary truncate">{adm.email}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardBody>
            </Card>

            {/* University Affiliation notice */}
            <Card className="p-5 bg-ivory-50/70 border-gold/30">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-navy-900">University Certified Organization</h4>
                  <p className="text-[11px] text-ink-secondary mt-1 leading-relaxed">
                    This organization operates under the bylaws and compliance guidelines of the University Student Affairs Council.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Join Request Modal */}
      {isJoinModalOpen && (
        <MembershipRequestModal
          club={club}
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          onSuccess={() => setMembershipStatus('PENDING')}
        />
      )}
    </div>
  );
}

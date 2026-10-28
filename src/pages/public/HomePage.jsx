import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { statService } from '../../services/statService';
import { clubService } from '../../services/clubService';
import { eventService } from '../../services/eventService';
import { ClubCard } from '../../components/clubs/ClubCard';
import { EventCard } from '../../components/events/EventCard';
import { Button } from '../../components/common/Button';
import {
  Compass,
  Calendar,
  Users,
  CheckCircle2,
  Award,
  ArrowRight,
  Shield,
  Sparkles,
  BookOpen,
  ChevronRight
} from 'lucide-react';

export function HomePage() {
  const [stats, setStats] = useState(null);
  const [featuredClubs, setFeaturedClubs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, clubsData, eventsData] = await Promise.all([
          statService.getPublicStats(),
          clubService.getAll({ size: 3, sortBy: 'name', direction: 'asc' }),
          eventService.getUpcoming(3),
        ]);
        setStats(statsData);
        setFeaturedClubs(clubsData.content || clubsData || []);
        setUpcomingEvents(eventsData || []);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative bg-navy-900 text-white overflow-hidden py-24 sm:py-32 border-b border-gold/20">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#C6A15B_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-wider mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Official University Collegiate Societies Portal
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Discover Your Community. <br className="hidden sm:inline" />
            <span className="text-gold italic font-normal">Shape Your Legacy.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Connect with recognized academic societies, competitive engineering teams, visual arts guilds, and athletic organizations across the university campus.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/clubs">
              <Button variant="accent" size="lg" icon={Compass} className="w-full sm:w-auto shadow-elevated">
                Explore College Clubs
              </Button>
            </Link>
            <Link to="/events">
              <Button variant="secondary" size="lg" icon={Calendar} className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20">
                Browse Campus Events
              </Button>
            </Link>
          </div>

          {/* Live Metrics Grid */}
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto pt-10 border-t border-navy-800">
            <div>
              <p className="font-serif text-3xl sm:text-4xl font-bold text-gold">
                {stats?.totalClubs ?? 6}+
              </p>
              <p className="text-xs uppercase tracking-wider text-gray-400 mt-1">Active Clubs</p>
            </div>
            <div>
              <p className="font-serif text-3xl sm:text-4xl font-bold text-white">
                {stats?.totalMembers ?? 50}+
              </p>
              <p className="text-xs uppercase tracking-wider text-gray-400 mt-1">Student Members</p>
            </div>
            <div>
              <p className="font-serif text-3xl sm:text-4xl font-bold text-gold">
                {stats?.totalEvents ?? 12}+
              </p>
              <p className="text-xs uppercase tracking-wider text-gray-400 mt-1">Annual Events</p>
            </div>
            <div>
              <p className="font-serif text-3xl sm:text-4xl font-bold text-white">
                {stats?.averageFeedbackRating ? `${stats.averageFeedbackRating} / 5` : '4.9 / 5'}
              </p>
              <p className="text-xs uppercase tracking-wider text-gray-400 mt-1">Student Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Clubs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-forest-700 block mb-1">
              Campus Organizations
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900">
              Featured Societies & Guilds
            </h2>
          </div>
          <Link to="/clubs" className="text-xs font-bold text-forest-700 hover:text-forest-800 flex items-center gap-1">
            View All Clubs <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-dark block mb-1">
              Mark Your Calendar
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900">
              Upcoming University Events
            </h2>
          </div>
          <Link to="/events" className="text-xs font-bold text-forest-700 hover:text-forest-800 flex items-center gap-1">
            Full Events Schedule <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-forest-700 block mb-1">
              Seamless Involvement
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-navy-900">
              How the Platform Works
            </h2>
            <p className="mt-3 text-sm text-ink-secondary">
              Everything you need to discover clubs, join activities, and record your collegiate accomplishments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-lg bg-ivory-50 border border-border">
              <div className="w-10 h-10 rounded-lg bg-navy-900 text-gold font-bold flex items-center justify-center font-serif text-lg mb-4">
                1
              </div>
              <h4 className="font-serif text-base font-bold text-navy-900 mb-2">Create Student Account</h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Register using your official university student email address to unlock membership requests and event RSVP capabilities.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-ivory-50 border border-border">
              <div className="w-10 h-10 rounded-lg bg-navy-900 text-gold font-bold flex items-center justify-center font-serif text-lg mb-4">
                2
              </div>
              <h4 className="font-serif text-base font-bold text-navy-900 mb-2">Discover & Apply</h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Filter by academic focus, athletic discipline, or cultural interest. Submit join requests directly to club administrators.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-ivory-50 border border-border">
              <div className="w-10 h-10 rounded-lg bg-navy-900 text-gold font-bold flex items-center justify-center font-serif text-lg mb-4">
                3
              </div>
              <h4 className="font-serif text-base font-bold text-navy-900 mb-2">RSVP & Attend Events</h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Reserve seats at hackathons, debates, masterclasses, and exhibitions. Verify attendance digitally with official check-in logs.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-ivory-50 border border-border">
              <div className="w-10 h-10 rounded-lg bg-navy-900 text-gold font-bold flex items-center justify-center font-serif text-lg mb-4">
                4
              </div>
              <h4 className="font-serif text-base font-bold text-navy-900 mb-2">Feedback & Leadership</h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Rate attended events, contribute feedback to executive committees, and build leadership credentials for future roles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white p-10 sm:p-14 border border-gold/30 shadow-elevated flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Ready to Expand Your Collegiate Journey?
            </h3>
            <p className="mt-2 text-sm text-gray-300 max-w-xl">
              Join over 500+ active student leaders and peers participating in campus clubs this semester.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/register">
              <Button variant="accent" size="lg">
                Register as Student
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { clubService } from '../../services/clubService';
import { membershipService } from '../../services/membershipService';
import { useAuth } from '../../hooks/useAuth';
import { ClubGrid } from '../../components/clubs/ClubGrid';
import { ClubFilter } from '../../components/clubs/ClubFilter';
import { MembershipRequestModal } from '../../components/clubs/MembershipRequestModal';

export function ClubsDirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isStudent } = useAuth();

  const [clubs, setClubs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClubForJoin, setSelectedClubForJoin] = useState(null);
  const [userMemberships, setUserMemberships] = useState({});

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    async function fetchCategories() {
      try {
        const cats = await clubService.getCategories();
        setCategories(cats || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchClubs() {
      setLoading(true);
      try {
        const data = await clubService.getAll({
          search: search || undefined,
          category: category || undefined,
          status: 'ACTIVE',
          size: 50,
        });
        setClubs(data.content || data || []);
      } catch (err) {
        console.error('Failed to fetch clubs', err);
      } finally {
        setLoading(false);
      }
    }
    fetchClubs();
  }, [search, category]);

  useEffect(() => {
    async function fetchUserMemberships() {
      if (isAuthenticated && isStudent) {
        try {
          const list = await membershipService.getMyMemberships();
          const map = {};
          list.forEach((m) => {
            map[m.clubId] = m.status;
          });
          setUserMemberships(map);
        } catch (err) {
          console.error('Failed to fetch memberships', err);
        }
      }
    }
    fetchUserMemberships();
  }, [isAuthenticated, isStudent]);

  const handleSearchChange = (val) => {
    const params = new URLSearchParams(searchParams);
    if (val) params.set('search', val);
    else params.delete('search');
    setSearchParams(params);
  };

  const handleCategoryChange = (val) => {
    const params = new URLSearchParams(searchParams);
    if (val) params.set('category', val);
    else params.delete('category');
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchParams({});
  };

  const handleJoinClick = (club) => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/clubs');
      return;
    }
    setSelectedClubForJoin(club);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Title */}
      <div className="mb-8 text-center sm:text-left">
        <span className="text-xs font-bold uppercase tracking-widest text-forest-700 block mb-1">
          Campus Directory
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900">
          Recognized Student Clubs & Societies
        </h1>
        <p className="mt-2 text-sm text-ink-secondary max-w-2xl">
          Browse through all active campus organizations. Learn about meeting schedules, team projects, and request formal membership.
        </p>
      </div>

      {/* Filter Bar */}
      <ClubFilter
        search={search}
        onSearchChange={handleSearchChange}
        category={category}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        onReset={handleReset}
      />

      {/* Grid */}
      <ClubGrid
        clubs={clubs}
        loading={loading}
        onJoinClick={isStudent ? handleJoinClick : null}
        userMemberships={userMemberships}
      />

      {/* Join Request Modal */}
      {selectedClubForJoin && (
        <MembershipRequestModal
          club={selectedClubForJoin}
          isOpen={!!selectedClubForJoin}
          onClose={() => setSelectedClubForJoin(null)}
          onSuccess={() => {
            setUserMemberships((prev) => ({
              ...prev,
              [selectedClubForJoin.id]: 'PENDING',
            }));
          }}
        />
      )}
    </div>
  );
}

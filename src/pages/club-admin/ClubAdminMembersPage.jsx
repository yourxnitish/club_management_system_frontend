import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { clubService } from '../../services/clubService';
import { membershipService } from '../../services/membershipService';
import { MemberTable } from '../../components/tables/MemberTable';
import { Select } from '../../components/common/Select';
import { useToast } from '../../hooks/useToast';
import { Card } from '../../components/common/Card';

export function ClubAdminMembersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [clubs, setClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState(searchParams.get('clubId') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const toast = useToast();

  useEffect(() => {
    async function loadManagedClubs() {
      try {
        const list = await clubService.getMyManagedClubs();
        setClubs(list || []);
        if (!selectedClubId && list && list.length > 0) {
          setSelectedClubId(list[0].id.toString());
        }
      } catch (err) {
        console.error('Failed to load clubs', err);
      }
    }
    loadManagedClubs();
  }, []);

  const loadMemberships = async () => {
    if (!selectedClubId) return;
    setLoading(true);
    try {
      const data = await membershipService.getClubMemberships(selectedClubId, {
        status: status || undefined,
        page,
        size: 10,
      });
      setMemberships(data.content || data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to load memberships', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemberships();
  }, [selectedClubId, status, page]);

  const handleApprove = async (id) => {
    try {
      await membershipService.review(id, 'APPROVED');
      toast.success('Membership approved.');
      loadMemberships();
    } catch (err) {
      toast.error(err.message || 'Approval failed.');
    }
  };

  const handleReject = async (id) => {
    try {
      await membershipService.review(id, 'REJECTED');
      toast.success('Membership rejected.');
      loadMemberships();
    } catch (err) {
      toast.error(err.message || 'Rejection failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900">
          Membership Applications & Roster
        </h1>
        <p className="text-xs text-ink-secondary mt-1">
          Review prospective applicants, approve credentials, and view active club member rolls.
        </p>
      </div>

      {/* Filter Row */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Filter by Assigned Club"
            placeholder="Select a club"
            value={selectedClubId}
            onChange={(e) => {
              setSelectedClubId(e.target.value);
              setPage(0);
            }}
            options={clubs.map((c) => ({ value: c.id, label: c.name }))}
          />

          <Select
            label="Membership Status"
            placeholder="All Statuses"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
            options={[
              { value: 'PENDING', label: 'Pending Review Only' },
              { value: 'APPROVED', label: 'Approved Members' },
              { value: 'REJECTED', label: 'Rejected Applications' },
            ]}
          />
        </div>
      </Card>

      {/* Member Table */}
      <MemberTable
        memberships={memberships}
        loading={loading}
        onApprove={handleApprove}
        onReject={handleReject}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

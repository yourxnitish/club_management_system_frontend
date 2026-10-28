import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';
import { clubService } from '../../services/clubService';
import { userService } from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import { UserCheck, Plus, X, Shield, Search, Building } from 'lucide-react';

export default function SystemAdminAssignmentsPage() {
  const { showToast } = useToast();
  const [clubs, setClubs] = useState([]);
  const [candidateUsers, setCandidateUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [assigning, setAssigning] = useState(false);

  const fetchClubs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await clubService.getAll({ page: 0, size: 100 });
      setClubs(data.content || []);
    } catch (err) {
      showToast('Failed to load clubs list', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchUsers = useCallback(async () => {
    try {
      // Fetch users who can be assigned (CLUB_ADMIN role or all users)
      const data = await userService.searchUsers({ size: 100 });
      setCandidateUsers(data.content || []);
    } catch (err) {
      showToast('Failed to load user candidates', 'error');
    }
  }, [showToast]);

  useEffect(() => {
    fetchClubs();
    fetchUsers();
  }, [fetchClubs, fetchUsers]);

  const handleOpenAssignModal = (clubId = '') => {
    setSelectedClubId(clubId ? String(clubId) : (clubs[0]?.id ? String(clubs[0].id) : ''));
    setSelectedUserId(candidateUsers[0]?.id ? String(candidateUsers[0].id) : '');
    setModalOpen(true);
  };

  const handleAssignAdmin = async () => {
    if (!selectedClubId || !selectedUserId) {
      showToast('Please select both a club and a user', 'error');
      return;
    }

    try {
      setAssigning(true);
      await clubService.assignAdmin(Number(selectedClubId), Number(selectedUserId));
      showToast('Club administrator successfully appointed', 'success');
      setModalOpen(false);
      fetchClubs();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to assign administrator', 'error');
    } finally {
      setAssigning(false);
    }
  };

  const handleRemoveAdmin = async (clubId, userId, userName, clubName) => {
    if (!window.confirm(`Revoke admin privileges for ${userName} from "${clubName}"?`)) return;

    try {
      await clubService.removeAdmin(clubId, userId);
      showToast(`Privileges revoked for ${userName}`, 'success');
      fetchClubs();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to remove admin assignment', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy-900">Club Administrator Delegations</h1>
          <p className="text-sm text-ink-secondary mt-1">
            Appoint student leaders or faculty advisors to manage specific club events, membership rosters, and announcements.
          </p>
        </div>
        <Button variant="primary" onClick={() => handleOpenAssignModal()}>
          <Plus className="w-4 h-4 mr-2" /> Appoint Club Admin
        </Button>
      </div>

      {/* Clubs & Current Assigned Admins */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <div className="space-y-4">
          {clubs.map((club) => (
            <Card key={club.id} className="p-5 hover:border-navy-900/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-navy-900">{club.name}</h3>
                    <Badge variant="neutral">{club.category}</Badge>
                    <Badge variant={club.status === 'ACTIVE' ? 'success' : 'neutral'}>
                      {club.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-ink-secondary">{club.shortDescription}</p>

                  {/* Assigned Admins Pills */}
                  <div className="pt-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-secondary mb-2">
                      Authorized Administrators:
                    </p>
                    {club.admins && club.admins.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {club.admins.map((admin) => (
                          <div
                            key={admin.id}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-900/5 border border-navy-900/15 text-xs text-navy-900 font-medium"
                          >
                            <Shield className="w-3.5 h-3.5 text-gold" />
                            <span>
                              {admin.fullName} ({admin.email})
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveAdmin(club.id, admin.id, admin.fullName, club.name)}
                              className="text-ink-secondary hover:text-crimson transition-colors"
                              title="Revoke Admin Access"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-amber-700 italic flex items-center gap-1">
                        ⚠️ No designated club officers assigned yet.
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:self-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenAssignModal(club.id)}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Officer
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Appointment Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Appoint Club Administrator"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary mb-1">
              Select Club
            </label>
            <Select
              value={selectedClubId}
              onChange={(e) => setSelectedClubId(e.target.value)}
            >
              {clubs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.category})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary mb-1">
              Select User to Appoint
            </label>
            <Select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              {candidateUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} — {u.email} ({u.role})
                </option>
              ))}
            </Select>
            <p className="text-[11px] text-ink-secondary mt-1">
              Note: Appointing a student will authorize them to manage rosters and post club announcements for this specific club.
            </p>
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setModalOpen(false)}
              disabled={assigning}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleAssignAdmin}
              isLoading={assigning}
            >
              Confirm Appointment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

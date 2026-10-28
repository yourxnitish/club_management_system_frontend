import React, { useState, useEffect } from 'react';
import { clubService } from '../../services/clubService';
import { useToast } from '../../hooks/useToast';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Textarea } from '../../components/common/Textarea';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { CLUB_CATEGORIES } from '../../constants/categories';
import { Edit3, Compass, Users, MapPin, Mail, Clock } from 'lucide-react';

export function ClubAdminClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClub, setEditingClub] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const loadClubs = async () => {
    setLoading(true);
    try {
      const data = await clubService.getMyManagedClubs();
      setClubs(data || []);
    } catch (err) {
      console.error('Failed to load managed clubs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClubs();
  }, []);

  const handleSaveClub = async (e) => {
    e.preventDefault();
    if (!editingClub) return;

    setSaving(true);
    try {
      await clubService.update(editingClub.id, editingClub);
      toast.success(`${editingClub.name} profile updated successfully.`);
      setEditingClub(null);
      loadClubs();
    } catch (err) {
      toast.error(err.message || 'Failed to update club.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900">
          Managed Organizations
        </h1>
        <p className="text-xs text-ink-secondary mt-1">
          Update meeting rooms, weekly schedules, club branding, and charter descriptions.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-ink-secondary">Loading clubs...</div>
      ) : clubs.length === 0 ? (
        <Card className="p-12 text-center text-xs text-ink-secondary">
          No clubs currently assigned to your account.
        </Card>
      ) : (
        <div className="space-y-6">
          {clubs.map((club) => (
            <Card key={club.id} className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-navy-900 text-gold flex items-center justify-center font-serif text-2xl font-bold shrink-0 shadow-sm overflow-hidden">
                    {club.logoUrl ? (
                      <img src={club.logoUrl} alt={club.name} className="w-full h-full object-cover" />
                    ) : (
                      club.name[0]
                    )}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-forest-700">
                      {club.category}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-navy-900">{club.name}</h3>
                    <p className="text-xs text-ink-secondary mt-0.5">{club.shortDescription}</p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  icon={Edit3}
                  onClick={() => setEditingClub({ ...club })}
                >
                  Edit Profile
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 text-xs text-ink-secondary">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-forest-700 shrink-0" />
                  <span>{club.meetingSchedule || 'No schedule set'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-navy-800 shrink-0" />
                  <span>{club.location || 'No location set'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gold shrink-0" />
                  <span className="truncate">{club.contactEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-ink-secondary shrink-0" />
                  <span>{club.memberCount || 0} Registered Members</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingClub && (
        <Modal
          isOpen={!!editingClub}
          onClose={() => setEditingClub(null)}
          title={`Edit Club: ${editingClub.name}`}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSaveClub} className="space-y-4">
            <Input
              label="Short Description"
              value={editingClub.shortDescription || ''}
              onChange={(e) => setEditingClub({ ...editingClub, shortDescription: e.target.value })}
              required
            />

            <Textarea
              label="Full Description / Charter"
              value={editingClub.description || ''}
              onChange={(e) => setEditingClub({ ...editingClub, description: e.target.value })}
              rows={4}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Contact Email"
                value={editingClub.contactEmail || ''}
                onChange={(e) => setEditingClub({ ...editingClub, contactEmail: e.target.value })}
                required
              />
              <Input
                label="Meeting Schedule"
                value={editingClub.meetingSchedule || ''}
                onChange={(e) => setEditingClub({ ...editingClub, meetingSchedule: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Venue / Room"
                value={editingClub.location || ''}
                onChange={(e) => setEditingClub({ ...editingClub, location: e.target.value })}
              />
              <Select
                label="Category"
                value={editingClub.category || ''}
                options={CLUB_CATEGORIES}
                onChange={(e) => setEditingClub({ ...editingClub, category: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Banner Image URL"
                value={editingClub.bannerUrl || ''}
                onChange={(e) => setEditingClub({ ...editingClub, bannerUrl: e.target.value })}
              />
              <Input
                label="Logo / Crest URL"
                value={editingClub.logoUrl || ''}
                onChange={(e) => setEditingClub({ ...editingClub, logoUrl: e.target.value })}
              />
            </div>

            <div className="pt-4 border-t border-border flex justify-end gap-3">
              <Button variant="secondary" size="md" onClick={() => setEditingClub(null)} disabled={saving}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" isLoading={saving}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

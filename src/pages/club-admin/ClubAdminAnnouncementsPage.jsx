import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { AnnouncementForm } from '../../components/forms/AnnouncementForm';
import { announcementService } from '../../services/announcementService';
import { clubService } from '../../services/clubService';
import { useToast } from '../../context/ToastContext';
import { formatDateTime, getPriorityBadgeVariant } from '../../utils/formatters';
import { Megaphone, Plus, Trash2, Calendar, Globe, Users } from 'lucide-react';

export default function ClubAdminAnnouncementsPage() {
  const { showToast } = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const data = await announcementService.getFeed(50);
      setAnnouncements(data || []);
    } catch (err) {
      showToast('Failed to load announcements', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    async function loadClubs() {
      try {
        const myClubs = await clubService.getMyClubs();
        setClubs(myClubs || []);
      } catch (err) {
        showToast('Failed to fetch clubs for announcements', 'error');
      }
    }
    loadClubs();
    fetchAnnouncements();
  }, [fetchAnnouncements, showToast]);

  const handleCreateAnnouncement = async (formData) => {
    try {
      setSubmitting(true);
      const payload = {
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        isPublic: Boolean(formData.isPublic),
        clubId: formData.clubId ? Number(formData.clubId) : null,
      };
      await announcementService.create(payload);
      showToast('Announcement broadcasted successfully', 'success');
      setModalOpen(false);
      fetchAnnouncements();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to publish announcement', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await announcementService.delete(id);
      showToast('Announcement removed', 'success');
      fetchAnnouncements();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete announcement', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy-900">Club Announcements</h1>
          <p className="text-sm text-ink-secondary mt-1">
            Broadcast club meetings, official notices, and urgent alerts to club members and the campus.
          </p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Broadcast Announcement
        </Button>
      </div>

      {/* Announcements Feed */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : announcements.length === 0 ? (
        <Card className="p-12 text-center">
          <EmptyState
            icon={Megaphone}
            title="No Announcements Broadcasted"
            description="Keep your club members informed about schedules, workshops, and deadlines by publishing your first announcement."
            action={
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> Post Announcement
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <Card key={item.id} className="p-5 border-l-4 border-l-navy-900 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={getPriorityBadgeVariant(item.priority)}>
                      {item.priority} PRIORITY
                    </Badge>
                    {item.clubName ? (
                      <Badge variant="navy" className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {item.clubName}
                      </Badge>
                    ) : (
                      <Badge variant="gold" className="flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Campus-Wide
                      </Badge>
                    )}
                    {item.isPublic && (
                      <span className="text-[11px] font-semibold text-forest flex items-center gap-1">
                        • Public Notice
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg font-bold text-navy-900">{item.title}</h3>
                  <p className="text-sm text-ink-primary whitespace-pre-line leading-relaxed">
                    {item.content}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-ink-secondary pt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Published on {formatDateTime(item.createdAt)}
                    </span>
                    <span>By: <span className="font-semibold text-navy-900">{item.authorName}</span></span>
                  </div>
                </div>

                <div className="sm:self-start">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteAnnouncement(item.id)}
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Broadcast Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Broadcast Club Announcement"
      >
        <AnnouncementForm
          clubs={clubs}
          canPublishCampusWide={false}
          onSubmit={handleCreateAnnouncement}
          isLoading={submitting}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { announcementService } from '../../services/announcementService';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDateTime, getStatusBadgeVariant } from '../../utils/formatters';
import { Bell, Shield } from 'lucide-react';

export function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnnouncements() {
      setLoading(true);
      try {
        const data = await announcementService.getFeed(20);
        setAnnouncements(data || []);
      } catch (err) {
        console.error('Failed to load announcements', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnnouncements();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900">
          Campus & Society Notice Board
        </h1>
        <p className="text-xs text-ink-secondary mt-1">
          Official bulletins broadcasted by club administrators and university leadership.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-ink-secondary">
          Loading notices...
        </div>
      ) : announcements.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Active Bulletins"
          description="There are currently no announcements posted for your enrolled societies."
        />
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <Card key={a.id} className="p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-navy-900/10 text-navy-900 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4 text-forest-700" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-forest-700 block">
                      {a.clubName ? a.clubName : 'University Broadcast'}
                    </span>
                    <span className="text-[11px] text-ink-secondary">
                      Posted by {a.authorName} • {formatDateTime(a.createdAt)}
                    </span>
                  </div>
                </div>
                <Badge variant={getStatusBadgeVariant(a.priority)}>{a.priority} Priority</Badge>
              </div>

              <h3 className="font-serif text-lg font-bold text-navy-900 mb-2">
                {a.title}
              </h3>

              <div className="text-xs text-ink-primary leading-relaxed whitespace-pre-line bg-ivory/50 p-4 rounded-lg border border-border">
                {a.content}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

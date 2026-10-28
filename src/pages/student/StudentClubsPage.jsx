import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { membershipService } from '../../services/membershipService';
import { useToast } from '../../hooks/useToast';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { getStatusBadgeVariant, formatDateTime } from '../../utils/formatters';
import { Compass, Trash2, ArrowRight } from 'lucide-react';

export function StudentClubsPage() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadMemberships = async () => {
    setLoading(true);
    try {
      const data = await membershipService.getMyMemberships();
      setMemberships(data || []);
    } catch (err) {
      console.error('Failed to load memberships', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemberships();
  }, []);

  const handleCancelApplication = async (id, clubName) => {
    if (!window.confirm(`Are you sure you want to cancel your membership application for ${clubName}?`)) {
      return;
    }
    try {
      await membershipService.cancel(id);
      toast.success('Membership application cancelled.');
      loadMemberships();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel application.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900">
            My Club Memberships & Applications
          </h1>
          <p className="text-xs text-ink-secondary mt-1">
            Official affiliations and review statuses for campus societies and organizations.
          </p>
        </div>
        <Link to="/clubs">
          <Button variant="accent" size="sm" icon={Compass}>
            Discover New Clubs
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-ink-secondary">
          Loading memberships...
        </div>
      ) : memberships.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No Club Affiliations Yet"
          description="You have not requested membership to any campus clubs or societies."
          actionLabel="Browse Available Clubs"
          onAction={() => window.location.href = '/clubs'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memberships.map((m) => (
            <Card key={m.id} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-navy-900 text-gold font-serif font-bold text-base flex items-center justify-center shrink-0">
                      {m.clubName?.[0]}
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-bold text-navy-900 leading-tight">
                        {m.clubName}
                      </h4>
                      <span className="text-[11px] text-ink-secondary">
                        Submitted: {formatDateTime(m.createdAt)}
                      </span>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(m.status)}>{m.status}</Badge>
                </div>

                {m.joinReason && (
                  <p className="text-xs text-ink-secondary line-clamp-3 mb-4 bg-ivory p-3 rounded border border-border italic">
                    "{m.joinReason}"
                  </p>
                )}

                {m.reviewedByName && (
                  <p className="text-[11px] text-forest-700 font-medium mb-3">
                    Reviewed by executive: {m.reviewedByName}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
                <Link to={`/clubs/${m.clubId}`} className="text-xs font-semibold text-navy-900 hover:text-forest-700 flex items-center gap-1">
                  View Club Charter <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {m.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancelApplication(m.id, m.clubName)}
                    className="text-xs text-status-error hover:text-red-700 font-medium flex items-center gap-1"
                    title="Withdraw Application"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

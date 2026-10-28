import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../components/common/Card';
import { Select } from '../../components/common/Select';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { StarRating } from '../../components/feedback/StarRating';
import { FeedbackCard } from '../../components/feedback/FeedbackCard';
import { clubService } from '../../services/clubService';
import { feedbackService } from '../../services/feedbackService';
import { useToast } from '../../context/ToastContext';
import { MessageSquare, Star, Award, TrendingUp } from 'lucide-react';

export default function ClubAdminFeedbackPage() {
  const { showToast } = useToast();
  const [clubs, setClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Load clubs managed by admin
  useEffect(() => {
    async function fetchClubs() {
      try {
        setLoadingClubs(true);
        const data = await clubService.getMyClubs();
        setClubs(data || []);
        if (data && data.length > 0) {
          setSelectedClubId(String(data[0].id));
        }
      } catch (err) {
        showToast('Failed to load managed clubs', 'error');
      } finally {
        setLoadingClubs(false);
      }
    }
    fetchClubs();
  }, [showToast]);

  // Load feedbacks for selected club
  const fetchFeedbacks = useCallback(async () => {
    if (!selectedClubId) {
      setFeedbacks([]);
      return;
    }
    try {
      setLoadingFeedback(true);
      const data = await feedbackService.getForClub(selectedClubId, { page, size: 10 });
      setFeedbacks(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      showToast('Failed to load feedback for this club', 'error');
    } finally {
      setLoadingFeedback(false);
    }
  }, [selectedClubId, page, showToast]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  // Derived feedback stats
  const totalCount = feedbacks.length;
  const avgRating =
    totalCount > 0
      ? (feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) / totalCount).toFixed(1)
      : '0.0';

  const fiveStars = feedbacks.filter((f) => f.rating === 5).length;
  const positiveRate =
    totalCount > 0 ? Math.round(((fiveStars + feedbacks.filter((f) => f.rating === 4).length) / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-navy-900">Student Event Feedback</h1>
        <p className="text-sm text-ink-secondary mt-1">
          Read attendee reviews, survey ratings, and qualitative comments for your club events.
        </p>
      </div>

      {/* Club Selector */}
      <Card className="p-4 sm:p-5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary mb-1">
          Select Club to Inspect
        </label>
        {loadingClubs ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            value={selectedClubId}
            onChange={(e) => {
              setSelectedClubId(e.target.value);
              setPage(0);
            }}
            disabled={clubs.length === 0}
          >
            {clubs.length === 0 && <option value="">No managed clubs available</option>}
            {clubs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — ({c.category})
              </option>
            ))}
          </Select>
        )}
      </Card>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-gold text-gold" />
          </div>
          <div>
            <p className="text-xs text-ink-secondary">Average Event Rating</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-navy-900">{avgRating}</span>
              <StarRating rating={Number(avgRating)} size="sm" />
            </div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-navy-900/10 text-navy-900 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-ink-secondary">Total Submissions</p>
            <p className="text-xl font-bold text-navy-900">{totalCount}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-forest/10 text-forest flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-ink-secondary">Positive Sentiment (4-5 Stars)</p>
            <p className="text-xl font-bold text-forest">{positiveRate}%</p>
          </div>
        </Card>
      </div>

      {/* Feedback Feed */}
      <div>
        <h2 className="font-serif text-lg font-bold text-navy-900 mb-3">Recent Reviews</h2>
        {loadingFeedback ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : feedbacks.length === 0 ? (
          <Card className="p-10 text-center">
            <EmptyState
              icon={Award}
              title="No Feedback Received Yet"
              description="Students who attend and complete your club events will be able to share ratings and constructive reviews here."
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {feedbacks.map((item) => (
              <FeedbackCard key={item.id} feedback={item} />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center pt-4">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="px-3 py-1.5 text-xs font-semibold rounded border border-border bg-white text-navy-900 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs text-ink-secondary">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 text-xs font-semibold rounded border border-border bg-white text-navy-900 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

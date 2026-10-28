import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';
import { StarRating } from '../feedback/StarRating';
import { useToast } from '../../hooks/useToast';
import { feedbackService } from '../../services/feedbackService';

export function EventFeedbackModal({ event, isOpen, onClose, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!event) return;

    setLoading(true);
    try {
      await feedbackService.submit({
        eventId: event.id,
        rating,
        comments,
      });
      toast.success('Thank you! Your feedback has been submitted.');
      setComments('');
      setRating(5);
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  if (!event) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Review: ${event.title}`}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-navy-800 mb-2">
            Your Overall Rating
          </label>
          <div className="flex items-center gap-3">
            <StarRating rating={rating} onRatingChange={setRating} interactive />
            <span className="text-xs font-bold text-navy-900">{rating} of 5 Stars</span>
          </div>
        </div>

        <div>
          <Textarea
            label="Comments & Suggestions"
            placeholder="Share your thoughts on the event organization, speakers, workshops, or future improvements..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={4}
          />
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button variant="secondary" size="md" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" isLoading={loading}>
            Submit Review
          </Button>
        </div>
      </form>
    </Modal>
  );
}

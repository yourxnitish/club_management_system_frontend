import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';
import { useToast } from '../../hooks/useToast';
import { membershipService } from '../../services/membershipService';

export function MembershipRequestModal({ club, isOpen, onClose, onSuccess }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!club) return;

    setLoading(true);
    try {
      await membershipService.apply(club.id, reason);
      toast.success(`Membership request submitted for ${club.name}!`);
      setReason('');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit membership request.');
    } finally {
      setLoading(false);
    }
  };

  if (!club) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply to Join ${club.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-xs text-ink-secondary mb-3 leading-relaxed">
            Please share a brief statement introducing yourself and stating why you would like to join this collegiate organization. The club administrator will review your application.
          </p>
          <Textarea
            label="Statement of Interest (Optional)"
            placeholder="e.g. I am a sophomore Computer Science major eager to work on autonomous navigation and participate in upcoming hardware hackathons..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button variant="secondary" size="md" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="forest" size="md" type="submit" isLoading={loading}>
            Submit Membership Application
          </Button>
        </div>
      </form>
    </Modal>
  );
}

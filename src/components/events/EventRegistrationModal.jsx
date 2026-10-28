import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../../hooks/useToast';
import { registrationService } from '../../services/registrationService';
import { formatDateTime } from '../../utils/formatters';
import { Calendar, MapPin, Users, CheckCircle } from 'lucide-react';

export function EventRegistrationModal({ event, isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleRegister = async () => {
    if (!event) return;
    setLoading(true);
    try {
      await registrationService.register(event.id);
      toast.success(`You are successfully registered for ${event.title}!`);
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to complete event registration.');
    } finally {
      setLoading(false);
    }
  };

  if (!event) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Event Registration">
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-ivory border border-border">
          <h4 className="font-serif text-base font-bold text-navy-900 mb-2">{event.title}</h4>
          <div className="space-y-1.5 text-xs text-ink-secondary">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-forest-700" />
              <span>{formatDateTime(event.startTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-navy-800" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-ink-secondary" />
              <span>Host Club: {event.clubName}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-ink-secondary leading-relaxed">
          By registering, your name and student ID will be added to the attendance roster. A reminder notice will appear on your personalized student dashboard.
        </p>

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button variant="secondary" size="md" onClick={onClose} disabled={loading}>
            Dismiss
          </Button>
          <Button variant="forest" size="md" onClick={handleRegister} isLoading={loading} icon={CheckCircle}>
            Confirm RSVP
          </Button>
        </div>
      </div>
    </Modal>
  );
}

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema } from '../../utils/validationSchemas';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';

export function EventForm({ defaultValues, clubs = [], onSubmit, isLoading = false, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: defaultValues || {
      clubId: clubs[0]?.id || '',
      title: '',
      description: '',
      location: '',
      startTime: '',
      endTime: '',
      registrationDeadline: '',
      capacity: 50,
      bannerUrl: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Organizing Club"
          placeholder="Select Host Club"
          options={clubs.map((c) => ({ value: c.id, label: c.name }))}
          error={errors.clubId?.message}
          {...register('clubId')}
        />

        <Input
          label="Event Title"
          placeholder="e.g. Autonomous Rover Showcase & Hackathon"
          error={errors.title?.message}
          {...register('title')}
        />
      </div>

      <Textarea
        label="Event Description"
        placeholder="Provide complete event agenda, requirements, guidelines, and benefits..."
        rows={4}
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Event Venue / Location"
          placeholder="e.g. Founders Auditorium / Room 102"
          error={errors.location?.message}
          {...register('location')}
        />

        <Input
          label="Attendee Capacity"
          type="number"
          placeholder="50"
          error={errors.capacity?.message}
          {...register('capacity')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Start Date & Time"
          type="datetime-local"
          error={errors.startTime?.message}
          {...register('startTime')}
        />

        <Input
          label="End Date & Time"
          type="datetime-local"
          error={errors.endTime?.message}
          {...register('endTime')}
        />

        <Input
          label="Registration Deadline"
          type="datetime-local"
          error={errors.registrationDeadline?.message}
          {...register('registrationDeadline')}
        />
      </div>

      <Input
        label="Event Banner URL"
        placeholder="https://images.unsplash.com/..."
        error={errors.bannerUrl?.message}
        {...register('bannerUrl')}
      />

      <div className="pt-4 border-t border-border flex justify-end gap-3">
        {onCancel && (
          <Button variant="secondary" size="md" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button variant="forest" size="md" type="submit" isLoading={isLoading}>
          Save & Publish Event
        </Button>
      </div>
    </form>
  );
}

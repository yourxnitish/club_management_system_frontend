import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { announcementSchema } from '../../utils/validationSchemas';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';
import { ANNOUNCEMENT_PRIORITIES } from '../../constants/categories';

export function AnnouncementForm({ clubs = [], canPublishCampusWide = false, onSubmit, isLoading = false, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      clubId: canPublishCampusWide ? null : clubs[0]?.id || null,
      title: '',
      content: '',
      priority: 'NORMAL',
      isPublic: true,
    },
  });

  const clubOptions = [
    ...(canPublishCampusWide ? [{ value: '', label: 'Campus-Wide (All University Students)' }] : []),
    ...clubs.map((c) => ({ value: c.id, label: `${c.name} (Club Announcement)` })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Target Audience / Scope"
          options={clubOptions}
          error={errors.clubId?.message}
          {...register('clubId')}
        />

        <Select
          label="Priority Level"
          options={Object.values(ANNOUNCEMENT_PRIORITIES)}
          error={errors.priority?.message}
          {...register('priority')}
        />
      </div>

      <Input
        label="Announcement Headline"
        placeholder="e.g. Orientation Meeting & Lab Safety Protocols"
        error={errors.title?.message}
        {...register('title')}
      />

      <Textarea
        label="Announcement Message"
        placeholder="Provide complete news or notice details..."
        rows={5}
        error={errors.content?.message}
        {...register('content')}
      />

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="isPublicCheck"
          className="rounded border-border text-navy-900 focus:ring-navy-900 h-4 w-4"
          {...register('isPublic')}
        />
        <label htmlFor="isPublicCheck" className="text-xs text-ink-primary font-medium">
          Make visible to all prospective students on public directory
        </label>
      </div>

      <div className="pt-4 border-t border-border flex justify-end gap-3">
        {onCancel && (
          <Button variant="secondary" size="md" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button variant="primary" size="md" type="submit" isLoading={isLoading}>
          Broadcast Announcement
        </Button>
      </div>
    </form>
  );
}

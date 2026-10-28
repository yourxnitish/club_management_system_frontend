import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clubSchema } from '../../utils/validationSchemas';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';
import { CLUB_CATEGORIES } from '../../constants/categories';

export function ClubForm({ defaultValues, onSubmit, isLoading = false, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clubSchema),
    defaultValues: defaultValues || {
      name: '',
      shortDescription: '',
      description: '',
      category: CLUB_CATEGORIES[0],
      contactEmail: '',
      meetingSchedule: '',
      location: '',
      bannerUrl: '',
      logoUrl: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Club Official Name"
          placeholder="e.g. Robotics & Autonomous Systems Society"
          error={errors.name?.message}
          {...register('name')}
        />

        <Select
          label="Category"
          options={CLUB_CATEGORIES}
          error={errors.category?.message}
          {...register('category')}
        />
      </div>

      <Input
        label="Short Description (Summary)"
        placeholder="Brief one-sentence elevator pitch shown on cards"
        error={errors.shortDescription?.message}
        {...register('shortDescription')}
      />

      <Textarea
        label="Comprehensive Description & Charter"
        placeholder="Detailed background, goals, activities, and membership requirements..."
        rows={5}
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Official Contact Email"
          placeholder="robotics@collegeclub.edu"
          error={errors.contactEmail?.message}
          {...register('contactEmail')}
        />

        <Input
          label="Meeting Schedule"
          placeholder="e.g. Every Tuesday 6:00 PM"
          error={errors.meetingSchedule?.message}
          {...register('meetingSchedule')}
        />

        <Input
          label="Campus Location / Room"
          placeholder="e.g. Engineering Hall Room 402"
          error={errors.location?.message}
          {...register('location')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Banner Image URL (Unsplash or CDN)"
          placeholder="https://images.unsplash.com/..."
          error={errors.bannerUrl?.message}
          {...register('bannerUrl')}
        />

        <Input
          label="Logo / Crest Image URL"
          placeholder="https://images.unsplash.com/..."
          error={errors.logoUrl?.message}
          {...register('logoUrl')}
        />
      </div>

      <div className="pt-4 border-t border-border flex justify-end gap-3">
        {onCancel && (
          <Button variant="secondary" size="md" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button variant="primary" size="md" type="submit" isLoading={isLoading}>
          Save Club Details
        </Button>
      </div>
    </form>
  );
}

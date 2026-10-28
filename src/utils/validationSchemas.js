import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid university email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid university email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  studentId: z.string().optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
});

export const clubSchema = z.object({
  name: z.string().min(3, 'Club name must be at least 3 characters'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters').max(255),
  description: z.string().min(20, 'Full description must be at least 20 characters'),
  category: z.string().min(1, 'Category is required'),
  contactEmail: z.string().email('Please provide a valid contact email'),
  meetingSchedule: z.string().optional(),
  location: z.string().optional(),
  bannerUrl: z.string().url('Please enter a valid image URL').or(z.literal('')).optional(),
  logoUrl: z.string().url('Please enter a valid image URL').or(z.literal('')).optional(),
});

export const eventSchema = z.object({
  clubId: z.coerce.number().min(1, 'Please select a club'),
  title: z.string().min(3, 'Event title must be at least 3 characters'),
  description: z.string().min(10, 'Event description is required'),
  location: z.string().min(2, 'Location is required'),
  startTime: z.string().min(1, 'Start date and time are required'),
  endTime: z.string().min(1, 'End date and time are required'),
  registrationDeadline: z.string().optional(),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1 participant'),
  bannerUrl: z.string().url('Please enter a valid image URL').or(z.literal('')).optional(),
});

export const announcementSchema = z.object({
  clubId: z.coerce.number().nullable().optional(),
  title: z.string().min(3, 'Title is required').max(255),
  content: z.string().min(10, 'Content is required'),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
  isPublic: z.boolean().default(true),
});

export const feedbackSchema = z.object({
  rating: z.coerce.number().min(1, 'Please select a star rating (1-5)').max(5),
  comments: z.string().max(1000).optional(),
});

export const profileSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  studentId: z.string().optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
});

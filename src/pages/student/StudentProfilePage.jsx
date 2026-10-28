import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '../../utils/validationSchemas';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { userService } from '../../services/userService';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { User, Mail, BookOpen, Phone, Shield, Save } from 'lucide-react';
import { ROLE_LABELS } from '../../constants/roles';

export function StudentProfilePage() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      studentId: user?.studentId || '',
      department: user?.department || '',
      phone: user?.phone || '',
      avatarUrl: user?.avatarUrl || '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const updated = await userService.updateProfile(data);
      updateUser(updated);
      toast.success('Your profile has been successfully updated.');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900">
          Student Profile & Credentials
        </h1>
        <p className="text-xs text-ink-secondary mt-1">
          Update your contact details, academic department, and portal avatar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="p-6 text-center flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-navy-900 text-gold border-2 border-gold/40 flex items-center justify-center font-serif text-3xl font-bold mb-4 shadow-sm overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
            ) : (
              user?.firstName?.[0] || 'S'
            )}
          </div>
          <h3 className="font-serif text-lg font-bold text-navy-900">{user?.fullName}</h3>
          <p className="text-xs text-ink-secondary">{user?.email}</p>
          <div className="mt-4 pt-4 border-t border-border w-full text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-ink-secondary">Role:</span>
              <strong className="text-navy-900">{ROLE_LABELS[user?.role] || user?.role}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-secondary">Student ID:</span>
              <span className="text-navy-900 font-medium">{user?.studentId || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-secondary">Department:</span>
              <span className="text-navy-900 font-medium">{user?.department || 'Not set'}</span>
            </div>
          </div>
        </Card>

        {/* Edit Form */}
        <Card className="md:col-span-2">
          <CardHeader title="Edit Profile Details" subtitle="Permitted fields for your collegiate identity" />
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  icon={User}
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />
                <Input
                  label="Last Name"
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Student ID"
                  placeholder="STU-2024-501"
                  error={errors.studentId?.message}
                  {...register('studentId')}
                />
                <Input
                  label="Academic Department / School"
                  placeholder="Computer Science"
                  icon={BookOpen}
                  error={errors.department?.message}
                  {...register('department')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  placeholder="+1-555-0100"
                  icon={Phone}
                  error={errors.phone?.message}
                  {...register('phone')}
                />
                <Input
                  label="Profile Picture URL"
                  placeholder="https://images.unsplash.com/..."
                  error={errors.avatarUrl?.message}
                  {...register('avatarUrl')}
                />
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <Button variant="primary" size="md" type="submit" isLoading={loading} icon={Save}>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

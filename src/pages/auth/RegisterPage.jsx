import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../utils/validationSchemas';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Shield, UserPlus, Mail, Key, User, BookOpen } from 'lucide-react';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerAuth } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      studentId: '',
      department: '',
      phone: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const newUser = await registerAuth(data);
      toast.success(`Welcome to the portal, ${newUser.firstName}!`);
      navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 group mb-4">
          <div className="w-12 h-12 rounded-xl bg-navy-900 border border-gold/40 flex items-center justify-center text-gold shadow-md">
            <Shield className="w-6 h-6 text-gold" />
          </div>
        </Link>
        <h2 className="font-serif text-3xl font-bold text-navy-900 tracking-tight">
          Create Student Account
        </h2>
        <p className="mt-2 text-xs text-ink-secondary">
          Join recognized college societies, participate in university competitions, and track attendance
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="p-6 sm:p-8 shadow-elevated border-border">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                placeholder="Alex"
                icon={User}
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                label="Last Name"
                placeholder="Morgan"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>

            <Input
              label="University Email"
              type="email"
              placeholder="alex.student@collegeclub.edu"
              icon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Minimum 6 characters"
              icon={Key}
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Student ID"
                placeholder="STU-2024-101"
                error={errors.studentId?.message}
                {...register('studentId')}
              />
              <Input
                label="Department / Major"
                placeholder="Computer Science"
                icon={BookOpen}
                error={errors.department?.message}
                {...register('department')}
              />
            </div>

            <Input
              label="Contact Phone"
              placeholder="+1-555-0199"
              error={errors.phone?.message}
              {...register('phone')}
            />

            <div className="pt-2">
              <Button
                variant="forest"
                size="md"
                type="submit"
                isLoading={loading}
                icon={UserPlus}
                className="w-full font-medium"
              >
                Complete Registration
              </Button>
            </div>
          </form>
        </Card>

        <p className="mt-6 text-center text-xs text-ink-secondary">
          Already have a university account?{' '}
          <Link to="/login" className="font-semibold text-navy-900 hover:text-forest-700 underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}

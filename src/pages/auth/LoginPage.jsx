import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../utils/validationSchemas';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { ROLES } from '../../constants/roles';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Shield, LogIn, Key, Mail } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get('redirect');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.firstName}!`);

      if (redirect) {
        navigate(redirect);
      } else if (user.role === ROLES.SYSTEM_ADMIN) {
        navigate('/admin/dashboard');
      } else if (user.role === ROLES.CLUB_ADMIN) {
        navigate('/club-admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (email, password) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
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
          University Portal Sign In
        </h2>
        <p className="mt-2 text-xs text-ink-secondary">
          Access your collegiate club memberships, event RSVPs, or administration tools
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="p-6 sm:p-8 shadow-elevated border-border">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="University Email"
              type="email"
              placeholder="e.g. alex.student@collegeclub.edu"
              icon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Key}
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                type="submit"
                isLoading={loading}
                icon={LogIn}
                className="w-full bg-navy-900 hover:bg-navy-800 text-white font-medium"
              >
                Sign In to Portal
              </Button>
            </div>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-border">
            <span className="block text-[11px] font-semibold text-ink-secondary uppercase tracking-wider mb-2 text-center">
              Quick One-Click Test Accounts
            </span>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="text-[11px] px-2"
                onClick={() => fillCredentials('admin@collegeclub.edu', 'Admin@123456')}
              >
                System Admin
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="text-[11px] px-2"
                onClick={() => fillCredentials('robotics.lead@collegeclub.edu', 'Admin@123456')}
              >
                Club Admin
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="text-[11px] px-2"
                onClick={() => fillCredentials('alex.student@collegeclub.edu', 'Student@123456')}
              >
                Student
              </Button>
            </div>
          </div>
        </Card>

        {/* Link to Register */}
        <p className="mt-6 text-center text-xs text-ink-secondary">
          New to the collegiate community?{' '}
          <Link to="/register" className="font-semibold text-forest-700 hover:text-forest-800 underline">
            Register as a Student
          </Link>
        </p>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABELS } from '../../constants/roles';

export function UnauthorizedPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-status-error/10 text-status-error flex items-center justify-center mx-auto mb-6">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight">
        Access Restricted
      </h1>

      <p className="mt-3 text-sm text-ink-secondary max-w-md mx-auto leading-relaxed">
        You do not possess the required authorization credentials to access this administrative portal section.
        {user && (
          <span className="block mt-2 font-medium text-navy-900">
            Current Role: {ROLE_LABELS[user.role] || user.role}
          </span>
        )}
      </p>

      <div className="mt-8 flex items-center justify-center gap-3">
        <Link to="/">
          <Button variant="secondary" icon={Home}>
            Return Home
          </Button>
        </Link>
        <Link to="/student/dashboard">
          <Button variant="primary">
            Student Portal
          </Button>
        </Link>
      </div>
    </div>
  );
}

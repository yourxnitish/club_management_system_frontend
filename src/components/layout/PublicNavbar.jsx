import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../constants/roles';
import { Button } from '../common/Button';
import { Compass, Calendar, BookOpen, LogIn, Menu, X, Shield, User, ArrowRight } from 'lucide-react';

export function PublicNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getDashboardPath = () => {
    if (user?.role === ROLES.SYSTEM_ADMIN) return '/admin/dashboard';
    if (user?.role === ROLES.CLUB_ADMIN) return '/club-admin/dashboard';
    return '/student/dashboard';
  };

  const navLinks = [
    { label: 'Explore Clubs', path: '/clubs', icon: Compass },
    { label: 'Campus Events', path: '/events', icon: Calendar },
    { label: 'About Platform', path: '/about', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-navy-900 border border-gold/30 flex items-center justify-center text-gold shadow-sm group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-gold" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-navy-900 tracking-tight block">
                College Club Portal
              </span>
              <span className="text-[10px] uppercase tracking-widest text-gold-dark font-medium block">
                Collegiate Societies
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-forest-700 font-semibold' : 'text-ink-secondary hover:text-navy-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Auth CTA */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to={getDashboardPath()}>
                  <Button variant="primary" size="sm" icon={ArrowRight}>
                    My Dashboard
                  </Button>
                </Link>
                <button
                  onClick={logout}
                  className="text-xs text-ink-secondary hover:text-navy-900 font-medium px-2 py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm" icon={LogIn}>
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="accent" size="sm">
                    Join as Student
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-ink-secondary hover:text-navy-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-white px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 text-sm font-medium text-ink-primary hover:text-navy-900"
            >
              <link.icon className="w-4 h-4 text-forest-700" />
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-border flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardPath()} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
                <Button variant="secondary" size="md" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="md" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="accent" size="md" className="w-full">
                    Student Registration
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

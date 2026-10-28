import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs({ customCrumbs }) {
  const location = useLocation();

  if (customCrumbs) {
    return (
      <nav aria-label="Breadcrumb" className="flex items-center text-xs text-ink-secondary mb-4">
        {customCrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.label}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-gray-400" />}
            {crumb.path ? (
              <Link to={crumb.path} className="hover:text-navy-900 transition">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-navy-900 font-medium">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }

  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-ink-secondary mb-4">
      <Link to="/" className="hover:text-navy-900 transition flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const formatted = value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ');

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-gray-400" />
            {isLast ? (
              <span className="text-navy-900 font-medium">{formatted}</span>
            ) : (
              <Link to={to} className="hover:text-navy-900 transition">
                {formatted}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

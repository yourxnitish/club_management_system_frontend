import React from 'react';
import { Card, CardHeader, CardBody } from '../common/Card';
import { Badge } from '../common/Badge';
import { getStatusBadgeVariant } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';

export function MembershipStatusWidget({ memberships = [] }) {
  return (
    <Card>
      <CardHeader
        title="My Club Memberships"
        subtitle="Active affiliations and pending applications"
        action={
          <Link to="/student/clubs" className="text-xs text-forest-700 hover:text-forest-800 font-semibold flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      />
      <CardBody className="p-0">
        {memberships.length === 0 ? (
          <div className="p-8 text-center">
            <Compass className="w-8 h-8 text-ink-secondary mx-auto mb-2 opacity-50" />
            <p className="text-xs text-ink-secondary mb-3">You haven't joined any college clubs yet.</p>
            <Link to="/clubs" className="text-xs font-semibold text-forest-700 hover:underline">
              Explore Available Clubs &rarr;
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {memberships.slice(0, 5).map((m) => (
              <div key={m.id} className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-navy-900/10 text-navy-900 flex items-center justify-center font-serif text-xs font-bold shrink-0">
                    {m.clubName?.[0]}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-navy-900">{m.clubName}</h5>
                    <p className="text-[11px] text-ink-secondary">Applied: {new Date(m.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge variant={getStatusBadgeVariant(m.status)}>{m.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

import React from 'react';
import { ClubCard } from './ClubCard';
import { CardSkeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { Compass } from 'lucide-react';

export function ClubGrid({ clubs = [], loading = false, onJoinClick, userMemberships = {} }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (clubs.length === 0) {
    return (
      <EmptyState
        icon={Compass}
        title="No Clubs Match Criteria"
        description="Try searching with different keywords or clearing active category filters."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clubs.map((club) => (
        <ClubCard
          key={club.id}
          club={club}
          onJoinClick={onJoinClick}
          userMembershipStatus={userMemberships[club.id]}
        />
      ))}
    </div>
  );
}

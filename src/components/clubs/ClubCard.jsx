import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Users, Calendar, Star, ArrowRight } from 'lucide-react';

export function ClubCard({ club, onJoinClick, userMembershipStatus }) {
  return (
    <Card hover className="flex flex-col h-full overflow-hidden group">
      {/* Club Banner */}
      <div className="relative h-44 bg-navy-900 overflow-hidden">
        {club.bannerUrl ? (
          <img
            src={club.bannerUrl}
            alt={club.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-navy-900 text-gold/40 font-serif text-3xl font-bold">
            {club.name[0]}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="gold" size="sm" className="bg-navy-900/90 text-gold border-gold/40 backdrop-blur-xs font-semibold">
            {club.category}
          </Badge>
        </div>

        {/* Rating */}
        {club.averageRating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-xs text-white">
            <Star className="w-3.5 h-3.5 fill-gold text-gold" />
            <span className="font-semibold">{club.averageRating.toFixed(1)}</span>
          </div>
        )}

        {/* Club Logo / Monogram */}
        <div className="absolute -bottom-5 left-5">
          <div className="w-14 h-14 rounded-lg bg-white border-2 border-white shadow-md overflow-hidden flex items-center justify-center text-navy-900 font-serif text-xl font-bold">
            {club.logoUrl ? (
              <img src={club.logoUrl} alt={club.name} className="w-full h-full object-cover" />
            ) : (
              club.name[0]
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 pt-8 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-lg font-bold text-navy-900 group-hover:text-forest-700 transition line-clamp-1">
            <Link to={`/clubs/${club.slug || club.id}`}>{club.name}</Link>
          </h3>
          <p className="mt-2 text-xs text-ink-secondary leading-relaxed line-clamp-2">
            {club.shortDescription}
          </p>
        </div>

        {/* Meta Stats & Action */}
        <div className="mt-6 pt-4 border-t border-border/80">
          <div className="flex items-center justify-between text-xs text-ink-secondary mb-4">
            <span className="flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-navy-800" />
              {club.memberCount || 0} Members
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-forest-700" />
              {club.eventCount || 0} Events
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/clubs/${club.slug || club.id}`} className="flex-1">
              <Button variant="secondary" size="sm" className="w-full">
                View Club
              </Button>
            </Link>
            {onJoinClick && (
              <Button
                variant={userMembershipStatus ? 'ghost' : 'forest'}
                size="sm"
                disabled={!!userMembershipStatus}
                onClick={() => onJoinClick(club)}
              >
                {userMembershipStatus ? userMembershipStatus : 'Join'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

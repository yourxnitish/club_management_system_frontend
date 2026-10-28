import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export function EventFilter({
  search,
  onSearchChange,
  timeRange,
  onTimeRangeChange,
  onReset,
}) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg border border-border shadow-classic mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Search */}
        <div className="sm:col-span-8">
          <Input
            placeholder="Search events by title, keyword, or venue location..."
            icon={Search}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Time Filter */}
        <div className="sm:col-span-3">
          <Select
            placeholder="All Events"
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            options={[
              { value: 'upcoming', label: 'Upcoming Only' },
              { value: 'past', label: 'Past Events' },
            ]}
          />
        </div>

        {/* Reset */}
        <div className="sm:col-span-1 flex justify-end">
          {(search || timeRange) && (
            <Button variant="ghost" size="sm" onClick={onReset} title="Clear filters">
              <X className="w-4 h-4 text-ink-secondary" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export function ClubFilter({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories = [],
  onReset,
}) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg border border-border shadow-classic mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Search Input */}
        <div className="sm:col-span-7">
          <Input
            placeholder="Search clubs by name, keywords, or focus..."
            icon={Search}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Category Dropdown */}
        <div className="sm:col-span-4">
          <Select
            placeholder="All Categories"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            options={categories.map((c) => ({ value: c, label: c }))}
          />
        </div>

        {/* Reset */}
        <div className="sm:col-span-1 flex justify-end">
          {(search || category) && (
            <Button variant="ghost" size="sm" onClick={onReset} title="Clear filters">
              <X className="w-4 h-4 text-ink-secondary" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

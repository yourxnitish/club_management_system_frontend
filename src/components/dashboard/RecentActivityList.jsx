import React from 'react';
import { Card, CardHeader, CardBody } from '../common/Card';
import { formatDateTime } from '../../utils/formatters';
import { Clock, Activity } from 'lucide-react';

export function RecentActivityList({ activities = [] }) {
  return (
    <Card>
      <CardHeader title="Recent Platform Activities" subtitle="Audit trails and real-time community engagement" />
      <CardBody className="p-0">
        {activities.length === 0 ? (
          <div className="p-6 text-center text-xs text-ink-secondary">
            No recent activity recorded.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {activities.slice(0, 6).map((item) => (
              <div key={item.id} className="p-4 flex items-start gap-3 hover:bg-ivory/50 transition">
                <div className="w-8 h-8 rounded-full bg-navy-900/5 text-navy-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Activity className="w-4 h-4 text-navy-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-navy-900 truncate">
                    {item.details || item.action}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-ink-secondary">
                    {item.userName && <span>By {item.userName}</span>}
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(item.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

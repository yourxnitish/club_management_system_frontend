import React from 'react';
import { DataTable } from './DataTable';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { getStatusBadgeVariant, formatDateTime } from '../../utils/formatters';
import { Check, X } from 'lucide-react';

export function RegistrationTable({
  registrations = [],
  loading = false,
  onToggleAttendance,
  page,
  totalPages,
  onPageChange,
}) {
  const columns = [
    {
      header: 'Attendee',
      key: 'userName',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-navy-900/10 text-navy-900 font-bold flex items-center justify-center shrink-0">
            {row.userName?.[0] || 'S'}
          </div>
          <div>
            <span className="font-semibold text-navy-900 block">{row.userName}</span>
            <span className="text-[11px] text-ink-secondary">{row.userEmail}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Student ID',
      key: 'userStudentId',
      render: (row) => row.userStudentId || '—',
    },
    {
      header: 'Department',
      key: 'userDepartment',
      render: (row) => row.userDepartment || '—',
    },
    {
      header: 'RSVP Status',
      key: 'status',
      render: (row) => <Badge variant={getStatusBadgeVariant(row.status)}>{row.status}</Badge>,
    },
    {
      header: 'Attendance',
      key: 'attended',
      render: (row) => (
        <Badge variant={row.attended ? 'success' : 'neutral'}>
          {row.attended ? 'Attended' : 'Absent / Not Checked In'}
        </Badge>
      ),
    },
    {
      header: 'Registered On',
      key: 'createdAt',
      render: (row) => formatDateTime(row.createdAt),
    },
    {
      header: 'Attendance Action',
      key: 'actions',
      className: 'text-right',
      render: (row) =>
        onToggleAttendance && (
          <Button
            variant={row.attended ? 'secondary' : 'forest'}
            size="sm"
            onClick={() => onToggleAttendance(row.id, !row.attended)}
          >
            {row.attended ? (
              <>
                <X className="w-3.5 h-3.5 mr-1" /> Mark Absent
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 mr-1" /> Mark Present
              </>
            )}
          </Button>
        ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={registrations}
      loading={loading}
      emptyMessage="No students have registered for this event yet."
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}

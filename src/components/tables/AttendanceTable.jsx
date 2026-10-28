import React from 'react';
import { DataTable } from './DataTable';
import { Badge } from '../common/Badge';
import { formatDateTime } from '../../utils/formatters';

export function AttendanceTable({ records = [], loading = false }) {
  const columns = [
    {
      header: 'Event Title',
      key: 'eventTitle',
      render: (row) => <span className="font-semibold text-navy-900">{row.eventTitle}</span>,
    },
    {
      header: 'Organizing Club',
      key: 'clubName',
      render: (row) => row.clubName,
    },
    {
      header: 'Event Venue',
      key: 'eventLocation',
      render: (row) => row.eventLocation,
    },
    {
      header: 'Scheduled Date',
      key: 'eventStartTime',
      render: (row) => formatDateTime(row.eventStartTime),
    },
    {
      header: 'Attendance Verification',
      key: 'attended',
      render: (row) => (
        <Badge variant={row.attended ? 'success' : 'neutral'}>
          {row.attended ? 'Present & Verified' : 'Registered / Did not attend'}
        </Badge>
      ),
    },
    {
      header: 'Check-in Timestamp',
      key: 'checkedInAt',
      render: (row) => (row.checkedInAt ? formatDateTime(row.checkedInAt) : '—'),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={records}
      loading={loading}
      emptyMessage="No event attendance records on file."
    />
  );
}

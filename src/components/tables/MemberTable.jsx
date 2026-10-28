import React from 'react';
import { DataTable } from './DataTable';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { getStatusBadgeVariant, formatDateTime } from '../../utils/formatters';
import { Check, X } from 'lucide-react';

export function MemberTable({
  memberships = [],
  loading = false,
  onApprove,
  onReject,
  page,
  totalPages,
  onPageChange,
}) {
  const columns = [
    {
      header: 'Student',
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
      header: 'Application Reason',
      key: 'joinReason',
      render: (row) => (
        <p className="max-w-xs truncate text-xs text-ink-secondary" title={row.joinReason}>
          {row.joinReason || 'No statement provided.'}
        </p>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <Badge variant={getStatusBadgeVariant(row.status)}>{row.status}</Badge>,
    },
    {
      header: 'Applied Date',
      key: 'createdAt',
      render: (row) => formatDateTime(row.createdAt),
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (row) =>
        row.status === 'PENDING' ? (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="forest"
              size="sm"
              onClick={() => onApprove(row.id)}
              title="Approve Membership"
            >
              <Check className="w-3.5 h-3.5" /> Approve
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onReject(row.id)}
              title="Reject Application"
            >
              <X className="w-3.5 h-3.5" /> Reject
            </Button>
          </div>
        ) : (
          <span className="text-[11px] text-ink-secondary">
            {row.reviewedByName ? `Reviewed by ${row.reviewedByName}` : '—'}
          </span>
        ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={memberships}
      loading={loading}
      emptyMessage="No membership applications found."
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}

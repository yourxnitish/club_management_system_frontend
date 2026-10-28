import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { DataTable } from '../../components/tables/DataTable';
import { statService } from '../../services/statService';
import { useToast } from '../../context/ToastContext';
import { formatDateTime } from '../../utils/formatters';
import { Activity, ShieldAlert, Terminal, RefreshCw } from 'lucide-react';

export default function SystemAdminLogsPage() {
  const { showToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await statService.getAuditLogs({ page, size: 20 });
      setLogs(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      showToast('Failed to retrieve system audit logs', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, showToast]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const columns = [
    {
      header: 'Timestamp',
      key: 'createdAt',
      render: (row) => (
        <span className="text-xs font-mono text-ink-secondary">
          {formatDateTime(row.createdAt)}
        </span>
      ),
    },
    {
      header: 'Actor / User',
      key: 'userName',
      render: (row) => (
        <div>
          <span className="font-semibold text-navy-900 block text-xs">
            {row.userName || 'System Process'}
          </span>
          <span className="text-[10px] text-ink-secondary">{row.userEmail || 'internal@system'}</span>
        </div>
      ),
    },
    {
      header: 'Action Taken',
      key: 'action',
      render: (row) => {
        let variant = 'neutral';
        if (row.action.includes('LOGIN') || row.action.includes('REGISTER')) variant = 'primary';
        else if (row.action.includes('CREATE') || row.action.includes('JOIN')) variant = 'forest';
        else if (row.action.includes('DELETE') || row.action.includes('CANCEL') || row.action.includes('REJECT')) variant = 'danger';
        else if (row.action.includes('UPDATE') || row.action.includes('ATTENDANCE')) variant = 'gold';

        return <Badge variant={variant}>{row.action}</Badge>;
      },
    },
    {
      header: 'Entity Scope',
      key: 'entityType',
      render: (row) => (
        <span className="text-xs font-mono text-navy-900">
          {row.entityType} {row.entityId ? `(#${row.entityId})` : ''}
        </span>
      ),
    },
    {
      header: 'Details',
      key: 'details',
      render: (row) => (
        <span className="text-xs text-ink-primary line-clamp-1 max-w-xs" title={row.details}>
          {row.details || '—'}
        </span>
      ),
    },
    {
      header: 'IP Address',
      key: 'ipAddress',
      render: (row) => (
        <span className="text-xs font-mono text-ink-secondary">
          {row.ipAddress || '127.0.0.1'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy-900">System Security & Audit Trail</h1>
          <p className="text-sm text-ink-secondary mt-1">
            Immutable timeline of administrative, authentication, and database state change events.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded border border-border bg-white text-navy-900 hover:bg-ivory transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Logs
        </button>
      </div>

      {/* Logs Table */}
      <Card className="overflow-hidden">
        <DataTable
          columns={columns}
          data={logs}
          loading={loading}
          emptyMessage="No system audit logs found."
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
}

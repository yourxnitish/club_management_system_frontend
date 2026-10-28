import React from 'react';
import { Skeleton } from '../common/Skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../common/Button';

export function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No records found.',
  page = 0,
  totalPages = 1,
  onPageChange,
}) {
  return (
    <div className="bg-white rounded-lg border border-border shadow-classic overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ivory-50/70 border-b border-border text-[11px] font-semibold text-navy-900 uppercase tracking-wider">
              {columns.map((col) => (
                <th key={col.key || col.header} className={`py-3.5 px-4 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs text-ink-primary">
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  {columns.map((col, idx) => (
                    <td key={idx} className="py-4 px-4">
                      <Skeleton className="h-4 w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center text-xs text-ink-secondary">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr key={row.id || rowIdx} className="hover:bg-ivory-50/50 transition">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`py-3.5 px-4 ${col.className || ''}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && onPageChange && (
        <div className="px-4 py-3 border-t border-border bg-ivory-50/50 flex items-center justify-between text-xs text-ink-secondary">
          <span>
            Page <strong className="text-navy-900">{page + 1}</strong> of <strong className="text-navy-900">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 0 || loading}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= totalPages - 1 || loading}
              onClick={() => onPageChange(page + 1)}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

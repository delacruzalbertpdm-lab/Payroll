import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PaginationBar({
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  itemLabel = 'entries',
}) {
  const effectiveSize = pageSize === 'ALL' ? Math.max(totalItems, 1) : Number(pageSize) || 10;
  const totalPages = Math.max(1, Math.ceil(totalItems / effectiveSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIdx = totalItems === 0 ? 0 : (safePage - 1) * effectiveSize + 1;
  const endIdx = pageSize === 'ALL' ? totalItems : Math.min(safePage * effectiveSize, totalItems);

  return (
    <div
      className="no-print"
      style={{
        padding: '10px 16px',
        background: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        fontSize: 12.5,
        color: '#475569',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>
          Showing <strong>{startIdx}</strong>–<strong>{endIdx}</strong> of{' '}
          <strong>{totalItems}</strong> {itemLabel}
        </span>

        {onPageSizeChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>• Show:</span>
            <select
              className="select"
              style={{ padding: '4px 8px', fontSize: 12 }}
              value={pageSize}
              onChange={(e) => {
                const val = e.target.value === 'ALL' ? 'ALL' : Number(e.target.value);
                onPageSizeChange(val);
              }}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} per page
                </option>
              ))}
              <option value="ALL">All ({totalItems})</option>
            </select>
          </div>
        )}
      </div>

      {pageSize !== 'ALL' && totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            className="btn btn-outline btn-sm"
            disabled={safePage <= 1}
            style={{ opacity: safePage <= 1 ? 0.5 : 1 }}
            onClick={() => onPageChange(safePage - 1)}
          >
            <ChevronLeft size={14} /> Prev
          </button>

          <span className="mono" style={{ padding: '0 8px', fontWeight: 700, color: '#0f172a' }}>
            Page {safePage} / {totalPages}
          </span>

          <button
            className="btn btn-outline btn-sm"
            disabled={safePage >= totalPages}
            style={{ opacity: safePage >= totalPages ? 0.5 : 1 }}
            onClick={() => onPageChange(safePage + 1)}
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

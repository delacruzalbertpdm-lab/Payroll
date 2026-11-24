
import React, { useEffect, useState } from 'react';
import { ClipboardList, RefreshCw, Search } from 'lucide-react';
import { fetchAuditLogsApi } from '../services/api';
import PaginationBar from './PaginationBar';

export default function AuditLogModule() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await fetchAuditLogsApi();
      setLogs(data.logs || []);
    } catch (err) {
      setError(err.message || 'Unable to load audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((log) =>
    `${log.username} ${log.action} ${log.details}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 24 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
        marginBottom: 20
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>
            <ClipboardList size={22} style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Audit Log
          </h2>
          <p style={{ color: '#64748b', marginTop: 6 }}>
            Track user activities in the payroll system.
          </p>
        </div>

        <button className="btn btn-outline btn-sm" onClick={loadLogs}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div style={{ marginBottom: 16, maxWidth: 400, position: 'relative' }}>
        <Search
          size={17}
          style={{
            position: 'absolute',
            left: 12,
            top: 12,
            color: '#64748b'
          }}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search user or activity..."
          style={{
            width: '100%',
            padding: '10px 12px 10px 38px',
            border: '1px solid #cbd5e1',
            borderRadius: 8
          }}
        />
      </div>

      {loading ? (
        <p>Loading audit logs...</p>
      ) : error ? (
        <p style={{ color: '#dc2626' }}>{error}</p>
      ) : (
        <div style={{
          overflowX: 'auto',
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 10
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: 650
          }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                <th style={{ padding: 14 }}>Date &amp; Time (PH)</th>
                <th style={{ padding: 14 }}>User / Role</th>
                <th style={{ padding: 14 }}>Activity</th>
                <th style={{ padding: 14 }}>Site &amp; Exact Changes</th>
              </tr>
            </thead>
            <tbody>
              {(pageSize === 'ALL'
                ? filteredLogs
                : filteredLogs.slice(
                    (currentPage - 1) * Number(pageSize),
                    currentPage * Number(pageSize)
                  )
              ).map((log) => (
                <tr key={log.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                  <td className="mono" style={{ padding: 14, whiteSpace: 'nowrap', fontSize: 12 }}>
                    {new Date(log.created_at).toLocaleString('en-PH', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                  <td style={{ padding: 14, whiteSpace: 'nowrap' }}>
                    <strong style={{ marginRight: 6 }}>{log.username}</strong>
                    <span
                      className={`badge ${log.role === 'ADMIN' ? 'badge-gcash' : 'badge-amber'}`}
                      style={{ fontSize: 10 }}
                    >
                      {log.role === 'ADMIN' ? 'ADMIN' : 'HR STAFF'}
                    </span>
                  </td>
                  <td style={{ padding: 14, fontWeight: 700, whiteSpace: 'nowrap' }}>{log.action}</td>
                  <td style={{ padding: 14, fontSize: 12.5, color: '#334155' }}>{log.details}</td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="4" style={{
                    padding: 24,
                    textAlign: 'center',
                    color: '#64748b'
                  }}>
                    No audit logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <PaginationBar
            totalItems={filteredLogs.length}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(sz) => setPageSize(sz)}
            pageSizeOptions={[10, 20, 50, 100]}
            itemLabel="logs"
          />
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import PaginationBar from './PaginationBar';
import {
  Building2,
  Plus,
  MapPin,
  UserCheck,
  Edit3,
  Trash2,
  ExternalLink,
  X,
} from 'lucide-react';

const fmt = (val) => {
  const n = parseFloat(val) || 0;
  return n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function SitesModule({
  sites,
  employees,
  records,
  onCreateSite,
  onUpdateSite,
  onDeleteSite,
  onJumpToSitePayroll,
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [sites.length, pageSize]);
  const [form, setForm] = useState({
    code: '',
    name: '',
    project_in_charge: '',
    location: '',
  });

  const openAdd = () => {
    setEditingSite(null);
    setForm({ code: '', name: '', project_in_charge: '', location: '' });
    setShowModal(true);
  };

  const openEdit = (site) => {
    setEditingSite(site);
    setForm({
      code: site.code,
      name: site.name,
      project_in_charge: site.project_in_charge || '',
      location: site.location || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.name.trim()) return;
    if (editingSite) {
      await onUpdateSite(editingSite.id, form);
    } else {
      await onCreateSite(form);
    }
    setShowModal(false);
  };

  return (
    <div>
      <div
        className="card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>
            Construction Project Sites ({sites.length})
          </div>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            Add and manage construction sites. Every site has its own GCash and Cash weekly payroll
            sheet.
          </div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add Project Site
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 16,
        }}
      >
        {(pageSize === 'ALL'
          ? sites
          : sites.slice((currentPage - 1) * Number(pageSize), currentPage * Number(pageSize))
        ).map((site) => {
          const siteRecs = records.filter((r) => Number(r.site_id) === Number(site.id));
          const gcashCount = siteRecs.filter((r) => r.payment_method === 'GCASH').length;
          const cashCount = siteRecs.filter((r) => r.payment_method === 'CASH').length;
          const totalGross = siteRecs.reduce((acc, r) => acc + (parseFloat(r.gross_pay) || 0), 0);
          const totalNet = siteRecs.reduce((acc, r) => acc + (parseFloat(r.net_pay) || 0), 0);
          const assignedCount = employees.filter(
            (e) => Number(e.site_id) === Number(site.id)
          ).length;

          return (
            <div key={site.id} className="card" style={{ marginBottom: 0 }}>
              <div
                className="card-header"
                style={{ background: '#0f172a', color: '#fff', padding: '14px 16px' }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      background: '#facc15',
                      color: '#0f172a',
                      padding: '2px 7px',
                      borderRadius: 4,
                      marginRight: 8,
                    }}
                  >
                    {site.code}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: 14 }}>{site.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    className="btn btn-sm"
                    style={{ background: '#1e293b', color: '#cbd5e1' }}
                    onClick={() => openEdit(site)}
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{ background: '#1e293b', color: '#f43f5e' }}
                    onClick={() => onDeleteSite(site.id)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div style={{ padding: 16 }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    fontSize: 12.5,
                    color: '#475569',
                    marginBottom: 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <UserCheck size={14} color="#2563eb" />
                    <span>
                      Project In-Charge:{' '}
                      <strong>{site.project_in_charge || 'Site Engineer'}</strong>
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MapPin size={14} color="#059669" />
                    <span>
                      Location: <strong>{site.location || 'Metro Manila / Luzon'}</strong>
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Building2 size={14} color="#d97706" />
                    <span>
                      Assigned Personnel: <strong>{assignedCount} workers</strong> ({gcashCount}{' '}
                      GCash, {cashCount} Cash in payroll)
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 10,
                    background: '#f8fafc',
                    padding: 12,
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 10.5, color: '#64748b', fontWeight: 700 }}>
                      SITE GROSS PAYROLL
                    </div>
                    <div className="mono" style={{ fontSize: 15, fontWeight: 800 }}>
                      ₱{fmt(totalGross)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, color: '#15803d', fontWeight: 700 }}>
                      SITE NET PAYROLL
                    </div>
                    <div
                      className="mono"
                      style={{ fontSize: 15, fontWeight: 800, color: '#15803d' }}
                    >
                      ₱{fmt(totalNet)}
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-outline"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => onJumpToSitePayroll(site.id)}
                >
                  Open Site Payroll Sheet <ExternalLink size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <PaginationBar
          totalItems={sites.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(sz) => setPageSize(sz)}
          pageSizeOptions={[6, 12, 24]}
          itemLabel="sites"
        />
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <div style={{ fontWeight: 800, fontSize: 16 }}>
                {editingSite ? 'Edit Project Site' : 'Add New Construction Project Site'}
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setShowModal(false)}>
                <X size={15} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Project Code (e.g. 24D00099 or 26OE0038)</label>
                    <input
                      type="text"
                      className="input"
                      required
                      placeholder="e.g. 26D00105"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Project Site Name</label>
                    <input
                      type="text"
                      className="input"
                      required
                      placeholder="e.g. BATANGAS FLYOVER PHASE 2"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Project In-Charge / Site Engineer</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Sir Denmark / Engr. Ricardo"
                      value={form.project_in_charge}
                      onChange={(e) => setForm({ ...form, project_in_charge: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Site Location</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Calamba, Laguna"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSite ? 'Save Changes' : 'Create Project Site'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


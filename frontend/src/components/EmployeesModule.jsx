import React, { useState, useMemo } from 'react';
import {
  UserPlus,
  Search,
  Wallet,
  Banknote,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
} from 'lucide-react';

const fmt = (val) => {
  const n = parseFloat(val) || 0;
  return n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function EmployeesModule({
  employees,
  sites,
  benefitConfig,
  onCreateEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
}) {
  const [search, setSearch] = useState('');
  const [siteFilter, setSiteFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);

  const emptyForm = {
    full_name: '',
    role: 'Skilled Worker',
    site_id: sites[0]?.id || '',
    daily_rate: 620,
    payment_method: 'GCASH',
    gcash_number: '',
    total_office_vale: 0,
    default_office_vale_deduction: 0,
    has_phic: true,
    has_sss: false,
    has_hdmf: false,
    has_gcash_charge: true,
    sss_salary_loan: 0,
    hdmf_mpl: 0,
    add_to_active_period: true,
    initial_days_worked: 5,
    initial_ot_hours: 0,
  };

  const [form, setForm] = useState(emptyForm);

  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      if (siteFilter !== 'ALL' && Number(e.site_id) !== Number(siteFilter)) return false;
      if (methodFilter !== 'ALL' && e.payment_method !== methodFilter) return false;
      if (
        search.trim() &&
        !e.full_name.toLowerCase().includes(search.trim().toLowerCase()) &&
        !(e.role || '').toLowerCase().includes(search.trim().toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [employees, siteFilter, methodFilter, search]);

  const openAdd = () => {
    setEditingEmp(null);
    setForm({ ...emptyForm, site_id: sites[0]?.id || '' });
    setShowModal(true);
  };

  const openEdit = (emp) => {
    setEditingEmp(emp);
    setForm({
      ...emp,
      site_id: emp.site_id || '',
      add_to_active_period: false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim()) return;
    if (editingEmp) {
      await onUpdateEmployee(editingEmp.id, form);
    } else {
      await onCreateEmployee(form);
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
            Employees Masterlist & Site Assignment ({filteredEmployees.length} of {employees.length})
          </div>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            Assign employees to construction sites, set GCash or Cash payment mode, track Office
            Vale balances, and toggle uniform HR benefits.
          </div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <UserPlus size={16} /> Add New Employee
        </button>
      </div>

      {/* Filters */}
      <div
        className="card"
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: 10, color: '#64748b' }} />
          <input
            type="text"
            className="input"
            style={{ paddingLeft: 32, width: '100%' }}
            placeholder="Search employee name or position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="select"
          value={siteFilter}
          onChange={(e) => setSiteFilter(e.target.value)}
        >
          <option value="ALL">All Assigned Sites</option>
          {sites.map((s) => (
            <option key={s.id} value={s.id}>
              {s.code} {s.name}
            </option>
          ))}
        </select>

        <select
          className="select"
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
        >
          <option value="ALL">All Payment Methods (GCash & Cash)</option>
          <option value="GCASH">GCash Only</option>
          <option value="CASH">Cash Only</option>
        </select>
      </div>

      <div className="card">
        <div className="table-scroll">
          <table className="payroll-table">
            <thead>
              <tr>
                <th>#</th>
                <th style={{ textAlign: 'left' }}>FULL NAME</th>
                <th style={{ textAlign: 'left' }}>ROLE / POSITION</th>
                <th style={{ textAlign: 'left' }}>ASSIGNED SITE</th>
                <th>PAYMENT MODE</th>
                <th>DAILY RATE</th>
                <th>TOTAL OFFICE VALE</th>
                <th>WEEKLY VALE DED.</th>
                <th>ENROLLED BENEFITS (UNIFORM HR RATES)</th>
                <th>RECURRING LOANS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp, idx) => (
                <tr key={emp.id}>
                  <td className="mono" style={{ textAlign: 'center', color: '#64748b' }}>
                    {idx + 1}
                  </td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{emp.full_name}</td>
                  <td>{emp.role}</td>
                  <td>
                    <span
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: '#1e3a8a',
                        background: '#eff6ff',
                        padding: '3px 8px',
                        borderRadius: 6,
                      }}
                    >
                      {emp.site_name}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      className={`badge ${
                        emp.payment_method === 'GCASH' ? 'badge-gcash' : 'badge-cash'
                      }`}
                    >
                      {emp.payment_method === 'GCASH' ? (
                        <Wallet size={12} />
                      ) : (
                        <Banknote size={12} />
                      )}
                      {emp.payment_method}
                    </span>
                  </td>
                  <td className="mono" style={{ textAlign: 'right', fontWeight: 700 }}>
                    ₱{fmt(emp.daily_rate)}
                  </td>
                  <td
                    className="mono"
                    style={{
                      textAlign: 'right',
                      color: emp.total_office_vale > 0 ? '#b45309' : '#64748b',
                      fontWeight: emp.total_office_vale > 0 ? 700 : 400,
                    }}
                  >
                    ₱{fmt(emp.total_office_vale)}
                  </td>
                  <td className="mono" style={{ textAlign: 'right', color: '#be123c' }}>
                    ₱{fmt(emp.default_office_vale_deduction)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {emp.has_phic && (
                        <span className="badge badge-amber">
                          PHIC (₱{benefitConfig.phic_contribution_default})
                        </span>
                      )}
                      {emp.has_sss && (
                        <span className="badge badge-gcash">
                          SSS (₱{benefitConfig.sss_contribution_default})
                        </span>
                      )}
                      {emp.has_hdmf && (
                        <span className="badge badge-cash">
                          HDMF (₱{benefitConfig.hdmf_contribution_default})
                        </span>
                      )}
                      {emp.payment_method === 'GCASH' && emp.has_gcash_charge && (
                        <span
                          className="badge"
                          style={{ background: '#f1f5f9', color: '#475569' }}
                        >
                          +₱{benefitConfig.gcash_charge_default} GCash Fee
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {emp.hdmf_mpl > 0 || emp.sss_salary_loan > 0 ? (
                      <span style={{ color: '#be123c', fontWeight: 700 }}>
                        ₱{fmt((emp.hdmf_mpl || 0) + (emp.sss_salary_loan || 0))}
                      </span>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>—</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(emp)}>
                        <Edit3 size={12} /> Edit
                      </button>
                      <button
                        className="btn btn-danger-ghost btn-sm"
                        onClick={() => onDeleteEmployee(emp.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Employee Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <div style={{ fontWeight: 800, fontSize: 16 }}>
                {editingEmp ? `Edit Employee — ${editingEmp.full_name}` : 'Add New Employee'}
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setShowModal(false)}>
                <X size={15} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Full Name (LAST NAME, FIRST NAME)</label>
                    <input
                      type="text"
                      className="input"
                      required
                      placeholder="e.g. DELA CRUZ, JUAN"
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Role / Position</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Skilled Worker / Laborer / Watchman"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Assigned Construction Site</label>
                    <select
                      className="select"
                      value={form.site_id}
                      onChange={(e) => setForm({ ...form, site_id: e.target.value })}
                    >
                      {sites.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.code} {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Daily Rate (₱)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="input"
                      required
                      value={form.daily_rate}
                      onChange={(e) => setForm({ ...form, daily_rate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Salary Process / Payment Method</label>
                    <select
                      className="select"
                      value={form.payment_method}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          payment_method: e.target.value,
                          has_gcash_charge: e.target.value === 'GCASH',
                        })
                      }
                    >
                      <option value="GCASH">GCASH (With GCash Portal Transfer)</option>
                      <option value="CASH">CASH (Direct Site Cash Payout)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Total Office Vale Balance (₱)</label>
                    <input
                      type="number"
                      step="100"
                      className="input"
                      value={form.total_office_vale}
                      onChange={(e) => setForm({ ...form, total_office_vale: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Weekly Office Vale Deduction (₱)</label>
                    <input
                      type="number"
                      step="100"
                      className="input"
                      value={form.default_office_vale_deduction}
                      onChange={(e) =>
                        setForm({ ...form, default_office_vale_deduction: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">HDMF MPL Loan Deduction (₱)</label>
                    <input
                      type="number"
                      step="1"
                      className="input"
                      value={form.hdmf_mpl}
                      onChange={(e) => setForm({ ...form, hdmf_mpl: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">SSS Salary Loan Deduction (₱)</label>
                    <input
                      type="number"
                      step="1"
                      className="input"
                      value={form.sss_salary_loan}
                      onChange={(e) => setForm({ ...form, sss_salary_loan: e.target.value })}
                    />
                  </div>
                </div>

                {/* Uniform Benefit Toggles */}
                <div
                  style={{
                    marginTop: 16,
                    padding: 14,
                    background: '#f8fafc',
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
                    Enrolled Standard Benefits (Amounts managed in HR Benefits Module)
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={form.has_phic}
                        onChange={(e) => setForm({ ...form, has_phic: e.target.checked })}
                      />
                      <span>
                        PHIC / PhilHealth (₱{benefitConfig.phic_contribution_default})
                      </span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={form.has_sss}
                        onChange={(e) => setForm({ ...form, has_sss: e.target.checked })}
                      />
                      <span>
                        SSS Contribution (₱{benefitConfig.sss_contribution_default})
                      </span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={form.has_hdmf}
                        onChange={(e) => setForm({ ...form, has_hdmf: e.target.checked })}
                      />
                      <span>
                        HDMF / Pag-IBIG (₱{benefitConfig.hdmf_contribution_default})
                      </span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={form.has_gcash_charge}
                        onChange={(e) => setForm({ ...form, has_gcash_charge: e.target.checked })}
                      />
                      <span>
                        GCash Charge Allowance (+₱{benefitConfig.gcash_charge_default})
                      </span>
                    </label>
                  </div>
                </div>

                {!editingEmp && (
                  <div
                    style={{
                      marginTop: 14,
                      padding: 14,
                      background: '#eff6ff',
                      borderRadius: 10,
                      border: '1px solid #bfdbfe',
                    }}
                  >
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontWeight: 700,
                        color: '#1e3a8a',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={form.add_to_active_period}
                        onChange={(e) =>
                          setForm({ ...form, add_to_active_period: e.target.checked })
                        }
                      />
                      Automatically add this employee to the active Weekly Payroll Sheet
                    </label>
                    {form.add_to_active_period && (
                      <div className="form-grid" style={{ marginTop: 10 }}>
                        <div className="form-group">
                          <label className="form-label">Initial Days Worked</label>
                          <input
                            type="number"
                            step="0.5"
                            className="input"
                            value={form.initial_days_worked}
                            onChange={(e) =>
                              setForm({ ...form, initial_days_worked: e.target.value })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Initial Overtime Hours (OT)</label>
                          <input
                            type="number"
                            step="0.5"
                            className="input"
                            value={form.initial_ot_hours}
                            onChange={(e) =>
                              setForm({ ...form, initial_ot_hours: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
                  <CheckCircle2 size={15} />
                  {editingEmp ? 'Update Employee' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


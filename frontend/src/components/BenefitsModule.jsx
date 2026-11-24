import React, { useState, useEffect } from 'react';
import PaginationBar from './PaginationBar';
import {
  ShieldCheck,
  RefreshCw,
  Save,
  CheckCircle2,
  Calculator,
} from 'lucide-react';

const fmt = (val) => {
  const n = parseFloat(val) || 0;
  return n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function BenefitsModule({
  benefitConfig,
  employees,
  onSaveBenefitsConfig,
  onUpdateEmployee,
}) {
  const [form, setForm] = useState({ ...benefitConfig });
  const [savedBanner, setSavedBanner] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [employees.length, pageSize]);

  const handleSave = async (applyToCurrentPayroll = false) => {
    await onSaveBenefitsConfig({
      ...form,
      apply_to_open_period: applyToCurrentPayroll,
    });
    setSavedBanner(
      applyToCurrentPayroll
        ? 'Uniform HR benefit amounts saved & synced to all enrolled employees in the active payroll!'
        : 'Uniform HR benefit amounts & formula multipliers saved!'
    );
    setTimeout(() => setSavedBanner(''), 4000);
  };

  return (
    <div>
      {savedBanner && (
        <div
          style={{
            background: '#dcfce7',
            border: '1px solid #86efac',
            color: '#14532d',
            padding: '12px 18px',
            borderRadius: 10,
            marginBottom: 16,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <CheckCircle2 size={18} />
          {savedBanner}
        </div>
      )}

      {/* Uniform Benefit Rates Card */}
      <div className="card">
        <div className="card-header" style={{ background: '#eff6ff' }}>
          <div>
            <div className="card-title">
              <ShieldCheck size={18} color="#2563eb" />
              HR UNIFORM BENEFITS & ALLOWANCE CONFIGURATION
            </div>
            <div style={{ fontSize: 12.5, color: '#475569', marginTop: 2 }}>
              Per HR policy, standard benefit contributions have a single uniform amount across
              enrolled site workers. Update the amount once here and sync across all sites.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline" onClick={() => handleSave(false)}>
              <Save size={15} /> Save Defaults Only
            </button>
            <button className="btn btn-primary" onClick={() => handleSave(true)}>
              <RefreshCw size={15} /> Save & Apply to Current Payroll
            </button>
          </div>
        </div>

        <div style={{ padding: 20 }}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Standard PHIC (PhilHealth) Contribution (₱)
              </label>
              <input
                type="number"
                step="1"
                className="input mono"
                value={form.phic_contribution_default}
                onChange={(e) =>
                  setForm({ ...form, phic_contribution_default: parseFloat(e.target.value) || 0 })
                }
              />
              <span style={{ fontSize: 11, color: '#64748b' }}>
                Default in Excel: ₱250.00 per enrolled employee
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Standard SSS Contribution (₱)</label>
              <input
                type="number"
                step="1"
                className="input mono"
                value={form.sss_contribution_default}
                onChange={(e) =>
                  setForm({ ...form, sss_contribution_default: parseFloat(e.target.value) || 0 })
                }
              />
              <span style={{ fontSize: 11, color: '#64748b' }}>
                Default in Excel: ₱425.00 per enrolled employee
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Standard HDMF (Pag-IBIG) Contribution (₱)</label>
              <input
                type="number"
                step="1"
                className="input mono"
                value={form.hdmf_contribution_default}
                onChange={(e) =>
                  setForm({ ...form, hdmf_contribution_default: parseFloat(e.target.value) || 0 })
                }
              />
              <span style={{ fontSize: 11, color: '#64748b' }}>
                Uniform Pag-IBIG contribution amount
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Standard GCash Charge Allowance (₱)</label>
              <input
                type="number"
                step="1"
                className="input mono"
                value={form.gcash_charge_default}
                onChange={(e) =>
                  setForm({ ...form, gcash_charge_default: parseFloat(e.target.value) || 0 })
                }
              />
              <span style={{ fontSize: 11, color: '#64748b' }}>
                Default in Excel: +₱20.00 added to Gross for GCash workers
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Standard SSS Rate Allowance (₱)</label>
              <input
                type="number"
                step="1"
                className="input mono"
                value={form.sss_rate_default}
                onChange={(e) =>
                  setForm({ ...form, sss_rate_default: parseFloat(e.target.value) || 0 })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Standard Abuloy Contribution (₱)</label>
              <input
                type="number"
                step="1"
                className="input mono"
                value={form.abuloy_default}
                onChange={(e) =>
                  setForm({ ...form, abuloy_default: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Excel Formula Multipliers Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Calculator size={18} color="#059669" />
            EXCEL PAYROLL FORMULA MULTIPLIERS
          </div>
        </div>
        <div style={{ padding: 20 }}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Overtime Hourly Multiplier (× Hourly Rate)</label>
              <input
                type="number"
                step="0.05"
                className="input mono"
                value={form.ot_hourly_multiplier}
                onChange={(e) =>
                  setForm({ ...form, ot_hourly_multiplier: parseFloat(e.target.value) || 1.0 })
                }
              />
              <span style={{ fontSize: 11, color: '#64748b' }}>
                Excel formula: (Daily Rate / 8) × 1.00 × OT Hours
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Night Differential Multiplier</label>
              <input
                type="number"
                step="0.05"
                className="input mono"
                value={form.night_diff_multiplier}
                onChange={(e) =>
                  setForm({ ...form, night_diff_multiplier: parseFloat(e.target.value) || 0.1 })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rest Day Multiplier</label>
              <input
                type="number"
                step="0.05"
                className="input mono"
                value={form.rest_day_multiplier}
                onChange={(e) =>
                  setForm({ ...form, rest_day_multiplier: parseFloat(e.target.value) || 1.3 })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Regular Holiday Multiplier</label>
              <input
                type="number"
                step="0.05"
                className="input mono"
                value={form.reg_holiday_multiplier}
                onChange={(e) =>
                  setForm({ ...form, reg_holiday_multiplier: parseFloat(e.target.value) || 1.0 })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Employee Enrollment Matrix */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              EMPLOYEE BENEFIT ENROLLMENT & LOAN MATRIX ({employees.length} Workers)
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              Toggle which workers have PHIC, SSS, HDMF, and GCash Charge enabled, then click "Save
              & Apply to Current Payroll" above.
            </div>
          </div>
        </div>

        <div className="table-scroll">
          <table className="payroll-table">
            <thead>
              <tr>
                <th>#</th>
                <th style={{ textAlign: 'left' }}>EMPLOYEE NAME</th>
                <th style={{ textAlign: 'left' }}>ASSIGNED SITE</th>
                <th>MODE</th>
                <th>
                  PHIC ENROLLED
                  <br />
                  (₱{fmt(form.phic_contribution_default)})
                </th>
                <th>
                  SSS ENROLLED
                  <br />
                  (₱{fmt(form.sss_contribution_default)})
                </th>
                <th>
                  HDMF ENROLLED
                  <br />
                  (₱{fmt(form.hdmf_contribution_default)})
                </th>
                <th>
                  GCASH CHARGE
                  <br />
                  (+₱{fmt(form.gcash_charge_default)})
                </th>
                <th>HDMF MPL LOAN (₱)</th>
                <th>SSS SALARY LOAN (₱)</th>
              </tr>
            </thead>
            <tbody>
              {(pageSize === 'ALL'
                ? employees
                : employees.slice(
                    (currentPage - 1) * Number(pageSize),
                    currentPage * Number(pageSize)
                  )
              ).map((emp, idx) => (
                <tr key={emp.id}>
                  <td className="mono" style={{ textAlign: 'center' }}>
                    {(pageSize === 'ALL' ? 0 : (currentPage - 1) * Number(pageSize)) + idx + 1}
                  </td>
                  <td style={{ fontWeight: 700 }}>{emp.full_name}</td>
                  <td>{emp.site_name}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      className={`badge ${
                        emp.payment_method === 'GCASH' ? 'badge-gcash' : 'badge-cash'
                      }`}
                    >
                      {emp.payment_method}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(emp.has_phic)}
                      onChange={(e) => onUpdateEmployee(emp.id, { has_phic: e.target.checked })}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(emp.has_sss)}
                      onChange={(e) => onUpdateEmployee(emp.id, { has_sss: e.target.checked })}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(emp.has_hdmf)}
                      onChange={(e) => onUpdateEmployee(emp.id, { has_hdmf: e.target.checked })}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(emp.has_gcash_charge)}
                      onChange={(e) =>
                        onUpdateEmployee(emp.id, { has_gcash_charge: e.target.checked })
                      }
                    />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <input
                      type="number"
                      className="cell-input"
                      value={emp.hdmf_mpl || 0}
                      onChange={(e) =>
                        onUpdateEmployee(emp.id, { hdmf_mpl: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <input
                      type="number"
                      className="cell-input"
                      value={emp.sss_salary_loan || 0}
                      onChange={(e) =>
                        onUpdateEmployee(emp.id, {
                          sss_salary_loan: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationBar
          totalItems={employees.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(sz) => setPageSize(sz)}
          pageSizeOptions={[10, 20, 50, 100]}
          itemLabel="workers"
        />
      </div>
    </div>
  );
}


import React, { useState, useMemo, useEffect } from 'react';
import PaginationBar from './PaginationBar';
import { createAuditLogApi } from '../services/api';
import {
  Printer,
  Search,
  Wallet,
  Banknote,
  FileText,
} from 'lucide-react';

const fmt = (val) => {
  const n = parseFloat(val) || 0;
  return n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function PayslipsModule({
  sites,
  records,
  activePeriod,
  focusedRecordId,
  onClearFocusedRecord,
}) {
  const [siteFilter, setSiteFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [siteFilter, methodFilter, search, focusedRecordId, pageSize]);

  const filteredRecords = useMemo(() => {
    if (focusedRecordId) {
      return records.filter((r) => Number(r.id) === Number(focusedRecordId));
    }
    return records.filter((r) => {
      if (siteFilter !== 'ALL' && Number(r.site_id) !== Number(siteFilter)) return false;
      if (methodFilter !== 'ALL' && r.payment_method !== methodFilter) return false;
      if (
        search.trim() &&
        !r.employee_name.toLowerCase().includes(search.trim().toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  
  }, [records, siteFilter, methodFilter, search, focusedRecordId]);

  const handlePrint = async () => {
    try {
      await createAuditLogApi(
        'Printed Payslip',
        `Printed ${filteredRecords.length} payslip(s) for period: ${activePeriod?.period_covered || 'N/A'}`
      );
    } catch (error) {
      console.error('Failed to record payslip print audit:', error);
    }

    window.print();
  };

  return (

    <div>
      {/* Controls Bar */}
      <div
        className="card no-print"
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
          <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={19} color="#2563eb" />
            Employee Weekly Payslips Generator ({filteredRecords.length} Payslips)
          </div>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            Filter by Project Site or Payment Method (GCash / Cash) and print individual or batch
            payslips.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {focusedRecordId && (
            <button className="btn btn-outline" onClick={onClearFocusedRecord}>
              Show All Payslips ({records.length})
            </button>
          )}
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Print {filteredRecords.length} Payslip(s)
          </button>
        </div>
      </div>

      {!focusedRecordId && (
        <div
          className="card no-print"
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
              placeholder="Search worker name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="select"
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
          >
            <option value="ALL">All Project Sites</option>
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
            <option value="ALL">All Payment Modes (GCash & Cash)</option>
            <option value="GCASH">GCash Only</option>
            <option value="CASH">Cash Only</option>
          </select>
        </div>
      )}

      {/* Payslip Cards Grid */}
      <div className="payslip-grid">
        {(pageSize === 'ALL' || focusedRecordId
          ? filteredRecords
          : filteredRecords.slice(
              (currentPage - 1) * Number(pageSize),
              currentPage * Number(pageSize)
            )
        ).map((r) => {
          const holidayAndRest =
            (r.night_diff_amount || 0) +
            (r.rest_day_amount || 0) +
            (r.rest_day_ot_amount || 0) +
            (r.reg_holiday_amount || 0) +
            (r.reg_holiday_ot_amount || 0) +
            (r.spec_holiday_amount || 0) +
            (r.spec_holiday_ot_amount || 0);

          const totalLoans =
            (r.sss_salary_loan || 0) +
            (r.sss_calamity_loan || 0) +
            (r.sss_emergency_loan || 0) +
            (r.sss_restructured || 0) +
            (r.sss_condonation || 0) +
            (r.hdmf_mpl || 0) +
            (r.hdmf_cl || 0);

          return (
            <div key={r.id} className="payslip-card">
              {/* Header */}
              <div
                style={{
                  borderBottom: '2px solid #0f172a',
                  paddingBottom: 10,
                  marginBottom: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: '-0.01em' }}>
                    CONSTRUCTION WEEKLY PAYSLIP
                  </div>
                  <div style={{ fontSize: 11.5, color: '#1d4ed8', fontWeight: 700 }}>
                    PROJECT: {r.site_name}
                  </div>
                  <div style={{ fontSize: 11, color: '#475569' }}>
                    PERIOD: <strong>{activePeriod?.period_covered}</strong>
                  </div>
                </div>

                <span
                  className={`badge ${
                    r.payment_method === 'GCASH' ? 'badge-gcash' : 'badge-cash'
                  }`}
                >
                  {r.payment_method === 'GCASH' ? <Wallet size={12} /> : <Banknote size={12} />}
                  {r.payment_method}
                </span>
              </div>

              {/* Worker Info */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.3fr 1fr',
                  gap: 8,
                  background: '#f8fafc',
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: '1px solid #e2e8f0',
                  marginBottom: 12,
                  fontSize: 12,
                }}
              >
                <div>
                  <div style={{ color: '#64748b', fontSize: 10.5 }}>EMPLOYEE NAME</div>
                  <div style={{ fontWeight: 800, fontSize: 13 }}>{r.employee_name}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{r.employee_role}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#64748b', fontSize: 10.5 }}>RATE & ATTENDANCE</div>
                  <div className="mono" style={{ fontWeight: 700 }}>
                    ₱{fmt(r.daily_rate)}/day × {r.days_worked} days
                  </div>
                  <div className="mono" style={{ fontSize: 11, color: '#047857' }}>
                    OT: {r.ot_hours} hrs (₱{fmt(r.daily_rate / 8)}/hr)
                  </div>
                </div>
              </div>

              {/* Two Column Earnings vs Deductions */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 14,
                  fontSize: 11.5,
                  marginBottom: 12,
                }}
              >
                {/* Earnings */}
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      color: '#0369a1',
                      borderBottom: '1px solid #cbd5e1',
                      paddingBottom: 4,
                      marginBottom: 6,
                    }}
                  >
                    EARNINGS
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Regular Pay ({r.days_worked}d)</span>
                    <span className="mono">{fmt(r.regular_amount)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Overtime ({r.ot_hours}h)</span>
                    <span className="mono">{fmt(r.ot_amount)}</span>
                  </div>
                  {(r.night_diff_amount || 0) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>Night Shift Diff (+10%, {r.night_diff_hours}h)</span>
                      <span className="mono">{fmt(r.night_diff_amount)}</span>
                    </div>
                  )}
                  {((r.rest_day_amount || 0) + (r.rest_day_ot_amount || 0)) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>Rest Day (+30% / OT)</span>
                      <span className="mono">{fmt((r.rest_day_amount || 0) + (r.rest_day_ot_amount || 0))}</span>
                    </div>
                  )}
                  {((r.reg_holiday_amount || 0) + (r.reg_holiday_ot_amount || 0)) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>Regular Holiday (Double Pay)</span>
                      <span className="mono">{fmt((r.reg_holiday_amount || 0) + (r.reg_holiday_ot_amount || 0))}</span>
                    </div>
                  )}
                  {((r.spec_holiday_amount || 0) + (r.spec_holiday_ot_amount || 0)) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>Special Holiday (+30%)</span>
                      <span className="mono">{fmt((r.spec_holiday_amount || 0) + (r.spec_holiday_ot_amount || 0))}</span>
                    </div>
                  )}
                  {(r.paid_holiday_amount || 0) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>Paid Holiday ({r.paid_holiday_days}d)</span>
                      <span className="mono">{fmt(r.paid_holiday_amount)}</span>
                    </div>
                  )}
                  {r.sss_rate > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>SSS Rate</span>
                      <span className="mono">{fmt(r.sss_rate)}</span>
                    </div>
                  )}
                  {r.gcash_charge > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>GCash Charge</span>
                      <span className="mono">{fmt(r.gcash_charge)}</span>
                    </div>
                  )}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderTop: '1px dashed #94a3b8',
                      paddingTop: 5,
                      marginTop: 6,
                      fontWeight: 800,
                    }}
                  >
                    <span>GROSS PAY</span>
                    <span className="mono">₱{fmt(r.gross_pay)}</span>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      color: '#be123c',
                      borderBottom: '1px solid #cbd5e1',
                      paddingBottom: 4,
                      marginBottom: 6,
                    }}
                  >
                    DEDUCTIONS
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Office Vale Ded.</span>
                    <span className="mono">{fmt(r.office_vale_deduction)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>PHIC (PhilHealth)</span>
                    <span className="mono">{fmt(r.phic_contribution)}</span>
                  </div>
                  {(r.sss_contribution > 0 || r.hdmf_contribution > 0) && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>SSS / Pag-IBIG</span>
                      <span className="mono">
                        {fmt((r.sss_contribution || 0) + (r.hdmf_contribution || 0))}
                      </span>
                    </div>
                  )}
                  {totalLoans > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>SSS / HDMF Loans</span>
                      <span className="mono">{fmt(totalLoans)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Site Vale</span>
                    <span className="mono">{fmt(r.site_vale)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Corpo / Others</span>
                    <span className="mono">
                      {fmt((r.corpo || 0) + (r.others || 0) + (r.abuloy || 0))}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderTop: '1px dashed #94a3b8',
                      paddingTop: 5,
                      marginTop: 6,
                      fontWeight: 800,
                      color: '#be123c',
                    }}
                  >
                    <span>TOTAL DED.</span>
                    <span className="mono">₱{fmt(r.total_deductions)}</span>
                  </div>
                </div>
              </div>

              {/* Net Pay & Vale Balance Bar */}
              <div
                style={{
                  background: '#0f172a',
                  color: '#fff',
                  padding: '10px 12px',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <div>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>
                    OFFICE VALE REMAINING BALANCE
                  </div>
                  <div className="mono" style={{ fontSize: 12.5, color: '#facc15', fontWeight: 700 }}>
                    ₱{fmt(r.office_vale_balance)} (Total Vale: ₱{fmt(r.total_office_vale)})
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>
                    NET TAKE-HOME PAY
                  </div>
                  <div className="mono" style={{ fontSize: 17, fontWeight: 800, color: '#4ade80' }}>
                    ₱{fmt(r.net_pay)}
                  </div>
                </div>
              </div>

              {r.remarks && (
                <div
                  style={{
                    fontSize: 11,
                    color: '#92400e',
                    background: '#fffbeb',
                    padding: '4px 8px',
                    borderRadius: 4,
                    marginBottom: 10,
                  }}
                >
                  <strong>Note:</strong> {r.remarks}
                </div>
              )}

              {/* Signatures */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 10.5,
                  color: '#64748b',
                  paddingTop: 14,
                }}
              >
                <div style={{ borderTop: '1px solid #94a3b8', width: '44%', paddingTop: 3 }}>
                  Prepared by: {activePeriod?.prepared_by || 'Payroll Admin'}
                </div>
                <div
                  style={{
                    borderTop: '1px solid #94a3b8',
                    width: '48%',
                    paddingTop: 3,
                    textAlign: 'right',
                  }}
                >
                  Employee Signature: ________________
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!focusedRecordId && (
        <div className="card no-print" style={{ marginTop: 18 }}>
          <PaginationBar
            totalItems={filteredRecords.length}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(sz) => setPageSize(sz)}
            pageSizeOptions={[6, 12, 24, 50]}
            itemLabel="payslips"
          />
        </div>
      )}
    </div>
  );
}


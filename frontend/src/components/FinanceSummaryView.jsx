import React from 'react';
import {
  Wallet,
  Banknote,
  TrendingUp,
  AlertCircle,
  Clock,
  ExternalLink,
  Printer,
} from 'lucide-react';

const fmt = (val) => {
  const n = parseFloat(val) || 0;
  return n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function FinanceSummaryView({
  summary,
  activePeriod,
  onJumpToSite,
}) {
  const gcash = summary?.gcash || { rows: [], totals: {} };
  const cash = summary?.cash || { rows: [], totals: {} };

  const grandGross = (gcash.totals.gross_pay || 0) + (cash.totals.gross_pay || 0);
  const grandNet = (gcash.totals.net_pay || 0) + (cash.totals.net_pay || 0);
  const totalManHours =
    (gcash.totals.man_hours_days || 0) +
    (gcash.totals.man_hours_ot || 0) +
    (cash.totals.man_hours_days || 0) +
    (cash.totals.man_hours_ot || 0);

  return (
    <div>
      {/* Executive KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">
            <span>TOTAL GROSS PAYROLL</span>
            <TrendingUp size={16} color="#2563eb" />
          </div>
          <div className="kpi-value mono">₱{fmt(grandGross)}</div>
          <div className="kpi-sub">
            GCash: ₱{fmt(gcash.totals.gross_pay)} • Cash: ₱{fmt(cash.totals.gross_pay)}
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #2563eb' }}>
          <div className="kpi-label">
            <span>DEDUCTED TO GCASH PORTAL</span>
            <Wallet size={16} color="#2563eb" />
          </div>
          <div className="kpi-value mono" style={{ color: '#1d4ed8' }}>
            ₱{fmt(gcash.totals.deducted_to_gcash)}
          </div>
          <div className="kpi-sub">
            Gross Less Office Vale (Net to Workers: ₱{fmt(gcash.totals.net_pay)})
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #d97706' }}>
          <div className="kpi-label">
            <span>OFFICE VALE (FOR ENCASHMENT)</span>
            <AlertCircle size={16} color="#d97706" />
          </div>
          <div className="kpi-value mono" style={{ color: '#b45309' }}>
            ₱{fmt(gcash.totals.office_vale_deduction)}
          </div>
          <div className="kpi-sub">Cheque encashment every last week of the month</div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #059669' }}>
          <div className="kpi-label">
            <span>TOTAL CASH PAYROLL (NET)</span>
            <Banknote size={16} color="#059669" />
          </div>
          <div className="kpi-value mono" style={{ color: '#059669' }}>
            ₱{fmt(cash.totals.net_pay)}
          </div>
          <div className="kpi-sub">
            {cash.totals.employee_count || 0} Cash Employees • Gross: ₱{fmt(cash.totals.gross_pay)}
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">
            <span>TOTAL MAN-HOURS LOGGED</span>
            <Clock size={16} color="#7c3aed" />
          </div>
          <div className="kpi-value mono">{fmt(totalManHours)} hrs</div>
          <div className="kpi-sub">
            Regular (Days×8): {fmt((gcash.totals.man_hours_days || 0) + (cash.totals.man_hours_days || 0))} • OT:{' '}
            {fmt((gcash.totals.man_hours_ot || 0) + (cash.totals.man_hours_ot || 0))}
          </div>
        </div>
      </div>

      {/* 1. GCASH SUMMARY TABLE BY PROJECT SITE */}
      <div className="card">
        <div className="card-header" style={{ background: '#eff6ff' }}>
          <div>
            <div className="card-title">
              <span className="badge badge-gcash">GCASH PORTAL</span>
              FINANCE DEPARTMENT — GCASH WEEKLY PAYROLL SUMMARY BY SITE
            </div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
              PERIOD COVERED: <strong>{activePeriod?.period_covered}</strong> • Click any project site
              to open its detailed payroll sheet
            </div>
          </div>
          <button className="btn btn-outline btn-sm no-print" onClick={() => window.print()}>
            <Printer size={14} /> Print Finance Summary
          </button>
        </div>

        <div className="table-scroll">
          <table className="payroll-table">
            <thead>
              <tr>
                <th>#</th>
                <th style={{ textAlign: 'left', minWidth: 230 }}>PROJECT NAME</th>
                <th>NO. OF EMPLOYEES</th>
                <th>MAN HOURS (DAYS)</th>
                <th>MAN HOURS (OT)</th>
                <th style={{ background: '#0369a1' }}>GROSS</th>
                <th>OFFICE VALE</th>
                <th>SSS CONTRIB</th>
                <th>HDMF MPL</th>
                <th>PHIC CONTRIB</th>
                <th>SITE VALE</th>
                <th>CORPO</th>
                <th>OTHERS</th>
                <th style={{ background: '#14532d' }}>NET PAYROLL</th>
                <th style={{ background: '#1e3a8a' }}>
                  DEDUCTED TO GCASH
                  <br />
                  (GROSS LESS OFFICE VALE)
                </th>
              </tr>
            </thead>
            <tbody>
              {gcash.rows.map((r, i) => (
                <tr key={r.site_id}>
                  <td className="mono" style={{ textAlign: 'center' }}>
                    {i + 1}
                  </td>
                  <td>
                    <button
                      onClick={() => onJumpToSite(r.site_id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#1d4ed8',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 12.5,
                      }}
                    >
                      {r.project_name}
                      <ExternalLink size={12} className="no-print" />
                    </button>
                  </td>
                  <td className="mono" style={{ textAlign: 'center', fontWeight: 700 }}>
                    {r.employee_count}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(r.man_hours_days)}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(r.man_hours_ot)}
                  </td>
                  <td className="mono" style={{ textAlign: 'right', fontWeight: 700, background: '#f0f9ff' }}>
                    {fmt(r.gross_pay)}
                  </td>
                  <td className="mono" style={{ textAlign: 'right', color: '#be123c' }}>
                    {fmt(r.office_vale_deduction)}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(r.sss_contribution)}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(r.hdmf_mpl)}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(r.phic_contribution)}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(r.site_vale)}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(r.corpo)}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(r.others)}
                  </td>
                  <td
                    className="mono"
                    style={{ textAlign: 'right', fontWeight: 800, background: '#dcfce7', color: '#15803d' }}
                  >
                    {fmt(r.net_pay)}
                  </td>
                  <td
                    className="mono"
                    style={{ textAlign: 'right', fontWeight: 800, background: '#dbeafe', color: '#1e3a8a' }}
                  >
                    {fmt(r.deducted_to_gcash)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td>TOTAL GCASH:</td>
                <td className="mono" style={{ textAlign: 'center' }}>
                  {gcash.totals.employee_count}
                </td>
                <td className="mono" style={{ textAlign: 'right' }}>
                  {fmt(gcash.totals.man_hours_days)}
                </td>
                <td className="mono" style={{ textAlign: 'right' }}>
                  {fmt(gcash.totals.man_hours_ot)}
                </td>
                <td className="mono" style={{ textAlign: 'right' }}>
                  ₱{fmt(gcash.totals.gross_pay)}
                </td>
                <td className="mono" style={{ textAlign: 'right', color: '#be123c' }}>
                  ₱{fmt(gcash.totals.office_vale_deduction)}
                </td>
                <td className="mono" style={{ textAlign: 'right' }}>
                  {fmt(gcash.totals.sss_contribution)}
                </td>
                <td className="mono" style={{ textAlign: 'right' }}>
                  {fmt(gcash.totals.hdmf_mpl)}
                </td>
                <td className="mono" style={{ textAlign: 'right' }}>
                  {fmt(gcash.totals.phic_contribution)}
                </td>
                <td className="mono" style={{ textAlign: 'right' }}>
                  {fmt(gcash.totals.site_vale)}
                </td>
                <td className="mono" style={{ textAlign: 'right' }}>
                  {fmt(gcash.totals.corpo)}
                </td>
                <td className="mono" style={{ textAlign: 'right' }}>
                  {fmt(gcash.totals.others)}
                </td>
                <td className="mono" style={{ textAlign: 'right', color: '#15803d' }}>
                  ₱{fmt(gcash.totals.net_pay)}
                </td>
                <td className="mono" style={{ textAlign: 'right', color: '#1e3a8a' }}>
                  ₱{fmt(gcash.totals.deducted_to_gcash)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Finance Reconciliation Box matching the Excel summary */}
        <div
          style={{
            padding: '16px 20px',
            background: '#fffbeb',
            borderTop: '1px solid #fde68a',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#92400e' }}>
              FINANCE RECONCILIATION (GCASH PORTAL VS. OFFICE VALE ENCASHMENT)
            </div>
            <div style={{ fontSize: 12, color: '#b45309', marginTop: 2 }}>
              {activePeriod?.finance_note}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 11, color: '#78350f', fontWeight: 700 }}>TOTAL GCASH PAYROLL</div>
              <div className="mono" style={{ fontSize: 16, fontWeight: 800 }}>
                ₱{fmt(gcash.totals.gross_pay)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#b45309', fontWeight: 700 }}>
                LESS: OFFICE VALE (FOR ENCASHMENT)
              </div>
              <div className="mono" style={{ fontSize: 16, fontWeight: 800, color: '#d97706' }}>
                ₱{fmt(gcash.totals.office_vale_deduction)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#1e3a8a', fontWeight: 700 }}>
                TOTAL PAYROLL DEDUCTED TO GCASH
              </div>
              <div className="mono" style={{ fontSize: 16, fontWeight: 800, color: '#1d4ed8' }}>
                ₱{fmt(gcash.totals.deducted_to_gcash)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CASH SUMMARY TABLE BY PROJECT SITE */}
      <div className="card">
        <div className="card-header" style={{ background: '#ecfdf5' }}>
          <div>
            <div className="card-title">
              <span className="badge badge-cash">CASH DISBURSEMENT</span>
              FINANCE DEPARTMENT — CASH WEEKLY PAYROLL SUMMARY BY SITE
            </div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
              PERIOD COVERED: <strong>{activePeriod?.period_covered}</strong>
            </div>
          </div>
        </div>

        <div className="table-scroll">
          <table className="payroll-table">
            <thead>
              <tr>
                <th>#</th>
                <th style={{ textAlign: 'left', minWidth: 230 }}>PROJECT NAME</th>
                <th>NO. OF EMPLOYEES</th>
                <th>MAN HOURS (DAYS)</th>
                <th>MAN HOURS (OT)</th>
                <th style={{ background: '#0369a1' }}>GROSS</th>
                <th>OFFICE VALE</th>
                <th>SSS / HDMF / PHIC</th>
                <th>SITE VALE</th>
                <th>CORPO</th>
                <th>OTHERS</th>
                <th style={{ background: '#14532d' }}>NET PAYROLL (CASH)</th>
              </tr>
            </thead>
            <tbody>
              {cash.rows.map((r, i) => (
                <tr key={r.site_id}>
                  <td className="mono" style={{ textAlign: 'center' }}>
                    {i + 1}
                  </td>
                  <td>
                    <button
                      onClick={() => onJumpToSite(r.site_id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#047857',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 12.5,
                      }}
                    >
                      {r.project_name}
                      <ExternalLink size={12} className="no-print" />
                    </button>
                  </td>
                  <td className="mono" style={{ textAlign: 'center', fontWeight: 700 }}>
                    {r.employee_count}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(r.man_hours_days)}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(r.man_hours_ot)}
                  </td>
                  <td className="mono" style={{ textAlign: 'right', fontWeight: 700 }}>
                    {fmt(r.gross_pay)}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(r.office_vale_deduction)}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(
                      (r.sss_contribution || 0) +
                        (r.hdmf_contribution || 0) +
                        (r.phic_contribution || 0)
                    )}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(r.site_vale)}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(r.corpo)}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(r.others)}
                  </td>
                  <td
                    className="mono"
                    style={{ textAlign: 'right', fontWeight: 800, background: '#dcfce7', color: '#15803d' }}
                  >
                    {fmt(r.net_pay)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td>TOTAL CASH:</td>
                <td className="mono" style={{ textAlign: 'center' }}>
                  {cash.totals.employee_count}
                </td>
                <td className="mono" style={{ textAlign: 'right' }}>
                  {fmt(cash.totals.man_hours_days)}
                </td>
                <td className="mono" style={{ textAlign: 'right' }}>
                  {fmt(cash.totals.man_hours_ot)}
                </td>
                <td className="mono" style={{ textAlign: 'right' }}>
                  ₱{fmt(cash.totals.gross_pay)}
                </td>
                <td className="mono" style={{ textAlign: 'right' }}>
                  {fmt(cash.totals.office_vale_deduction)}
                </td>
                <td className="mono" style={{ textAlign: 'right' }}>
                  0.00
                </td>
                <td className="mono" style={{ textAlign: 'right' }}>
                  {fmt(cash.totals.site_vale)}
                </td>
                <td className="mono" style={{ textAlign: 'right' }}>
                  ₱{fmt(cash.totals.corpo)}
                </td>
                <td className="mono" style={{ textAlign: 'right' }}>
                  {fmt(cash.totals.others)}
                </td>
                <td className="mono" style={{ textAlign: 'right', color: '#15803d' }}>
                  ₱{fmt(cash.totals.net_pay)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}


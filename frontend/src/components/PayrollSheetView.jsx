import React, { useState, useMemo } from 'react';
import {
  Plus,
  Printer,
  Download,
  SlidersHorizontal,
  Edit3,
  Trash2,
  CheckCircle2,
  Building2,
  Wallet,
  Banknote,
  Search,
  X,
} from 'lucide-react';

const fmt = (val) => {
  const n = parseFloat(val) || 0;
  return n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function PayrollSheetView({
  sites,
  employees,
  records,
  benefitConfig,
  activePeriod,
  selectedSiteId,
  onSelectSiteId,
  onUpdateRecord,
  onCreateRecord,
  onDeleteRecord,
  onOpenPayslipForRecord,
}) {
  const [paymentFilter, setPaymentFilter] = useState('ALL'); // 'ALL', 'GCASH', 'CASH'
  const [showFullColumns, setShowFullColumns] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const currentSite = useMemo(
    () => sites.find((s) => Number(s.id) === Number(selectedSiteId)) || sites[0],
    [sites, selectedSiteId]
  );

  const siteRecords = useMemo(() => {
    return records.filter((r) => {
      if (selectedSiteId !== 'ALL' && Number(r.site_id) !== Number(selectedSiteId)) {
        return false;
      }
      if (
        searchQuery.trim() &&
        !r.employee_name.toLowerCase().includes(searchQuery.trim().toLowerCase()) &&
        !(r.remarks || '').toLowerCase().includes(searchQuery.trim().toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [records, selectedSiteId, searchQuery]);

  const gcashRecords = useMemo(
    () => siteRecords.filter((r) => r.payment_method === 'GCASH'),
    [siteRecords]
  );
  const cashRecords = useMemo(
    () => siteRecords.filter((r) => r.payment_method === 'CASH'),
    [siteRecords]
  );

  // Add Worker to Site Modal state
  const [newRow, setNewRow] = useState({
    employee_id: '',
    payment_method: 'GCASH',
    daily_rate: 620,
    days_worked: 5,
    ot_hours: 0,
    gcash_charge: benefitConfig.gcash_charge_default || 20,
    total_office_vale: 0,
    office_vale_deduction: 0,
    phic_contribution: benefitConfig.phic_contribution_default || 250,
    sss_contribution: 0,
    site_vale: 0,
    corpo: 0,
    others: 0,
    remarks: '',
  });

  const handleEmployeeSelectForNewRow = (empId) => {
    const emp = employees.find((e) => Number(e.id) === Number(empId));
    if (!emp) {
      setNewRow((prev) => ({ ...prev, employee_id: empId }));
      return;
    }
    setNewRow({
      employee_id: emp.id,
      payment_method: emp.payment_method,
      daily_rate: emp.daily_rate,
      days_worked: 5,
      ot_hours: 0,
      gcash_charge:
        emp.payment_method === 'GCASH' && emp.has_gcash_charge
          ? benefitConfig.gcash_charge_default
          : 0,
      total_office_vale: emp.total_office_vale || 0,
      office_vale_deduction: emp.default_office_vale_deduction || 0,
      phic_contribution: emp.has_phic ? benefitConfig.phic_contribution_default : 0,
      sss_contribution: emp.has_sss ? benefitConfig.sss_contribution_default : 0,
      site_vale: 0,
      corpo: 0,
      others: 0,
      remarks: '',
    });
  };

  const handleSubmitNewRow = async (e) => {
    e.preventDefault();
    if (!newRow.employee_id) return;
    const targetSiteId =
      selectedSiteId === 'ALL'
        ? employees.find((emp) => Number(emp.id) === Number(newRow.employee_id))?.site_id ||
          sites[0]?.id
        : selectedSiteId;

    await onCreateRecord({
      ...newRow,
      period_id: activePeriod?.id || 1,
      site_id: targetSiteId,
    });
    setShowAddModal(false);
  };

  const handleExportCsv = () => {
    const headers = [
      '#',
      'SITE',
      'PAYMENT METHOD',
      'FULL NAME',
      'DAILY RATE',
      'NO. OF DAYS',
      'REGULAR AMOUNT',
      'OT HRS',
      'OT AMOUNT',
      'GCASH CHARGE',
      'GROSS PAY',
      'TOTAL OFFICE VALE',
      'OFFICE VALE DEDUCTION',
      'VALE BALANCE',
      'SSS CONTRIBUTION',
      'HDMF MPL',
      'PHIC CONTRIBUTION',
      'SITE VALE',
      'CORPO',
      'OTHERS',
      'TOTAL DEDUCTIONS',
      'NET PAY',
      'REMARKS',
    ];
    const rows = siteRecords.map((r, i) => [
      i + 1,
      `"${r.site_name}"`,
      r.payment_method,
      `"${r.employee_name}"`,
      r.daily_rate,
      r.days_worked,
      r.regular_amount,
      r.ot_hours,
      r.ot_amount,
      r.gcash_charge,
      r.gross_pay,
      r.total_office_vale,
      r.office_vale_deduction,
      r.office_vale_balance,
      r.sss_contribution,
      r.hdmf_mpl,
      r.phic_contribution,
      r.site_vale,
      r.corpo,
      r.others,
      r.total_deductions,
      r.net_pay,
      `"${r.remarks || ''}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Weekly_Payroll_${currentSite ? currentSite.code : 'ALL'}_${activePeriod?.period_covered || ''}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderSectionTable = (title, methodBadge, rows) => {
    const sum = (field) => rows.reduce((acc, r) => acc + (parseFloat(r[field]) || 0), 0);
    const totalDaysManHours = rows.reduce(
      (acc, r) => acc + (parseFloat(r.days_worked) || 0) * 8.0,
      0
    );
    const activeHeadcount = rows.filter((r) => (parseFloat(r.days_worked) || 0) > 0).length;

    return (
      <div className="card" style={{ marginBottom: 24 }}>
        <div
          className="card-header"
          style={{
            background: methodBadge === 'GCASH' ? '#eff6ff' : '#ecfdf5',
            borderBottom: '2px solid #cbd5e1',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                className={`badge ${methodBadge === 'GCASH' ? 'badge-gcash' : 'badge-cash'}`}
                style={{ fontSize: 12, padding: '4px 10px' }}
              >
                {methodBadge === 'GCASH' ? <Wallet size={13} /> : <Banknote size={13} />}
                {methodBadge} PAYROLL REPORT
              </span>
              <span style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>
                NAME OF PROJECT:{' '}
                <span style={{ color: '#1d4ed8' }}>
                  {selectedSiteId === 'ALL' ? 'ALL CONSTRUCTION SITES' : currentSite?.full_title}
                </span>
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 3 }}>
              PERIOD COVERED: <strong>{activePeriod?.period_covered}</strong> • Workers with Regular
              Days: <strong>{activeHeadcount}</strong> (Total Rows: {rows.length}) • Total Regular
              Man-Hours (Days × 8): <strong className="mono">{fmt(totalDaysManHours)} hrs</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>GROSS PAYROLL</div>
              <div className="mono" style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                ₱{fmt(sum('gross_pay'))}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: '#be123c', fontWeight: 700 }}>DEDUCTIONS</div>
              <div className="mono" style={{ fontSize: 15, fontWeight: 800, color: '#e11d48' }}>
                ₱{fmt(sum('total_deductions'))}
              </div>
            </div>
            <div
              style={{
                textAlign: 'right',
                background: '#0f172a',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: 8,
              }}
            >
              <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>NET PAYROLL</div>
              <div className="mono" style={{ fontSize: 16, fontWeight: 800, color: '#4ade80' }}>
                ₱{fmt(sum('net_pay'))}
              </div>
            </div>
          </div>
        </div>

        <div className="table-scroll">
          <table className="payroll-table">
            <thead>
              <tr>
                <th rowSpan={2}>#</th>
                <th rowSpan={2} style={{ minWidth: 190, textAlign: 'left' }}>
                  FULL NAME
                </th>
                <th colSpan={3} style={{ background: '#1e3a8a' }}>
                  REGULAR RATE
                </th>
                <th colSpan={showFullColumns ? 4 : 2} style={{ background: '#0f766e' }}>
                  OVERTIME
                </th>
                {showFullColumns && (
                  <>
                    <th colSpan={4} style={{ background: '#4338ca' }}>
                      REST DAY
                    </th>
                    <th colSpan={8} style={{ background: '#6d28d9' }}>
                      HOLIDAY (REGULAR & SPECIAL)
                    </th>
                  </>
                )}
                <th rowSpan={2}>SSS RATE</th>
                <th rowSpan={2}>GCASH CHARGE</th>
                <th rowSpan={2} style={{ background: '#0369a1' }}>
                  GROSS
                </th>
                <th
                  colSpan={showFullColumns ? 17 : 9}
                  style={{ background: '#881337' }}
                >
                  DEDUCTIONS
                </th>
                <th rowSpan={2} style={{ background: '#14532d' }}>
                  NET PAY
                </th>
                <th rowSpan={2}>SIGNED</th>
                <th rowSpan={2}>REMARKS</th>
                <th rowSpan={2} className="no-print">
                  ACTIONS
                </th>
              </tr>
              <tr className="sub-header">
                {/* Regular */}
                <th>DAILY RATE</th>
                <th>NO. OF DAYS</th>
                <th>AMOUNT</th>
                {/* Overtime */}
                <th>NO. OF HRS</th>
                <th>AMOUNT</th>
                {showFullColumns && (
                  <>
                    <th>NIGHT DIFF (HRS)</th>
                    <th>AMOUNT</th>
                    {/* Rest Day */}
                    <th>RD DAYS</th>
                    <th>AMOUNT</th>
                    <th>RD OT HRS</th>
                    <th>AMOUNT</th>
                    {/* Holiday */}
                    <th>REG HOL DAYS</th>
                    <th>AMOUNT</th>
                    <th>REG HOL OT</th>
                    <th>AMOUNT</th>
                    <th>SPEC HOL DAYS</th>
                    <th>AMOUNT</th>
                    <th>SPEC HOL OT</th>
                    <th>AMOUNT</th>
                  </>
                )}
                {/* Deductions */}
                <th>TOTAL OFFICE VALE</th>
                <th>VALE DEDUCTION</th>
                <th>VALE BALANCE</th>
                <th>SSS CONTRIB</th>
                {showFullColumns && (
                  <>
                    <th>SSS SAL LOAN</th>
                    <th>SSS CAL LOAN</th>
                    <th>SSS EMERG</th>
                    <th>SSS RESTR</th>
                    <th>SSS COND(4)</th>
                    <th>HDMF CONTRIB</th>
                  </>
                )}
                <th>HDMF MPL</th>
                {showFullColumns && <th>HDMF CL</th>}
                <th>PHIC CONTRIB</th>
                {showFullColumns && <th>ABULOY</th>}
                <th>SITE VALE</th>
                <th>CORPO</th>
                <th>OTHERS</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={showFullColumns ? 40 : 22}
                    style={{ textAlign: 'center', padding: 24, color: '#64748b' }}
                  >
                    Walang {methodBadge} payroll records para sa site na ito. Click "+ Add Worker to
                    Payroll" sa taas.
                  </td>
                </tr>
              ) : (
                rows.map((r, idx) => (
                  <tr key={r.id}>
                    <td className="mono" style={{ textAlign: 'center', color: '#64748b' }}>
                      {idx + 1}
                    </td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>
                      <div>{r.employee_name}</div>
                      {selectedSiteId === 'ALL' && (
                        <div style={{ fontSize: 10, color: '#2563eb', fontWeight: 600 }}>
                          {r.site_name}
                        </div>
                      )}
                    </td>

                    {/* Daily Rate (Auto-pulled from Employee Profile) */}
                    <td className="mono" style={{ textAlign: 'right', color: '#475569', fontWeight: 600 }}>
                      ₱{fmt(r.daily_rate)}
                    </td>
                    {/* Days Worked */}
                    <td style={{ textAlign: 'right', background: '#eff6ff' }}>
                      <input
                        type="number"
                        step="0.5"
                        className="cell-input"
                        style={{ width: 58, fontWeight: 700, color: '#1d4ed8' }}
                        value={r.days_worked}
                        onChange={(e) =>
                          onUpdateRecord(r.id, { days_worked: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </td>
                    {/* Regular Amount */}
                    <td className="mono" style={{ textAlign: 'right', fontWeight: 600 }}>
                      {fmt(r.regular_amount)}
                    </td>

                    {/* OT Hours */}
                    <td style={{ textAlign: 'right', background: '#f0fdf4' }}>
                      <input
                        type="number"
                        step="0.5"
                        className="cell-input"
                        style={{ width: 58, fontWeight: 700, color: '#047857' }}
                        value={r.ot_hours}
                        onChange={(e) =>
                          onUpdateRecord(r.id, { ot_hours: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </td>
                    {/* OT Amount */}
                    <td className="mono" style={{ textAlign: 'right', fontWeight: 600 }}>
                      {fmt(r.ot_amount)}
                    </td>

                    {showFullColumns && (
                      <>
                        <td style={{ textAlign: 'right' }}>
                          <input
                            type="number"
                            step="0.5"
                            className="cell-input"
                            style={{ width: 54 }}
                            value={r.night_diff_hours}
                            onChange={(e) =>
                              onUpdateRecord(r.id, {
                                night_diff_hours: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </td>
                        <td className="mono" style={{ textAlign: 'right' }}>
                          {fmt(r.night_diff_amount)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <input
                            type="number"
                            step="0.5"
                            className="cell-input"
                            style={{ width: 54 }}
                            value={r.rest_day_days}
                            onChange={(e) =>
                              onUpdateRecord(r.id, {
                                rest_day_days: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </td>
                        <td className="mono" style={{ textAlign: 'right' }}>
                          {fmt(r.rest_day_amount)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <input
                            type="number"
                            step="0.5"
                            className="cell-input"
                            style={{ width: 54 }}
                            value={r.rest_day_ot_hours}
                            onChange={(e) =>
                              onUpdateRecord(r.id, {
                                rest_day_ot_hours: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </td>
                        <td className="mono" style={{ textAlign: 'right' }}>
                          {fmt(r.rest_day_ot_amount)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <input
                            type="number"
                            step="0.5"
                            className="cell-input"
                            style={{ width: 54 }}
                            value={r.reg_holiday_days}
                            onChange={(e) =>
                              onUpdateRecord(r.id, {
                                reg_holiday_days: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </td>
                        <td className="mono" style={{ textAlign: 'right' }}>
                          {fmt(r.reg_holiday_amount)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <input
                            type="number"
                            step="0.5"
                            className="cell-input"
                            style={{ width: 54 }}
                            value={r.reg_holiday_ot_hours}
                            onChange={(e) =>
                              onUpdateRecord(r.id, {
                                reg_holiday_ot_hours: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </td>
                        <td className="mono" style={{ textAlign: 'right' }}>
                          {fmt(r.reg_holiday_ot_amount)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <input
                            type="number"
                            step="0.5"
                            className="cell-input"
                            style={{ width: 54 }}
                            value={r.spec_holiday_days}
                            onChange={(e) =>
                              onUpdateRecord(r.id, {
                                spec_holiday_days: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </td>
                        <td className="mono" style={{ textAlign: 'right' }}>
                          {fmt(r.spec_holiday_amount)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <input
                            type="number"
                            step="0.5"
                            className="cell-input"
                            style={{ width: 54 }}
                            value={r.spec_holiday_ot_hours}
                            onChange={(e) =>
                              onUpdateRecord(r.id, {
                                spec_holiday_ot_hours: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </td>
                        <td className="mono" style={{ textAlign: 'right' }}>
                          {fmt(r.spec_holiday_ot_amount)}
                        </td>
                      </>
                    )}

                    {/* SSS Rate */}
                    <td style={{ textAlign: 'right' }}>
                      <input
                        type="number"
                        step="0.01"
                        className="cell-input"
                        style={{ width: 56 }}
                        value={r.sss_rate}
                        onChange={(e) =>
                          onUpdateRecord(r.id, { sss_rate: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </td>

                    {/* GCash Charge */}
                    <td style={{ textAlign: 'right' }}>
                      <input
                        type="number"
                        step="1"
                        className="cell-input"
                        style={{ width: 54 }}
                        value={r.gcash_charge}
                        onChange={(e) =>
                          onUpdateRecord(r.id, { gcash_charge: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </td>

                    {/* GROSS PAY */}
                    <td
                      className="mono"
                      style={{
                        textAlign: 'right',
                        fontWeight: 800,
                        background: '#e0f2fe',
                        color: '#0369a1',
                      }}
                    >
                      {fmt(r.gross_pay)}
                    </td>

                    {/* Office Vale Total, Deduction, Balance */}
                    <td style={{ textAlign: 'right' }}>
                      <input
                        type="number"
                        step="100"
                        className="cell-input"
                        value={r.total_office_vale}
                        onChange={(e) =>
                          onUpdateRecord(r.id, {
                            total_office_vale: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </td>
                    <td style={{ textAlign: 'right', background: '#fff1f2' }}>
                      <input
                        type="number"
                        step="100"
                        className="cell-input"
                        style={{ color: '#be123c', fontWeight: 600 }}
                        value={r.office_vale_deduction}
                        onChange={(e) =>
                          onUpdateRecord(r.id, {
                            office_vale_deduction: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </td>
                    <td
                      className="mono"
                      style={{
                        textAlign: 'right',
                        color: r.office_vale_balance > 0 ? '#b45309' : '#64748b',
                        fontWeight: r.office_vale_balance > 0 ? 700 : 400,
                      }}
                    >
                      {fmt(r.office_vale_balance)}
                    </td>

                    {/* SSS Contribution */}
                    <td style={{ textAlign: 'right' }}>
                      <input
                        type="number"
                        step="1"
                        className="cell-input"
                        style={{ width: 64 }}
                        value={r.sss_contribution}
                        onChange={(e) =>
                          onUpdateRecord(r.id, {
                            sss_contribution: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </td>

                    {showFullColumns && (
                      <>
                        <td style={{ textAlign: 'right' }}>
                          <input
                            type="number"
                            className="cell-input"
                            style={{ width: 64 }}
                            value={r.sss_salary_loan}
                            onChange={(e) =>
                              onUpdateRecord(r.id, {
                                sss_salary_loan: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <input
                            type="number"
                            className="cell-input"
                            style={{ width: 64 }}
                            value={r.sss_calamity_loan}
                            onChange={(e) =>
                              onUpdateRecord(r.id, {
                                sss_calamity_loan: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <input
                            type="number"
                            className="cell-input"
                            style={{ width: 64 }}
                            value={r.sss_emergency_loan}
                            onChange={(e) =>
                              onUpdateRecord(r.id, {
                                sss_emergency_loan: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <input
                            type="number"
                            className="cell-input"
                            style={{ width: 64 }}
                            value={r.sss_restructured}
                            onChange={(e) =>
                              onUpdateRecord(r.id, {
                                sss_restructured: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <input
                            type="number"
                            className="cell-input"
                            style={{ width: 64 }}
                            value={r.sss_condonation}
                            onChange={(e) =>
                              onUpdateRecord(r.id, {
                                sss_condonation: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <input
                            type="number"
                            className="cell-input"
                            style={{ width: 64 }}
                            value={r.hdmf_contribution}
                            onChange={(e) =>
                              onUpdateRecord(r.id, {
                                hdmf_contribution: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </td>
                      </>
                    )}

                    {/* HDMF MPL */}
                    <td style={{ textAlign: 'right' }}>
                      <input
                        type="number"
                        className="cell-input"
                        style={{ width: 64 }}
                        value={r.hdmf_mpl}
                        onChange={(e) =>
                          onUpdateRecord(r.id, { hdmf_mpl: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </td>

                    {showFullColumns && (
                      <td style={{ textAlign: 'right' }}>
                        <input
                          type="number"
                          className="cell-input"
                          style={{ width: 64 }}
                          value={r.hdmf_cl}
                          onChange={(e) =>
                            onUpdateRecord(r.id, { hdmf_cl: parseFloat(e.target.value) || 0 })
                          }
                        />
                      </td>
                    )}

                    {/* PHIC Contribution */}
                    <td style={{ textAlign: 'right' }}>
                      <input
                        type="number"
                        className="cell-input"
                        style={{ width: 64 }}
                        value={r.phic_contribution}
                        onChange={(e) =>
                          onUpdateRecord(r.id, {
                            phic_contribution: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </td>

                    {showFullColumns && (
                      <td style={{ textAlign: 'right' }}>
                        <input
                          type="number"
                          className="cell-input"
                          style={{ width: 64 }}
                          value={r.abuloy}
                          onChange={(e) =>
                            onUpdateRecord(r.id, { abuloy: parseFloat(e.target.value) || 0 })
                          }
                        />
                      </td>
                    )}

                    {/* Site Vale, Corpo, Others */}
                    <td style={{ textAlign: 'right' }}>
                      <input
                        type="number"
                        className="cell-input"
                        style={{ width: 68 }}
                        value={r.site_vale}
                        onChange={(e) =>
                          onUpdateRecord(r.id, { site_vale: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <input
                        type="number"
                        className="cell-input"
                        style={{ width: 64 }}
                        value={r.corpo}
                        onChange={(e) =>
                          onUpdateRecord(r.id, { corpo: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <input
                        type="number"
                        className="cell-input"
                        style={{ width: 64 }}
                        value={r.others}
                        onChange={(e) =>
                          onUpdateRecord(r.id, { others: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </td>

                    {/* NET PAY */}
                    <td
                      className="mono"
                      style={{
                        textAlign: 'right',
                        fontWeight: 800,
                        background: '#dcfce7',
                        color: '#15803d',
                        fontSize: 13,
                      }}
                    >
                      {fmt(r.net_pay)}
                    </td>

                    {/* Signature */}
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(r.is_signed)}
                        onChange={(e) => onUpdateRecord(r.id, { is_signed: e.target.checked })}
                      />
                    </td>

                    {/* Remarks */}
                    <td>
                      <input
                        type="text"
                        className="cell-input"
                        style={{ width: 140, textAlign: 'left', fontFamily: 'inherit' }}
                        placeholder="Add note..."
                        value={r.remarks || ''}
                        onChange={(e) => onUpdateRecord(r.id, { remarks: e.target.value })}
                      />
                    </td>

                    {/* Actions */}
                    <td className="no-print" style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <button
                          className="btn btn-outline btn-sm"
                          title="Full Details / Loans / Holidays"
                          onClick={() => setEditingRecord(r)}
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          title="View Payslip"
                          onClick={() => onOpenPayslipForRecord(r)}
                        >
                          Payslip
                        </button>
                        <button
                          className="btn btn-danger-ghost btn-sm"
                          title="Remove from Payroll"
                          onClick={() => onDeleteRecord(r.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {rows.length > 0 && (
              <tfoot>
                <tr>
                  <td className="mono" style={{ textAlign: 'center' }}>
                    {activeHeadcount}
                  </td>
                  <td>TOTAL (DAYS IN MAN-HRS = DAYS × 8):</td>
                  <td></td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(totalDaysManHours)}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(sum('regular_amount'))}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(sum('ot_hours'))}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(sum('ot_amount'))}
                  </td>
                  {showFullColumns && (
                    <>
                      <td className="mono" style={{ textAlign: 'right' }}>
                        {fmt(sum('night_diff_hours'))}
                      </td>
                      <td className="mono" style={{ textAlign: 'right' }}>
                        {fmt(sum('night_diff_amount'))}
                      </td>
                      <td colSpan={12}></td>
                    </>
                  )}
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(sum('sss_rate'))}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(sum('gcash_charge'))}
                  </td>
                  <td className="mono" style={{ textAlign: 'right', color: '#0369a1' }}>
                    ₱{fmt(sum('gross_pay'))}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(sum('total_office_vale'))}
                  </td>
                  <td className="mono" style={{ textAlign: 'right', color: '#be123c' }}>
                    {fmt(sum('office_vale_deduction'))}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(sum('office_vale_balance'))}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(sum('sss_contribution'))}
                  </td>
                  {showFullColumns && (
                    <>
                      <td className="mono" style={{ textAlign: 'right' }}>
                        {fmt(sum('sss_salary_loan'))}
                      </td>
                      <td className="mono" style={{ textAlign: 'right' }}>
                        {fmt(sum('sss_calamity_loan'))}
                      </td>
                      <td className="mono" style={{ textAlign: 'right' }}>
                        {fmt(sum('sss_emergency_loan'))}
                      </td>
                      <td className="mono" style={{ textAlign: 'right' }}>
                        {fmt(sum('sss_restructured'))}
                      </td>
                      <td className="mono" style={{ textAlign: 'right' }}>
                        {fmt(sum('sss_condonation'))}
                      </td>
                      <td className="mono" style={{ textAlign: 'right' }}>
                        {fmt(sum('hdmf_contribution'))}
                      </td>
                    </>
                  )}
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(sum('hdmf_mpl'))}
                  </td>
                  {showFullColumns && (
                    <td className="mono" style={{ textAlign: 'right' }}>
                      {fmt(sum('hdmf_cl'))}
                    </td>
                  )}
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(sum('phic_contribution'))}
                  </td>
                  {showFullColumns && (
                    <td className="mono" style={{ textAlign: 'right' }}>
                      {fmt(sum('abuloy'))}
                    </td>
                  )}
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(sum('site_vale'))}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(sum('corpo'))}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmt(sum('others'))}
                  </td>
                  <td className="mono" style={{ textAlign: 'right', color: '#15803d' }}>
                    ₱{fmt(sum('net_pay'))}
                  </td>
                  <td colSpan={3}>
                    Total Deductions: <span className="mono">₱{fmt(sum('total_deductions'))}</span>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Excel-like Project Site Tabs */}
      <div className="sheet-tabs-bar no-print">
        <button
          className={`sheet-tab ${selectedSiteId === 'ALL' ? 'active' : ''}`}
          onClick={() => onSelectSiteId('ALL')}
        >
          <Building2 size={14} />
          ALL SITES ({records.length})
        </button>
        {sites.map((s) => {
          const count = records.filter((r) => Number(r.site_id) === Number(s.id)).length;
          return (
            <button
              key={s.id}
              className={`sheet-tab ${Number(selectedSiteId) === Number(s.id) ? 'active' : ''}`}
              onClick={() => onSelectSiteId(s.id)}
            >
              <span>{s.code}</span>
              <span>{s.name}</span>
              <span
                style={{
                  fontSize: 10,
                  padding: '1px 6px',
                  borderRadius: 99,
                  background: 'rgba(0,0,0,0.2)',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Controls Bar */}
      <div
        className="card no-print"
        style={{ padding: '12px 16px', marginBottom: 16, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={15}
              style={{ position: 'absolute', left: 10, top: 10, color: '#64748b' }}
            />
            <input
              type="text"
              className="input"
              style={{ paddingLeft: 32, width: 230 }}
              placeholder="Search worker name or note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 4, borderRadius: 8 }}>
            {['ALL', 'GCASH', 'CASH'].map((m) => (
              <button
                key={m}
                className="btn btn-sm"
                style={{
                  background: paymentFilter === m ? '#0f172a' : 'transparent',
                  color: paymentFilter === m ? '#fff' : '#475569',
                }}
                onClick={() => setPaymentFilter(m)}
              >
                {m === 'ALL' ? 'Both (GCash + Cash)' : `${m} Only`}
              </button>
            ))}
          </div>

          <button
            className={`btn btn-sm ${showFullColumns ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setShowFullColumns(!showFullColumns)}
          >
            <SlidersHorizontal size={14} />
            {showFullColumns ? 'Hide Extra Holiday/Loan Columns' : 'Show All 38 Excel Columns'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="btn btn-outline btn-sm" onClick={handleExportCsv}>
            <Download size={14} /> Export CSV
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => window.print()}>
            <Printer size={14} /> Print Sheet
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={15} /> Add Worker to Payroll
          </button>
        </div>
      </div>

      {/* Render GCash and Cash Tables just like the Excel Workbook */}
      {(paymentFilter === 'ALL' || paymentFilter === 'GCASH') &&
        renderSectionTable('WEEKLY PAYROLL REPORT (GCASH)', 'GCASH', gcashRecords)}

      {(paymentFilter === 'ALL' || paymentFilter === 'CASH') &&
        renderSectionTable('WEEKLY PAYROLL REPORT (CASH)', 'CASH', cashRecords)}

      {/* Modal: Add Worker to Site Payroll */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <div style={{ fontWeight: 800, fontSize: 16 }}>
                Add Worker Entry to Payroll ({currentSite?.full_title || 'Selected Site'})
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setShowAddModal(false)}>
                <X size={15} />
              </button>
            </div>
            <form onSubmit={handleSubmitNewRow}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Select Employee (Rate & Benefits Auto-Loaded)</label>
                    <select
                      className="select"
                      required
                      value={newRow.employee_id}
                      onChange={(e) => handleEmployeeSelectForNewRow(e.target.value)}
                    >
                      <option value="">-- Choose Employee --</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.full_name} ({emp.role} • ₱{emp.daily_rate}/day • {emp.payment_method})
                        </option>
                      ))}
                    </select>
                  </div>

                  {newRow.employee_id && (
                    <div
                      style={{
                        gridColumn: '1 / -1',
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: 8,
                        padding: '10px 14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 10,
                        fontSize: 12.5,
                      }}
                    >
                      <div>
                        <span style={{ color: '#64748b' }}>Daily Rate: </span>
                        <strong className="mono" style={{ color: '#0f172a' }}>
                          ₱{fmt(newRow.daily_rate)}/day
                        </strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Mode: </span>
                        <strong>{newRow.payment_method}</strong>
                        {newRow.gcash_charge > 0 && ` (+₱${newRow.gcash_charge} fee)`}
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Auto Benefits: </span>
                        <strong>
                          PHIC ₱{newRow.phic_contribution} • SSS ₱{newRow.sss_contribution}
                        </strong>
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label" style={{ color: '#1d4ed8' }}>
                      No. of Days Worked *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      className="input"
                      style={{ fontWeight: 700, borderColor: '#2563eb' }}
                      value={newRow.days_worked}
                      onChange={(e) => setNewRow({ ...newRow, days_worked: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Overtime Hours (OT)</label>
                    <input
                      type="number"
                      step="0.5"
                      className="input"
                      value={newRow.ot_hours}
                      onChange={(e) => setNewRow({ ...newRow, ot_hours: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Site Vale (Optional ₱)</label>
                    <input
                      type="number"
                      step="1"
                      className="input"
                      value={newRow.site_vale}
                      onChange={(e) => setNewRow({ ...newRow, site_vale: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Corpo Deduction (Optional ₱)</label>
                    <input
                      type="number"
                      step="1"
                      className="input"
                      value={newRow.corpo}
                      onChange={(e) => setNewRow({ ...newRow, corpo: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Remarks / Notes (Optional)</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. svale & corpo c/o SIR DENMARK"
                      value={newRow.remarks}
                      onChange={(e) => setNewRow({ ...newRow, remarks: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={15} /> Add to Site Payroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Full 38-Column Record Editor */}
      {editingRecord && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 820 }}>
            <div className="modal-header">
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>
                  Full Payroll Breakdown — {editingRecord.employee_name}
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  {editingRecord.site_name} • {editingRecord.payment_method}
                </div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setEditingRecord(null)}>
                <X size={15} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ fontWeight: 700, marginBottom: 10, color: '#1d4ed8' }}>
                1. Earnings, Overtime, Rest Day & Holidays
              </div>
              <div className="form-grid" style={{ marginBottom: 18 }}>
                {[
                  ['daily_rate', 'Daily Rate (₱)'],
                  ['days_worked', 'Regular Days'],
                  ['ot_hours', 'Overtime Hours'],
                  ['night_diff_hours', 'Night Diff (Hrs)'],
                  ['rest_day_days', 'Rest Day (Days)'],
                  ['rest_day_ot_hours', 'Rest Day OT (Hrs)'],
                  ['reg_holiday_days', 'Regular Holiday (Days)'],
                  ['reg_holiday_ot_hours', 'Reg Holiday OT (Hrs)'],
                  ['spec_holiday_days', 'Special Holiday (Days)'],
                  ['spec_holiday_ot_hours', 'Spec Holiday OT (Hrs)'],
                  ['sss_rate', 'SSS Rate Allowance (₱)'],
                  ['gcash_charge', 'GCash Charge (₱)'],
                ].map(([key, label]) => (
                  <div className="form-group" key={key}>
                    <label className="form-label">{label}</label>
                    <input
                      type="number"
                      step="0.5"
                      className="input"
                      value={editingRecord[key]}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setEditingRecord({ ...editingRecord, [key]: val });
                        onUpdateRecord(editingRecord.id, { [key]: val });
                      }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ fontWeight: 700, marginBottom: 10, color: '#be123c' }}>
                2. Office Vale, SSS / HDMF / PHIC Benefits & Loans, Site Deductions
              </div>
              <div className="form-grid">
                {[
                  ['total_office_vale', 'Total Office Vale (₱)'],
                  ['office_vale_deduction', 'Office Vale Deduction (₱)'],
                  ['sss_contribution', 'SSS Contribution (₱)'],
                  ['sss_salary_loan', 'SSS Salary Loan (₱)'],
                  ['sss_calamity_loan', 'SSS Calamity Loan (₱)'],
                  ['sss_emergency_loan', 'SSS Emergency Loan (₱)'],
                  ['sss_restructured', 'SSS Restructured (₱)'],
                  ['sss_condonation', 'SSS Condonation (4) (₱)'],
                  ['hdmf_contribution', 'HDMF Contribution (₱)'],
                  ['hdmf_mpl', 'HDMF MPL Loan (₱)'],
                  ['hdmf_cl', 'HDMF Calamity Loan (₱)'],
                  ['phic_contribution', 'PHIC Contribution (₱)'],
                  ['abuloy', 'Abuloy (₱)'],
                  ['site_vale', 'Site Vale (₱)'],
                  ['corpo', 'Corpo (₱)'],
                  ['others', 'Others (₱)'],
                ].map(([key, label]) => (
                  <div className="form-group" key={key}>
                    <label className="form-label">{label}</label>
                    <input
                      type="number"
                      step="1"
                      className="input"
                      value={editingRecord[key]}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setEditingRecord({ ...editingRecord, [key]: val });
                        onUpdateRecord(editingRecord.id, { [key]: val });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setEditingRecord(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


import React, { useMemo } from 'react';
import { getHolidaysInPeriod } from '../data/initialPayrollData';
import {
  Building2,
  Users,
  Wallet,
  Banknote,
  TrendingUp,
  Clock,
  Calendar,
  FileText,
  ArrowRight,
  AlertCircle,
  Moon,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  ClipboardList,
} from 'lucide-react';

const fmt = (val) => {
  const n = parseFloat(val) || 0;
  return n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const fmtCompact = (val) => {
  const n = parseFloat(val) || 0;
  if (n >= 1000000) return `₱${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `₱${(n / 1000).toFixed(1)}K`;
  return `₱${n.toFixed(0)}`;
};

export default function DashboardView({
  sites,
  employees,
  records,
  holidays,
  activePeriod,
  summary,
  userRole = 'ADMIN',
  onNavigateTab,
  onJumpToSite,
  onApplyPeriodHolidays,
}) {
  const gcashTotals = summary?.gcash?.totals || {};
  const cashTotals = summary?.cash?.totals || {};

  const grandGross = (gcashTotals.gross_pay || 0) + (cashTotals.gross_pay || 0);
  const grandNet = (gcashTotals.net_pay || 0) + (cashTotals.net_pay || 0);
  const grandDeductions = (gcashTotals.total_deductions || 0) + (cashTotals.total_deductions || 0);
  const totalRegularHrs = (gcashTotals.man_hours_days || 0) + (cashTotals.man_hours_days || 0);
  const totalOtHrs = (gcashTotals.man_hours_ot || 0) + (cashTotals.man_hours_ot || 0);

  const nightShiftWorkers = useMemo(
    () => records.filter((r) => Boolean(r.is_night_shift) || (r.night_diff_hours || 0) > 0).length,
    [records]
  );

  const siteStats = useMemo(() => {
    const list = sites.map((site) => {
      const siteRecs = records.filter((r) => Number(r.site_id) === Number(site.id));
      const gross = siteRecs.reduce((acc, r) => acc + (parseFloat(r.gross_pay) || 0), 0);
      const net = siteRecs.reduce((acc, r) => acc + (parseFloat(r.net_pay) || 0), 0);
      const workers = siteRecs.filter((r) => (parseFloat(r.days_worked) || 0) > 0).length;
      return { id: site.id, code: site.code, name: site.name, gross, net, workers };
    });
    return list.sort((a, b) => b.gross - a.gross);
  }, [sites, records]);

  const maxSiteGross = Math.max(...siteStats.map((s) => s.gross), 1);

  const deductionBreakdown = useMemo(() => {
    const sum = (f) => records.reduce((acc, r) => acc + (parseFloat(r[f]) || 0), 0);
    return [
      { label: 'Site Vale', amount: sum('site_vale'), color: '#f59e0b' },
      { label: 'Office Vale', amount: sum('office_vale_deduction'), color: '#e11d48' },
      { label: 'PHIC', amount: sum('phic_contribution'), color: '#2563eb' },
      { label: 'Corpo / Others', amount: sum('corpo') + sum('others'), color: '#7c3aed' },
      {
        label: 'SSS & HDMF',
        amount:
          sum('sss_contribution') +
          sum('hdmf_contribution') +
          sum('hdmf_mpl') +
          sum('sss_salary_loan'),
        color: '#059669',
      },
    ].filter((d) => d.amount > 0);
  }, [records]);

  const topVales = useMemo(() => {
    return [...records]
      .filter((r) => (parseFloat(r.office_vale_balance) || 0) > 0)
      .sort((a, b) => (b.office_vale_balance || 0) - (a.office_vale_balance || 0))
      .slice(0, 4);
  }, [records]);

  const periodHolidays = useMemo(() => {
    const start = activePeriod?.start_date || '2026-10-30';
    const end = activePeriod?.end_date || '2026-11-05';
    return getHolidaysInPeriod(holidays, start, end);
  }, [holidays, activePeriod]);

  const gcashGross = gcashTotals.gross_pay || 0;
  const cashGross = cashTotals.gross_pay || 0;
  const gcashSharePct = grandGross > 0 ? Math.round((gcashGross / grandGross) * 100) : 0;
  const cashSharePct = 100 - gcashSharePct;

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const gcashStroke = (gcashSharePct / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Compact Single-Row Hero Strip */}
      <div
        style={{
          background:
            'radial-gradient(circle at top right, rgba(37,99,235,0.28), transparent 45%), linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#f8fafc',
          borderRadius: 12,
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#facc15', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 5 }}>
              <CheckCircle2 size={12} /> {userRole === 'ADMIN' ? 'ADMIN' : 'HR STAFF'} • {activePeriod?.period_covered}
            </div>
            <h1 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 2 }}>
              Payroll Command Center
            </h1>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { icon: <Building2 size={12} />, text: `${sites.length} Sites` },
              { icon: <Users size={12} />, text: `${employees.length} Workers` },
              { icon: <Clock size={12} />, text: `${fmtCompact(totalRegularHrs + totalOtHrs).replace('₱', '')} Hrs` },
              ...(nightShiftWorkers > 0 ? [{ icon: <Moon size={12} />, text: `${nightShiftWorkers} Night` }] : []),
            ].map((pill, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '4px 9px',
                  borderRadius: 7,
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  fontSize: 11.5,
                  color: '#e2e8f0',
                  fontWeight: 600,
                }}
              >
                {pill.icon}
                {pill.text}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-sm"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
            onClick={() => onNavigateTab('payroll')}
          >
            Payroll Sheets <ArrowRight size={13} />
          </button>
          <button
            className="btn btn-sm"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
            onClick={() => onNavigateTab('payslips')}
          >
            <FileText size={13} /> Payslips
          </button>
          {userRole === 'ADMIN' ? (
            <button className="btn btn-primary btn-sm" onClick={() => onNavigateTab('audit')}>
              <ClipboardList size={13} /> Audit Log
            </button>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => onNavigateTab('holidays')}>
              <Calendar size={13} /> Holidays
            </button>
          )}
        </div>
      </div>

      {/* Compact 4 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          {
            title: 'TOTAL GROSS PAYROLL',
            value: `₱${fmt(grandGross)}`,
            sub: `Net: ₱${fmt(grandNet)}`,
            accent: '#2563eb',
            iconBg: '#eff6ff',
            icon: <TrendingUp size={16} color="#2563eb" />,
          },
          {
            title: 'GCASH PORTAL TRANSFER',
            value: `₱${fmt(gcashTotals.deducted_to_gcash)}`,
            sub: `${gcashTotals.employee_count || 0} active GCash workers`,
            accent: '#1d4ed8',
            iconBg: '#dbeafe',
            icon: <Wallet size={16} color="#1d4ed8" />,
          },
          {
            title: 'CASH PAYOUT (NET)',
            value: `₱${fmt(cashTotals.net_pay)}`,
            sub: `${cashTotals.employee_count || 0} Cash workers`,
            accent: '#059669',
            iconBg: '#ecfdf5',
            icon: <Banknote size={16} color="#059669" />,
          },
          {
            title: 'OFFICE VALE (ENCASHMENT)',
            value: `₱${fmt(gcashTotals.office_vale_deduction)}`,
            sub: `Total Ded: ₱${fmt(grandDeductions)}`,
            accent: '#d97706',
            iconBg: '#fffbeb',
            icon: <AlertCircle size={16} color="#d97706" />,
          },
        ].map((kpi) => (
          <div
            key={kpi.title}
            className="kpi-card"
            style={{
              borderRadius: 11,
              padding: '12px 14px',
              borderTop: `3px solid ${kpi.accent}`,
              gap: 3,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.04em' }}>
                {kpi.title}
              </span>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: kpi.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {kpi.icon}
              </div>
            </div>
            <div className="mono" style={{ fontSize: 19, fontWeight: 800, color: '#0f172a' }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Single-Row 3-Column Bento Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.9fr 1.15fr', gap: 12, alignItems: 'stretch' }}>
        <div className="card" style={{ marginBottom: 0, borderRadius: 12 }}>
          <div className="card-header" style={{ padding: '10px 14px', background: '#fff' }}>
            <div className="card-title" style={{ fontSize: 13 }}>
              <Building2 size={15} color="#2563eb" />
              Payroll by Construction Site
            </div>
            <button className="btn btn-outline btn-sm" style={{ padding: '3px 8px', fontSize: 11 }} onClick={() => onNavigateTab('summary')}>
              Summary <ArrowUpRight size={12} />
            </button>
          </div>
          <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
            {siteStats.map((s, idx) => {
              const pct = Math.max(4, Math.round((s.gross / maxSiteGross) * 100));
              return (
                <div key={s.id} onClick={() => onJumpToSite(s.id)} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '68%' }}>
                      <span style={{ color: '#2563eb', marginRight: 5 }}>{idx + 1}. {s.code}</span>
                      {s.name}
                    </span>
                    <span className="mono" style={{ fontWeight: 800, color: '#0f172a' }}>₱{fmt(s.gross)}</span>
                  </div>
                  <div style={{ width: '100%', height: 5, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: idx === 0 ? 'linear-gradient(90deg, #2563eb, #60a5fa)' : 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
                        borderRadius: 99,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card" style={{ marginBottom: 0, borderRadius: 12 }}>
            <div className="card-header" style={{ padding: '10px 14px', background: '#fff' }}>
              <div className="card-title" style={{ fontSize: 13 }}>GCash vs. Cash Mix</div>
            </div>
            <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ position: 'relative', width: 88, height: 88, flexShrink: 0 }}>
                <svg width="88" height="88" viewBox="0 0 88 88">
                  <circle cx="44" cy="44" r={radius} fill="none" stroke="#10b981" strokeWidth="11" />
                  <circle
                    cx="44"
                    cy="44"
                    r={radius}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="11"
                    strokeDasharray={`${gcashStroke} ${circumference}`}
                    transform="rotate(-90 44 44)"
                    strokeLinecap="round"
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 8.5, fontWeight: 700, color: '#64748b' }}>GROSS</span>
                  <span className="mono" style={{ fontSize: 11.5, fontWeight: 800 }}>{fmtCompact(grandGross)}</span>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11.5 }}>
                <div style={{ padding: '6px 9px', borderRadius: 8, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#1d4ed8', fontWeight: 700 }}>
                    <span>GCash</span><span>{gcashSharePct}%</span>
                  </div>
                  <div className="mono" style={{ fontWeight: 800 }}>₱{fmt(gcashGross)}</div>
                </div>
                <div style={{ padding: '6px 9px', borderRadius: 8, background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#047857', fontWeight: 700 }}>
                    <span>Cash</span><span>{cashSharePct}%</span>
                  </div>
                  <div className="mono" style={{ fontWeight: 800 }}>₱{fmt(cashGross)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 0, borderRadius: 12, flex: 1 }}>
            <div className="card-header" style={{ padding: '10px 14px', background: '#fff' }}>
              <div className="card-title" style={{ fontSize: 13 }}>Deductions</div>
              <span className="mono" style={{ fontSize: 12, fontWeight: 800, color: '#be123c' }}>₱{fmt(grandDeductions)}</span>
            </div>
            <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {deductionBreakdown.map((d) => {
                const share = grandDeductions > 0 ? Math.round((d.amount / grandDeductions) * 100) : 0;
                return (
                  <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#334155', fontWeight: 600 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                      {d.label}
                    </span>
                    <span className="mono" style={{ fontWeight: 700 }}>
                      ₱{fmt(d.amount)} <span style={{ color: '#94a3b8', fontSize: 10 }}>({share}%)</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card" style={{ marginBottom: 0, borderRadius: 12 }}>
            <div className="card-header" style={{ padding: '10px 14px', background: '#fffbeb' }}>
              <div className="card-title" style={{ fontSize: 13 }}>
                <Calendar size={14} color="#d97706" />
                Cutoff Holidays ({periodHolidays.length})
              </div>
              <button className="btn btn-sm btn-emerald" style={{ padding: '3px 8px', fontSize: 11 }} onClick={onApplyPeriodHolidays}>
                <Sparkles size={11} /> Sync
              </button>
            </div>
            <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {periodHolidays.length === 0 ? (
                <div style={{ fontSize: 11.5, color: '#64748b' }}>No holidays in this cutoff.</div>
              ) : (
                periodHolidays.slice(0, 3).map((h) => (
                  <div
                    key={h.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '5px 9px',
                      background: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: 7,
                      fontSize: 11.5,
                    }}
                  >
                    <span style={{ fontWeight: 700, color: '#78350f' }}>{h.name}</span>
                    <span className="badge badge-amber" style={{ fontSize: 10 }}>
                      {h.holiday_type === 'REGULAR' ? '200%' : h.holiday_type === 'SPECIAL' ? '+30%' : '100%'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 0, borderRadius: 12, flex: 1 }}>
            <div className="card-header" style={{ padding: '10px 14px', background: '#fff' }}>
              <div className="card-title" style={{ fontSize: 13 }}>
                <Users size={14} color="#e11d48" />
                Top Office Vale Balances
              </div>
              <button className="btn btn-outline btn-sm" style={{ padding: '3px 8px', fontSize: 11 }} onClick={() => onNavigateTab('employees')}>
                All
              </button>
            </div>
            <div style={{ padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {topVales.map((r) => (
                <div
                  key={r.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 11.5,
                    paddingBottom: 6,
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{r.employee_name}</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>{r.site_code} • Ded: ₱{fmt(r.office_vale_deduction)}</div>
                  </div>
                  <div className="mono" style={{ fontWeight: 800, color: '#b45309' }}>
                    ₱{fmt(r.office_vale_balance)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

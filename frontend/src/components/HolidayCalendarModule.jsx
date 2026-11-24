import React, { useState, useMemo, useEffect } from 'react';
import PaginationBar from './PaginationBar';
import { expandHolidaysForYear, getHolidaysInPeriod } from '../data/initialPayrollData';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Trash2,
  CheckCircle2,
  X,
} from 'lucide-react';

const TYPE_META = {
  REGULAR: {
    label: 'Regular Holiday (Double Pay)',
    short: '200% Double Pay',
    bg: '#fee2e2',
    border: '#fca5a5',
    color: '#b91c1c',
  },
  SPECIAL: {
    label: 'Special Non-Working (+30%)',
    short: '+30% Special',
    bg: '#fef3c7',
    border: '#fcd34d',
    color: '#b45309',
  },
  PAID_HOLIDAY: {
    label: 'Paid Holiday (100% Unworked)',
    short: '100% Paid Holiday',
    bg: '#dcfce7',
    border: '#86efac',
    color: '#15803d',
  },
  SPECIAL_WORKING: {
    label: 'Special Working Day (Normal 100%)',
    short: 'Special Working',
    bg: '#e0f2fe',
    border: '#7dd3fc',
    color: '#0369a1',
  },
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function HolidayCalendarModule({
  holidays,
  activePeriod,
  onUpsertHoliday,
  onDeleteHoliday,
  onApplyPeriodHolidays,
}) {
  // Default to October/November 2026 (active period: Oct 30 - Nov 5, 2026)
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(9); // 0-indexed: 9 = October, 10 = November
  const [selectedDate, setSelectedDate] = useState(null);
  const [form, setForm] = useState({
    date: '',
    name: '',
    holiday_type: 'REGULAR',
    auto_apply: true,
  });
  const [banner, setBanner] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [(holidays || []).length, pageSize]);

  const yearHolidays = useMemo(
    () => expandHolidaysForYear(holidays, viewYear),
    [holidays, viewYear]
  );

  const holidayByDate = useMemo(() => {
    const map = {};
    yearHolidays.forEach((h) => {
      map[h.date] = h;
    });
    return map;
  }, [yearHolidays]);

  const periodHolidays = useMemo(() => {
    const start = activePeriod?.start_date || '2026-10-30';
    const end = activePeriod?.end_date || '2026-11-05';
    return getHolidaysInPeriod(holidays, start, end);
  }, [holidays, activePeriod]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(viewMonth + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      cells.push(`${viewYear}-${mm}-${dd}`);
    }
    return cells;
  }, [viewYear, viewMonth]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const openDateModal = (dateStr) => {
    const existing = holidayByDate[dateStr];
    setSelectedDate(dateStr);
    if (existing) {
      setForm({
        date: existing.date,
        name: existing.name,
        holiday_type: existing.holiday_type,
        auto_apply: existing.auto_apply,
      });
    } else {
      setForm({
        date: dateStr,
        name: '',
        holiday_type: 'REGULAR',
        auto_apply: true,
      });
    }
  };

  const handleSaveHoliday = async (e) => {
    e.preventDefault();
    if (!form.date || !form.name.trim()) return;
    await onUpsertHoliday(form);
    setSelectedDate(null);
    setBanner(`Saved "${form.name}" on ${form.date}. Click "Auto-Apply Period Holidays" to sync to payroll.`);
    setTimeout(() => setBanner(''), 5000);
  };

  const handleApplyToPayroll = async () => {
    const res = await onApplyPeriodHolidays();
    setBanner(
      `Applied ${res?.applied_holidays ?? periodHolidays.length} holiday(s) (${res?.reg_count || 0} Double Pay, ${res?.spec_count || 0} Special +30%, ${res?.paid_count || 0} Paid Holiday) to all workers in ${activePeriod?.period_covered}!`
    );
    setTimeout(() => setBanner(''), 6000);
  };

  const inActivePeriod = (dateStr) => {
    const start = activePeriod?.start_date || '2026-10-30';
    const end = activePeriod?.end_date || '2026-11-05';
    return dateStr >= start && dateStr <= end;
  };

  return (
    <div>
      {banner && (
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
          {banner}
        </div>
      )}

      {/* Header & Auto-Apply Bar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 14,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <CalendarIcon size={19} color="#2563eb" />
            Holiday &amp; Special Non-Working Calendar
          </div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
            Click any date to mark it as <strong>Regular Holiday (Double Pay 200%)</strong>,{' '}
            <strong>Special Non-Working (+30%)</strong>, or <strong>Paid Holiday (100%)</strong>.
            Holidays inside the active payroll period auto-add to employee pay.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            className="btn btn-outline"
            onClick={() => openDateModal(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-01`)}
          >
            <Plus size={15} /> Add Holiday Date
          </button>
          <button className="btn btn-emerald" onClick={handleApplyToPayroll}>
            <Sparkles size={15} /> Auto-Apply Period Holidays to Payroll ({periodHolidays.length})
          </button>
        </div>
      </div>

      {/* Legend + Active Period Holidays Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* Interactive Monthly Calendar */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header" style={{ background: '#0f172a', color: '#fff' }}>
            <button
              className="btn btn-sm"
              style={{ background: '#1e293b', color: '#fff' }}
              onClick={handlePrevMonth}
            >
              <ChevronLeft size={16} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontWeight: 800, fontSize: 15 }}>
                {MONTH_NAMES[viewMonth]}
              </span>
              <select
                className="select"
                style={{ padding: '3px 8px', fontSize: 13, fontWeight: 700, background: '#1e293b', color: '#fff', borderColor: '#334155' }}
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
              >
                {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn btn-sm"
              style={{ background: '#1e293b', color: '#fff' }}
              onClick={handleNextMonth}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ padding: 14 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 6,
                marginBottom: 8,
                textAlign: 'center',
                fontSize: 11,
                fontWeight: 700,
                color: '#64748b',
              }}
            >
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 6,
              }}
            >
              {calendarDays.map((dateStr, idx) => {
                if (!dateStr) {
                  return <div key={`empty-${idx}`} style={{ minHeight: 74 }} />;
                }
                const dayNum = Number(dateStr.split('-')[2]);
                const hol = holidayByDate[dateStr];
                const meta = hol ? TYPE_META[hol.holiday_type] : null;
                const isPeriod = inActivePeriod(dateStr);

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => openDateModal(dateStr)}
                    style={{
                      minHeight: 74,
                      padding: 6,
                      borderRadius: 8,
                      border: meta
                        ? `1.5px solid ${meta.border}`
                        : isPeriod
                        ? '1.5px solid #3b82f6'
                        : '1px solid #e2e8f0',
                      background: meta ? meta.bg : isPeriod ? '#eff6ff' : '#ffffff',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.1s',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <span
                        className="mono"
                        style={{
                          fontSize: 12.5,
                          fontWeight: 800,
                          color: meta ? meta.color : '#0f172a',
                        }}
                      >
                        {dayNum}
                      </span>
                      {isPeriod && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: '#1d4ed8',
                            background: '#dbeafe',
                            padding: '1px 4px',
                            borderRadius: 4,
                          }}
                        >
                          PERIOD
                        </span>
                      )}
                    </div>

                    {hol && (
                      <div>
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: meta.color,
                            lineHeight: 1.2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {hol.name}
                        </div>
                        <div style={{ fontSize: 9.5, fontWeight: 800, color: meta.color }}>
                          {meta.short}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Active Period Holidays & List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header" style={{ background: '#eff6ff' }}>
              <div className="card-title" style={{ fontSize: 13.5 }}>
                ACTIVE PAYROLL PERIOD HOLIDAYS
              </div>
              <span className="badge badge-gcash">{activePeriod?.period_covered}</span>
            </div>
            <div style={{ padding: 14 }}>
              {periodHolidays.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: 12.5 }}>
                  No holidays set between {activePeriod?.start_date} and {activePeriod?.end_date}.
                  Click any blue-bordered date on the calendar to add one.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {periodHolidays.map((h) => {
                    const meta = TYPE_META[h.holiday_type];
                    return (
                      <div
                        key={h.id}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 8,
                          background: meta.bg,
                          border: `1px solid ${meta.border}`,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 12.5, color: meta.color }}>
                            {h.name}
                          </div>
                          <div style={{ fontSize: 11, color: meta.color }}>
                            <span className="mono">{h.date}</span> • {meta.label}
                          </div>
                        </div>
                        <button
                          className="btn btn-danger-ghost btn-sm"
                          onClick={() => onDeleteHoliday(h.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <div className="card-title" style={{ fontSize: 13.5 }}>
                {viewYear} HOLIDAYS ({yearHolidays.length} Fixed + Custom)
              </div>
            </div>
            <div style={{ maxHeight: 260, overflowY: 'auto' }}>
              <table className="payroll-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>DATE</th>
                    <th style={{ textAlign: 'left' }}>HOLIDAY NAME</th>
                    <th style={{ textAlign: 'left' }}>PAY RULE</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {(pageSize === 'ALL'
                    ? yearHolidays
                    : yearHolidays.slice(
                        (currentPage - 1) * Number(pageSize),
                        currentPage * Number(pageSize)
                      )
                  ).map((h) => {
                    const meta = TYPE_META[h.holiday_type] || TYPE_META.REGULAR;
                    return (
                      <tr key={h.id}>
                        <td className="mono" style={{ fontWeight: 700 }}>
                          {h.date}
                        </td>
                        <td style={{ fontWeight: 600 }}>{h.name}</td>
                        <td>
                          <span
                            className="badge"
                            style={{ background: meta.bg, color: meta.color }}
                          >
                            {meta.short}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="btn btn-danger-ghost btn-sm"
                            onClick={() => onDeleteHoliday(h.id)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <PaginationBar
              totalItems={yearHolidays.length}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(sz) => setPageSize(sz)}
              pageSizeOptions={[5, 10, 20]}
              itemLabel="holidays"
            />
          </div>
        </div>
      </div>

      {/* Modal: Set Holiday on Date */}
      {selectedDate && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 460 }}>
            <div className="modal-header">
              <div style={{ fontWeight: 800, fontSize: 16 }}>
                Set Holiday / Special Day ({selectedDate})
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedDate(null)}
              >
                <X size={15} />
              </button>
            </div>
            <form onSubmit={handleSaveHoliday}>
              <div className="modal-body">
                <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="input"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Holiday / Occasion Name</label>
                    <input
                      type="text"
                      className="input"
                      required
                      placeholder="e.g. Bonifacio Day / All Saints' Day"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Payroll Rate Rule</label>
                    <select
                      className="select"
                      value={form.holiday_type}
                      onChange={(e) => setForm({ ...form, holiday_type: e.target.value })}
                    >
                      <option value="REGULAR">
                        Regular Holiday (Double Pay — +100% Daily Rate)
                      </option>
                      <option value="SPECIAL">
                        Special Non-Working Holiday (+30% Daily Rate)
                      </option>
                      <option value="SPECIAL_WORKING">
                        Special Working Day (Normal 100% Rate)
                      </option>
                      <option value="PAID_HOLIDAY">
                        Paid Holiday (100% Daily Rate Even Unworked)
                      </option>
                    </select>
                  </div>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(form.auto_apply)}
                      onChange={(e) => setForm({ ...form, auto_apply: e.target.checked })}
                    />
                    <span>Auto-add to employee payroll when this date falls in period</span>
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setSelectedDate(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

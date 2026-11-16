import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Table2,
  Building2,
  Users,
  ShieldCheck,
  FileText,
  HardHat,
  RotateCcw,
  Calendar,
} from 'lucide-react';

import {
  fetchBootstrapAndPayroll,
  createSiteApi,
  updateSiteApi,
  deleteSiteApi,
  createEmployeeApi,
  updateEmployeeApi,
  deleteEmployeeApi,
  updateBenefitsConfigApi,
  createRecordApi,
  updateRecordApi,
  deleteRecordApi,
  resetToSampleExcelData,
  upsertHolidayApi,
  deleteHolidayApi,
  applyPeriodHolidaysApi,
} from './services/api';
import { computeFinanceSummary, INITIAL_BENEFIT_CONFIG, INITIAL_HOLIDAYS } from './data/initialPayrollData';

import FinanceSummaryView from './components/FinanceSummaryView';
import PayrollSheetView from './components/PayrollSheetView';
import SitesModule from './components/SitesModule';
import EmployeesModule from './components/EmployeesModule';
import BenefitsModule from './components/BenefitsModule';
import PayslipsModule from './components/PayslipsModule';
import HolidayCalendarModule from './components/HolidayCalendarModule';

export default function App() {
  const [activeTab, setActiveTab] = useState('payroll'); // 'summary', 'payroll', 'sites', 'employees', 'benefits', 'holidays', 'payslips'
  const [sites, setSites] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [records, setRecords] = useState([]);
  const [holidays, setHolidays] = useState(INITIAL_HOLIDAYS);
  const [benefitConfig, setBenefitConfig] = useState(INITIAL_BENEFIT_CONFIG);
  const [selectedSiteId, setSelectedSiteId] = useState(1);
  const [focusedPayslipRecordId, setFocusedPayslipRecordId] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchBootstrapAndPayroll();
    setSites(data.sites || []);
    setEmployees(data.employees || []);
    setPeriods(data.periods || []);
    setRecords(data.records || []);
    setHolidays(data.holidays || INITIAL_HOLIDAYS);
    setBenefitConfig(data.benefit_config || INITIAL_BENEFIT_CONFIG);
    setBackendConnected(Boolean(data.backendConnected));
    if (data.sites?.length && !selectedSiteId) {
      setSelectedSiteId(data.sites[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const activePeriod = periods[0] || {
    id: 1,
    period_covered: 'OCTOBER 30-NOVEMBER 5, 2026',
    finance_note:
      'NOTE: HINDI NI-DISBURSE, PAPALITAN NI BOSS SAKIN NG CHEQUE ENCASHMENT EVERY LAST WEEK OF THE MONTH',
    prepared_by: 'Finance / Payroll Admin',
  };

  const financeSummary = useMemo(
    () => computeFinanceSummary(sites, records),
    [sites, records]
  );

  // Handlers
  const handleCreateSite = async (payload) => {
    const created = await createSiteApi(payload);
    setSites((prev) => [...prev, created]);
  };

  const handleUpdateSite = async (siteId, payload) => {
    const updated = await updateSiteApi(siteId, payload);
    setSites((prev) => prev.map((s) => (Number(s.id) === Number(siteId) ? updated : s)));
  };

  const handleDeleteSite = async (siteId) => {
    await deleteSiteApi(siteId);
    setSites((prev) => prev.filter((s) => Number(s.id) !== Number(siteId)));
    setRecords((prev) => prev.filter((r) => Number(r.site_id) !== Number(siteId)));
  };

  const handleCreateEmployee = async (payload) => {
    const { employee, createdRecord } = await createEmployeeApi(payload);
    setEmployees((prev) => [...prev, employee]);
    if (createdRecord) {
      setRecords((prev) => [...prev, createdRecord]);
    }
  };

  const handleUpdateEmployee = async (empId, payload) => {
    const res = await updateEmployeeApi(empId, payload);
    const updatedEmp = res.employee || res;
    setEmployees((prev) => prev.map((e) => (Number(e.id) === Number(empId) ? updatedEmp : e)));
    if (res.records) {
      setRecords(res.records);
    }
  };

  const handleDeleteEmployee = async (empId) => {
    await deleteEmployeeApi(empId);
    setEmployees((prev) => prev.filter((e) => Number(e.id) !== Number(empId)));
    setRecords((prev) => prev.filter((r) => Number(r.employee_id) !== Number(empId)));
  };

  const handleSaveBenefitsConfig = async (payload) => {
    const res = await updateBenefitsConfigApi(payload);
    setBenefitConfig(res.benefit_config);
    setRecords(res.records);
  };

  const handleCreateRecord = async (payload) => {
    const rec = await createRecordApi(payload);
    setRecords((prev) => [...prev, rec]);
  };

  const handleUpdateRecord = async (recordId, patch) => {
    const updated = await updateRecordApi(recordId, patch);
    if (updated) {
      setRecords((prev) =>
        prev.map((r) => (Number(r.id) === Number(recordId) ? updated : r))
      );
    }
  };

  const handleDeleteRecord = async (recordId) => {
    await deleteRecordApi(recordId);
    setRecords((prev) => prev.filter((r) => Number(r.id) !== Number(recordId)));
  };

  const handleResetDemo = () => {
    resetToSampleExcelData();
    loadData();
  };

  const handleJumpToSite = (siteId) => {
    setSelectedSiteId(siteId);
    setActiveTab('payroll');
  };

  const handleOpenPayslipForRecord = (rec) => {
    setFocusedPayslipRecordId(rec.id);
    setActiveTab('payslips');
  };

  const handleUpsertHoliday = async (payload) => {
    const nextHolidays = await upsertHolidayApi(payload);
    setHolidays(nextHolidays);
  };

  const handleDeleteHoliday = async (holidayId) => {
    const nextHolidays = await deleteHolidayApi(holidayId);
    setHolidays(nextHolidays);
  };

  const handleApplyPeriodHolidays = async () => {
    const res = await applyPeriodHolidaysApi(activePeriod.id);
    if (res?.records) {
      setRecords(res.records);
    }
    return res;
  };

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand-box">
          <div className="brand-icon">
            <HardHat size={22} />
          </div>
          <div>
            <div className="brand-title">BUILDCORE PAYROLL</div>
            <div className="brand-sub">Construction Site Payroll ERP</div>
          </div>
        </div>

        <div className="nav-section-label">Payroll Operations</div>
        <div className="nav-list">
          <button
            className={`nav-btn ${activeTab === 'payroll' ? 'active' : ''}`}
            onClick={() => setActiveTab('payroll')}
          >
            <span className="nav-btn-left">
              <Table2 size={17} />
              <span>Site Payroll Sheets</span>
            </span>
            <span className="nav-badge">{records.length}</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            <span className="nav-btn-left">
              <LayoutDashboard size={17} />
              <span>Finance Summary (GCash/Cash)</span>
            </span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'payslips' ? 'active' : ''}`}
            onClick={() => {
              setFocusedPayslipRecordId(null);
              setActiveTab('payslips');
            }}
          >
            <span className="nav-btn-left">
              <FileText size={17} />
              <span>Employee Payslips</span>
            </span>
            <span className="nav-badge">Print</span>
          </button>
        </div>

        <div className="nav-section-label">Management & HR</div>
        <div className="nav-list">
          <button
            className={`nav-btn ${activeTab === 'sites' ? 'active' : ''}`}
            onClick={() => setActiveTab('sites')}
          >
            <span className="nav-btn-left">
              <Building2 size={17} />
              <span>Project Sites (Add Site)</span>
            </span>
            <span className="nav-badge">{sites.length}</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            <span className="nav-btn-left">
              <Users size={17} />
              <span>Employees (Add Employee)</span>
            </span>
            <span className="nav-badge">{employees.length}</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'benefits' ? 'active' : ''}`}
            onClick={() => setActiveTab('benefits')}
          >
            <span className="nav-btn-left">
              <ShieldCheck size={17} />
              <span>HR Benefits Module</span>
            </span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'holidays' ? 'active' : ''}`}
            onClick={() => setActiveTab('holidays')}
          >
            <span className="nav-btn-left">
              <Calendar size={17} />
              <span>Holiday Calendar</span>
            </span>
            <span className="nav-badge">{holidays.length}</span>
          </button>
        </div>

        {/* Quick Site Jump List in Sidebar */}
        <div className="nav-section-label">Quick Site Sheets</div>
        <div className="nav-list" style={{ paddingBottom: 20 }}>
          {sites.map((s) => (
            <button
              key={s.id}
              className="nav-btn"
              style={{
                padding: '7px 12px',
                fontSize: 11.5,
                background:
                  activeTab === 'payroll' && Number(selectedSiteId) === Number(s.id)
                    ? 'rgba(250, 204, 21, 0.16)'
                    : 'transparent',
                color:
                  activeTab === 'payroll' && Number(selectedSiteId) === Number(s.id)
                    ? '#facc15'
                    : '#94a3b8',
              }}
              onClick={() => handleJumpToSite(s.id)}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                • {s.code} {s.name}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-area">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                WEEKLY CONSTRUCTION PAYROLL SYSTEM
              </div>
              <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={13} color="#2563eb" />
                <span>
                  Active Period: <strong style={{ color: '#0f172a' }}>{activePeriod.period_covered}</strong>
                </span>
                <span>•</span>
                <span
                  style={{
                    color: backendConnected ? '#059669' : '#2563eb',
                    fontWeight: 600,
                  }}
                >
                  {backendConnected ? '● Django API Connected' : '● Live Formula Engine Ready'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              className="btn btn-outline btn-sm"
              title="Reset to exact uploaded Excel data"
              onClick={handleResetDemo}
            >
              <RotateCcw size={13} /> Reset Excel Data
            </button>
          </div>
        </header>

        <main className="content-wrap">
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
              Loading construction payroll data...
            </div>
          ) : (
            <>
              {activeTab === 'summary' && (
                <FinanceSummaryView
                  summary={financeSummary}
                  activePeriod={activePeriod}
                  onJumpToSite={handleJumpToSite}
                />
              )}

              {activeTab === 'payroll' && (
                <PayrollSheetView
                  sites={sites}
                  employees={employees}
                  records={records}
                  benefitConfig={benefitConfig}
                  activePeriod={activePeriod}
                  holidays={holidays}
                  selectedSiteId={selectedSiteId}
                  onSelectSiteId={setSelectedSiteId}
                  onUpdateRecord={handleUpdateRecord}
                  onCreateRecord={handleCreateRecord}
                  onDeleteRecord={handleDeleteRecord}
                  onOpenPayslipForRecord={handleOpenPayslipForRecord}
                  onApplyPeriodHolidays={handleApplyPeriodHolidays}
                />
              )}

              {activeTab === 'sites' && (
                <SitesModule
                  sites={sites}
                  employees={employees}
                  records={records}
                  onCreateSite={handleCreateSite}
                  onUpdateSite={handleUpdateSite}
                  onDeleteSite={handleDeleteSite}
                  onJumpToSitePayroll={handleJumpToSite}
                />
              )}

              {activeTab === 'employees' && (
                <EmployeesModule
                  employees={employees}
                  sites={sites}
                  benefitConfig={benefitConfig}
                  onCreateEmployee={handleCreateEmployee}
                  onUpdateEmployee={handleUpdateEmployee}
                  onDeleteEmployee={handleDeleteEmployee}
                />
              )}

              {activeTab === 'benefits' && (
                <BenefitsModule
                  benefitConfig={benefitConfig}
                  employees={employees}
                  onSaveBenefitsConfig={handleSaveBenefitsConfig}
                  onUpdateEmployee={handleUpdateEmployee}
                />
              )}

              {activeTab === 'holidays' && (
                <HolidayCalendarModule
                  holidays={holidays}
                  activePeriod={activePeriod}
                  onUpsertHoliday={handleUpsertHoliday}
                  onDeleteHoliday={handleDeleteHoliday}
                  onApplyPeriodHolidays={handleApplyPeriodHolidays}
                />
              )}

              {activeTab === 'payslips' && (
                <PayslipsModule
                  sites={sites}
                  records={records}
                  activePeriod={activePeriod}
                  focusedRecordId={focusedPayslipRecordId}
                  onClearFocusedRecord={() => setFocusedPayslipRecordId(null)}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}


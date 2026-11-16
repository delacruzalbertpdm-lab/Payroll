import {
  buildInitialDataset,
  computeRecordFormulas,
  computeFinanceSummary,
  INITIAL_HOLIDAYS,
} from '../data/initialPayrollData';

const STORAGE_KEY = 'buildcore_construction_payroll_v1';
const API_BASE = 'http://127.0.0.1:8000/api';

function loadLocalStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.sites) && Array.isArray(parsed.records)) {
        if (!Array.isArray(parsed.holidays)) {
          parsed.holidays = [...INITIAL_HOLIDAYS];
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse local store, resetting to default', e);
  }
  const initial = buildInitialDataset();
  saveLocalStore(initial);
  return initial;
}

function saveLocalStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.warn('Could not save to localStorage', e);
  }
}

async function tryFetch(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1800);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...options,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

export async function fetchBootstrapAndPayroll() {
  const remoteBoot = await tryFetch('/bootstrap/');
  if (remoteBoot && remoteBoot.active_period_id) {
    const remotePayroll = await tryFetch(`/payroll/${remoteBoot.active_period_id}/`);
    if (remotePayroll) {
      const store = {
        sites: remoteBoot.sites,
        benefit_config: remoteBoot.benefit_config,
        employees: remoteBoot.employees,
        periods: remoteBoot.periods,
        records: remotePayroll.records,
      };
      saveLocalStore(store);
      return {
        ...store,
        active_period_id: remoteBoot.active_period_id,
        summary: remotePayroll.summary,
        backendConnected: true,
      };
    }
  }

  const local = loadLocalStore();
  const activePeriodId = local.periods[0]?.id || 1;
  const periodRecords = local.records.filter((r) => Number(r.period_id) === Number(activePeriodId));
  return {
    ...local,
    active_period_id: activePeriodId,
    records: periodRecords,
    summary: computeFinanceSummary(local.sites, periodRecords),
    backendConnected: false,
  };
}

export async function createSiteApi(payload) {
  const remote = await tryFetch('/sites/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const store = loadLocalStore();
  const newSite = remote?.site || {
    id: Date.now(),
    code: (payload.code || '').trim().toUpperCase(),
    name: (payload.name || '').trim().toUpperCase(),
    full_title: `${(payload.code || '').trim().toUpperCase()} ${(payload.name || '').trim().toUpperCase()}`.trim(),
    project_in_charge: (payload.project_in_charge || '').trim(),
    location: (payload.location || '').trim(),
    is_active: true,
    employee_count: 0,
  };
  store.sites.push(newSite);
  saveLocalStore(store);
  return newSite;
}

export async function updateSiteApi(siteId, payload) {
  await tryFetch(`/sites/${siteId}/`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  const store = loadLocalStore();
  store.sites = store.sites.map((s) => {
    if (Number(s.id) !== Number(siteId)) return s;
    const code = payload.code !== undefined ? payload.code.trim().toUpperCase() : s.code;
    const name = payload.name !== undefined ? payload.name.trim().toUpperCase() : s.name;
    return {
      ...s,
      ...payload,
      code,
      name,
      full_title: `${code} ${name}`.trim(),
    };
  });
  saveLocalStore(store);
  return store.sites.find((s) => Number(s.id) === Number(siteId));
}

export async function deleteSiteApi(siteId) {
  await tryFetch(`/sites/${siteId}/`, { method: 'DELETE' });
  const store = loadLocalStore();
  store.sites = store.sites.filter((s) => Number(s.id) !== Number(siteId));
  store.records = store.records.filter((r) => Number(r.site_id) !== Number(siteId));
  saveLocalStore(store);
  return true;
}

export async function createEmployeeApi(payload) {
  const remote = await tryFetch('/employees/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const store = loadLocalStore();
  const site = store.sites.find((s) => Number(s.id) === Number(payload.site_id));
  const emp = remote?.employee || {
    id: Date.now(),
    full_name: (payload.full_name || '').trim().toUpperCase(),
    role: (payload.role || 'Site Worker').trim(),
    site_id: Number(payload.site_id) || null,
    site_name: site ? site.full_title : 'Unassigned',
    daily_rate: parseFloat(payload.daily_rate) || 620,
    payment_method: payload.payment_method || 'GCASH',
    gcash_number: (payload.gcash_number || '').trim(),
    total_office_vale: parseFloat(payload.total_office_vale) || 0,
    default_office_vale_deduction: parseFloat(payload.default_office_vale_deduction) || 0,
    has_sss: Boolean(payload.has_sss),
    has_phic: payload.has_phic !== undefined ? Boolean(payload.has_phic) : true,
    has_hdmf: Boolean(payload.has_hdmf),
    has_gcash_charge:
      payload.has_gcash_charge !== undefined
        ? Boolean(payload.has_gcash_charge)
        : (payload.payment_method || 'GCASH') === 'GCASH',
    sss_salary_loan: parseFloat(payload.sss_salary_loan) || 0,
    sss_calamity_loan: parseFloat(payload.sss_calamity_loan) || 0,
    sss_emergency_loan: parseFloat(payload.sss_emergency_loan) || 0,
    sss_restructured: parseFloat(payload.sss_restructured) || 0,
    sss_condonation: parseFloat(payload.sss_condonation) || 0,
    hdmf_mpl: parseFloat(payload.hdmf_mpl) || 0,
    hdmf_cl: parseFloat(payload.hdmf_cl) || 0,
    is_active: true,
  };

  store.employees.push(emp);

  let createdRecord = null;
  if (payload.add_to_active_period && emp.site_id && site) {
    const cfg = store.benefit_config;
    const activePeriod = store.periods[0];
    createdRecord = computeRecordFormulas(
      {
        id: Date.now() + 1,
        period_id: activePeriod.id,
        period_covered: activePeriod.period_covered,
        site_id: site.id,
        site_code: site.code,
        site_name: site.full_title,
        employee_id: emp.id,
        employee_name: emp.full_name,
        employee_role: emp.role,
        payment_method: emp.payment_method,
        daily_rate: emp.daily_rate,
        days_worked: parseFloat(payload.initial_days_worked) || 5,
        ot_hours: parseFloat(payload.initial_ot_hours) || 0,
        night_diff_hours: 0,
        rest_day_days: 0,
        rest_day_ot_hours: 0,
        reg_holiday_days: 0,
        reg_holiday_ot_hours: 0,
        spec_holiday_days: 0,
        spec_holiday_ot_hours: 0,
        sss_rate: cfg.sss_rate_default || 0,
        gcash_charge:
          emp.payment_method === 'GCASH' && emp.has_gcash_charge ? cfg.gcash_charge_default : 0,
        total_office_vale: emp.total_office_vale,
        office_vale_deduction: emp.default_office_vale_deduction,
        sss_contribution: emp.has_sss ? cfg.sss_contribution_default : 0,
        sss_salary_loan: emp.sss_salary_loan,
        sss_calamity_loan: emp.sss_calamity_loan,
        sss_emergency_loan: emp.sss_emergency_loan,
        sss_restructured: emp.sss_restructured,
        sss_condonation: emp.sss_condonation,
        hdmf_contribution: emp.has_hdmf ? cfg.hdmf_contribution_default : 0,
        hdmf_mpl: emp.hdmf_mpl,
        hdmf_cl: emp.hdmf_cl,
        phic_contribution: emp.has_phic ? cfg.phic_contribution_default : 0,
        abuloy: cfg.abuloy_default || 0,
        site_vale: 0,
        corpo: 0,
        others: 0,
        is_signed: true,
        remarks: '',
      },
      cfg
    );
    store.records.push(createdRecord);
  }

  saveLocalStore(store);
  return { employee: emp, createdRecord };
}

export async function updateEmployeeApi(empId, payload) {
  await tryFetch(`/employees/${empId}/`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  const store = loadLocalStore();
  const cfg = store.benefit_config;
  const site = store.sites.find((s) => Number(s.id) === Number(payload.site_id));

  store.employees = store.employees.map((e) => {
    if (Number(e.id) !== Number(empId)) return e;
    return {
      ...e,
      ...payload,
      site_id: payload.site_id !== undefined ? Number(payload.site_id) || null : e.site_id,
      site_name:
        payload.site_id !== undefined ? (site ? site.full_title : 'Unassigned') : e.site_name,
    };
  });

  const updatedEmp = store.employees.find((e) => Number(e.id) === Number(empId));

  // Sync updated daily_rate or payment_method to active payroll records
  if (updatedEmp && (payload.daily_rate !== undefined || payload.payment_method !== undefined)) {
    store.records = store.records.map((r) => {
      if (Number(r.employee_id) !== Number(empId)) return r;
      return computeRecordFormulas(
        {
          ...r,
          daily_rate: payload.daily_rate !== undefined ? parseFloat(payload.daily_rate) || 0 : r.daily_rate,
          payment_method: payload.payment_method !== undefined ? payload.payment_method : r.payment_method,
        },
        cfg
      );
    });
  }

  saveLocalStore(store);
  return { employee: updatedEmp, records: store.records };
}

export async function deleteEmployeeApi(empId) {
  await tryFetch(`/employees/${empId}/`, { method: 'DELETE' });
  const store = loadLocalStore();
  store.employees = store.employees.filter((e) => Number(e.id) !== Number(empId));
  store.records = store.records.filter((r) => Number(r.employee_id) !== Number(empId));
  saveLocalStore(store);
  return true;
}

export async function updateBenefitsConfigApi(payload) {
  await tryFetch('/benefits/', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  const store = loadLocalStore();
  const nextCfg = {
    ...store.benefit_config,
    ...payload,
  };
  delete nextCfg.apply_to_open_period;
  delete nextCfg.period_id;

  store.benefit_config = nextCfg;

  if (payload.apply_to_open_period) {
    const empMap = {};
    store.employees.forEach((e) => {
      empMap[e.id] = e;
    });

    store.records = store.records.map((rec) => {
      const emp = empMap[rec.employee_id];
      const updated = { ...rec };
      if (emp) {
        updated.sss_contribution = emp.has_sss ? parseFloat(nextCfg.sss_contribution_default) || 0 : 0;
        updated.phic_contribution = emp.has_phic ? parseFloat(nextCfg.phic_contribution_default) || 0 : 0;
        updated.hdmf_contribution = emp.has_hdmf ? parseFloat(nextCfg.hdmf_contribution_default) || 0 : 0;
        if (updated.payment_method === 'GCASH' && emp.has_gcash_charge && updated.days_worked > 0) {
          updated.gcash_charge = parseFloat(nextCfg.gcash_charge_default) || 0;
        }
      }
      return computeRecordFormulas(updated, nextCfg);
    });
  } else {
    store.records = store.records.map((rec) => computeRecordFormulas(rec, nextCfg));
  }

  saveLocalStore(store);
  return {
    benefit_config: store.benefit_config,
    records: store.records,
  };
}

export async function createRecordApi(payload) {
  const remote = await tryFetch('/records/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const store = loadLocalStore();
  const cfg = store.benefit_config;
  const site = store.sites.find((s) => Number(s.id) === Number(payload.site_id));
  const emp = store.employees.find((e) => Number(e.id) === Number(payload.employee_id));
  const period = store.periods.find((p) => Number(p.id) === Number(payload.period_id)) || store.periods[0];

  const payMethod = payload.payment_method || emp?.payment_method || 'GCASH';

  const newRec =
    remote?.record ||
    computeRecordFormulas(
      {
        id: Date.now(),
        period_id: period.id,
        period_covered: period.period_covered,
        site_id: site.id,
        site_code: site.code,
        site_name: site.full_title,
        employee_id: emp.id,
        employee_name: emp.full_name,
        employee_role: emp.role,
        payment_method: payMethod,
        daily_rate: payload.daily_rate !== undefined ? payload.daily_rate : emp.daily_rate,
        days_worked: payload.days_worked ?? 5,
        ot_hours: payload.ot_hours ?? 0,
        night_diff_hours: payload.night_diff_hours ?? 0,
        rest_day_days: payload.rest_day_days ?? 0,
        rest_day_ot_hours: payload.rest_day_ot_hours ?? 0,
        reg_holiday_days: payload.reg_holiday_days ?? 0,
        reg_holiday_ot_hours: payload.reg_holiday_ot_hours ?? 0,
        spec_holiday_days: payload.spec_holiday_days ?? 0,
        spec_holiday_ot_hours: payload.spec_holiday_ot_hours ?? 0,
        sss_rate: payload.sss_rate ?? cfg.sss_rate_default ?? 0,
        gcash_charge:
          payload.gcash_charge !== undefined
            ? payload.gcash_charge
            : payMethod === 'GCASH' && emp.has_gcash_charge
              ? cfg.gcash_charge_default
              : 0,
        total_office_vale: payload.total_office_vale ?? emp.total_office_vale ?? 0,
        office_vale_deduction: payload.office_vale_deduction ?? emp.default_office_vale_deduction ?? 0,
        sss_contribution:
          payload.sss_contribution !== undefined
            ? payload.sss_contribution
            : emp.has_sss
              ? cfg.sss_contribution_default
              : 0,
        sss_salary_loan: payload.sss_salary_loan ?? emp.sss_salary_loan ?? 0,
        sss_calamity_loan: payload.sss_calamity_loan ?? emp.sss_calamity_loan ?? 0,
        sss_emergency_loan: payload.sss_emergency_loan ?? emp.sss_emergency_loan ?? 0,
        sss_restructured: payload.sss_restructured ?? emp.sss_restructured ?? 0,
        sss_condonation: payload.sss_condonation ?? emp.sss_condonation ?? 0,
        hdmf_contribution:
          payload.hdmf_contribution !== undefined
            ? payload.hdmf_contribution
            : emp.has_hdmf
              ? cfg.hdmf_contribution_default
              : 0,
        hdmf_mpl: payload.hdmf_mpl ?? emp.hdmf_mpl ?? 0,
        hdmf_cl: payload.hdmf_cl ?? emp.hdmf_cl ?? 0,
        phic_contribution:
          payload.phic_contribution !== undefined
            ? payload.phic_contribution
            : emp.has_phic
              ? cfg.phic_contribution_default
              : 0,
        abuloy: payload.abuloy ?? cfg.abuloy_default ?? 0,
        site_vale: payload.site_vale ?? 0,
        corpo: payload.corpo ?? 0,
        others: payload.others ?? 0,
        is_signed: true,
        remarks: payload.remarks || '',
      },
      cfg
    );

  store.records.push(newRec);
  saveLocalStore(store);
  return newRec;
}

export async function updateRecordApi(recordId, patch) {
  await tryFetch(`/records/${recordId}/`, {
    method: 'PUT',
    body: JSON.stringify(patch),
  });

  const store = loadLocalStore();
  const cfg = store.benefit_config;
  let updatedRecord = null;

  store.records = store.records.map((r) => {
    if (Number(r.id) !== Number(recordId)) return r;
    updatedRecord = computeRecordFormulas({ ...r, ...patch }, cfg);
    return updatedRecord;
  });

  saveLocalStore(store);
  return updatedRecord;
}

export async function deleteRecordApi(recordId) {
  await tryFetch(`/records/${recordId}/`, { method: 'DELETE' });
  const store = loadLocalStore();
  store.records = store.records.filter((r) => Number(r.id) !== Number(recordId));
  saveLocalStore(store);
  return true;
}

export function resetToSampleExcelData() {
  localStorage.removeItem(STORAGE_KEY);
  return loadLocalStore();
}

export async function upsertHolidayApi(payload) {
  const remote = await tryFetch('/holidays/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const store = loadLocalStore();
  if (!Array.isArray(store.holidays)) store.holidays = [];

  const holidayObj = remote?.holiday || {
    id: Date.now(),
    date: payload.date,
    name: (payload.name || 'Holiday').trim(),
    holiday_type: payload.holiday_type || 'REGULAR',
    auto_apply: payload.auto_apply !== undefined ? Boolean(payload.auto_apply) : true,
  };

  const idx = store.holidays.findIndex((h) => h.date === holidayObj.date);
  if (idx >= 0) {
    store.holidays[idx] = { ...store.holidays[idx], ...holidayObj };
  } else {
    store.holidays.push(holidayObj);
  }
  store.holidays.sort((a, b) => a.date.localeCompare(b.date));
  saveLocalStore(store);
  return store.holidays;
}

export async function deleteHolidayApi(holidayId) {
  await tryFetch(`/holidays/${holidayId}/`, { method: 'DELETE' });
  const store = loadLocalStore();
  store.holidays = (store.holidays || []).filter((h) => Number(h.id) !== Number(holidayId));
  saveLocalStore(store);
  return store.holidays;
}

export async function applyPeriodHolidaysApi(periodId) {
  const remote = await tryFetch(`/periods/${periodId}/apply-holidays/`, {
    method: 'POST',
  });

  const store = loadLocalStore();
  const cfg = store.benefit_config;
  const period = store.periods.find((p) => Number(p.id) === Number(periodId)) || store.periods[0];

  if (remote?.records) {
    store.records = remote.records;
    saveLocalStore(store);
    return {
      records: store.records,
      applied_holidays: remote.applied_holidays,
      reg_count: remote.reg_count,
      spec_count: remote.spec_count,
      paid_count: remote.paid_count,
    };
  }

  const start = period?.start_date || '';
  const end = period?.end_date || '';
  const activeHolidays = (store.holidays || []).filter((h) => {
    if (!h.auto_apply) return false;
    if (start && end) return h.date >= start && h.date <= end;
    return true;
  });

  const reg_count = activeHolidays.filter((h) => h.holiday_type === 'REGULAR').length;
  const spec_count = activeHolidays.filter((h) => h.holiday_type === 'SPECIAL').length;
  const paid_count = activeHolidays.filter((h) => h.holiday_type === 'PAID_HOLIDAY').length;

  store.records = store.records.map((r) => {
    if (Number(r.period_id) !== Number(period.id)) return r;
    const worked = (parseFloat(r.days_worked) || 0) > 0;
    return computeRecordFormulas(
      {
        ...r,
        reg_holiday_days: worked ? reg_count : 0,
        spec_holiday_days: worked ? spec_count : 0,
        paid_holiday_days: paid_count,
      },
      cfg
    );
  });

  saveLocalStore(store);
  return {
    records: store.records,
    applied_holidays: activeHolidays.length,
    reg_count,
    spec_count,
    paid_count,
  };
}


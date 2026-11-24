import assert from 'node:assert/strict';
import {
  buildInitialDataset,
  computeRecordFormulas,
  computeFinanceSummary,
  INITIAL_BENEFIT_CONFIG,
} from './src/data/initialPayrollData.js';

let passed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`PASS: ${name}`);
    passed += 1;
  } catch (err) {
    console.error(`FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

test('Initial dataset loads 8 sites, employees, holidays, and records', () => {
  const data = buildInitialDataset();
  assert.equal(data.sites.length, 8);
  assert.ok(data.employees.length > 50);
  assert.ok(data.holidays.length >= 7);
  assert.ok(data.records.length > 100);
});

test('Finance summary matches Excel GCash & Cash totals', () => {
  const data = buildInitialDataset();
  const summary = computeFinanceSummary(data.sites, data.records);
  assert.equal(summary.gcash.totals.gross_pay, 433635);
  assert.equal(summary.gcash.totals.office_vale_deduction, 15500);
  assert.equal(summary.gcash.totals.deducted_to_gcash, 418135);
  assert.equal(summary.cash.totals.gross_pay, 43850);
  assert.equal(summary.cash.totals.net_pay, 43639);
});

test('Night Shift checkbox (+10%) auto-computes hours and adds to Gross & Net', () => {
  const rec = computeRecordFormulas(
    {
      daily_rate: 800,
      days_worked: 5,
      ot_hours: 0,
      is_night_shift: true,
      gcash_charge: 0,
      total_office_vale: 0,
      office_vale_deduction: 0,
      phic_contribution: 0,
    },
    INITIAL_BENEFIT_CONFIG
  );
  // 5 days * 8 hrs = 40 night diff hrs; hourly = 100; 10% * 40 = 400
  assert.equal(rec.regular_amount, 4000);
  assert.equal(rec.night_diff_hours, 40);
  assert.equal(rec.night_diff_amount, 400);
  assert.equal(rec.gross_pay, 4400);
  assert.equal(rec.net_pay, 4400);
});

test('Regular Holiday (Double Pay), Special (+30%), and Paid Holiday (100%) compute accurately', () => {
  const rec = computeRecordFormulas(
    {
      daily_rate: 600,
      days_worked: 5,
      reg_holiday_days: 1,
      spec_holiday_days: 1,
      paid_holiday_days: 1,
    },
    INITIAL_BENEFIT_CONFIG
  );
  assert.equal(rec.regular_amount, 3000);
  assert.equal(rec.reg_holiday_amount, 600);
  assert.equal(rec.spec_holiday_amount, 180);
  assert.equal(rec.paid_holiday_amount, 600);
  assert.equal(rec.gross_pay, 4380);
});

console.log(`\nTotal frontend formula tests passed: ${passed}`);

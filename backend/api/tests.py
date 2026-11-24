import json
from decimal import Decimal
from django.test import TestCase, Client
from django.contrib.auth.models import User
from .models import Site, Employee, BenefitConfig, PayrollPeriod, PayrollRecord, Holiday, UserProfile, AuditLog


class PayrollSystemEndToEndTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.admin_user = User.objects.create_user(username='test_admin', password='Password123!')
        UserProfile.objects.create(user=self.admin_user, role='ADMIN')

        self.hr_user = User.objects.create_user(username='test_hr', password='Password123!')
        UserProfile.objects.create(user=self.hr_user, role='HR_STAFF')

    def test_01_signup_login_and_role_permissions(self):
        # Signup new HR user
        res = self.client.post(
            '/api/auth/signup/',
            data=json.dumps({
                'username': 'newhr',
                'password': 'Password123!',
                'confirm_password': 'Password123!',
                'role': 'HR_STAFF',
            }),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 200)

        # Login as HR_STAFF
        res = self.client.post(
            '/api/auth/login/',
            data=json.dumps({'username': 'test_hr', 'password': 'Password123!'}),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['role'], 'HR_STAFF')

        # HR_STAFF must be blocked from Audit Log (403)
        res = self.client.get('/api/audit-logs/')
        self.assertEqual(res.status_code, 403)

        # Login as ADMIN
        res = self.client.post(
            '/api/auth/login/',
            data=json.dumps({'username': 'test_admin', 'password': 'Password123!'}),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['role'], 'ADMIN')

        # ADMIN can access Audit Log (200)
        res = self.client.get('/api/audit-logs/')
        self.assertEqual(res.status_code, 200)

    def test_02_bootstrap_seeds_excel_data(self):
        res = self.client.get('/api/bootstrap/')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(len(data['sites']), 8)
        self.assertGreater(len(data['employees']), 50)
        self.assertEqual(len(data['periods']), 1)

    def test_03_hr_site_and_payroll_edit_logs_to_audit_log(self):
        # Bootstrap first
        self.client.get('/api/bootstrap/')

        # Login as HR_STAFF and edit a site + payroll record
        self.client.login(username='test_hr', password='Password123!')

        site = Site.objects.first()
        res = self.client.put(
            f'/api/sites/{site.id}/',
            data=json.dumps({'project_in_charge': 'Engr. Updated'}),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 200)

        rec = PayrollRecord.objects.first()
        res = self.client.put(
            f'/api/records/{rec.id}/',
            data=json.dumps({'days_worked': 6, 'ot_hours': 8, 'is_night_shift': True}),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 200)
        updated = res.json()['record']

        # Verify Night Shift auto-computed (6 days * 8 = 48 hrs * 10% hourly rate)
        self.assertTrue(updated['is_night_shift'])
        self.assertEqual(updated['night_diff_hours'], 48.0)
        self.assertGreater(updated['night_diff_amount'], 0)

        # Verify AuditLog recorded HR_STAFF action with site & changes
        logs = AuditLog.objects.filter(user=self.hr_user)
        self.assertTrue(logs.filter(action='Updated Site').exists())
        payroll_log = logs.filter(action='Updated Payroll Record').first()
        self.assertIsNotNone(payroll_log)
        self.assertIn(rec.site.code, payroll_log.details)
        self.assertIn('days_worked', payroll_log.details)

    def test_04_holiday_calendar_and_auto_apply(self):
        self.client.get('/api/bootstrap/')
        period = PayrollPeriod.objects.first()

        # Add a Regular Holiday (Double Pay) inside the active period
        res = self.client.post(
            '/api/holidays/',
            data=json.dumps({
                'date': '2026-11-01',
                'name': 'Test Regular Holiday',
                'holiday_type': 'REGULAR',
                'auto_apply': True,
            }),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 201)

        # Auto-apply holidays to active period
        res = self.client.post(f'/api/periods/{period.id}/apply-holidays/')
        self.assertEqual(res.status_code, 200)
        self.assertGreaterEqual(res.json()['reg_count'], 1)

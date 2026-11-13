import json
from decimal import Decimal
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Site, BenefitConfig, Employee, PayrollPeriod, PayrollRecord
from .seed import seed_initial_data


def to_float(val):
    if val is None:
        return 0.0
    return float(val)


def to_dec(val, default='0.00'):
    if val is None or val == '':
        return Decimal(default)
    try:
        return Decimal(str(val))
    except Exception:
        return Decimal(default)


def serialize_site(s):
    return {
        'id': s.id,
        'code': s.code,
        'name': s.name,
        'full_title': f"{s.code} {s.name}".strip(),
        'project_in_charge': s.project_in_charge,
        'location': s.location,
        'is_active': s.is_active,
        'employee_count': s.employees.filter(is_active=True).count(),
    }


def serialize_benefit_config(cfg):
    return {
        'sss_contribution_default': to_float(cfg.sss_contribution_default),
        'phic_contribution_default': to_float(cfg.phic_contribution_default),
        'hdmf_contribution_default': to_float(cfg.hdmf_contribution_default),
        'gcash_charge_default': to_float(cfg.gcash_charge_default),
        'sss_rate_default': to_float(cfg.sss_rate_default),
        'abuloy_default': to_float(cfg.abuloy_default),
        'ot_hourly_multiplier': to_float(cfg.ot_hourly_multiplier),
        'night_diff_multiplier': to_float(cfg.night_diff_multiplier),
        'rest_day_multiplier': to_float(cfg.rest_day_multiplier),
        'rest_day_ot_multiplier': to_float(cfg.rest_day_ot_multiplier),
        'reg_holiday_multiplier': to_float(cfg.reg_holiday_multiplier),
        'reg_holiday_ot_multiplier': to_float(cfg.reg_holiday_ot_multiplier),
        'spec_holiday_multiplier': to_float(cfg.spec_holiday_multiplier),
        'spec_holiday_ot_multiplier': to_float(cfg.spec_holiday_ot_multiplier),
    }


def serialize_employee(e):
    return {
        'id': e.id,
        'full_name': e.full_name,
        'role': e.role,
        'site_id': e.site_id,
        'site_name': f"{e.site.code} {e.site.name}" if e.site else 'Unassigned',
        'daily_rate': to_float(e.daily_rate),
        'payment_method': e.payment_method,
        'gcash_number': e.gcash_number,
        'total_office_vale': to_float(e.total_office_vale),
        'default_office_vale_deduction': to_float(e.default_office_vale_deduction),
        'has_sss': e.has_sss,
        'has_phic': e.has_phic,
        'has_hdmf': e.has_hdmf,
        'has_gcash_charge': e.has_gcash_charge,
        'sss_salary_loan': to_float(e.sss_salary_loan),
        'sss_calamity_loan': to_float(e.sss_calamity_loan),
        'sss_emergency_loan': to_float(e.sss_emergency_loan),
        'sss_restructured': to_float(e.sss_restructured),
        'sss_condonation': to_float(e.sss_condonation),
        'hdmf_mpl': to_float(e.hdmf_mpl),
        'hdmf_cl': to_float(e.hdmf_cl),
        'is_active': e.is_active,
    }


def serialize_period(p):
    return {
        'id': p.id,
        'period_covered': p.period_covered,
        'start_date': p.start_date.isoformat() if p.start_date else '',
        'end_date': p.end_date.isoformat() if p.end_date else '',
        'status': p.status,
        'finance_note': p.finance_note,
        'prepared_by': p.prepared_by,
        'record_count': p.records.count(),
    }


def serialize_record(r):
    return {
        'id': r.id,
        'period_id': r.period_id,
        'period_covered': r.period.period_covered,
        'site_id': r.site_id,
        'site_code': r.site.code,
        'site_name': f"{r.site.code} {r.site.name}",
        'employee_id': r.employee_id,
        'employee_name': r.employee.full_name,
        'employee_role': r.employee.role,
        'payment_method': r.payment_method,
        'daily_rate': to_float(r.daily_rate),
        'days_worked': to_float(r.days_worked),
        'regular_amount': to_float(r.regular_amount),
        'ot_hours': to_float(r.ot_hours),
        'ot_amount': to_float(r.ot_amount),
        'night_diff_hours': to_float(r.night_diff_hours),
        'night_diff_amount': to_float(r.night_diff_amount),
        'rest_day_days': to_float(r.rest_day_days),
        'rest_day_amount': to_float(r.rest_day_amount),
        'rest_day_ot_hours': to_float(r.rest_day_ot_hours),
        'rest_day_ot_amount': to_float(r.rest_day_ot_amount),
        'reg_holiday_days': to_float(r.reg_holiday_days),
        'reg_holiday_amount': to_float(r.reg_holiday_amount),
        'reg_holiday_ot_hours': to_float(r.reg_holiday_ot_hours),
        'reg_holiday_ot_amount': to_float(r.reg_holiday_ot_amount),
        'spec_holiday_days': to_float(r.spec_holiday_days),
        'spec_holiday_amount': to_float(r.spec_holiday_amount),
        'spec_holiday_ot_hours': to_float(r.spec_holiday_ot_hours),
        'spec_holiday_ot_amount': to_float(r.spec_holiday_ot_amount),
        'sss_rate': to_float(r.sss_rate),
        'gcash_charge': to_float(r.gcash_charge),
        'gross_pay': to_float(r.gross_pay),
        'total_office_vale': to_float(r.total_office_vale),
        'office_vale_deduction': to_float(r.office_vale_deduction),
        'office_vale_balance': to_float(r.office_vale_balance),
        'sss_contribution': to_float(r.sss_contribution),
        'sss_salary_loan': to_float(r.sss_salary_loan),
        'sss_calamity_loan': to_float(r.sss_calamity_loan),
        'sss_emergency_loan': to_float(r.sss_emergency_loan),
        'sss_restructured': to_float(r.sss_restructured),
        'sss_condonation': to_float(r.sss_condonation),
        'hdmf_contribution': to_float(r.hdmf_contribution),
        'hdmf_mpl': to_float(r.hdmf_mpl),
        'hdmf_cl': to_float(r.hdmf_cl),
        'phic_contribution': to_float(r.phic_contribution),
        'abuloy': to_float(r.abuloy),
        'site_vale': to_float(r.site_vale),
        'corpo': to_float(r.corpo),
        'others': to_float(r.others),
        'total_deductions': to_float(r.total_deductions),
        'net_pay': to_float(r.net_pay),
        'is_signed': r.is_signed,
        'remarks': r.remarks,
    }


@csrf_exempt
def bootstrap_view(request):
    seed_initial_data(force=False)
    sites = [serialize_site(s) for s in Site.objects.all()]
    cfg = serialize_benefit_config(BenefitConfig.get_solo())
    employees = [serialize_employee(e) for e in Employee.objects.select_related('site').all()]
    periods = [serialize_period(p) for p in PayrollPeriod.objects.all()]
    active_period_id = periods[0]['id'] if periods else None

    return JsonResponse({
        'sites': sites,
        'benefit_config': cfg,
        'employees': employees,
        'periods': periods,
        'active_period_id': active_period_id,
    })


@csrf_exempt
def sites_view(request, site_id=None):
    if request.method == 'GET':
        return JsonResponse({'sites': [serialize_site(s) for s in Site.objects.all()]})

    if request.method == 'POST':
        data = json.loads(request.body)
        site = Site.objects.create(
            code=data.get('code', '').strip().upper(),
            name=data.get('name', '').strip().upper(),
            project_in_charge=data.get('project_in_charge', '').strip(),
            location=data.get('location', '').strip(),
            is_active=data.get('is_active', True),
        )
        return JsonResponse({'site': serialize_site(site)}, status=201)

    if request.method in ('PUT', 'PATCH') and site_id:
        data = json.loads(request.body)
        site = Site.objects.get(pk=site_id)
        if 'code' in data:
            site.code = data['code'].strip().upper()
        if 'name' in data:
            site.name = data['name'].strip().upper()
        if 'project_in_charge' in data:
            site.project_in_charge = data['project_in_charge'].strip()
        if 'location' in data:
            site.location = data['location'].strip()
        if 'is_active' in data:
            site.is_active = bool(data['is_active'])
        site.save()
        return JsonResponse({'site': serialize_site(site)})

    if request.method == 'DELETE' and site_id:
        Site.objects.filter(pk=site_id).delete()
        return JsonResponse({'deleted': True})

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def employees_view(request, emp_id=None):
    if request.method == 'GET':
        return JsonResponse({'employees': [serialize_employee(e) for e in Employee.objects.select_related('site').all()]})

    if request.method == 'POST':
        data = json.loads(request.body)
        site_id = data.get('site_id') or None
        emp = Employee.objects.create(
            full_name=data.get('full_name', '').strip(),
            role=data.get('role', 'Site Worker').strip(),
            site_id=site_id,
            daily_rate=to_dec(data.get('daily_rate', 620)),
            payment_method=data.get('payment_method', 'GCASH'),
            gcash_number=data.get('gcash_number', '').strip(),
            total_office_vale=to_dec(data.get('total_office_vale', 0)),
            default_office_vale_deduction=to_dec(data.get('default_office_vale_deduction', 0)),
            has_sss=bool(data.get('has_sss', False)),
            has_phic=bool(data.get('has_phic', True)),
            has_hdmf=bool(data.get('has_hdmf', False)),
            has_gcash_charge=bool(data.get('has_gcash_charge', data.get('payment_method', 'GCASH') == 'GCASH')),
            sss_salary_loan=to_dec(data.get('sss_salary_loan', 0)),
            sss_calamity_loan=to_dec(data.get('sss_calamity_loan', 0)),
            sss_emergency_loan=to_dec(data.get('sss_emergency_loan', 0)),
            sss_restructured=to_dec(data.get('sss_restructured', 0)),
            sss_condonation=to_dec(data.get('sss_condonation', 0)),
            hdmf_mpl=to_dec(data.get('hdmf_mpl', 0)),
            hdmf_cl=to_dec(data.get('hdmf_cl', 0)),
            is_active=bool(data.get('is_active', True)),
        )
        # Optionally auto-add to active payroll period if requested
        if data.get('add_to_active_period') and emp.site_id:
            active_period = PayrollPeriod.objects.first()
            if active_period:
                cfg = BenefitConfig.get_solo()
                PayrollRecord.objects.create(
                    period=active_period,
                    site_id=emp.site_id,
                    employee=emp,
                    payment_method=emp.payment_method,
                    daily_rate=emp.daily_rate,
                    days_worked=to_dec(data.get('initial_days_worked', 0)),
                    ot_hours=to_dec(data.get('initial_ot_hours', 0)),
                    gcash_charge=cfg.gcash_charge_default if (emp.payment_method == 'GCASH' and emp.has_gcash_charge) else Decimal('0.00'),
                    total_office_vale=emp.total_office_vale,
                    office_vale_deduction=emp.default_office_vale_deduction,
                    sss_contribution=cfg.sss_contribution_default if emp.has_sss else Decimal('0.00'),
                    phic_contribution=cfg.phic_contribution_default if emp.has_phic else Decimal('0.00'),
                    hdmf_contribution=cfg.hdmf_contribution_default if emp.has_hdmf else Decimal('0.00'),
                    sss_salary_loan=emp.sss_salary_loan,
                    sss_calamity_loan=emp.sss_calamity_loan,
                    sss_emergency_loan=emp.sss_emergency_loan,
                    sss_restructured=emp.sss_restructured,
                    sss_condonation=emp.sss_condonation,
                    hdmf_mpl=emp.hdmf_mpl,
                    hdmf_cl=emp.hdmf_cl,
                )
        return JsonResponse({'employee': serialize_employee(emp)}, status=201)

    if request.method in ('PUT', 'PATCH') and emp_id:
        data = json.loads(request.body)
        emp = Employee.objects.get(pk=emp_id)
        for field in ['full_name', 'role', 'payment_method', 'gcash_number']:
            if field in data:
                setattr(emp, field, str(data[field]).strip())
        if 'site_id' in data:
            emp.site_id = data['site_id'] or None
        for dec_field in [
            'daily_rate', 'total_office_vale', 'default_office_vale_deduction',
            'sss_salary_loan', 'sss_calamity_loan', 'sss_emergency_loan',
            'sss_restructured', 'sss_condonation', 'hdmf_mpl', 'hdmf_cl'
        ]:
            if dec_field in data:
                setattr(emp, dec_field, to_dec(data[dec_field]))
        for bool_field in ['has_sss', 'has_phic', 'has_hdmf', 'has_gcash_charge', 'is_active']:
            if bool_field in data:
                setattr(emp, bool_field, bool(data[bool_field]))
        emp.save()
        return JsonResponse({'employee': serialize_employee(emp)})

    if request.method == 'DELETE' and emp_id:
        Employee.objects.filter(pk=emp_id).delete()
        return JsonResponse({'deleted': True})

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def benefits_view(request):
    cfg = BenefitConfig.get_solo()
    if request.method == 'GET':
        return JsonResponse({'benefit_config': serialize_benefit_config(cfg)})

    if request.method in ('PUT', 'POST', 'PATCH'):
        data = json.loads(request.body)
        for field in [
            'sss_contribution_default', 'phic_contribution_default',
            'hdmf_contribution_default', 'gcash_charge_default',
            'sss_rate_default', 'abuloy_default',
            'ot_hourly_multiplier', 'night_diff_multiplier',
            'rest_day_multiplier', 'rest_day_ot_multiplier',
            'reg_holiday_multiplier', 'reg_holiday_ot_multiplier',
            'spec_holiday_multiplier', 'spec_holiday_ot_multiplier',
        ]:
            if field in data:
                setattr(cfg, field, to_dec(data[field]))
        cfg.save()

        # If apply_to_open_period is set, update active records for enrolled employees
        if data.get('apply_to_open_period'):
            period_id = data.get('period_id')
            qs = PayrollRecord.objects.select_related('employee')
            if period_id:
                qs = qs.filter(period_id=period_id)
            for rec in qs:
                emp = rec.employee
                if emp.has_sss:
                    rec.sss_contribution = cfg.sss_contribution_default
                if emp.has_phic:
                    rec.phic_contribution = cfg.phic_contribution_default
                if emp.has_hdmf:
                    rec.hdmf_contribution = cfg.hdmf_contribution_default
                if rec.payment_method == 'GCASH' and emp.has_gcash_charge and rec.days_worked > 0:
                    rec.gcash_charge = cfg.gcash_charge_default
                rec.save()

        return JsonResponse({'benefit_config': serialize_benefit_config(cfg)})

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def periods_view(request, period_id=None):
    if request.method == 'GET':
        return JsonResponse({'periods': [serialize_period(p) for p in PayrollPeriod.objects.all()]})

    if request.method == 'POST':
        data = json.loads(request.body)
        start_d = None
        end_d = None
        if data.get('start_date'):
            start_d = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        if data.get('end_date'):
            end_d = datetime.strptime(data['end_date'], '%Y-%m-%d').date()

        period = PayrollPeriod.objects.create(
            period_covered=data.get('period_covered', 'NEW PAYROLL PERIOD').strip().upper(),
            start_date=start_d,
            end_date=end_d,
            status='OPEN',
            finance_note=data.get(
                'finance_note',
                'NOTE: HINDI NI-DISBURSE, PAPALITAN NI BOSS SAKIN NG CHEQUE ENCASHMENT EVERY LAST WEEK OF THE MONTH'
            ),
            prepared_by=data.get('prepared_by', 'Payroll Admin'),
        )

        # Auto-generate template rows for all active employees assigned to sites
        if data.get('auto_populate_employees', True):
            cfg = BenefitConfig.get_solo()
            for emp in Employee.objects.filter(is_active=True, site__isnull=False):
                PayrollRecord.objects.create(
                    period=period,
                    site=emp.site,
                    employee=emp,
                    payment_method=emp.payment_method,
                    daily_rate=emp.daily_rate,
                    days_worked=Decimal('5.00'),
                    ot_hours=Decimal('0.00'),
                    gcash_charge=cfg.gcash_charge_default if (emp.payment_method == 'GCASH' and emp.has_gcash_charge) else Decimal('0.00'),
                    total_office_vale=emp.total_office_vale,
                    office_vale_deduction=emp.default_office_vale_deduction,
                    sss_contribution=cfg.sss_contribution_default if emp.has_sss else Decimal('0.00'),
                    phic_contribution=cfg.phic_contribution_default if emp.has_phic else Decimal('0.00'),
                    hdmf_contribution=cfg.hdmf_contribution_default if emp.has_hdmf else Decimal('0.00'),
                    sss_salary_loan=emp.sss_salary_loan,
                    sss_calamity_loan=emp.sss_calamity_loan,
                    sss_emergency_loan=emp.sss_emergency_loan,
                    sss_restructured=emp.sss_restructured,
                    sss_condonation=emp.sss_condonation,
                    hdmf_mpl=emp.hdmf_mpl,
                    hdmf_cl=emp.hdmf_cl,
                    abuloy=cfg.abuloy_default,
                )

        return JsonResponse({'period': serialize_period(period)}, status=201)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


def build_summary_for_period(period):
    records = list(PayrollRecord.objects.filter(period=period).select_related('site', 'employee'))
    sites = list(Site.objects.all())

    def summarize_by_method(method):
        rows = []
        totals = {
            'employee_count': 0,
            'man_hours_days': 0.0,
            'man_hours_ot': 0.0,
            'gross_pay': 0.0,
            'office_vale_deduction': 0.0,
            'sss_contribution': 0.0,
            'sss_salary_loan': 0.0,
            'sss_calamity_loan': 0.0,
            'sss_emergency_loan': 0.0,
            'sss_restructured': 0.0,
            'sss_condonation': 0.0,
            'hdmf_contribution': 0.0,
            'hdmf_mpl': 0.0,
            'hdmf_cl': 0.0,
            'phic_contribution': 0.0,
            'abuloy': 0.0,
            'site_vale': 0.0,
            'corpo': 0.0,
            'others': 0.0,
            'total_deductions': 0.0,
            'net_pay': 0.0,
            'deducted_to_gcash': 0.0,
        }

        for site in sites:
            site_recs = [r for r in records if r.site_id == site.id and r.payment_method == method]
            if not site_recs:
                continue

            # In the Excel, No. of Employees counts workers with regular days > 0 (or total rows if cash)
            emp_with_days = sum(1 for r in site_recs if r.days_worked > 0)
            man_hours_days = sum(to_float(r.days_worked) * 8.0 for r in site_recs)
            man_hours_ot = sum(to_float(r.ot_hours) for r in site_recs)
            gross = sum(to_float(r.gross_pay) for r in site_recs)
            office_vale = sum(to_float(r.office_vale_deduction) for r in site_recs)
            sss_c = sum(to_float(r.sss_contribution) for r in site_recs)
            sss_sl = sum(to_float(r.sss_salary_loan) for r in site_recs)
            sss_cl = sum(to_float(r.sss_calamity_loan) for r in site_recs)
            sss_el = sum(to_float(r.sss_emergency_loan) for r in site_recs)
            sss_res = sum(to_float(r.sss_restructured) for r in site_recs)
            sss_con = sum(to_float(r.sss_condonation) for r in site_recs)
            hdmf_c = sum(to_float(r.hdmf_contribution) for r in site_recs)
            hdmf_mpl = sum(to_float(r.hdmf_mpl) for r in site_recs)
            hdmf_cl = sum(to_float(r.hdmf_cl) for r in site_recs)
            phic_c = sum(to_float(r.phic_contribution) for r in site_recs)
            abuloy = sum(to_float(r.abuloy) for r in site_recs)
            site_vale = sum(to_float(r.site_vale) for r in site_recs)
            corpo = sum(to_float(r.corpo) for r in site_recs)
            others = sum(to_float(r.others) for r in site_recs)
            tot_ded = sum(to_float(r.total_deductions) for r in site_recs)
            net = sum(to_float(r.net_pay) for r in site_recs)
            deducted_gcash = gross - office_vale

            row = {
                'site_id': site.id,
                'project_name': f"{site.code} {site.name}",
                'employee_count': emp_with_days,
                'total_rows': len(site_recs),
                'man_hours_days': round(man_hours_days, 2),
                'man_hours_ot': round(man_hours_ot, 2),
                'gross_pay': round(gross, 2),
                'office_vale_deduction': round(office_vale, 2),
                'sss_contribution': round(sss_c, 2),
                'sss_salary_loan': round(sss_sl, 2),
                'sss_calamity_loan': round(sss_cl, 2),
                'sss_emergency_loan': round(sss_el, 2),
                'sss_restructured': round(sss_res, 2),
                'sss_condonation': round(sss_con, 2),
                'hdmf_contribution': round(hdmf_c, 2),
                'hdmf_mpl': round(hdmf_mpl, 2),
                'hdmf_cl': round(hdmf_cl, 2),
                'phic_contribution': round(phic_c, 2),
                'abuloy': round(abuloy, 2),
                'site_vale': round(site_vale, 2),
                'corpo': round(corpo, 2),
                'others': round(others, 2),
                'total_deductions': round(tot_ded, 2),
                'net_pay': round(net, 2),
                'deducted_to_gcash': round(deducted_gcash, 2),
            }
            rows.append(row)

            for k in totals:
                totals[k] = round(totals[k] + row[k], 2)

        return {'rows': rows, 'totals': totals}

    return {
        'gcash': summarize_by_method('GCASH'),
        'cash': summarize_by_method('CASH'),
    }


@csrf_exempt
def payroll_detail_view(request, period_id):
    period = PayrollPeriod.objects.get(pk=period_id)
    records = [
        serialize_record(r)
        for r in PayrollRecord.objects.filter(period=period).select_related('site', 'employee', 'period')
    ]
    summary = build_summary_for_period(period)
    return JsonResponse({
        'period': serialize_period(period),
        'records': records,
        'summary': summary,
    })


@csrf_exempt
def records_view(request, record_id=None):
    if request.method == 'POST':
        data = json.loads(request.body)
        emp = Employee.objects.get(pk=data['employee_id'])
        cfg = BenefitConfig.get_solo()
        pay_method = data.get('payment_method', emp.payment_method)

        rec = PayrollRecord.objects.create(
            period_id=data['period_id'],
            site_id=data['site_id'],
            employee=emp,
            payment_method=pay_method,
            daily_rate=to_dec(data.get('daily_rate', emp.daily_rate)),
            days_worked=to_dec(data.get('days_worked', 0)),
            ot_hours=to_dec(data.get('ot_hours', 0)),
            night_diff_hours=to_dec(data.get('night_diff_hours', 0)),
            rest_day_days=to_dec(data.get('rest_day_days', 0)),
            rest_day_ot_hours=to_dec(data.get('rest_day_ot_hours', 0)),
            reg_holiday_days=to_dec(data.get('reg_holiday_days', 0)),
            reg_holiday_ot_hours=to_dec(data.get('reg_holiday_ot_hours', 0)),
            spec_holiday_days=to_dec(data.get('spec_holiday_days', 0)),
            spec_holiday_ot_hours=to_dec(data.get('spec_holiday_ot_hours', 0)),
            sss_rate=to_dec(data.get('sss_rate', cfg.sss_rate_default)),
            gcash_charge=to_dec(
                data.get(
                    'gcash_charge',
                    cfg.gcash_charge_default if (pay_method == 'GCASH' and emp.has_gcash_charge) else 0
                )
            ),
            total_office_vale=to_dec(data.get('total_office_vale', emp.total_office_vale)),
            office_vale_deduction=to_dec(data.get('office_vale_deduction', emp.default_office_vale_deduction)),
            sss_contribution=to_dec(data.get('sss_contribution', cfg.sss_contribution_default if emp.has_sss else 0)),
            sss_salary_loan=to_dec(data.get('sss_salary_loan', emp.sss_salary_loan)),
            sss_calamity_loan=to_dec(data.get('sss_calamity_loan', emp.sss_calamity_loan)),
            sss_emergency_loan=to_dec(data.get('sss_emergency_loan', emp.sss_emergency_loan)),
            sss_restructured=to_dec(data.get('sss_restructured', emp.sss_restructured)),
            sss_condonation=to_dec(data.get('sss_condonation', emp.sss_condonation)),
            hdmf_contribution=to_dec(data.get('hdmf_contribution', cfg.hdmf_contribution_default if emp.has_hdmf else 0)),
            hdmf_mpl=to_dec(data.get('hdmf_mpl', emp.hdmf_mpl)),
            hdmf_cl=to_dec(data.get('hdmf_cl', emp.hdmf_cl)),
            phic_contribution=to_dec(data.get('phic_contribution', cfg.phic_contribution_default if emp.has_phic else 0)),
            abuloy=to_dec(data.get('abuloy', cfg.abuloy_default)),
            site_vale=to_dec(data.get('site_vale', 0)),
            corpo=to_dec(data.get('corpo', 0)),
            others=to_dec(data.get('others', 0)),
            is_signed=bool(data.get('is_signed', True)),
            remarks=data.get('remarks', '').strip(),
        )
        return JsonResponse({'record': serialize_record(rec)}, status=201)

    if request.method in ('PUT', 'PATCH') and record_id:
        data = json.loads(request.body)
        rec = PayrollRecord.objects.select_related('site', 'employee', 'period').get(pk=record_id)

        dec_fields = [
            'daily_rate', 'days_worked', 'ot_hours', 'night_diff_hours',
            'rest_day_days', 'rest_day_ot_hours', 'reg_holiday_days', 'reg_holiday_ot_hours',
            'spec_holiday_days', 'spec_holiday_ot_hours', 'sss_rate', 'gcash_charge',
            'total_office_vale', 'office_vale_deduction', 'sss_contribution',
            'sss_salary_loan', 'sss_calamity_loan', 'sss_emergency_loan',
            'sss_restructured', 'sss_condonation', 'hdmf_contribution',
            'hdmf_mpl', 'hdmf_cl', 'phic_contribution', 'abuloy',
            'site_vale', 'corpo', 'others'
        ]
        for f in dec_fields:
            if f in data:
                setattr(rec, f, to_dec(data[f]))

        if 'payment_method' in data:
            rec.payment_method = data['payment_method']
        if 'site_id' in data:
            rec.site_id = data['site_id']
        if 'is_signed' in data:
            rec.is_signed = bool(data['is_signed'])
        if 'remarks' in data:
            rec.remarks = str(data['remarks']).strip()

        rec.save()
        return JsonResponse({'record': serialize_record(rec)})

    if request.method == 'DELETE' and record_id:
        PayrollRecord.objects.filter(pk=record_id).delete()
        return JsonResponse({'deleted': True})

    return JsonResponse({'error': 'Method not allowed'}, status=405)


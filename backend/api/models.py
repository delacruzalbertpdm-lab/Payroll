from decimal import Decimal
from django.db import models
from django.contrib.auth.models import User


class Site(models.Model):
    code = models.CharField(max_length=50)
    name = models.CharField(max_length=200)
    project_in_charge = models.CharField(max_length=150, blank=True, default='')
    location = models.CharField(max_length=200, blank=True, default='')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['code', 'name']

    def __str__(self):
        return f"{self.code} {self.name}"


class BenefitConfig(models.Model):
    """
    Uniform company-wide benefit rates and payroll multipliers configured by HR.
    """
    sss_contribution_default = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('425.00'))
    phic_contribution_default = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('250.00'))
    hdmf_contribution_default = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('200.00'))
    gcash_charge_default = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('20.00'))
    sss_rate_default = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    abuloy_default = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))

    # Formula multipliers matching Excel calculations
    ot_hourly_multiplier = models.DecimalField(max_digits=6, decimal_places=4, default=Decimal('1.0000'))
    night_diff_multiplier = models.DecimalField(max_digits=6, decimal_places=4, default=Decimal('0.1000'))
    rest_day_multiplier = models.DecimalField(max_digits=6, decimal_places=4, default=Decimal('1.3000'))
    rest_day_ot_multiplier = models.DecimalField(max_digits=6, decimal_places=4, default=Decimal('1.6900'))
    reg_holiday_multiplier = models.DecimalField(max_digits=6, decimal_places=4, default=Decimal('1.0000'))
    reg_holiday_ot_multiplier = models.DecimalField(max_digits=6, decimal_places=4, default=Decimal('2.6000'))
    spec_holiday_multiplier = models.DecimalField(max_digits=6, decimal_places=4, default=Decimal('0.3000'))
    spec_holiday_ot_multiplier = models.DecimalField(max_digits=6, decimal_places=4, default=Decimal('1.6900'))

    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def get_solo(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Employee(models.Model):
    PAYMENT_CHOICES = [
        ('GCASH', 'GCash'),
        ('CASH', 'Cash'),
    ]

    full_name = models.CharField(max_length=200)
    role = models.CharField(max_length=120, blank=True, default='Site Worker')
    site = models.ForeignKey(Site, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees')
    daily_rate = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('620.00'))
    payment_method = models.CharField(max_length=10, choices=PAYMENT_CHOICES, default='GCASH')
    gcash_number = models.CharField(max_length=30, blank=True, default='')

    # Running Office Vale tracking
    total_office_vale = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    default_office_vale_deduction = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))

    # Uniform benefit enrollment toggles (amounts pulled from BenefitConfig)
    has_sss = models.BooleanField(default=False)
    has_phic = models.BooleanField(default=True)
    has_hdmf = models.BooleanField(default=False)
    has_gcash_charge = models.BooleanField(default=True)

    # Recurring Loan Deductions
    sss_salary_loan = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    sss_calamity_loan = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    sss_emergency_loan = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    sss_restructured = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    sss_condonation = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    hdmf_mpl = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    hdmf_cl = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['full_name']

    def __str__(self):
        return self.full_name


class Holiday(models.Model):
    TYPE_CHOICES = [
        ('REGULAR', 'Regular Holiday (Double Pay 200%)'),
        ('SPECIAL', 'Special Non-Working Holiday (+30%)'),
        ('PAID_HOLIDAY', 'Paid Holiday (100% Even Unworked)'),
    ]

    date = models.DateField(unique=True)
    name = models.CharField(max_length=150)
    holiday_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='REGULAR')
    auto_apply = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date']

    def __str__(self):
        return f"{self.date} - {self.name} ({self.holiday_type})"


class PayrollPeriod(models.Model):
    STATUS_CHOICES = [
        ('OPEN', 'Open / Draft'),
        ('APPROVED', 'Approved'),
        ('RELEASED', 'Released / Paid'),
    ]

    period_covered = models.CharField(max_length=150)  # e.g. "OCTOBER 30-NOVEMBER 5, 2026"
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    finance_note = models.TextField(
        blank=True,
        default='NOTE: HINDI NI-DISBURSE, PAPALITAN NI BOSS SAKIN NG CHEQUE ENCASHMENT EVERY LAST WEEK OF THE MONTH'
    )
    prepared_by = models.CharField(max_length=150, blank=True, default='Payroll Officer')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.period_covered


class PayrollRecord(models.Model):
    PAYMENT_CHOICES = [
        ('GCASH', 'GCash'),
        ('CASH', 'Cash'),
    ]

    period = models.ForeignKey(PayrollPeriod, on_delete=models.CASCADE, related_name='records')
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='payroll_records')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='payroll_records')
    payment_method = models.CharField(max_length=10, choices=PAYMENT_CHOICES, default='GCASH')

    # Regular Rate
    daily_rate = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    days_worked = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal('0.00'))
    regular_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))

    # Overtime & Night Diff
    ot_hours = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal('0.00'))
    ot_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    night_diff_hours = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal('0.00'))
    night_diff_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))

    # Rest Day
    rest_day_days = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal('0.00'))
    rest_day_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    rest_day_ot_hours = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal('0.00'))
    rest_day_ot_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))

    # Regular Holiday
    reg_holiday_days = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal('0.00'))
    reg_holiday_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    reg_holiday_ot_hours = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal('0.00'))
    reg_holiday_ot_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))

    # Special Non-Working Holiday
    spec_holiday_days = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal('0.00'))
    spec_holiday_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    spec_holiday_ot_hours = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal('0.00'))
    spec_holiday_ot_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))

    # Paid Holiday (Unworked Regular Holiday 100%)
    paid_holiday_days = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal('0.00'))
    paid_holiday_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))

    # Additions before Gross
    sss_rate = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    gcash_charge = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    gross_pay = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))

    # Office Vale
    total_office_vale = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    office_vale_deduction = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    office_vale_balance = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))

    # Government Benefits & Loans
    sss_contribution = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    sss_salary_loan = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    sss_calamity_loan = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    sss_emergency_loan = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    sss_restructured = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    sss_condonation = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    hdmf_contribution = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    hdmf_mpl = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    hdmf_cl = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    phic_contribution = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))

    # Company / Site Deductions
    abuloy = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    site_vale = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    corpo = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    others = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))

    # Totals & Status
    total_deductions = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    net_pay = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    is_signed = models.BooleanField(default=True)
    remarks = models.CharField(max_length=255, blank=True, default='')

    class Meta:
        ordering = ['id']

    def compute_totals(self):
        cfg = BenefitConfig.get_solo()
        d_rate = Decimal(str(self.daily_rate or 0))
        hourly_rate = d_rate / Decimal('8')

        self.regular_amount = (d_rate * Decimal(str(self.days_worked or 0))).quantize(Decimal('0.01'))
        self.ot_amount = (hourly_rate * cfg.ot_hourly_multiplier * Decimal(str(self.ot_hours or 0))).quantize(Decimal('0.01'))
        self.night_diff_amount = (hourly_rate * cfg.night_diff_multiplier * Decimal(str(self.night_diff_hours or 0))).quantize(Decimal('0.01'))
        self.rest_day_amount = (d_rate * cfg.rest_day_multiplier * Decimal(str(self.rest_day_days or 0))).quantize(Decimal('0.01'))
        self.rest_day_ot_amount = (hourly_rate * cfg.rest_day_ot_multiplier * Decimal(str(self.rest_day_ot_hours or 0))).quantize(Decimal('0.01'))
        self.reg_holiday_amount = (d_rate * cfg.reg_holiday_multiplier * Decimal(str(self.reg_holiday_days or 0))).quantize(Decimal('0.01'))
        self.reg_holiday_ot_amount = (hourly_rate * cfg.reg_holiday_ot_multiplier * Decimal(str(self.reg_holiday_ot_hours or 0))).quantize(Decimal('0.01'))
        self.spec_holiday_days = self.spec_holiday_days or Decimal('0.00')
        self.spec_holiday_amount = (d_rate * cfg.spec_holiday_multiplier * Decimal(str(self.spec_holiday_days or 0))).quantize(Decimal('0.01'))
        self.spec_holiday_ot_amount = (hourly_rate * cfg.spec_holiday_ot_multiplier * Decimal(str(self.spec_holiday_ot_hours or 0))).quantize(Decimal('0.01'))
        self.paid_holiday_amount = (d_rate * Decimal(str(self.paid_holiday_days or 0))).quantize(Decimal('0.01'))

        self.gross_pay = (
            self.regular_amount
            + self.ot_amount
            + self.night_diff_amount
            + self.rest_day_amount
            + self.rest_day_ot_amount
            + self.reg_holiday_amount
            + self.reg_holiday_ot_amount
            + self.spec_holiday_amount
            + self.spec_holiday_ot_amount
            + self.paid_holiday_amount
            + Decimal(str(self.sss_rate or 0))
            + Decimal(str(self.gcash_charge or 0))
        ).quantize(Decimal('0.01'))

        tot_vale = Decimal(str(self.total_office_vale or 0))
        vale_ded = Decimal(str(self.office_vale_deduction or 0))
        self.office_vale_balance = (tot_vale - vale_ded).quantize(Decimal('0.01'))

        self.total_deductions = (
            vale_ded
            + Decimal(str(self.sss_contribution or 0))
            + Decimal(str(self.sss_salary_loan or 0))
            + Decimal(str(self.sss_calamity_loan or 0))
            + Decimal(str(self.sss_emergency_loan or 0))
            + Decimal(str(self.sss_restructured or 0))
            + Decimal(str(self.sss_condonation or 0))
            + Decimal(str(self.hdmf_contribution or 0))
            + Decimal(str(self.hdmf_mpl or 0))
            + Decimal(str(self.hdmf_cl or 0))
            + Decimal(str(self.phic_contribution or 0))
            + Decimal(str(self.abuloy or 0))
            + Decimal(str(self.site_vale or 0))
            + Decimal(str(self.corpo or 0))
            + Decimal(str(self.others or 0))
        ).quantize(Decimal('0.01'))

        self.net_pay = (self.gross_pay - self.total_deductions).quantize(Decimal('0.01'))

    def save(self, *args, **kwargs):
        self.compute_totals()
        super().save(*args, **kwargs)


from django.contrib.auth.models import User


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('HR_STAFF', 'HR Staff'),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='HR_STAFF'
    )

    def __str__(self):
        return f"{self.user.username} - {self.role}"


class AuditLog(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    action = models.CharField(max_length=100)
    details = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.action} - {self.created_at}"

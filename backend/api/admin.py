from django.contrib import admin
from .models import (
    Site,
    BenefitConfig,
    Employee,
    PayrollPeriod,
    PayrollRecord,
    Holiday,
    UserProfile,
    AuditLog,
)


@admin.register(Site)
class SiteAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'project_in_charge', 'location', 'is_active')
    search_fields = ('code', 'name', 'project_in_charge')
    list_filter = ('is_active',)


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'role', 'site', 'daily_rate', 'payment_method', 'total_office_vale', 'is_active')
    search_fields = ('full_name', 'role')
    list_filter = ('payment_method', 'site', 'is_active')


@admin.register(PayrollPeriod)
class PayrollPeriodAdmin(admin.ModelAdmin):
    list_display = ('period_covered', 'start_date', 'end_date', 'status', 'prepared_by')
    list_filter = ('status',)


@admin.register(PayrollRecord)
class PayrollRecordAdmin(admin.ModelAdmin):
    list_display = ('employee', 'site', 'period', 'payment_method', 'days_worked', 'ot_hours', 'gross_pay', 'net_pay')
    search_fields = ('employee__full_name', 'site__code', 'site__name')
    list_filter = ('payment_method', 'site', 'period')


@admin.register(BenefitConfig)
class BenefitConfigAdmin(admin.ModelAdmin):
    list_display = ('phic_contribution_default', 'sss_contribution_default', 'hdmf_contribution_default', 'gcash_charge_default', 'updated_at')


@admin.register(Holiday)
class HolidayAdmin(admin.ModelAdmin):
    list_display = ('date', 'name', 'holiday_type', 'auto_apply')
    list_filter = ('holiday_type', 'auto_apply')


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role')
    list_filter = ('role',)


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'details', 'created_at')
    search_fields = ('action', 'details', 'user__username')
    list_filter = ('action',)

from django.urls import path
from . import views

urlpatterns = [
    path('bootstrap/', views.bootstrap_view, name='bootstrap'),
    path('sites/', views.sites_view, name='sites'),
    path('sites/<int:site_id>/', views.sites_view, name='site-detail'),
    path('employees/', views.employees_view, name='employees'),
    path('employees/<int:emp_id>/', views.employees_view, name='employee-detail'),
    path('benefits/', views.benefits_view, name='benefits'),
    path('periods/', views.periods_view, name='periods'),
    path('periods/<int:period_id>/', views.periods_view, name='period-detail'),
    path('payroll/<int:period_id>/', views.payroll_detail_view, name='payroll-detail'),
    path('records/', views.records_view, name='records'),
    path('records/<int:record_id>/', views.records_view, name='record-detail'),
    path('holidays/', views.holidays_view, name='holidays'),
    path('holidays/<int:holiday_id>/', views.holidays_view, name='holiday-detail'),
    path('periods/<int:period_id>/apply-holidays/', views.apply_holidays_view, name='apply-holidays'),
    path('auth/csrf/', views.auth_csrf_view, name='auth-csrf'),
    path('auth/signup/', views.signup_view, name='signup'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/status/', views.auth_status_view, name='auth-status'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('audit-logs/', views.audit_log_view, name='audit-logs'),
]


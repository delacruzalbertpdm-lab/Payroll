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
]


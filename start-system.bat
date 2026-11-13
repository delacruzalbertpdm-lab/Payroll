@echo off
echo ===================================================
echo   BUILDCORE CONSTRUCTION PAYROLL SYSTEM (DJANGO + REACT)
echo ===================================================
echo Starting Django Backend on http://127.0.0.1:8000 ...
start "Django Payroll Backend" cmd /k "cd /d %~dp0backend && python manage.py migrate && python manage.py runserver 8000"

echo Starting React Frontend on http://localhost:5173 ...
start "React Payroll Frontend" cmd /k "cd /d %~dp0frontend && npm install && npm run dev"

echo Both servers are launching!
pause


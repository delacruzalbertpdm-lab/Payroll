# BuildCore Construction Payroll System (Django + React JS)

Professional Construction Weekly Payroll, Site Management, Uniform HR Benefits, and Payslip System modeled directly from the **OCTOBER 30–NOVEMBER 5, 2026 Weekly Payroll Report** Excel workbook.

## Key Modules Included
1. **Site Payroll Sheets (`PayrollSheetView.jsx` & `/api/payroll/`)**
   - Yellow Excel-style Site Tabs (`24D00099 CALAMBA OVERPASS`, `25D00290 LUKUTANG MALAKI RIVER 5`, `22D00095 UPLB ASH BUILDING`, `26OE0038 DIMASALANG PH3`, `26OE0030 NAGTAHAN FLYOVER 6`, `26OE0028 NMED OFFICE PH6`, `25DF0138 MALAGASANG DIVERSION ROAD`, `26OE0024 JONES BRIDGE RETRO`).
   - Separate **GCash** and **Cash** payroll tables per site.
   - Live Excel Formula Engine:
     - `Regular Amount = Daily Rate × No. of Days`
     - `OT Amount = (Daily Rate / 8) × No. of OT Hrs`
     - `Total Man-Hours (Days) = Sum(No. of Days) × 8`
     - `Gross Pay = Regular + OT + Night Diff + Rest Day + Holidays + SSS Rate + GCash Charge`
     - `Office Vale Balance = Total Office Vale - Office Vale Deduction`
     - `Net Pay = Gross Pay - Total Deductions`
   - Toggle between Standard View and **Full 38-Column Excel View** (Night Differential, Rest Day, Regular & Special Non-Working Holidays, all SSS & HDMF Loans).

2. **Finance Department Summary (`FinanceSummaryView.jsx`)**
   - Matches the Finance Department summary sheet for **GCASH** and **CASH** per site.
   - Computes **DEDUCTED TO GCASH (GROSS LESS OFFICE VALE)** (`₱418,135.00`) and **OFFICE VALE (FOR ENCASHMENT)** (`₱15,500.00`).

3. **Project Sites Module (`SitesModule.jsx`)**
   - Add, edit, and manage construction project sites (`Code`, `Project Name`, `Project In-Charge`, `Location`).

4. **Employees Masterlist & Vale Tracker (`EmployeesModule.jsx`)**
   - Add and assign employees to sites, choose **GCash** or **Cash** salary processing, manage running **Office Vale** balances, and enroll in standard benefits.

5. **HR Uniform Benefits Module (`BenefitsModule.jsx`)**
   - Manage company-wide uniform benefit amounts (`PHIC = ₱250`, `SSS = ₱425`, `HDMF = ₱200`, `GCash Charge = ₱20`) and sync them across all enrolled workers in one click.

6. **Printable Weekly Payslips Module (`PayslipsModule.jsx`)**
   - Individual and batch-printable construction payslips per site or payment mode (`GCash` / `Cash`).

---

## How to Run

### Option 1: One-Click Startup (Windows)
Double-click [`start-system.bat`](./start-system.bat).

### Option 2: Manual Terminal Commands

**1. Backend (Django)**
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

**2. Frontend (React + Vite)**
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.


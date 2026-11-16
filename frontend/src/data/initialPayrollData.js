export const INITIAL_BENEFIT_CONFIG = {
  sss_contribution_default: 425.0,
  phic_contribution_default: 250.0,
  hdmf_contribution_default: 200.0,
  gcash_charge_default: 20.0,
  sss_rate_default: 0.0,
  abuloy_default: 0.0,
  ot_hourly_multiplier: 1.0,
  night_diff_multiplier: 0.1,
  rest_day_multiplier: 1.3,
  rest_day_ot_multiplier: 1.69,
  reg_holiday_multiplier: 1.0,
  reg_holiday_ot_multiplier: 2.6,
  spec_holiday_multiplier: 0.3,
  spec_holiday_ot_multiplier: 1.69,
};

export const INITIAL_SITES = [
  { id: 1, code: '24D00099', name: 'CALAMBA OVERPASS', full_title: '24D00099 CALAMBA OVERPASS', project_in_charge: 'Sir Denmark', location: 'Calamba, Laguna', is_active: true },
  { id: 2, code: '25D00290', name: 'LUKUTANG MALAKI RIVER 5', full_title: '25D00290 LUKUTANG MALAKI RIVER 5', project_in_charge: 'Engr. Ernesto Gustilo Jr.', location: 'Cavite / Laguna', is_active: true },
  { id: 3, code: '22D00095', name: 'UPLB ASH BUILDING', full_title: '22D00095 UPLB ASH BUILDING', project_in_charge: 'Site Engineer', location: 'UPLB, Los Baños, Laguna', is_active: true },
  { id: 4, code: '26OE0038', name: 'DIMASALANG PH3', full_title: '26OE0038 DIMASALANG PH3', project_in_charge: 'Ricardo Jr.', location: 'Dimasalang, Manila', is_active: true },
  { id: 5, code: '26OE0030', name: 'NAGTAHAN FLYOVER 6', full_title: '26OE0030 NAGTAHAN FLYOVER 6', project_in_charge: 'Site Engineer', location: 'Nagtahan, Manila', is_active: true },
  { id: 6, code: '26OE0028', name: 'NMED OFFICE PH6', full_title: '26OE0028 NMED OFFICE PH6', project_in_charge: 'Ricardo', location: 'Manila', is_active: true },
  { id: 7, code: '25DF0138', name: 'MALAGASANG DIVERSION ROAD', full_title: '25DF0138 MALAGASANG DIVERSION ROAD', project_in_charge: 'Sir Denmark', location: 'Imus, Cavite', is_active: true },
  { id: 8, code: '26OE0024', name: 'JONES BRIDGE RETRO', full_title: '26OE0024 JONES BRIDGE RETRO', project_in_charge: 'Site Engineer', location: 'Binondo, Manila', is_active: true },
];

export const INITIAL_PERIODS = [
  {
    id: 1,
    period_covered: 'OCTOBER 30-NOVEMBER 5, 2026',
    start_date: '2026-10-30',
    end_date: '2026-11-05',
    status: 'OPEN',
    finance_note: 'NOTE: HINDI NI-DISBURSE, PAPALITAN NI BOSS SAKIN NG CHEQUE ENCASHMENT EVERY LAST WEEK OF THE MONTH',
    prepared_by: 'Finance / Payroll Admin',
  },
];

export const INITIAL_HOLIDAYS = [
  { id: 1, date: '2026-10-31', name: "All Saints' Eve", holiday_type: 'SPECIAL', auto_apply: true },
  { id: 2, date: '2026-11-01', name: "All Saints' Day", holiday_type: 'SPECIAL', auto_apply: true },
  { id: 3, date: '2026-11-02', name: "All Souls' Day", holiday_type: 'SPECIAL', auto_apply: true },
  { id: 4, date: '2026-11-30', name: 'Bonifacio Day', holiday_type: 'REGULAR', auto_apply: true },
  { id: 5, date: '2026-12-08', name: 'Feast of the Immaculate Conception', holiday_type: 'SPECIAL', auto_apply: true },
  { id: 6, date: '2026-12-25', name: 'Christmas Day', holiday_type: 'REGULAR', auto_apply: true },
  { id: 7, date: '2026-12-30', name: 'Rizal Day', holiday_type: 'REGULAR', auto_apply: true },
];

// [siteId, payMethod, fullName, role, dailyRate, days, otHrs, gcashCharge, totVale, valeDed, sssC, hdmfMpl, phicC, siteVale, corpo, others, remarks]
const RAW_ROWS = [
  // 1. 24D00099 CALAMBA OVERPASS - GCASH
  [1, 'GCASH', 'MATA, JOSEPH', 'Skilled Worker', 630, 5, 40, 20, 0, 0, 0, 0, 250, 0, 0, 0, ''],
  [1, 'GCASH', 'AGBONES, PUBLEO', 'Laborer', 600, 5, 40, 20, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [1, 'GCASH', 'LABANDRIA, RONALD', 'Leadman / Skilled', 740, 5, 40, 20, 0, 0, 0, 0, 250, 0, 200, 0, 'svale & corpo c/o SIR DENMARK'],
  [1, 'GCASH', 'SALVADOR, ROLAND', 'Skilled Worker', 610, 5, 40, 20, 0, 0, 0, 0, 250, 1000, 200, 0, ''],
  [1, 'GCASH', 'VICENTE, ARTHUR JOSEPH', 'Skilled Worker', 650, 5, 40, 20, 0, 0, 0, 0, 250, 0, 200, 0, ''],
  [1, 'GCASH', 'MERCADO, HENRY', 'Skilled Worker', 620, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [1, 'GCASH', 'VILLAGRACIA, DANNY', 'Skilled Worker', 650, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [1, 'GCASH', 'TAN, ALVIN IAN', 'Skilled Worker', 740, 0, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [1, 'GCASH', 'SALVADOR, RONALD', 'Skilled Worker', 620, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [1, 'GCASH', 'VICENTE, LINO', 'Skilled Worker', 650, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [1, 'GCASH', 'LUCASIA, BERNARD', 'Skilled Worker', 700, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [1, 'GCASH', 'BONILLO, ROCKY', 'Skilled Worker', 620, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [1, 'GCASH', 'NIMROD, MINGUITO', 'Skilled Worker', 620, 0, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [1, 'GCASH', 'VECINA, EDWARD', 'Skilled Worker', 620, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [1, 'GCASH', 'ESGUERRA, CHRISTOPHER', 'Laborer', 600, 0, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [1, 'GCASH', 'VIGIL, DIOMEDES', 'Skilled Worker', 650, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],

  // 1B. 24D00099 CALAMBA OVERPASS - CASH
  [1, 'CASH', 'ENFORCER 1', 'Traffic Enforcer', 400, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [1, 'CASH', 'ENFORCER 2', 'Traffic Enforcer', 400, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [1, 'CASH', 'ENFORCER 3', 'Traffic Enforcer', 400, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],

  // 2. 25D00290 LUKUTANG MALAKI RIVER 5 - GCASH
  [2, 'GCASH', 'GUSTILO, JOSHUA ALEXANDER', 'Skilled Worker', 620, 5, 23, 20, 34000, 1000, 0, 0, 0, 0, 0, 0, ''],
  [2, 'GCASH', 'GUSTILO, ERNESTO JR.', 'Foreman / Lead', 1200, 5, 25, 20, 15000, 1000, 0, 0, 500, 0, 0, 0, ''],
  [2, 'GCASH', 'YUGA, ARNEL', 'Skilled Worker', 650, 5, 19, 20, 3000, 1000, 0, 0, 0, 500, 0, 0, ''],
  [2, 'GCASH', 'DE VERA, JOMAR', 'Laborer', 600, 6, 23, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''],
  [2, 'GCASH', 'TAMOYANG, MICHAEL', 'Laborer', 600, 7, 19, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''],
  [2, 'GCASH', 'ARROYO, JOHN ERIC', 'Skilled Worker', 740, 7, 21, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''],
  [2, 'GCASH', 'SANTOS, EDISON', 'Skilled Worker', 620, 3, 16, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''],
  [2, 'GCASH', 'COS, REY', 'Skilled Worker', 620, 4, 17, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''],
  [2, 'GCASH', 'BASMAYOR, JOMARIE', 'Skilled Worker', 620, 3, 16, 20, 2000, 1000, 425, 0, 250, 500, 0, 0, ''],
  [2, 'GCASH', 'RUELO, REYNALD', 'Skilled Worker', 650, 3, 18, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''],
  [2, 'GCASH', 'DELA TORRE, WILLIAM', 'Heavy Eq. / Skilled', 830, 4, 24, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''],
  [2, 'GCASH', 'GONZALES, BERNARD', 'Leadman', 920, 1, 5, 20, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [2, 'GCASH', 'LORICA, RICKY', 'Laborer', 600, 4, 20, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''],
  [2, 'GCASH', 'DIMARANAN, RODEL', 'Skilled Worker', 620, 3, 11, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''],
  [2, 'GCASH', 'ORLAZA, RODEL', 'Skilled Worker', 620, 3, 11, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''],
  [2, 'GCASH', 'IGNACIO, JOSELITO', 'Laborer', 600, 4, 11, 20, 0, 0, 0, 0, 0, 1000, 0, 0, ''],
  [2, 'GCASH', 'IGNACIO, JONATHAN', 'Laborer', 600, 7, 23, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''],
  [2, 'GCASH', 'MELAD, HAROLD', 'Laborer', 600, 4, 17, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''],
  [2, 'GCASH', 'TROLLANO, ALFIO', 'Laborer', 600, 7, 19, 20, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [2, 'GCASH', 'TATEL, MICHAEL', 'Laborer', 600, 4, 21, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''],
  [2, 'GCASH', 'RODRIGO, VINCENT', 'Laborer', 600, 3, 11, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''],
  [2, 'GCASH', 'CELLO, RUSTIC', 'Skilled Worker', 620, 4, 23, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''],
  [2, 'GCASH', 'ARSENIO, JOEBERT', 'Laborer', 600, 4, 23, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''],
  [2, 'GCASH', 'LABACA SR., LEONARDO', 'Skilled Worker', 680, 3, 16, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''],
  [2, 'GCASH', 'SALADA, JAYSON', 'Skilled Worker', 620, 4, 20, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''],
  [2, 'GCASH', 'GAVION, RODRIGO', 'Skilled Worker', 620, 3, 16, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''],
  [2, 'GCASH', 'GAVION, ANGELO', 'Laborer', 600, 3, 11, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''],
  [2, 'GCASH', 'ESPINAS, RUBEN', 'Skilled Worker', 800, 2, 12, 20, 0, 0, 0, 0, 250, 1000, 0, 0, ''],
  [2, 'GCASH', 'DACLES, JAIME', 'Skilled Worker', 650, 4, 16, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''],
  [2, 'GCASH', 'LLONA, LUIS', 'Skilled Worker', 620, 2, 9, 20, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [2, 'GCASH', 'NAYANGA, ALDOMAR', 'Skilled Worker', 680, 4, 16, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''],
  [2, 'GCASH', 'DACLES, VICTORIO', 'Laborer', 600, 2, 12, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''],
  [2, 'GCASH', 'TUANTE, MARK JOEL', 'Skilled Worker', 700, 3, 18, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''],
  [2, 'GCASH', 'OFTANA, MARLO', 'Laborer', 600, 3, 18, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''],
  [2, 'GCASH', 'MORANTE, ROMEL', 'Skilled Worker', 800, 4, 23, 20, 2000, 1000, 0, 0, 250, 1000, 0, 0, ''],
  [2, 'GCASH', 'BOCAL, CARLOS', 'Skilled Worker', 650, 5, 25, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''],
  [2, 'GCASH', 'TALISAY, BIENVINIDO', 'Skilled Worker', 800, 3, 18, 20, 3000, 0, 0, 0, 0, 0, 0, 0, ''],
  [2, 'GCASH', 'DEMOGENA, DEXTER', 'Skilled Worker', 620, 3, 18, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''],
  [2, 'GCASH', 'GARALDE, DINO', 'Skilled Worker', 620, 3, 17, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''],
  [2, 'GCASH', 'TAGLE, MCKENNEDY', 'Laborer', 600, 2, 11, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''],

  // 3. 22D00095 UPLB ASH BUILDING - GCASH
  [3, 'GCASH', 'JECOMO, RODRIGO', 'Skilled Worker', 620, 5, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [3, 'GCASH', "Watchman (Rodrigo Jecomo's Wife)", 'Watchman', 350, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],

  // 4. 26OE0038 DIMASALANG PH3 - GCASH
  [4, 'GCASH', 'ADESAS, GIL', 'Skilled Worker', 620, 7, 28, 20, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [4, 'GCASH', 'BOLIMA, GILBERT', 'Skilled Worker', 650, 4.5, 9, 20, 0, 0, 0, 0, 0, 0, 386, 0, ''],
  [4, 'GCASH', 'GONZALES, BENZON', 'Skilled Worker', 720, 4, 0, 20, 0, 0, 0, 0, 0, 0, 417, 0, ''],
  [4, 'GCASH', 'COLAR, BERNARDO', 'Skilled Worker', 630, 3, 8, 20, 0, 0, 0, 0, 250, 0, 0, 0, ''],
  [4, 'GCASH', 'GUSTILO, JEOFFREY', 'Laborer', 600, 4, 11, 20, 2000, 1000, 0, 0, 250, 0, 0, 0, ''],
  [4, 'GCASH', 'LAVANDRIA, RICARDO JR.', 'Skilled Worker', 680, 4.5, 9, 20, 2000, 1000, 0, 0, 250, 0, 0, 0, ''],
  [4, 'GCASH', 'RASE, ELMER', 'Skilled Worker', 620, 3.5, 3, 20, 0, 0, 0, 0, 250, 1600, 0, 0, ''],
  [4, 'GCASH', 'BUJANGIN, BENCHIE', 'Laborer', 600, 7, 8, 20, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [4, 'GCASH', 'MARQUEZ, GIL', 'Skilled Worker', 750, 2, 0, 20, 0, 0, 0, 0, 250, 0, 0, 0, ''],
  [4, 'GCASH', 'SAN JUAN, WILLIAM', 'Skilled Worker', 640, 2, 3, 0, 0, 0, 0, 0, 0, 0, 211, 0, ''],
  [4, 'GCASH', 'LABOC, RONNIE', 'Laborer', 600, 4.5, 6, 20, 0, 0, 0, 0, 0, 0, 436, 0, ''],
  [4, 'GCASH', 'ALEGRIA, ALFONZO', 'Laborer', 600, 5, 5, 20, 0, 0, 0, 0, 0, 0, 487, 0, ''],
  [4, 'GCASH', 'DAGALE, NILO', 'Skilled Worker', 650, 4.5, 9, 20, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [4, 'GCASH', 'MEONIS, JOCELYN', 'Laborer', 600, 5, 15, 20, 0, 0, 0, 0, 250, 0, 404, 0, ''],

  // 4B. 26OE0038 DIMASALANG PH3 - CASH
  [4, 'CASH', 'Watchman Bernie Rase (Barracks)', 'Watchman', 350, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [4, 'CASH', 'Extra Dennis Bungcaras', 'Extra Worker', 600, 1.5, 0, 0, 0, 0, 0, 0, 0, 0, 211, 0, ''],
  [4, 'CASH', 'Brgy 484 Chairwoman Eunice Ann Castro', 'Brgy Official', 350, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [4, 'CASH', 'Brgy 484 Tanod Maxi Maquinlin (Night)', 'Brgy Tanod', 350, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [4, 'CASH', 'Brgy 484 Tanod Alicia Bordios (Day)', 'Brgy Tanod', 350, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [4, 'CASH', 'Brgy 497 Chairman Bong Marzan', 'Brgy Official', 350, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [4, 'CASH', 'Brgy 497 Tanod Bernardo Balños (Day)', 'Brgy Tanod', 350, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [4, 'CASH', 'Brgy 497 Tanod Miyo Lopez (Night)', 'Brgy Tanod', 350, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],

  // 5. 26OE0030 NAGTAHAN FLYOVER 6 - GCASH & CASH
  [5, 'GCASH', 'VERBA, MARLO', 'Skilled Worker', 620, 5, 2, 20, 0, 0, 0, 0, 250, 1000, 0, 0, ''],
  [5, 'CASH', 'Brgy. 420 (Chairman Regala)', 'Brgy Official', 500, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],

  // 6. 26OE0028 NMED OFFICE PH6 - GCASH
  [6, 'GCASH', 'MATEO, ANGELBERTO', 'Leadman', 880, 5, 8, 20, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [6, 'GCASH', 'PANLILIO, DEXTER', 'Laborer', 600, 5, 0, 20, 0, 0, 0, 0, 0, 1100, 0, 0, ''],
  [6, 'GCASH', 'ALCANAR, JOLAN', 'Skilled Worker', 720, 7, 12, 20, 22500, 1500, 0, 0, 250, 0, 0, 0, ''],
  [6, 'GCASH', 'RUELO, SANTIAGO JR.', 'Skilled Worker', 650, 4, 7, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''],
  [6, 'GCASH', 'REBATO, WILFRETO', 'Laborer', 600, 5, 8, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''],
  [6, 'GCASH', 'ROSALDO, JOBELLE', 'Skilled Worker', 650, 4.5, 12, 20, 0, 0, 0, 0, 250, 0, 0, 0, ''],
  [6, 'GCASH', 'RONCALES, JOELITO', 'Skilled Worker', 650, 4, 4, 20, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [6, 'GCASH', 'AQUINO, CRISPOLO', 'Skilled Worker', 680, 6, 10, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''],
  [6, 'GCASH', 'MENDOZA, JOMAR', 'Laborer', 600, 4, 12, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''],
  [6, 'GCASH', 'COLONGON SR., NICOLAS', 'Skilled Worker', 620, 6.5, 2, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''],
  [6, 'GCASH', 'SUMAYAO, RHOCILL', 'Skilled Worker', 620, 6, 9, 20, 0, 0, 0, 685, 250, 500, 0, 0, ''],
  [6, 'GCASH', 'NALDOZA, JESSIE', 'Skilled Worker', 650, 4.5, 2, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''],
  [6, 'GCASH', 'CORCUERA, MARLON', 'Leadman', 920, 1, 2, 20, 4000, 0, 0, 0, 250, 500, 0, 0, ''],
  [6, 'GCASH', 'CONDE, MICHAEL', 'Skilled Worker', 680, 5, 12, 20, 3000, 1000, 0, 0, 250, 1000, 0, 0, ''],
  [6, 'GCASH', 'OGAYON, CHRISTIAN', 'Skilled Worker', 710, 4.5, 6, 20, 0, 0, 0, 323, 250, 1000, 0, 0, ''],
  [6, 'GCASH', 'VERBA, MARLO', 'Skilled Worker', 620, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [6, 'GCASH', 'PADAY SR., EDUARDO', 'Skilled Worker', 750, 2.5, 2, 20, 0, 0, 0, 0, 250, 800, 0, 0, ''],
  [6, 'GCASH', 'MANLAYA, BONIFACIO', 'Skilled Worker', 770, 5, 6, 20, 4000, 1000, 0, 0, 0, 1120, 0, 0, ''],
  [6, 'GCASH', 'ALEGRIA, ALBERTO', 'Skilled Worker', 740, 5, 8, 20, 0, 0, 0, 0, 0, 1000, 0, 0, ''],
  [6, 'GCASH', 'SICAD, IAN', 'Skilled Worker', 710, 6, 6, 20, 2000, 1000, 0, 0, 250, 1000, 0, 0, ''],
  [6, 'GCASH', 'CORAL, EDWIN', 'Skilled Worker', 640, 6, 5, 20, 0, 0, 0, 0, 250, 500, 88, 0, 'CORPO C/O RICARDO'],
  [6, 'GCASH', 'ROSALDO, JOHN MARIEL', 'Skilled Worker', 830, 4.5, 2, 20, 0, 0, 0, 0, 250, 500, 185, 0, 'CORPO C/O RICARDO'],
  [6, 'GCASH', 'CORCUERA, ARISTON III', 'Skilled Worker', 630, 5, 22, 20, 0, 0, 0, 0, 250, 0, 0, 0, ''],
  [6, 'GCASH', 'LABOC, RONNIE', 'Laborer', 600, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],

  // 6B. 26OE0028 NMED OFFICE PH6 - CASH
  [6, 'CASH', 'Romeo Sta. Ines', 'Skilled Worker', 700, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [6, 'CASH', 'Melvin Padapat (Tao ni Kuya Dagul)', 'Skilled Worker', 700, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [6, 'CASH', 'Raymund Reyes (Tao ni Kuya Dagul)', 'Skilled Worker', 700, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [6, 'CASH', 'Salvador Laurente (Tao ni Kuya Dagul)', 'Skilled Worker', 700, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],

  // 7. 25DF0138 MALAGASANG DIVERSION ROAD - GCASH
  [7, 'GCASH', 'LAVANDRIA, RICARDO SR.', 'Foreman / Lead', 920, 10, 8, 20, 6000, 1000, 0, 0, 250, 0, 0, 4000, 'c/o Sir Denmark (Others - cash advance)'],
  [7, 'GCASH', 'MERCADO, HENRY', 'Skilled Worker', 620, 4, 0, 20, 0, 0, 0, 0, 250, 0, 200, 0, ''],
  [7, 'GCASH', 'VILLAGRACIA, DANNY', 'Skilled Worker', 650, 5, 0, 20, 0, 0, 0, 0, 250, 1000, 0, 0, ''],
  [7, 'GCASH', 'LAVANDRIA, RONNIE', 'Skilled Worker', 830, 3, 8, 20, 6000, 1000, 0, 0, 250, 800, 270, 0, ''],
  [7, 'GCASH', 'TAN, ALVIN IAN', 'Skilled Worker', 740, 5, 2, 20, 1000, 1000, 0, 0, 0, 300, 270, 0, ''],
  [7, 'GCASH', 'MINGUITO, NIMROD', 'Skilled Worker', 620, 5, 2, 20, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [7, 'GCASH', 'SALVADOR, RONALD', 'Skilled Worker', 620, 5, 0, 20, 0, 0, 0, 0, 0, 300, 0, 0, ''],
  [7, 'GCASH', 'VICENTE, LINO', 'Skilled Worker', 650, 5, 0, 20, 0, 0, 0, 0, 250, 0, 200, 0, ''],
  [7, 'GCASH', 'LUCASIA, BERNARD', 'Skilled Worker', 700, 5, 0, 20, 0, 0, 0, 0, 250, 0, 0, 0, ''],
  [7, 'GCASH', 'BONILLO, ROCKY', 'Skilled Worker', 620, 5, 0, 20, 0, 0, 0, 0, 0, 0, 200, 0, ''],
  [7, 'GCASH', 'LAVANDRIA, ANGELINE', 'Admin / Site Staff', 600, 2, 4, 20, 2000, 0, 0, 0, 250, 500, 270, 0, ''],
  [7, 'GCASH', 'VIGIL, DIOMEDES', 'Skilled Worker', 650, 5, 0, 20, 0, 0, 0, 0, 0, 0, 200, 0, ''],
  [7, 'GCASH', 'ESGUERRA, CHRISTOPHER', 'Laborer', 600, 4, 0, 20, 1000, 1000, 0, 0, 0, 400, 270, 0, ''],
  [7, 'GCASH', 'VECINA, EDWRAD', 'Skilled Worker', 620, 2, 0, 20, 0, 0, 0, 0, 0, 0, 200, 0, ''],
  [7, 'GCASH', 'LAPIZ, JUDY', 'Skilled Worker', 700, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [7, 'GCASH', 'TUANTE, MJ', 'Skilled Worker', 640, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [7, 'GCASH', 'CARMONA, JUNREY', 'Laborer', 600, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [7, 'GCASH', 'Brgy Tanod Eduardo Reyes', 'Brgy Tanod', 500, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [7, 'GCASH', 'Brgy Tanod Joe Lara', 'Brgy Tanod', 500, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [7, 'GCASH', 'Brgy Tanod Edgar Tibayan', 'Brgy Tanod', 500, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],

  // 8. 26OE0024 JONES BRIDGE RETRO - GCASH
  [8, 'GCASH', 'PANLILIO, DEXTER', 'Laborer', 600, 2, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [8, 'GCASH', 'RUELO, SANTIAGO JR.', 'Skilled Worker', 650, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [8, 'GCASH', 'RONCALES, JOELITO', 'Skilled Worker', 650, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
  [8, 'GCASH', 'PADAY SR., EDUARDO', 'Skilled Worker', 750, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
];

export function computeRecordFormulas(rec, cfg = INITIAL_BENEFIT_CONFIG) {
  const num = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };
  const round2 = (v) => Math.round((v + Number.EPSILON) * 100) / 100;

  const daily_rate = num(rec.daily_rate);
  const hourly = daily_rate / 8.0;

  const days_worked = num(rec.days_worked);
  const regular_amount = round2(daily_rate * days_worked);

  const ot_hours = num(rec.ot_hours);
  const ot_amount = round2(hourly * num(cfg.ot_hourly_multiplier || 1.0) * ot_hours);

  const night_diff_hours = num(rec.night_diff_hours);
  const night_diff_amount = round2(hourly * num(cfg.night_diff_multiplier || 0.1) * night_diff_hours);

  const rest_day_days = num(rec.rest_day_days);
  const rest_day_amount = round2(daily_rate * num(cfg.rest_day_multiplier || 1.3) * rest_day_days);

  const rest_day_ot_hours = num(rec.rest_day_ot_hours);
  const rest_day_ot_amount = round2(hourly * num(cfg.rest_day_ot_multiplier || 1.69) * rest_day_ot_hours);

  const reg_holiday_days = num(rec.reg_holiday_days);
  const reg_holiday_amount = round2(daily_rate * num(cfg.reg_holiday_multiplier || 1.0) * reg_holiday_days);

  const reg_holiday_ot_hours = num(rec.reg_holiday_ot_hours);
  const reg_holiday_ot_amount = round2(hourly * num(cfg.reg_holiday_ot_multiplier || 2.6) * reg_holiday_ot_hours);

  const spec_holiday_days = num(rec.spec_holiday_days);
  const spec_holiday_amount = round2(daily_rate * num(cfg.spec_holiday_multiplier || 0.3) * spec_holiday_days);

  const spec_holiday_ot_hours = num(rec.spec_holiday_ot_hours);
  const spec_holiday_ot_amount = round2(hourly * num(cfg.spec_holiday_ot_multiplier || 1.69) * spec_holiday_ot_hours);

  const paid_holiday_days = num(rec.paid_holiday_days);
  const paid_holiday_amount = round2(daily_rate * paid_holiday_days);

  const sss_rate = num(rec.sss_rate);
  const gcash_charge = num(rec.gcash_charge);

  const gross_pay = round2(
    regular_amount +
      ot_amount +
      night_diff_amount +
      rest_day_amount +
      rest_day_ot_amount +
      reg_holiday_amount +
      reg_holiday_ot_amount +
      spec_holiday_amount +
      spec_holiday_ot_amount +
      paid_holiday_amount +
      sss_rate +
      gcash_charge
  );

  const total_office_vale = num(rec.total_office_vale);
  const office_vale_deduction = num(rec.office_vale_deduction);
  const office_vale_balance = round2(total_office_vale - office_vale_deduction);

  const sss_contribution = num(rec.sss_contribution);
  const sss_salary_loan = num(rec.sss_salary_loan);
  const sss_calamity_loan = num(rec.sss_calamity_loan);
  const sss_emergency_loan = num(rec.sss_emergency_loan);
  const sss_restructured = num(rec.sss_restructured);
  const sss_condonation = num(rec.sss_condonation);
  const hdmf_contribution = num(rec.hdmf_contribution);
  const hdmf_mpl = num(rec.hdmf_mpl);
  const hdmf_cl = num(rec.hdmf_cl);
  const phic_contribution = num(rec.phic_contribution);
  const abuloy = num(rec.abuloy);
  const site_vale = num(rec.site_vale);
  const corpo = num(rec.corpo);
  const others = num(rec.others);

  const total_deductions = round2(
    office_vale_deduction +
      sss_contribution +
      sss_salary_loan +
      sss_calamity_loan +
      sss_emergency_loan +
      sss_restructured +
      sss_condonation +
      hdmf_contribution +
      hdmf_mpl +
      hdmf_cl +
      phic_contribution +
      abuloy +
      site_vale +
      corpo +
      others
  );

  const net_pay = round2(gross_pay - total_deductions);

  return {
    ...rec,
    daily_rate,
    days_worked,
    regular_amount,
    ot_hours,
    ot_amount,
    night_diff_hours,
    night_diff_amount,
    rest_day_days,
    rest_day_amount,
    rest_day_ot_hours,
    rest_day_ot_amount,
    reg_holiday_days,
    reg_holiday_amount,
    reg_holiday_ot_hours,
    reg_holiday_ot_amount,
    spec_holiday_days,
    spec_holiday_amount,
    spec_holiday_ot_hours,
    spec_holiday_ot_amount,
    paid_holiday_days,
    paid_holiday_amount,
    sss_rate,
    gcash_charge,
    gross_pay,
    total_office_vale,
    office_vale_deduction,
    office_vale_balance,
    sss_contribution,
    sss_salary_loan,
    sss_calamity_loan,
    sss_emergency_loan,
    sss_restructured,
    sss_condonation,
    hdmf_contribution,
    hdmf_mpl,
    hdmf_cl,
    phic_contribution,
    abuloy,
    site_vale,
    corpo,
    others,
    total_deductions,
    net_pay,
  };
}

export function buildInitialDataset() {
  const siteById = {};
  INITIAL_SITES.forEach((s) => {
    siteById[s.id] = s;
  });

  const empMap = {};
  const employees = [];
  const records = [];

  RAW_ROWS.forEach((row, idx) => {
    const [
      siteId,
      payMethod,
      fullName,
      role,
      dailyRate,
      days,
      otHrs,
      gcashChg,
      totVale,
      valeDed,
      sssC,
      hdmfMpl,
      phicC,
      siteVale,
      corpo,
      others,
      remarks,
    ] = row;

    const cleanName = fullName.trim();
    const site = siteById[siteId];

    let emp = empMap[cleanName];
    if (!emp) {
      emp = {
        id: employees.length + 1,
        full_name: cleanName,
        role,
        site_id: siteId,
        site_name: site.full_title,
        daily_rate: dailyRate,
        payment_method: payMethod,
        gcash_number: payMethod === 'GCASH' ? `0917-${String(1000000 + employees.length * 731).slice(0, 7)}` : '',
        total_office_vale: totVale,
        default_office_vale_deduction: valeDed,
        has_sss: sssC > 0,
        has_phic: phicC > 0,
        has_hdmf: false,
        has_gcash_charge: gcashChg > 0,
        sss_salary_loan: 0,
        sss_calamity_loan: 0,
        sss_emergency_loan: 0,
        sss_restructured: 0,
        sss_condonation: 0,
        hdmf_mpl: hdmfMpl,
        hdmf_cl: 0,
        is_active: true,
      };
      empMap[cleanName] = emp;
      employees.push(emp);
    } else {
      if (totVale > 0 && emp.total_office_vale === 0) {
        emp.total_office_vale = totVale;
        emp.default_office_vale_deduction = valeDed;
      }
      if (phicC > 0) emp.has_phic = true;
      if (sssC > 0) emp.has_sss = true;
      if (hdmfMpl > 0) emp.hdmf_mpl = hdmfMpl;
    }

    const rec = computeRecordFormulas({
      id: idx + 1,
      period_id: 1,
      period_covered: 'OCTOBER 30-NOVEMBER 5, 2026',
      site_id: siteId,
      site_code: site.code,
      site_name: site.full_title,
      employee_id: emp.id,
      employee_name: emp.full_name,
      employee_role: emp.role,
      payment_method: payMethod,
      daily_rate: dailyRate,
      days_worked: days,
      ot_hours: otHrs,
      night_diff_hours: 0,
      rest_day_days: 0,
      rest_day_ot_hours: 0,
      reg_holiday_days: 0,
      reg_holiday_ot_hours: 0,
      spec_holiday_days: 0,
      spec_holiday_ot_hours: 0,
      sss_rate: 0,
      gcash_charge: gcashChg,
      total_office_vale: totVale,
      office_vale_deduction: valeDed,
      sss_contribution: sssC,
      sss_salary_loan: 0,
      sss_calamity_loan: 0,
      sss_emergency_loan: 0,
      sss_restructured: 0,
      sss_condonation: 0,
      hdmf_contribution: 0,
      hdmf_mpl: hdmfMpl,
      hdmf_cl: 0,
      phic_contribution: phicC,
      abuloy: 0,
      site_vale: siteVale,
      corpo: corpo,
      others: others,
      is_signed: true,
      remarks: remarks,
    });

    records.push(rec);
  });

  const sitesWithCounts = INITIAL_SITES.map((s) => ({
    ...s,
    employee_count: employees.filter((e) => e.site_id === s.id && e.is_active).length,
  }));

  return {
    sites: sitesWithCounts,
    benefit_config: { ...INITIAL_BENEFIT_CONFIG },
    employees,
    periods: [...INITIAL_PERIODS],
    holidays: [...INITIAL_HOLIDAYS],
    records,
  };
}

export function computeFinanceSummary(sites, records) {
  const round2 = (v) => Math.round((v + Number.EPSILON) * 100) / 100;

  const summarizeByMethod = (method) => {
    const rows = [];
    const totals = {
      employee_count: 0,
      man_hours_days: 0,
      man_hours_ot: 0,
      gross_pay: 0,
      office_vale_deduction: 0,
      sss_contribution: 0,
      sss_salary_loan: 0,
      sss_calamity_loan: 0,
      sss_emergency_loan: 0,
      sss_restructured: 0,
      sss_condonation: 0,
      hdmf_contribution: 0,
      hdmf_mpl: 0,
      hdmf_cl: 0,
      phic_contribution: 0,
      abuloy: 0,
      site_vale: 0,
      corpo: 0,
      others: 0,
      total_deductions: 0,
      net_pay: 0,
      deducted_to_gcash: 0,
    };

    sites.forEach((site) => {
      const siteRecs = records.filter(
        (r) => Number(r.site_id) === Number(site.id) && r.payment_method === method
      );
      if (siteRecs.length === 0) return;

      const sumField = (field) =>
        round2(siteRecs.reduce((acc, r) => acc + (parseFloat(r[field]) || 0), 0));

      const empWithDays = siteRecs.filter((r) => (parseFloat(r.days_worked) || 0) > 0).length;
      const manHoursDays = round2(
        siteRecs.reduce((acc, r) => acc + (parseFloat(r.days_worked) || 0) * 8.0, 0)
      );
      const manHoursOt = sumField('ot_hours');
      const gross = sumField('gross_pay');
      const officeVale = sumField('office_vale_deduction');

      const row = {
        site_id: site.id,
        project_name: `${site.code} ${site.name}`,
        employee_count: empWithDays,
        total_rows: siteRecs.length,
        man_hours_days: manHoursDays,
        man_hours_ot: manHoursOt,
        gross_pay: gross,
        office_vale_deduction: officeVale,
        sss_contribution: sumField('sss_contribution'),
        sss_salary_loan: sumField('sss_salary_loan'),
        sss_calamity_loan: sumField('sss_calamity_loan'),
        sss_emergency_loan: sumField('sss_emergency_loan'),
        sss_restructured: sumField('sss_restructured'),
        sss_condonation: sumField('sss_condonation'),
        hdmf_contribution: sumField('hdmf_contribution'),
        hdmf_mpl: sumField('hdmf_mpl'),
        hdmf_cl: sumField('hdmf_cl'),
        phic_contribution: sumField('phic_contribution'),
        abuloy: sumField('abuloy'),
        site_vale: sumField('site_vale'),
        corpo: sumField('corpo'),
        others: sumField('others'),
        total_deductions: sumField('total_deductions'),
        net_pay: sumField('net_pay'),
        deducted_to_gcash: round2(gross - officeVale),
      };

      rows.push(row);
      Object.keys(totals).forEach((k) => {
        totals[k] = round2(totals[k] + row[k]);
      });
    });

    return { rows, totals };
  };

  return {
    gcash: summarizeByMethod('GCASH'),
    cash: summarizeByMethod('CASH'),
  };
}


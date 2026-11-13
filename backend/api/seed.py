from decimal import Decimal
from datetime import date
from .models import Site, BenefitConfig, Employee, PayrollPeriod, PayrollRecord


def seed_initial_data(force=False):
    if PayrollPeriod.objects.exists() and not force:
        return False

    if force:
        PayrollRecord.objects.all().delete()
        PayrollPeriod.objects.all().delete()
        Employee.objects.all().delete()
        Site.objects.all().delete()

    BenefitConfig.get_solo()

    sites_data = [
        ('24D00099', 'CALAMBA OVERPASS', 'Sir Denmark', 'Calamba, Laguna'),
        ('25D00290', 'LUKUTANG MALAKI RIVER 5', 'Engr. Ernesto Gustilo Jr.', 'Cavite / Laguna'),
        ('22D00095', 'UPLB ASH BUILDING', 'Site Engineer', 'UPLB, Los Baños, Laguna'),
        ('26OE0038', 'DIMASALANG PH3', 'Ricardo Jr.', 'Dimasalang, Manila'),
        ('26OE0030', 'NAGTAHAN FLYOVER 6', 'Site Engineer', 'Nagtahan, Manila'),
        ('26OE0028', 'NMED OFFICE PH6', 'Ricardo', 'Manila'),
        ('25DF0138', 'MALAGASANG DIVERSION ROAD', 'Sir Denmark', 'Imus, Cavite'),
        ('26OE0024', 'JONES BRIDGE RETRO', 'Site Engineer', 'Binondo, Manila'),
    ]

    site_map = {}
    for code, name, pic, loc in sites_data:
        site, _ = Site.objects.get_or_create(
            code=code,
            defaults={'name': name, 'project_in_charge': pic, 'location': loc, 'is_active': True}
        )
        site_map[code] = site

    period = PayrollPeriod.objects.create(
        period_covered='OCTOBER 30-NOVEMBER 5, 2026',
        start_date=date(2026, 10, 30),
        end_date=date(2026, 11, 5),
        status='OPEN',
        finance_note='NOTE: HINDI NI-DISBURSE, PAPALITAN NI BOSS SAKIN NG CHEQUE ENCASHMENT EVERY LAST WEEK OF THE MONTH',
        prepared_by='Finance / Payroll Admin',
    )

    # Entries format:
    # (site_code, payment_method, full_name, role, daily_rate, days, ot_hrs, gcash_charge,
    #  tot_vale, vale_ded, sss_c, hdmf_mpl, phic_c, site_vale, corpo, others, remarks)
    raw_entries = [
        # 1. 24D00099 CALAMBA OVERPASS - GCASH
        ('24D00099', 'GCASH', 'MATA, JOSEPH', 'Skilled Worker', 630, 5, 40, 20, 0, 0, 0, 0, 250, 0, 0, 0, ''),
        ('24D00099', 'GCASH', 'AGBONES, PUBLEO', 'Laborer', 600, 5, 40, 20, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('24D00099', 'GCASH', 'LABANDRIA, RONALD', 'Leadman / Skilled', 740, 5, 40, 20, 0, 0, 0, 0, 250, 0, 200, 0, 'svale & corpo c/o SIR DENMARK'),
        ('24D00099', 'GCASH', 'SALVADOR, ROLAND', 'Skilled Worker', 610, 5, 40, 20, 0, 0, 0, 0, 250, 1000, 200, 0, ''),
        ('24D00099', 'GCASH', 'VICENTE, ARTHUR JOSEPH', 'Skilled Worker', 650, 5, 40, 20, 0, 0, 0, 0, 250, 0, 200, 0, ''),
        ('24D00099', 'GCASH', 'MERCADO, HENRY', 'Skilled Worker', 620, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('24D00099', 'GCASH', 'VILLAGRACIA, DANNY', 'Skilled Worker', 650, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('24D00099', 'GCASH', 'TAN, ALVIN IAN', 'Skilled Worker', 740, 0, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('24D00099', 'GCASH', 'SALVADOR, RONALD', 'Skilled Worker', 620, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('24D00099', 'GCASH', 'VICENTE, LINO', 'Skilled Worker', 650, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('24D00099', 'GCASH', 'LUCASIA, BERNARD', 'Skilled Worker', 700, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('24D00099', 'GCASH', 'BONILLO, ROCKY', 'Skilled Worker', 620, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('24D00099', 'GCASH', 'NIMROD, MINGUITO', 'Skilled Worker', 620, 0, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('24D00099', 'GCASH', 'VECINA, EDWARD', 'Skilled Worker', 620, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('24D00099', 'GCASH', 'ESGUERRA, CHRISTOPHER', 'Laborer', 600, 0, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('24D00099', 'GCASH', 'VIGIL, DIOMEDES', 'Skilled Worker', 650, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),

        # 1B. 24D00099 CALAMBA OVERPASS - CASH
        ('24D00099', 'CASH', 'ENFORCER 1', 'Traffic Enforcer', 400, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('24D00099', 'CASH', 'ENFORCER 2', 'Traffic Enforcer', 400, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('24D00099', 'CASH', 'ENFORCER 3', 'Traffic Enforcer', 400, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),

        # 2. 25D00290 LUKUTANG MALAKI RIVER 5 - GCASH (Selected & key records matching summary)
        ('25D00290', 'GCASH', 'GUSTILO, JOSHUA ALEXANDER', 'Skilled Worker', 620, 5, 23, 20, 34000, 1000, 0, 0, 0, 0, 0, 0, ''),
        ('25D00290', 'GCASH', 'GUSTILO, ERNESTO JR.', 'Foreman / Lead', 1200, 5, 25, 20, 15000, 1000, 0, 0, 500, 0, 0, 0, ''),
        ('25D00290', 'GCASH', 'YUGA, ARNEL', 'Skilled Worker', 650, 5, 19, 20, 3000, 1000, 0, 0, 0, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'DE VERA, JOMAR', 'Laborer', 600, 6, 23, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'TAMOYANG, MICHAEL', 'Laborer', 600, 7, 19, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'ARROYO, JOHN ERIC', 'Skilled Worker', 740, 7, 21, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'SANTOS, EDISON', 'Skilled Worker', 620, 3, 16, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'COS, REY', 'Skilled Worker', 620, 4, 17, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'BASMAYOR, JOMARIE', 'Skilled Worker', 620, 3, 16, 20, 2000, 1000, 425, 0, 250, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'RUELO, REYNALD', 'Skilled Worker', 650, 3, 18, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'DELA TORRE, WILLIAM', 'Heavy Eq. / Skilled', 830, 4, 24, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'GONZALES, BERNARD', 'Leadman', 920, 1, 5, 20, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('25D00290', 'GCASH', 'LORICA, RICKY', 'Laborer', 600, 4, 20, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'DIMARANAN, RODEL', 'Skilled Worker', 620, 3, 11, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'ORLAZA, RODEL', 'Skilled Worker', 620, 3, 11, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'IGNACIO, JOSELITO', 'Laborer', 600, 4, 11, 20, 0, 0, 0, 0, 0, 1000, 0, 0, ''),
        ('25D00290', 'GCASH', 'IGNACIO, JONATHAN', 'Laborer', 600, 7, 23, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'MELAD, HAROLD', 'Laborer', 600, 4, 17, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'TROLLANO, ALFIO', 'Laborer', 600, 7, 19, 20, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('25D00290', 'GCASH', 'TATEL, MICHAEL', 'Laborer', 600, 4, 21, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'RODRIGO, VINCENT', 'Laborer', 600, 3, 11, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'CELLO, RUSTIC', 'Skilled Worker', 620, 4, 23, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'ARSENIO, JOEBERT', 'Laborer', 600, 4, 23, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'LABACA SR., LEONARDO', 'Skilled Worker', 680, 3, 16, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'SALADA, JAYSON', 'Skilled Worker', 620, 4, 20, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'GAVION, RODRIGO', 'Skilled Worker', 620, 3, 16, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'GAVION, ANGELO', 'Laborer', 600, 3, 11, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'ESPINAS, RUBEN', 'Skilled Worker', 800, 2, 12, 20, 0, 0, 0, 0, 250, 1000, 0, 0, ''),
        ('25D00290', 'GCASH', 'DACLES, JAIME', 'Skilled Worker', 650, 4, 16, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'LLONA, LUIS', 'Skilled Worker', 620, 2, 9, 20, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('25D00290', 'GCASH', 'NAYANGA, ALDOMAR', 'Skilled Worker', 680, 4, 16, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'DACLES, VICTORIO', 'Laborer', 600, 2, 12, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'TUANTE, MARK JOEL', 'Skilled Worker', 700, 3, 18, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'OFTANA, MARLO', 'Laborer', 600, 3, 18, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'MORANTE, ROMEL', 'Skilled Worker', 800, 4, 23, 20, 2000, 1000, 0, 0, 250, 1000, 0, 0, ''),
        ('25D00290', 'GCASH', 'BOCAL, CARLOS', 'Skilled Worker', 650, 5, 25, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'TALISAY, BIENVINIDO', 'Skilled Worker', 800, 3, 18, 20, 3000, 0, 0, 0, 0, 0, 0, 0, ''),
        ('25D00290', 'GCASH', 'DEMOGENA, DEXTER', 'Skilled Worker', 620, 3, 18, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'GARALDE, DINO', 'Skilled Worker', 620, 3, 17, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''),
        ('25D00290', 'GCASH', 'TAGLE, MCKENNEDY', 'Laborer', 600, 2, 11, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''),

        # 3. 22D00095 UPLB ASH BUILDING - GCASH
        ('22D00095', 'GCASH', 'JECOMO, RODRIGO', 'Skilled Worker', 620, 5, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('22D00095', 'GCASH', "Watchman (Rodrigo Jecomo's Wife)", 'Watchman', 350, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),

        # 4. 26OE0038 DIMASALANG PH3 - GCASH
        ('26OE0038', 'GCASH', 'ADESAS, GIL', 'Skilled Worker', 620, 7, 28, 20, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('26OE0038', 'GCASH', 'BOLIMA, GILBERT', 'Skilled Worker', 650, 4.5, 9, 20, 0, 0, 0, 0, 0, 0, 386, 0, ''),
        ('26OE0038', 'GCASH', 'GONZALES, BENZON', 'Skilled Worker', 720, 4, 0, 20, 0, 0, 0, 0, 0, 0, 417, 0, ''),
        ('26OE0038', 'GCASH', 'COLAR, BERNARDO', 'Skilled Worker', 630, 3, 8, 20, 0, 0, 0, 0, 250, 0, 0, 0, ''),
        ('26OE0038', 'GCASH', 'GUSTILO, JEOFFREY', 'Laborer', 600, 4, 11, 20, 2000, 1000, 0, 0, 250, 0, 0, 0, ''),
        ('26OE0038', 'GCASH', 'LAVANDRIA, RICARDO JR.', 'Skilled Worker', 680, 4.5, 9, 20, 2000, 1000, 0, 0, 250, 0, 0, 0, ''),
        ('26OE0038', 'GCASH', 'RASE, ELMER', 'Skilled Worker', 620, 3.5, 3, 20, 0, 0, 0, 0, 250, 1600, 0, 0, ''),
        ('26OE0038', 'GCASH', 'BUJANGIN, BENCHIE', 'Laborer', 600, 7, 8, 20, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('26OE0038', 'GCASH', 'MARQUEZ, GIL', 'Skilled Worker', 750, 2, 0, 20, 0, 0, 0, 0, 250, 0, 0, 0, ''),
        ('26OE0038', 'GCASH', 'SAN JUAN, WILLIAM', 'Skilled Worker', 640, 2, 3, 0, 0, 0, 0, 0, 0, 0, 211, 0, ''),
        ('26OE0038', 'GCASH', 'LABOC, RONNIE', 'Laborer', 600, 4.5, 6, 20, 0, 0, 0, 0, 0, 0, 436, 0, ''),
        ('26OE0038', 'GCASH', 'ALEGRIA, ALFONZO', 'Laborer', 600, 5, 5, 20, 0, 0, 0, 0, 0, 0, 487, 0, ''),
        ('26OE0038', 'GCASH', 'DAGALE, NILO', 'Skilled Worker', 650, 4.5, 9, 20, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('26OE0038', 'GCASH', 'MEONIS, JOCELYN', 'Laborer', 600, 5, 15, 20, 0, 0, 0, 0, 250, 0, 404, 0, ''),

        # 4B. 26OE0038 DIMASALANG PH3 - CASH
        ('26OE0038', 'CASH', 'Watchman Bernie Rase (Barracks)', 'Watchman', 350, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('26OE0038', 'CASH', 'Extra Dennis Bungcaras', 'Extra Worker', 600, 1.5, 0, 0, 0, 0, 0, 0, 0, 0, 211, 0, ''),
        ('26OE0038', 'CASH', 'Brgy 484 Chairwoman Eunice Ann Castro', 'Brgy Official', 350, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('26OE0038', 'CASH', 'Brgy 484 Tanod Maxi Maquinlin (Night)', 'Brgy Tanod', 350, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('26OE0038', 'CASH', 'Brgy 484 Tanod Alicia Bordios (Day)', 'Brgy Tanod', 350, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('26OE0038', 'CASH', 'Brgy 497 Chairman Bong Marzan', 'Brgy Official', 350, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('26OE0038', 'CASH', 'Brgy 497 Tanod Bernardo Balños (Day)', 'Brgy Tanod', 350, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('26OE0038', 'CASH', 'Brgy 497 Tanod Miyo Lopez (Night)', 'Brgy Tanod', 350, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),

        # 5. 26OE0030 NAGTAHAN FLYOVER 6 - GCASH & CASH
        ('26OE0030', 'GCASH', 'VERBA, MARLO', 'Skilled Worker', 620, 5, 2, 20, 0, 0, 0, 0, 250, 1000, 0, 0, ''),
        ('26OE0030', 'CASH', 'Brgy. 420 (Chairman Regala)', 'Brgy Official', 500, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),

        # 6. 26OE0028 NMED OFFICE PH6 - GCASH
        ('26OE0028', 'GCASH', 'MATEO, ANGELBERTO', 'Leadman', 880, 5, 8, 20, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('26OE0028', 'GCASH', 'PANLILIO, DEXTER', 'Laborer', 600, 5, 0, 20, 0, 0, 0, 0, 0, 1100, 0, 0, ''),
        ('26OE0028', 'GCASH', 'ALCANAR, JOLAN', 'Skilled Worker', 720, 7, 12, 20, 22500, 1500, 0, 0, 250, 0, 0, 0, ''),
        ('26OE0028', 'GCASH', 'RUELO, SANTIAGO JR.', 'Skilled Worker', 650, 4, 7, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''),
        ('26OE0028', 'GCASH', 'REBATO, WILFRETO', 'Laborer', 600, 5, 8, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''),
        ('26OE0028', 'GCASH', 'ROSALDO, JOBELLE', 'Skilled Worker', 650, 4.5, 12, 20, 0, 0, 0, 0, 250, 0, 0, 0, ''),
        ('26OE0028', 'GCASH', 'RONCALES, JOELITO', 'Skilled Worker', 650, 4, 4, 20, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('26OE0028', 'GCASH', 'AQUINO, CRISPOLO', 'Skilled Worker', 680, 6, 10, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''),
        ('26OE0028', 'GCASH', 'MENDOZA, JOMAR', 'Laborer', 600, 4, 12, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''),
        ('26OE0028', 'GCASH', 'COLONGON SR., NICOLAS', 'Skilled Worker', 620, 6.5, 2, 20, 0, 0, 0, 0, 0, 500, 0, 0, ''),
        ('26OE0028', 'GCASH', 'SUMAYAO, RHOCILL', 'Skilled Worker', 620, 6, 9, 20, 0, 0, 0, 685, 250, 500, 0, 0, ''),
        ('26OE0028', 'GCASH', 'NALDOZA, JESSIE', 'Skilled Worker', 650, 4.5, 2, 20, 0, 0, 0, 0, 250, 500, 0, 0, ''),
        ('26OE0028', 'GCASH', 'CORCUERA, MARLON', 'Leadman', 920, 1, 2, 20, 4000, 0, 0, 0, 250, 500, 0, 0, ''),
        ('26OE0028', 'GCASH', 'CONDE, MICHAEL', 'Skilled Worker', 680, 5, 12, 20, 3000, 1000, 0, 0, 250, 1000, 0, 0, ''),
        ('26OE0028', 'GCASH', 'OGAYON, CHRISTIAN', 'Skilled Worker', 710, 4.5, 6, 20, 0, 0, 0, 323, 250, 1000, 0, 0, ''),
        ('26OE0028', 'GCASH', 'VERBA, MARLO', 'Skilled Worker', 620, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('26OE0028', 'GCASH', 'PADAY SR., EDUARDO', 'Skilled Worker', 750, 2.5, 2, 20, 0, 0, 0, 0, 250, 800, 0, 0, ''),
        ('26OE0028', 'GCASH', 'MANLAYA, BONIFACIO', 'Skilled Worker', 770, 5, 6, 20, 4000, 1000, 0, 0, 0, 1120, 0, 0, ''),
        ('26OE0028', 'GCASH', 'ALEGRIA, ALBERTO', 'Skilled Worker', 740, 5, 8, 20, 0, 0, 0, 0, 0, 1000, 0, 0, ''),
        ('26OE0028', 'GCASH', 'SICAD, IAN', 'Skilled Worker', 710, 6, 6, 20, 2000, 1000, 0, 0, 250, 1000, 0, 0, ''),
        ('26OE0028', 'GCASH', 'CORAL, EDWIN', 'Skilled Worker', 640, 6, 5, 20, 0, 0, 0, 0, 250, 500, 88, 0, 'CORPO C/O RICARDO'),
        ('26OE0028', 'GCASH', 'ROSALDO, JOHN MARIEL', 'Skilled Worker', 830, 4.5, 2, 20, 0, 0, 0, 0, 250, 500, 185, 0, 'CORPO C/O RICARDO'),
        ('26OE0028', 'GCASH', 'CORCUERA, ARISTON III', 'Skilled Worker', 630, 5, 22, 20, 0, 0, 0, 0, 250, 0, 0, 0, ''),
        ('26OE0028', 'GCASH', 'LABOC, RONNIE', 'Laborer', 600, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),

        # 6B. 26OE0028 NMED OFFICE PH6 - CASH
        ('26OE0028', 'CASH', 'Romeo Sta. Ines', 'Skilled Worker', 700, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('26OE0028', 'CASH', 'Melvin Padapat (Tao ni Kuya Dagul)', 'Skilled Worker', 700, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('26OE0028', 'CASH', 'Raymund Reyes (Tao ni Kuya Dagul)', 'Skilled Worker', 700, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('26OE0028', 'CASH', 'Salvador Laurente (Tao ni Kuya Dagul)', 'Skilled Worker', 700, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),

        # 7. 25DF0138 MALAGASANG DIVERSION ROAD - GCASH
        ('25DF0138', 'GCASH', 'LAVANDRIA, RICARDO SR.', 'Foreman / Lead', 920, 10, 8, 20, 6000, 1000, 0, 0, 250, 0, 0, 4000, 'c/o Sir Denmark (Others - cash advance)'),
        ('25DF0138', 'GCASH', 'MERCADO, HENRY', 'Skilled Worker', 620, 4, 0, 20, 0, 0, 0, 0, 250, 0, 200, 0, ''),
        ('25DF0138', 'GCASH', 'VILLAGRACIA, DANNY', 'Skilled Worker', 650, 5, 0, 20, 0, 0, 0, 0, 250, 1000, 0, 0, ''),
        ('25DF0138', 'GCASH', 'LAVANDRIA, RONNIE', 'Skilled Worker', 830, 3, 8, 20, 6000, 1000, 0, 0, 250, 800, 270, 0, ''),
        ('25DF0138', 'GCASH', 'TAN, ALVIN IAN', 'Skilled Worker', 740, 5, 2, 20, 1000, 1000, 0, 0, 0, 300, 270, 0, ''),
        ('25DF0138', 'GCASH', 'MINGUITO, NIMROD', 'Skilled Worker', 620, 5, 2, 20, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('25DF0138', 'GCASH', 'SALVADOR, RONALD', 'Skilled Worker', 620, 5, 0, 20, 0, 0, 0, 0, 0, 300, 0, 0, ''),
        ('25DF0138', 'GCASH', 'VICENTE, LINO', 'Skilled Worker', 650, 5, 0, 20, 0, 0, 0, 0, 250, 0, 200, 0, ''),
        ('25DF0138', 'GCASH', 'LUCASIA, BERNARD', 'Skilled Worker', 700, 5, 0, 20, 0, 0, 0, 0, 250, 0, 0, 0, ''),
        ('25DF0138', 'GCASH', 'BONILLO, ROCKY', 'Skilled Worker', 620, 5, 0, 20, 0, 0, 0, 0, 0, 0, 200, 0, ''),
        ('25DF0138', 'GCASH', 'LAVANDRIA, ANGELINE', 'Admin / Site Staff', 600, 2, 4, 20, 2000, 0, 0, 0, 250, 500, 270, 0, ''),
        ('25DF0138', 'GCASH', 'VIGIL, DIOMEDES', 'Skilled Worker', 650, 5, 0, 20, 0, 0, 0, 0, 0, 0, 200, 0, ''),
        ('25DF0138', 'GCASH', 'ESGUERRA, CHRISTOPHER', 'Laborer', 600, 4, 0, 20, 1000, 1000, 0, 0, 0, 400, 270, 0, ''),
        ('25DF0138', 'GCASH', 'VECINA, EDWRAD', 'Skilled Worker', 620, 2, 0, 20, 0, 0, 0, 0, 0, 0, 200, 0, ''),
        ('25DF0138', 'GCASH', 'LAPIZ, JUDY', 'Skilled Worker', 700, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('25DF0138', 'GCASH', 'TUANTE, MJ', 'Skilled Worker', 640, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('25DF0138', 'GCASH', 'CARMONA, JUNREY', 'Laborer', 600, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('25DF0138', 'GCASH', 'Brgy Tanod Eduardo Reyes', 'Brgy Tanod', 500, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('25DF0138', 'GCASH', 'Brgy Tanod Joe Lara', 'Brgy Tanod', 500, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('25DF0138', 'GCASH', 'Brgy Tanod Edgar Tibayan', 'Brgy Tanod', 500, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),

        # 8. 26OE0024 JONES BRIDGE RETRO - GCASH
        ('26OE0024', 'GCASH', 'PANLILIO, DEXTER', 'Laborer', 600, 2, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('26OE0024', 'GCASH', 'RUELO, SANTIAGO JR.', 'Skilled Worker', 650, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('26OE0024', 'GCASH', 'RONCALES, JOELITO', 'Skilled Worker', 650, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
        ('26OE0024', 'GCASH', 'PADAY SR., EDUARDO', 'Skilled Worker', 750, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''),
    ]

    emp_cache = {}
    for (
        site_code, pay_method, full_name, role, d_rate, days, ot_hrs, gcash_chg,
        tot_vale, vale_ded, sss_c, hdmf_mpl, phic_c, site_vale, corpo, others, remarks
    ) in raw_entries:
        site_obj = site_map[site_code]
        clean_name = full_name.strip()

        if clean_name not in emp_cache:
            emp = Employee.objects.create(
                full_name=clean_name,
                role=role,
                site=site_obj,
                daily_rate=Decimal(str(d_rate)),
                payment_method=pay_method,
                total_office_vale=Decimal(str(tot_vale)),
                default_office_vale_deduction=Decimal(str(vale_ded)),
                has_sss=(sss_c > 0),
                has_phic=(phic_c > 0),
                has_hdmf=False,
                has_gcash_charge=(gcash_chg > 0),
                hdmf_mpl=Decimal(str(hdmf_mpl)),
            )
            emp_cache[clean_name] = emp
        else:
            emp = emp_cache[clean_name]
            if tot_vale > 0 and emp.total_office_vale == 0:
                emp.total_office_vale = Decimal(str(tot_vale))
                emp.default_office_vale_deduction = Decimal(str(vale_ded))
            if phic_c > 0:
                emp.has_phic = True
            if sss_c > 0:
                emp.has_sss = True
            if hdmf_mpl > 0:
                emp.hdmf_mpl = Decimal(str(hdmf_mpl))
            emp.save()

        PayrollRecord.objects.create(
            period=period,
            site=site_obj,
            employee=emp,
            payment_method=pay_method,
            daily_rate=Decimal(str(d_rate)),
            days_worked=Decimal(str(days)),
            ot_hours=Decimal(str(ot_hrs)),
            gcash_charge=Decimal(str(gcash_chg)),
            total_office_vale=Decimal(str(tot_vale)),
            office_vale_deduction=Decimal(str(vale_ded)),
            sss_contribution=Decimal(str(sss_c)),
            hdmf_mpl=Decimal(str(hdmf_mpl)),
            phic_contribution=Decimal(str(phic_c)),
            site_vale=Decimal(str(site_vale)),
            corpo=Decimal(str(corpo)),
            others=Decimal(str(others)),
            is_signed=True,
            remarks=remarks,
        )

    return True


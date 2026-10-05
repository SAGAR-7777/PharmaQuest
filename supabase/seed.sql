-- ====================================================================
-- PHARMAQUEST — SEED DATA SCRIPT (ER-2020 D.PHARM PART I)
-- Sourced directly from official PCI syllabus document (Pages 12–35)
-- Safe to re-run: Uses ON CONFLICT DO UPDATE / DO NOTHING
-- ====================================================================

-- 1. SEED 5 SUBJECTS
INSERT INTO public.subjects (id, theory_code, practical_code, title, accent_color, total_theory_hours, total_tutorial_hours, total_practical_hours, scope)
VALUES
('pharmaceutics', 'ER20-11T', 'ER20-11P', 'Pharmaceutics', '#f59e0b', 75, 25, 75, 'Impart basic knowledge and skills on the art and science of formulating and dispensing different pharmaceutical dosage forms.'),
('chemistry', 'ER20-12T', 'ER20-12P', 'Pharmaceutical Chemistry', '#06b6d4', 75, 25, 75, 'Impart basic knowledge on the chemical structure, storage conditions and medicinal uses of organic and inorganic chemical substances used as drugs.'),
('pharmacognosy', 'ER20-13T', 'ER20-13P', 'Pharmacognosy', '#10b981', 75, 25, 75, 'Impart knowledge on the medicinal uses of various drugs of natural origin, alternative systems of medicine, nutraceuticals, and herbal cosmetics.'),
('hap', 'ER20-14T', 'ER20-14P', 'Human Anatomy & Physiology', '#f43f5e', 75, 25, 75, 'Impart basic knowledge on structure and functions of human body, homeostasis mechanisms and homeostatic imbalances.'),
('social', 'ER20-15T', 'ER20-15P', 'Social Pharmacy', '#8b5cf6', 75, 25, 75, 'Impart basic knowledge on public health, epidemiology, preventive care, and roles of pharmacists in public health programs.')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  scope = EXCLUDED.scope,
  total_theory_hours = EXCLUDED.total_theory_hours,
  total_tutorial_hours = EXCLUDED.total_tutorial_hours,
  total_practical_hours = EXCLUDED.total_practical_hours;

-- 2. SEED CHAPTERS
INSERT INTO public.chapters (id, subject_id, chapter_number, title, hours, topics)
VALUES
-- Pharmaceutics (ER20-11T)
('pc-ch-01', 'pharmaceutics', 1, 'History of Pharmacy & Pharmacopoeias', 7, '["History of profession of Pharmacy in India", "Pharmacy as a career", "Introduction to IP, BP, USP, NF, Extra Pharmacopoeia", "Salient features of IP"]'::jsonb),
('pc-ch-02', 'pharmaceutics', 2, 'Packaging Materials', 5, '["Types, selection criteria, advantages and disadvantages of glass, plastic, metal, rubber"]'::jsonb),
('pc-ch-03', 'pharmaceutics', 3, 'Pharmaceutical Aids & Preservatives', 3, '["Organoleptic agents (Colouring, flavouring, sweetening)", "Preservatives: Definition, types with examples and uses"]'::jsonb),
('pc-ch-04', 'pharmaceutics', 4, 'Unit Operations', 9, '["Size reduction (hammer mill, ball mill)", "Size separation (cyclone separator, sieves IP)", "Mixing (double cone blender, silverson mixer)", "Filtration", "Drying (fluidized bed dryer, freeze drying)", "Extraction"]'::jsonb),
('pc-ch-05', 'pharmaceutics', 5, 'Pharmaceutical Dosage Forms', 37, '["Tablets (8h)", "Capsules (4h)", "Liquid oral preparations (6h)", "Topical preparations (8h)", "Nasal & Ear (2h)", "Powders & granules (3h)", "Sterile formulations (6h)", "Immunological products (4h)"]'::jsonb),
('pc-ch-06', 'pharmaceutics', 6, 'Plant Layout & Quality Management', 5, '["Basic structure, layout of manufacturing plants", "Quality control and quality assurance, cGMP, calibration, validation"]'::jsonb),
('pc-ch-07', 'pharmaceutics', 7, 'Novel Drug Delivery Systems (NDDS)', 5, '["Introduction, Classification with examples, advantages, and challenges"]'::jsonb),

-- Pharmaceutical Chemistry (ER20-12T)
('ch-ch-01', 'chemistry', 1, 'Introduction, Errors & Limit Tests', 8, '["Scope & objectives", "Sources & types of errors", "Impurities in Pharmaceuticals & Limit tests (chlorides, sulphates, iron, heavy metals, arsenic)"]'::jsonb),
('ch-ch-02', 'chemistry', 2, 'Volumetric & Gravimetric Analysis', 8, '["Acid-base, non-aqueous, precipitation, complexometric, redox titrations", "Gravimetric analysis"]'::jsonb),
('ch-ch-03', 'chemistry', 3, 'Inorganic Pharmaceuticals', 7, '["Haematinics", "Gastro-intestinal agents", "Topical agents", "Dental products", "Medicinal gases"]'::jsonb),
('ch-ch-04', 'chemistry', 4, 'Nomenclature of Heterocyclic Compounds', 2, '["Nomenclature of organic chemical systems containing up to three rings"]'::jsonb),
('ch-ch-05', 'chemistry', 5, 'Drugs Acting on Central Nervous System', 9, '["Anaesthetics (Thiopental Sodium*, Ketamine HCl*)", "Sedatives & Hypnotics (Diazepam*)", "Antipsychotics", "Anticonvulsants (Phenytoin*)", "Anti-Depressants"]'::jsonb),
('ch-ch-11', 'chemistry', 11, 'Anti-Infective Agents', 12, '["Antifungal, Urinary tract anti-infectives", "Anti-Tubercular (INH*, Ethambutol*)", "Antiviral, Antimalarials, Sulfonamides"]'::jsonb),

-- Pharmacognosy (ER20-13T)
('cg-ch-01', 'pharmacognosy', 1, 'Definition, History & Scope', 2, '["Scope and historical development of Pharmacognosy"]'::jsonb),
('cg-ch-02', 'pharmacognosy', 2, 'Classification of Crude Drugs', 4, '["Alphabetical, Taxonomical, Morphological, Pharmacological, Chemical, Chemo-taxonomical"]'::jsonb),
('cg-ch-04', 'pharmacognosy', 4, 'Primary & Secondary Metabolites', 6, '["Alkaloids, Glycosides, Tannins, Volatile oils, Resins"]'::jsonb),
('cg-ch-05', 'pharmacognosy', 5, 'Biological Source, Chemistry & Efficacy', 50, '["Laxatives (Senna, Aloe)", "Cardiotonics (Digitalis)", "Carminatives", "Astringents", "Antihypertensives (Rauwolfia)"]'::jsonb),

-- Human Anatomy & Physiology (ER20-14T)
('ha-ch-01', 'hap', 1, 'Scope of Anatomy & Elementary Tissues', 4, '["Definition, anatomical terms, cellular components, primary tissues"]'::jsonb),
('ha-ch-05', 'hap', 5, 'Haemopoietic System', 8, '["Composition and functions of blood", "Blood groups", "Blood clotting mechanism and disorders"]'::jsonb),
('ha-ch-07', 'hap', 7, 'Cardiovascular System', 8, '["Anatomy of heart, blood vessels, cardiac cycle, conduction system, ECG basics"]'::jsonb),

-- Social Pharmacy (ER20-15T)
('sp-ch-01', 'social', 1, 'Introduction to Social Pharmacy', 5, '["Definition, scope, National Health Policy, Millenium Development Goals, WHO concepts"]'::jsonb),
('sp-ch-02', 'social', 2, 'Preventive Healthcare & Environment', 18, '["Nutrition, Balanced diet, Micronutrient deficiencies", "Immunization schedules, vaccines"]'::jsonb),
('sp-ch-04', 'social', 4, 'Microbiology, Epidemiology & Communicable Diseases', 28, '["Causative agents, epidemiology, and prevention of tuberculosis, dengue, malaria, AIDS"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED QUESTIONS
INSERT INTO public.questions (id, subject_id, chapter_id, chapter_number, chapter_title, code_label, question_text, question_type, year, difficulty, radar_tag, frequency, explanation_mechanism, explanation_key_point, explanation_syllabus_ref, marks)
VALUES
('q-pc-01', 'pharmaceutics', 'pc-ch-01', 1, 'History of Pharmacy & Pharmacopoeias', 'ER20-11T #014', 'Which edition of the Indian Pharmacopoeia (IP) was first published, and who was the chairman of the committee?', 'pyq', 2024, 'Medium', 'HIGH PRIORITY', 'Appeared 4 times in 2021–2024', 'The First Edition of the Indian Pharmacopoeia was published in 1955 under the chairmanship of Dr. B. N. Ghosh by the Ministry of Health, Government of India.', 'Historical landmark: 1955 = 1st Edition (Dr. B. N. Ghosh). Supplement in 1960.', 'ER20-11T Chapter 1: History of Pharmacy in India & Salient features of IP.', 3),
('q-pc-02', 'pharmaceutics', 'pc-ch-04', 4, 'Unit Operations', 'ER20-11T #028', 'In a Ball Mill, size reduction predominantly occurs through which combination of physical mechanisms?', 'mcq', 2023, 'Hard', 'CONCEPTUAL', 'Board Exam 2023', 'In a ball mill, when the cylinder rotates at optimum speed, cascading balls impart impact and shearing/attrition.', 'Hammer mill = Impact only. Ball mill = Both Impact and Attrition.', 'ER20-11T Chapter 4: Size reduction: hammer mill and ball mill.', 1),
('q-pc-03', 'pharmaceutics', 'pc-ch-05', 5, 'Pharmaceutical Dosage Forms', 'ER20-11T #042', 'What is the primary difference between a hard gelatin capsule and a soft gelatin capsule regarding their plasticizer-to-gelatin ratio?', 'pyq', 2023, 'Medium', 'REPEATED', 'Repeated in 2022 & 2023', 'Soft gelatin capsules require high flexibility achieved by adding glycerol/sorbitol in a ratio of approximately 0.8:1, whereas hard gelatin has ~0.4:1.', 'Soft gel = High plasticizer (flexible, hermetically sealed in single step).', 'ER20-11T Chapter 5: Capsules – hard and soft gelatine capsules.', 3),
('q-pc-04', 'pharmaceutics', 'pc-ch-04', 4, 'Unit Operations', 'ER20-11T #055', 'Freeze drying (Lyophilization) is based on which fundamental thermodynamic phenomenon?', 'vvi', 2022, 'Hard', 'MUST REVISE', 'Core VVI Question', 'Lyophilization operates below the triple point of water (0.01°C and 4.58 mmHg). Moisture frozen into ice is removed directly by sublimation into water vapor without passing through the liquid phase.', 'Direct Solid -> Gas transition without liquid phase = Sublimation.', 'ER20-11T Chapter 4: Drying: working of fluidized bed dryer and process of freeze drying.', 5),

('q-ch-01', 'chemistry', 'ch-ch-01', 1, 'Introduction, Errors & Limit Tests', 'ER20-12T #019', 'In the Limit Test for Iron as per the Indian Pharmacopoeia, which reagent is added to prevent precipitation of iron as ferrous hydroxide?', 'pyq', 2024, 'Medium', 'HIGH PRIORITY', 'Annual Sessional & Final 2024', 'Citric acid complexes with iron to prevent premature precipitation as ferrous hydroxide when made alkaline by ammonia. Thioglycolic acid then reacts with Fe2+ to produce purple colored ferrous thioglycolate.', 'Citric Acid = Prevents precipitation. Thioglycolic Acid = Color-forming reducing agent.', 'ER20-12T Chapter 1: Limit tests for iron.', 3),
('q-ch-02', 'chemistry', 'ch-ch-05', 5, 'Drugs Acting on Central Nervous System', 'ER20-12T #033', 'Phenytoin* (starred compound in syllabus) belongs chemically to which heterocyclic ring system?', 'mcq', 2023, 'Medium', 'MUST REVISE', 'Board Exam 2023', 'Phenytoin is 5,5-diphenylhydantoin (5,5-diphenylimidazolidine-2,4-dione). It is a first-line anticonvulsant that stabilizes voltage-gated sodium channels.', 'Phenytoin = Hydantoin derivative. Starred (*) in ER20-12T syllabus.', 'ER20-12T Chapter 5: Anticonvulsants: Phenytoin*.', 1),
('q-ch-03', 'chemistry', 'ch-ch-11', 11, 'Anti-Infective Agents', 'ER20-12T #062', 'Isoniazid (INH*) is a first-line anti-tubercular agent chemically classified as:', 'vvi', 2024, 'Hard', 'HIGH PRIORITY', 'Must revise VVI', 'INH (Isoniazid) is the hydrazide of isonicotinic acid (Pyridine-4-carbohydrazide). It inhibits mycolic acid synthesis in the Mycobacterium tuberculosis cell wall after activation by KatG.', 'Pyridine ring + -CONHNH2 group at position 4. Starred compound in syllabus.', 'ER20-12T Chapter 11: Anti-Tubercular Agents: INH*.', 3),

('q-cg-01', 'pharmacognosy', 'cg-ch-05', 5, 'Biological Source, Chemistry & Efficacy', 'ER20-13T #011', 'What is the biological source and active chemical class of Senna?', 'pyq', 2024, 'Easy', 'REPEATED', 'Repeated in 2021, 2022, 2023, 2024', 'Senna consists of dried leaflets of Cassia senna or Cassia angustifolia, family Leguminosae. It contains Sennoside A and B which are stimulant anthraquinone laxatives.', 'Cassia angustifolia / Leguminosae / Anthraquinone glycosides / Laxative.', 'ER20-13T Chapter 5: Laxatives: Aloe, Castor oil, Ispaghula, Senna.', 3),
('q-cg-02', 'pharmacognosy', 'cg-ch-05', 5, 'Biological Source, Chemistry & Efficacy', 'ER20-13T #035', 'Which chemical test is used for the detection of Anthraquinone glycosides in Senna leaves?', 'mcq', 2023, 'Medium', 'CONCEPTUAL', 'Board Exam 2023', 'In Borntrager test, powder is boiled with dilute acid, filtered, extracted with organic solvent, and shaken with dilute ammonia. A rose pink or cherry red color confirms free anthraquinones.', 'Keller-Kiliani = Deoxy sugars (Digitalis). Borntrager = Anthraquinones (Senna).', 'ER20-13T Chapter 4 & 5: Identification tests of glycosides; Laxatives.', 1),

('q-ha-01', 'hap', 'ha-ch-07', 7, 'Cardiovascular System', 'ER20-14T #007', 'In the cardiac conduction system of the human heart, what is the natural pacemaker and what is its typical intrinsic firing rate?', 'pyq', 2024, 'Medium', 'HIGH PRIORITY', 'Universal D.Pharm Exam Question', 'The Sinoatrial (SA) node located in the superior wall of the right atrium initiates rhythmic action potentials at 60–100 impulses per minute, making it the primary physiological pacemaker.', 'SA Node -> AV Node -> Bundle of His -> Purkinje Fibers.', 'ER20-14T Chapter 7: Anatomy and Physiology of heart, Cardiac cycle and Heart sounds.', 3),
('q-ha-02', 'hap', 'ha-ch-05', 5, 'Haemopoietic System', 'ER20-14T #022', 'Which blood clotting factor is known as the Stuart-Prower factor in the coagulation cascade?', 'mcq', 2023, 'Easy', 'MUST REVISE', 'Annual Exam 2023', 'Factor X is the Stuart-Prower factor. Its activation to Factor Xa is the convergence point where intrinsic and extrinsic pathways merge into the common pathway to activate prothrombin to thrombin.', 'Factor X = Stuart-Prower factor. Factor I = Fibrinogen. Factor II = Prothrombin.', 'ER20-14T Chapter 5: Mechanism of Blood Clotting.', 1),

('q-sp-01', 'social', 'sp-ch-02', 2, 'Preventive Healthcare & Environment', 'ER20-15T #016', 'Under the National Immunization Schedule (NIS) in India, which vaccines are administered at birth to a newborn?', 'pyq', 2024, 'Medium', 'HIGH PRIORITY', 'Board Exam 2024', 'At birth, the child receives three primary immunizations: BCG against tuberculosis (intradermal), Oral Polio Vaccine (OPV zero dose), and Hepatitis B birth dose (intramuscular within 24 hours).', 'Birth doses: BCG + OPV 0 + Hep-B (within 24 hrs).', 'ER20-15T Chapter 2: Overview of Vaccines, types of immunity and immunization.', 3),
('q-sp-02', 'social', 'sp-ch-04', 4, 'Microbiology, Epidemiology & Communicable Diseases', 'ER20-15T #039', 'Which vector transmits Dengue and Chikungunya fevers in humans?', 'mcq', 2023, 'Medium', 'CONCEPTUAL', 'National Health Program Section', 'Aedes aegypti (day-biting mosquito) is the primary biological vector for Dengue virus (Flaviviridae) and Chikungunya virus (Togaviridae). Anopheles transmits Malaria; Culex transmits Filariasis.', 'Aedes aegypti = Dengue / Chikungunya. Anopheles = Malaria. Culex = Filariasis.', 'ER20-15T Chapter 4: Causative agents, epidemiology and prevention of Dengue and Malaria.', 1)
ON CONFLICT (id) DO NOTHING;

-- 4. SEED OPTIONS FOR QUESTIONS
INSERT INTO public.question_options (question_id, option_index, option_key, option_text, is_correct)
VALUES
('q-pc-01', 0, 'A', '1955, Dr. B. N. Ghosh', true),
('q-pc-01', 1, 'B', '1966, Dr. B. Mukerji', false),
('q-pc-01', 2, 'C', '1985, Dr. Nitya Anand', false),
('q-pc-01', 3, 'D', '1948, Dr. Ram Nath Chopra', false),

('q-pc-02', 0, 'A', 'Impact only', false),
('q-pc-02', 1, 'B', 'Attrition only', false),
('q-pc-02', 2, 'C', 'Both Impact and Attrition', true),
('q-pc-02', 3, 'D', 'Cutting and shearing', false),

('q-pc-03', 0, 'A', 'Hard gelatin capsules contain more plasticizer than soft gelatin capsules', false),
('q-pc-03', 1, 'B', 'Soft gelatin capsules contain a higher plasticizer-to-gelatin ratio (0.8:1) to maintain flexibility', true),
('q-pc-03', 2, 'C', 'Soft gelatin capsules contain zero plasticizer', false),
('q-pc-03', 3, 'D', 'Both hard and soft gelatin capsules have identical plasticizer ratios', false),

('q-pc-04', 0, 'A', 'Condensation at atmospheric pressure', false),
('q-pc-04', 1, 'B', 'Sublimation of ice to vapor below the triple point of water', true),
('q-pc-04', 2, 'C', 'Evaporation by convection current', false),
('q-pc-04', 3, 'D', 'Adiabatic flash drying', false),

('q-ch-01', 0, 'A', 'Thioglycolic acid', false),
('q-ch-01', 1, 'B', 'Citric acid (Iron-free)', true),
('q-ch-01', 2, 'C', 'Ammonia solution', false),
('q-ch-01', 3, 'D', 'Lead acetate cotton', false),

('q-ch-02', 0, 'A', 'Barbiturate ring', false),
('q-ch-02', 1, 'B', 'Hydantoin (Imidazolidinedione) ring', true),
('q-ch-02', 2, 'C', 'Benzodiazepine ring', false),
('q-ch-02', 3, 'D', 'Phenothiazine ring', false),

('q-ch-03', 0, 'A', 'Isonicotinic acid hydrazide (Pyridine derivative)', true),
('q-ch-03', 1, 'B', 'Diaminodiphenyl sulfone (Aniline derivative)', false),
('q-ch-03', 2, 'C', 'Fluoroquinolone derivative', false),
('q-ch-03', 3, 'D', 'Purine analogue', false),

('q-cg-01', 0, 'A', 'Dried leaflets of Cassia angustifolia (Family: Leguminosae) containing Anthraquinone glycosides (Sennoside A & B)', true),
('q-cg-01', 1, 'B', 'Dried leaves of Digitalis purpurea (Family: Scrophulariaceae) containing Cardiac glycosides', false),
('q-cg-01', 2, 'C', 'Dried rhizomes of Zingiber officinale containing Volatile oils', false),
('q-cg-01', 3, 'D', 'Dried bark of Cinchona calisaya containing Quinoline alkaloids', false),

('q-cg-02', 0, 'A', 'Keller-Kiliani test', false),
('q-cg-02', 1, 'B', 'Borntrager test (Modified Borntrager for C-glycosides)', true),
('q-cg-02', 2, 'C', 'Mayer reagent test', false),
('q-cg-02', 3, 'D', 'Shinoda test', false),

('q-ha-01', 0, 'A', 'Atrioventricular (AV) node, 40–60 bpm', false),
('q-ha-01', 1, 'B', 'Sinoatrial (SA) node, 60–100 bpm', true),
('q-ha-01', 2, 'C', 'Bundle of His, 30–40 bpm', false),
('q-ha-01', 3, 'D', 'Purkinje fibers, 15–20 bpm', false),

('q-ha-02', 0, 'A', 'Factor VIII', false),
('q-ha-02', 1, 'B', 'Factor IX', false),
('q-ha-02', 2, 'C', 'Factor X', true),
('q-ha-02', 3, 'D', 'Factor XII', false),

('q-sp-01', 0, 'A', 'BCG, OPV-0, Hepatitis B birth dose', true),
('q-sp-01', 1, 'B', 'DPT, Rotavirus, PCV', false),
('q-sp-01', 2, 'C', 'Measles-Rubella, Vitamin A', false),
('q-sp-01', 3, 'D', 'TT-1, Pentavalent', false),

('q-sp-02', 0, 'A', 'Anopheles stephensi', false),
('q-sp-02', 1, 'B', 'Aedes aegypti', true),
('q-sp-02', 2, 'C', 'Culex quinquefasciatus', false),
('q-sp-02', 3, 'D', 'Mansonia annulifera', false)
ON CONFLICT DO NOTHING;

-- 5. SEED QUESTION MODEL ANSWERS
INSERT INTO public.question_answers (question_id, correct_option_index, model_answer)
VALUES
('q-pc-01', 0, 'The First Edition of the Indian Pharmacopoeia was compiled by the IP Committee constituted in 1948 under the chairmanship of Dr. B. N. Ghosh and officially published in 1955.'),
('q-pc-02', 2, 'Size reduction in ball mill operates simultaneously by impact (falling balls) and attrition (balls rolling against one another). Critical speed maintains proper cascading.'),
('q-pc-03', 1, 'Soft gelatin capsules use a higher plasticizer-to-gelatin ratio (~0.8:1) using glycerol, sorbitol or propylene glycol to ensure elasticity and airtight seal.'),
('q-pc-04', 1, 'Lyophilization sublimates frozen water below the triple point (0.01°C, 4.58 mmHg), protecting thermolabile biological products like vaccines and antibiotics.'),
('q-ch-01', 1, 'Citric acid prevents precipitation of iron by ammonia by forming a soluble iron-citrate complex. Thioglycolic acid reduces Fe3+ to Fe2+ to yield purple ferrous thioglycolate.'),
('q-ch-02', 1, 'Phenytoin is 5,5-diphenylhydantoin, an anticonvulsant that delays sodium channel reactivation to block high-frequency neuronal firing.'),
('q-ch-03', 0, 'Isoniazid is isonicotinic acid hydrazide. It stops cell-wall mycolic acid formation in Mycobacterium tuberculosis.'),
('q-cg-01', 0, 'Senna consists of leaflets of Cassia angustifolia (Tinnevelly) or Cassia acutifolia (Alexandrian), Leguminosae, rich in Sennosides A & B.'),
('q-cg-02', 1, 'Borntrager test yields a distinct rose-pink or red color in the ammoniacal layer in the presence of free anthraquinone aglycones.'),
('q-ha-01', 1, 'The SA node in the right atrium possesses the highest automaticity (60–100 bpm) and depolarizes first to set the physiological heart rate.'),
('q-ha-02', 2, 'Factor X (Stuart-Prower factor) activates prothrombin (Factor II) to thrombin (Factor IIa) in the presence of Factor V, Ca2+ and phospholipids.'),
('q-sp-01', 0, 'Under the Indian National Immunization Schedule, BCG, zero dose OPV, and birth-dose Hepatitis B are administered within 24 hours of birth.'),
('q-sp-02', 1, 'Aedes aegypti mosquitoes with characteristic white markings on legs transmit Dengue and Chikungunya arboviruses.')
ON CONFLICT (question_id) DO NOTHING;

-- 6. SEED PYQS
INSERT INTO public.pyqs (question_id, exam_year, exam_session, marks)
VALUES
('q-pc-01', 2024, 'Annual Board Exam', 3),
('q-pc-03', 2023, 'Sessional Exam', 3),
('q-ch-01', 2024, 'Annual Board Exam', 3),
('q-cg-01', 2024, 'Supplementary Exam', 3),
('q-ha-01', 2024, 'Annual Board Exam', 3),
('q-sp-01', 2024, 'Annual Board Exam', 3)
ON CONFLICT DO NOTHING;

-- 7. SEED VVI EXAM RADAR QUESTIONS
INSERT INTO public.vvi_questions (question_id, priority_tier, reason)
VALUES
('q-pc-01', 'TIER 1 (MUST REVISE)', 'Repeated in 4 consecutive exam cycles across state boards'),
('q-pc-04', 'TIER 1 (MUST REVISE)', 'Core thermodynamic unit operation question in pharmaceutics'),
('q-ch-01', 'TIER 1 (MUST REVISE)', 'Mandatory inorganic limit test question with exact reagent roles'),
('q-ch-03', 'TIER 1 (MUST REVISE)', 'Starred (*) structure compound in anti-infectives syllabus'),
('q-cg-01', 'TIER 2 (HIGH PROBABILITY)', 'Standard biological source and chemical class question'),
('q-ha-01', 'TIER 1 (MUST REVISE)', 'Fundamental physiology diagram and conduction system question'),
('q-sp-01', 'TIER 1 (MUST REVISE)', 'National Health Programme Immunization schedule priority')
ON CONFLICT DO NOTHING;

-- 8. SEED MOCK TEST
INSERT INTO public.mock_tests (id, title, subject_id, duration_seconds, total_questions, description)
VALUES
('mock-er20-01', 'D.Pharm Part I Comprehensive Sessional Assessment', 'pharmaceutics', 900, 5, 'Full-spectrum ER-2020 sessional mock assessment covering Pharmaceutics, Chemistry, Pharmacognosy, HAP, and Social Pharmacy.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.mock_test_questions (mock_test_id, question_id, sort_order)
VALUES
('mock-er20-01', 'q-pc-01', 1),
('mock-er20-01', 'q-pc-02', 2),
('mock-er20-01', 'q-ch-01', 3),
('mock-er20-01', 'q-cg-01', 4),
('mock-er20-01', 'q-ha-01', 5)
ON CONFLICT DO NOTHING;

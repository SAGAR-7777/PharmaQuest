// Official-aligned D.Pharm ER-2020 Questions, PYQs, MCQs, VVIs & Viva Bank
// Strictly aligned with ER20-11T through ER20-15T topics and official question patterns

export const QUESTIONS_BANK = [
  // --- PHARMACEUTICS (ER20-11T) ---
  {
    id: "q-pc-01",
    courseId: "pharmaceutics",
    courseCode: "ER20-11T",
    chapterNumber: 1,
    chapterTitle: "History of Pharmacy & Pharmacopoeias",
    type: "pyq",
    year: 2024,
    codeLabel: "ER20-11T #014",
    difficulty: "Medium",
    radarTag: "HIGH PRIORITY",
    frequency: "Appeared 4 times in 2021–2024",
    question: "Which edition of the Indian Pharmacopoeia (IP) was first published, and who was the chairman of the committee?",
    options: [
      "1955, Dr. B. N. Ghosh",
      "1966, Dr. B. Mukerji",
      "1985, Dr. Nitya Anand",
      "1948, Dr. Ram Nath Chopra"
    ],
    correctAnswer: 0,
    explanation: {
      mechanism: "The First Edition of the Indian Pharmacopoeia was published in 1955 under the chairmanship of Dr. B. N. Ghosh by the Ministry of Health, Government of India.",
      keyPoint: "Historical landmark: 1955 = 1st Edition (Dr. B. N. Ghosh). Supplement published in 1960.",
      syllabusRef: "ER20-11T Chapter 1: History of Pharmacy in India & Salient features of IP."
    },
    marks: 3
  },
  {
    id: "q-pc-02",
    courseId: "pharmaceutics",
    courseCode: "ER20-11T",
    chapterNumber: 4,
    chapterTitle: "Unit Operations",
    type: "mcq",
    year: 2023,
    codeLabel: "ER20-11T #028",
    difficulty: "Hard",
    radarTag: "CONCEPTUAL",
    frequency: "Board Exam 2023",
    question: "In a Ball Mill, size reduction predominantly occurs through which combination of physical mechanisms?",
    options: [
      "Impact only",
      "Attrition only",
      "Both Impact and Attrition",
      "Cutting and shearing"
    ],
    correctAnswer: 2,
    explanation: {
      mechanism: "In a ball mill, when the cylinder rotates at optimum (critical) speed, the balls cascade down imparting impact upon the drug particles, and shearing/attrition as balls rub against each other and the shell.",
      keyPoint: "Hammer mill = Impact only. Ball mill = Both Impact and Attrition. Fluid energy mill = Impact and Attrition.",
      syllabusRef: "ER20-11T Chapter 4: Size reduction: hammer mill and ball mill."
    },
    marks: 1
  },
  {
    id: "q-pc-03",
    courseId: "pharmaceutics",
    courseCode: "ER20-11T",
    chapterNumber: 5,
    chapterTitle: "Pharmaceutical Dosage Forms",
    type: "pyq",
    year: 2023,
    codeLabel: "ER20-11T #042",
    difficulty: "Medium",
    radarTag: "REPEATED",
    frequency: "Repeated in 2022 & 2023",
    question: "What is the primary difference between a hard gelatin capsule and a soft gelatin capsule regarding their plasticizer-to-gelatin ratio?",
    options: [
      "Hard gelatin capsules contain more plasticizer than soft gelatin capsules",
      "Soft gelatin capsules contain a higher plasticizer-to-gelatin ratio (0.8:1) to maintain flexibility",
      "Soft gelatin capsules contain zero plasticizer",
      "Both hard and soft gelatin capsules have identical plasticizer ratios"
    ],
    correctAnswer: 1,
    explanation: {
      mechanism: "Soft gelatin capsules require high flexibility to contain non-aqueous liquids and pastes, achieved by adding glycerol/sorbitol in a ratio of approximately 0.8:1 (Plasticizer:Gelatin), whereas hard gelatin has ~0.4:1.",
      keyPoint: "Soft gel = High plasticizer (flexible, hermetically sealed in single step). Hard gel = Low plasticizer (two pieces: cap and body).",
      syllabusRef: "ER20-11T Chapter 5: Capsules – hard and soft gelatine capsules."
    },
    marks: 3
  },
  {
    id: "q-pc-04",
    courseId: "pharmaceutics",
    courseCode: "ER20-11T",
    chapterNumber: 4,
    chapterTitle: "Unit Operations",
    type: "vvi",
    year: 2022,
    codeLabel: "ER20-11T #055",
    difficulty: "Hard",
    radarTag: "MUST REVISE",
    frequency: "Core VVI Question",
    question: "Freeze drying (Lyophilization) is based on which fundamental thermodynamic phenomenon?",
    options: [
      "Condensation at atmospheric pressure",
      "Sublimation of ice to vapor below the triple point of water",
      "Evaporation by convection current",
      "Adiabatic flash drying"
    ],
    correctAnswer: 1,
    explanation: {
      mechanism: "Lyophilization operates below the triple point of water (0.01°C and 4.58 mmHg). Moisture frozen into ice is removed directly by sublimation into water vapor without passing through the liquid phase, preserving thermolabile biologicals (vaccines, sera, antibiotics).",
      keyPoint: "Direct Solid -> Gas transition without liquid phase = Sublimation.",
      syllabusRef: "ER20-11T Chapter 4: Drying: working of fluidized bed dryer and process of freeze drying."
    },
    marks: 5
  },

  // --- PHARMACEUTICAL CHEMISTRY (ER20-12T) ---
  {
    id: "q-ch-01",
    courseId: "chemistry",
    courseCode: "ER20-12T",
    chapterNumber: 1,
    chapterTitle: "Introduction, Errors & Limit Tests",
    type: "pyq",
    year: 2024,
    codeLabel: "ER20-12T #019",
    difficulty: "Medium",
    radarTag: "HIGH PRIORITY",
    frequency: "Annual Sessional & Final 2024",
    question: "In the Limit Test for Iron as per the Indian Pharmacopoeia, which reagent is added to prevent precipitation of iron as ferrous hydroxide?",
    options: [
      "Thioglycolic acid",
      "Citric acid (Iron-free)",
      "Ammonia solution",
      "Lead acetate cotton"
    ],
    correctAnswer: 1,
    explanation: {
      mechanism: "Citric acid complexes with iron to prevent its premature precipitation as ferrous hydroxide when the medium is made alkaline by the addition of ammonia. Thioglycolic acid then reacts with Fe2+ to produce purple colored ferrous thioglycolate.",
      keyPoint: "Citric Acid = Prevents precipitation. Thioglycolic Acid = Color-forming reducing agent.",
      syllabusRef: "ER20-12T Chapter 1: Principle and procedures of Limit tests for iron."
    },
    marks: 3
  },
  {
    id: "q-ch-02",
    courseId: "chemistry",
    courseCode: "ER20-12T",
    chapterNumber: 5,
    chapterTitle: "Drugs Acting on Central Nervous System",
    type: "mcq",
    year: 2023,
    codeLabel: "ER20-12T #033",
    difficulty: "Medium",
    radarTag: "MUST REVISE",
    frequency: "Board Exam 2023",
    question: "Phenytoin* (starred compound in syllabus) belongs chemically to which heterocyclic ring system?",
    options: [
      "Barbiturate ring",
      "Hydantoin (Imidazolidinedione) ring",
      "Benzodiazepine ring",
      "Phenothiazine ring"
    ],
    correctAnswer: 1,
    explanation: {
      mechanism: "Phenytoin is 5,5-diphenylhydantoin (5,5-diphenylimidazolidine-2,4-dione). It is a first-line anticonvulsant that stabilizes the inactive state of voltage-gated sodium channels.",
      keyPoint: "Phenytoin = Hydantoin derivative. Starred (*) in ER20-12T syllabus requiring chemical structure mastery.",
      syllabusRef: "ER20-12T Chapter 5: Anticonvulsants: Phenytoin*."
    },
    marks: 1
  },
  {
    id: "q-ch-03",
    courseId: "chemistry",
    courseCode: "ER20-12T",
    chapterNumber: 11,
    chapterTitle: "Anti-Infective Agents",
    type: "vvi",
    year: 2024,
    codeLabel: "ER20-12T #062",
    difficulty: "Hard",
    radarTag: "HIGH PRIORITY",
    frequency: "Must revise VVI",
    question: "Isoniazid (INH*) is a first-line anti-tubercular agent chemically classified as:",
    options: [
      "Isonicotinic acid hydrazide (Pyridine derivative)",
      "Diaminodiphenyl sulfone (Aniline derivative)",
      "Fluoroquinolone derivative",
      "Purine analogue"
    ],
    correctAnswer: 0,
    explanation: {
      mechanism: "INH (Isoniazid) is the hydrazide of isonicotinic acid (Pyridine-4-carbohydrazide). It inhibits mycolic acid synthesis in the Mycobacterium tuberculosis cell wall after activation by KatG catalase-peroxidase enzyme.",
      keyPoint: "Pyridine ring + -CONHNH2 group at position 4. Starred compound in syllabus.",
      syllabusRef: "ER20-12T Chapter 11: Anti-Tubercular Agents: INH*."
    },
    marks: 3
  },

  // --- PHARMACOGNOSY (ER20-13T) ---
  {
    id: "q-cg-01",
    courseId: "pharmacognosy",
    courseCode: "ER20-13T",
    chapterNumber: 5,
    chapterTitle: "Biological Source, Chemistry & Efficacy",
    type: "pyq",
    year: 2024,
    codeLabel: "ER20-13T #011",
    difficulty: "Easy",
    radarTag: "REPEATED",
    frequency: "Repeated in 2021, 2022, 2023, 2024",
    question: "What is the biological source and active chemical class of Senna?",
    options: [
      "Dried leaflets of Cassia angustifolia (Family: Leguminosae) containing Anthraquinone glycosides (Sennoside A & B)",
      "Dried leaves of Digitalis purpurea (Family: Scrophulariaceae) containing Cardiac glycosides",
      "Dried rhizomes of Zingiber officinale containing Volatile oils",
      "Dried bark of Cinchona calisaya containing Quinoline alkaloids"
    ],
    correctAnswer: 0,
    explanation: {
      mechanism: "Senna consists of dried leaflets of Cassia senna (Alexandrian) or Cassia angustifolia (Tinnevelly), family Leguminosae. It contains Sennoside A, B, C, D which are stimulant laxatives.",
      keyPoint: "Cassia angustifolia / Leguminosae / Anthraquinone glycosides / Laxative.",
      syllabusRef: "ER20-13T Chapter 5: Laxatives: Aloe, Castor oil, Ispaghula, Senna."
    },
    marks: 3
  },
  {
    id: "q-cg-02",
    courseId: "pharmacognosy",
    courseCode: "ER20-13T",
    chapterNumber: 5,
    chapterTitle: "Biological Source, Chemistry & Efficacy",
    type: "mcq",
    year: 2023,
    codeLabel: "ER20-13T #035",
    difficulty: "Medium",
    radarTag: "CONCEPTUAL",
    frequency: "Board Exam 2023",
    question: "Which chemical test is used for the detection of Anthraquinone glycosides in Senna leaves?",
    options: [
      "Keller-Kiliani test",
      "Borntrager's test (Modified Borntrager's for C-glycosides)",
      "Mayer's reagent test",
      "Shinoda test"
    ],
    correctAnswer: 1,
    explanation: {
      mechanism: "In Borntrager's test, powder is boiled with dilute HCl/H2SO4, filtered, extracted with benzene/ether, and shaken with dilute ammonia. A rose pink or cherry red color in the ammoniacal layer confirms free anthraquinones.",
      keyPoint: "Keller-Kiliani = Deoxy sugars (Digitalis). Borntrager = Anthraquinones (Senna). Mayer = Alkaloids.",
      syllabusRef: "ER20-13T Chapter 4 & 5: Identification tests of glycosides; Laxatives."
    },
    marks: 1
  },

  // --- HUMAN ANATOMY & PHYSIOLOGY (ER20-14T) ---
  {
    id: "q-ha-01",
    courseId: "hap",
    courseCode: "ER20-14T",
    chapterNumber: 7,
    chapterTitle: "Cardiovascular System",
    type: "pyq",
    year: 2024,
    codeLabel: "ER20-14T #007",
    difficulty: "Medium",
    radarTag: "HIGH PRIORITY",
    frequency: "Universal D.Pharm Exam Question",
    question: "In the cardiac conduction system of the human heart, what is the natural pacemaker and what is its typical intrinsic firing rate?",
    options: [
      "Atrioventricular (AV) node, 40–60 bpm",
      "Sinoatrial (SA) node, 60–100 bpm",
      "Bundle of His, 30–40 bpm",
      "Purkinje fibers, 15–20 bpm"
    ],
    correctAnswer: 1,
    explanation: {
      mechanism: "The Sinoatrial (SA) node located in the superior wall of the right atrium initiates rhythmic action potentials at 60–100 impulses per minute, making it the primary physiological pacemaker.",
      keyPoint: "SA Node -> AV Node -> Bundle of His -> Purkinje Fibers.",
      syllabusRef: "ER20-14T Chapter 7: Anatomy and Physiology of heart, Cardiac cycle and Heart sounds."
    },
    marks: 3
  },
  {
    id: "q-ha-02",
    courseId: "hap",
    courseCode: "ER20-14T",
    chapterNumber: 5,
    chapterTitle: "Haemopoietic System",
    type: "mcq",
    year: 2023,
    codeLabel: "ER20-14T #022",
    difficulty: "Easy",
    radarTag: "MUST REVISE",
    frequency: "Annual Exam 2023",
    question: "Which blood clotting factor is known as the Stuart-Prower factor in the coagulation cascade?",
    options: [
      "Factor VIII",
      "Factor IX",
      "Factor X",
      "Factor XII"
    ],
    correctAnswer: 2,
    explanation: {
      mechanism: "Factor X is the Stuart-Prower factor. Its activation to Factor Xa is the convergence point where the intrinsic and extrinsic coagulation pathways merge into the common pathway to activate prothrombin to thrombin.",
      keyPoint: "Factor X = Stuart-Prower factor. Factor I = Fibrinogen. Factor II = Prothrombin.",
      syllabusRef: "ER20-14T Chapter 5: Mechanism of Blood Clotting."
    },
    marks: 1
  },

  // --- SOCIAL PHARMACY (ER20-15T) ---
  {
    id: "q-sp-01",
    courseId: "social",
    courseCode: "ER20-15T",
    chapterNumber: 2,
    chapterTitle: "Preventive Healthcare & Environment",
    type: "pyq",
    year: 2024,
    codeLabel: "ER20-15T #016",
    difficulty: "Medium",
    radarTag: "HIGH PRIORITY",
    frequency: "Board Exam 2024",
    question: "Under the National Immunization Schedule (NIS) in India, which vaccines are administered at birth to a newborn?",
    options: [
      "BCG, OPV-0, Hepatitis B birth dose",
      "DPT, Rotavirus, PCV",
      "Measles-Rubella, Vitamin A",
      "TT-1, Pentavalent"
    ],
    correctAnswer: 0,
    explanation: {
      mechanism: "At birth, the child receives three primary immunizations: BCG (Bacillus Calmette-Guérin) against tuberculosis (intradermal), Oral Polio Vaccine (OPV zero dose), and Hepatitis B birth dose (intramuscular within 24 hours).",
      keyPoint: "Birth doses: BCG + OPV 0 + Hep-B (within 24 hrs).",
      syllabusRef: "ER20-15T Chapter 2: Overview of Vaccines, types of immunity and immunization."
    },
    marks: 3
  },
  {
    id: "q-sp-02",
    courseId: "social",
    courseCode: "ER20-15T",
    chapterNumber: 4,
    chapterTitle: "Microbiology, Epidemiology & Communicable Diseases",
    type: "mcq",
    year: 2023,
    codeLabel: "ER20-15T #039",
    difficulty: "Medium",
    radarTag: "CONCEPTUAL",
    frequency: "National Health Program Section",
    question: "Which vector transmits Dengue and Chikungunya fevers in humans?",
    options: [
      "Female Anopheles mosquito",
      "Female Aedes aegypti mosquito",
      "Culex mosquito",
      "Tsetse fly"
    ],
    correctAnswer: 1,
    explanation: {
      mechanism: "Aedes aegypti (and Aedes albopictus) is the primary day-biting vector responsible for transmitting Dengue virus (Flaviviridae) and Chikungunya virus (Togaviridae). Anopheles transmits malaria; Culex transmits filariasis and Japanese encephalitis.",
      keyPoint: "Aedes = Dengue & Chikungunya. Anopheles = Malaria. Culex = Filariasis.",
      syllabusRef: "ER20-15T Chapter 4: Arthropod-borne infections - dengue, malaria, filariasis and chikungunya."
    },
    marks: 1
  }
];

// Official PCI Viva Question Dossier (for Examination Room Mode)
export const VIVA_QUESTIONS = [
  {
    id: "viva-01",
    courseId: "pharmaceutics",
    courseCode: "ER20-11T",
    topic: "Pharmacopoeias",
    question: "What is a Pharmacopoeia and what are the salient features of the latest Indian Pharmacopoeia?",
    answer: "A Pharmacopoeia is an official code or legal document issued by the authority of a Government containing a list of drugs and medicinal substances with their formulas, methods of preparation, physical/chemical standards, dosage, and quality tests. The Indian Pharmacopoeia (IP) is published by the Indian Pharmacopoeia Commission (IPC), Ghaziabad. Key features include monographs on APIs, dosage forms, herbals, radiopharmaceuticals, vaccines, and updated analytical standards such as HPLC and dissolution specifications.",
    keyKeywords: ["Official book of standards", "IPC Ghaziabad", "Monographs", "Legal standard"]
  },
  {
    id: "viva-02",
    courseId: "chemistry",
    courseCode: "ER20-12T",
    topic: "Limit Test",
    question: "Explain the role of Potassium Sulphate and Alcohol in the Limit Test for Sulphate.",
    answer: "In the Limit test for Sulphate, Barium Sulphate reagent contains 0.05 M Barium Chloride, Potassium Sulphate, and 95% Alcohol. Potassium sulphate is added in small amount to provide seeding and induce immediate precipitation of barium sulphate. Alcohol prevents super-saturation of barium sulphate and ensures uniform turbidity for visual nephelometric comparison.",
    keyKeywords: ["Seeding agent", "Prevents supersaturation", "Uniform turbidity", "Barium sulphate reagent"]
  },
  {
    id: "viva-03",
    courseId: "pharmacognosy",
    courseCode: "ER20-13T",
    topic: "Cardiotonic Drugs",
    question: "What is the biological source of Digitalis and what is the specific test for its digitoxose sugar?",
    answer: "Digitalis consists of the dried leaves of Digitalis purpurea Linn. (Family: Scrophulariaceae), dried at temperatures below 60°C. The specific chemical test for the digitoxose (deoxysugar) component is the Keller-Kiliani Test: The extract is dissolved in glacial acetic acid containing a trace of FeCl3 and layered over concentrated H2SO4. A reddish-brown ring forms at the junction, and the upper acetic acid layer gradually turns bluish-green.",
    keyKeywords: ["Digitalis purpurea", "Scrophulariaceae", "Keller-Kiliani test", "Digitoxose", "Deoxysugar"]
  },
  {
    id: "viva-04",
    courseId: "hap",
    courseCode: "ER20-14T",
    topic: "Blood Groups",
    question: "What is the basis of the ABO blood grouping system and what is the Landsteiner Law?",
    answer: "ABO blood grouping is based on the presence or absence of inherited antigen A and antigen B (agglutinogens) on the RBC membrane and corresponding antibodies (agglutinins anti-A and anti-B) in the plasma. Landsteiner's Law states: 1) If an agglutinogen is present in the RBCs of an individual, the corresponding agglutinin must be absent from plasma. 2) If an agglutinogen is absent from RBCs, the corresponding agglutinin must be present in plasma.",
    keyKeywords: ["Agglutinogens on RBC", "Agglutinins in plasma", "Landsteiner Law", "Type O universal donor", "Type AB universal recipient"]
  },
  {
    id: "viva-05",
    courseId: "social",
    courseCode: "ER20-15T",
    topic: "Disaster Management & Public Health",
    question: "What is the specific role of a pharmacist during a natural disaster or epidemic outbreak?",
    answer: "The pharmacist acts as a frontline healthcare coordinator by: 1) Ensuring cold-chain integrity and uninterrupted supply of emergency medicines, IV fluids, and vaccines. 2) Formulating and distributing disinfectants (hand sanitizers, chlorine bleach for water purification). 3) Triage assessment, primary wound dressing, and first aid. 4) Combating misinformation and conducting public health hygiene campaigns. 5) Monitoring adverse drug reactions and preventing drug hoards or counterfeit medicines.",
    keyKeywords: ["Cold-chain maintenance", "Emergency drug supply", "Water purification", "First aid & triage", "Infection control"]
  }
];

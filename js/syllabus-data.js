// Authoritative ER-2020 D.Pharm Part I Syllabus Data
// Extracted page-by-page from the official PCI ER-2020 syllabus document (Pages 12–35)

export const SYLLABUS_PART_I = {
  regulations: "ER-2020",
  part: "Part I",
  courses: [
    {
      id: "pharmaceutics",
      theoryCode: "ER20-11T",
      practicalCode: "ER20-11P",
      title: "Pharmaceutics",
      accent: "var(--subj-pharmaceutics)",
      accentName: "amber",
      totalTheoryHours: 75,
      totalTutorialHours: 25,
      theoryWeeklyHours: 3,
      tutorialWeeklyHours: 1,
      practicalWeeklyHours: 3,
      practicalTotalHours: 75,
      scope: "This course is designed to impart basic knowledge and skills on the art and science of formulating and dispensing different pharmaceutical dosage forms.",
      objectives: [
        "Basic concepts, types and need",
        "Advantages and disadvantages, methods of preparation / formulation",
        "Packaging and labelling requirements",
        "Basic quality control tests, concepts of quality assurance and good manufacturing practices"
      ],
      outcomes: [
        "Describe about the different dosage forms and their formulation aspects",
        "Explain the advantages, disadvantages, and quality control tests of different dosage forms",
        "Discuss the importance of quality assurance and good manufacturing practices"
      ],
      chapters: [
        {
          chapterNumber: 1,
          title: "History of Pharmacy & Pharmacopoeias",
          hours: 7,
          topics: [
            "History of the profession of Pharmacy in India in relation to Pharmacy education, industry, pharmacy practice, and various professional associations.",
            "Pharmacy as a career.",
            "Pharmacopoeia: Introduction to IP, BP, USP, NF and Extra Pharmacopoeia. Salient features of Indian Pharmacopoeia."
          ]
        },
        {
          chapterNumber: 2,
          title: "Packaging Materials",
          hours: 5,
          topics: [
            "Packaging materials: Types, selection criteria, advantages and disadvantages of glass, plastic, metal, rubber as packaging materials."
          ]
        },
        {
          chapterNumber: 3,
          title: "Pharmaceutical Aids & Preservatives",
          hours: 3,
          topics: [
            "Pharmaceutical aids: Organoleptic (Colouring, flavouring, and sweetening) agents.",
            "Preservatives: Definition, types with examples and uses."
          ]
        },
        {
          chapterNumber: 4,
          title: "Unit Operations",
          hours: 9,
          topics: [
            "Definition, objectives/applications, principles, construction, and workings of:",
            "Size reduction: hammer mill and ball mill.",
            "Size separation: Classification of powders according to IP, Cyclone separator, Sieves and standards of sieves.",
            "Mixing: Double cone blender, Turbine mixer, Triple roller mill and Silverson mixer homogenizer.",
            "Filtration: Theory of filtration, membrane filter and sintered glass filter.",
            "Drying: working of fluidized bed dryer and process of freeze drying.",
            "Extraction: Definition, Classification, method, and applications."
          ]
        },
        {
          chapterNumber: 5,
          title: "Pharmaceutical Dosage Forms",
          hours: 37,
          topics: [
            "Tablets – coated and uncoated, various modified tablets (sustained release, extended-release, fast dissolving, multi-layered, etc.) (8 Hours)",
            "Capsules - hard and soft gelatine capsules (4 Hours)",
            "Liquid oral preparations - solution, syrup, elixir, emulsion, suspension, dry powder for reconstitution (6 Hours)",
            "Topical preparations - ointments, creams, pastes, gels, liniments and lotions, suppositories, and pessaries (8 Hours)",
            "Nasal preparations, Ear preparations (2 Hours)",
            "Powders and granules - Insufflations, dusting powders, effervescent powders, and effervescent granules (3 Hours)",
            "Sterile formulations – Injectables, eye drops and eye ointments (6 Hours)",
            "Immunological products: Sera, vaccines, toxoids, and their manufacturing methods (4 Hours)"
          ]
        },
        {
          chapterNumber: 6,
          title: "Plant Layout & Quality Management",
          hours: 5,
          topics: [
            "Basic structure, layout, sections, and activities of pharmaceutical manufacturing plants.",
            "Quality control and quality assurance: Definition and concepts of quality control and quality assurance, current good manufacturing practice (cGMP), Introduction to the concept of calibration and validation."
          ]
        },
        {
          chapterNumber: 7,
          title: "Novel Drug Delivery Systems (NDDS)",
          hours: 5,
          topics: [
            "Novel drug delivery systems: Introduction, Classification with examples, advantages, and challenges."
          ]
        }
      ],
      practicalExperiments: [
        "Handling and referring the official references: Pharmacopoeias, Formularies, etc. for retrieving formulas, procedures, etc.",
        "Formulation of Liquid Oral: Simple syrup, Piperazine citrate elixir, Aqueous Iodine solution",
        "Formulation of Emulsion: Castor oil emulsion, Cod liver oil emulsion",
        "Formulation of Suspension: Calamine lotion, Magnesium hydroxide mixture",
        "Formulation of Ointment: Simple ointment base, Sulphur ointment",
        "Formulation of Cream: Cetrimide cream; Gel: Sodium alginate gel",
        "Formulation of Liniment: Turpentine liniment, White liniment BPC",
        "Formulation of Dry powder: Effervescent powder granules, Dusting powder",
        "Formulation of Sterile Injection: Normal Saline, Calcium gluconate Injection",
        "Formulation of Hard Gelatine Capsule: Tetracycline capsules; Tablet: Paracetamol tablets",
        "Formulation of at least five commonly used cosmetic preparations – e.g. cold cream, shampoo, lotion, toothpaste etc.",
        "Demonstration on various stages of tablet manufacturing processes.",
        "Appropriate methods of usage and storage of all dosage forms including special dosage such as different types of inhalers, spacers, insulin pens.",
        "Demonstration of quality control tests and evaluation of common dosage forms viz. tablets, capsules, emulsion, sterile injections as per the monographs."
      ],
      assignments: [
        "Various systems of measures commonly used in prescribing, compounding and dispensing practices.",
        "Market preparations (including Fixed Dose Combinations) of each type of dosage forms, their generic name, minimum three brand names and label contents.",
        "Overview of various machines / equipments / instruments involved in the formulation and quality control of various dosage forms.",
        "Overview of extemporaneous preparations at community / hospital pharmacy vs. manufacturing of dosage forms at industrial level.",
        "Basic pharmaceutical calculations: ratios, conversion to percentage fraction, alligation, proof spirit, isotonicity."
      ],
      fieldVisit: "Industrial visit to pharmaceutical industries to witness manufacturing of tablets, capsules, liquid orals, injectables with individual student reports."
    },
    {
      id: "chemistry",
      theoryCode: "ER20-12T",
      practicalCode: "ER20-12P",
      title: "Pharmaceutical Chemistry",
      accent: "var(--subj-chemistry)",
      accentName: "cyan",
      totalTheoryHours: 75,
      totalTutorialHours: 25,
      theoryWeeklyHours: 3,
      tutorialWeeklyHours: 1,
      practicalWeeklyHours: 3,
      practicalTotalHours: 75,
      scope: "This course is designed to impart basic knowledge on the chemical structure, storage conditions and medicinal uses of organic and inorganic chemical substances used as drugs and pharmaceuticals. Also discusses impurities and quality control aspects.",
      objectives: [
        "Chemical classification, chemical name, chemical structure",
        "Pharmacological uses, doses, stability and storage conditions",
        "Different types of formulations / dosage form available and their brand names",
        "Impurity testing and basic quality control tests"
      ],
      outcomes: [
        "Describe the chemical class, structure and chemical name of commonly used drugs of both organic and inorganic nature",
        "Discuss pharmacological uses, dosage regimen, stability issues and storage conditions",
        "Describe quantitative and qualitative analysis, impurity testing of official monographs",
        "Identify dosage form & brand names popular in the marketplace"
      ],
      chapters: [
        {
          chapterNumber: 1,
          title: "Introduction, Errors & Limit Tests",
          hours: 8,
          topics: [
            "Introduction to Pharmaceutical chemistry: Scope and objectives.",
            "Sources and types of errors: Accuracy, precision, significant figures.",
            "Impurities in Pharmaceuticals: Source and effect of impurities in Pharmacopoeial substances, importance of limit test, Principle and procedures of Limit tests for chlorides, sulphates, iron, heavy metals and arsenic."
          ]
        },
        {
          chapterNumber: 2,
          title: "Volumetric & Gravimetric Analysis",
          hours: 8,
          topics: [
            "Volumetric analysis: Fundamentals of volumetric analysis, Acid-base titration, non-aqueous titration, precipitation titration, complexometric titration, redox titration.",
            "Gravimetric analysis: Principle and method."
          ]
        },
        {
          chapterNumber: 3,
          title: "Inorganic Pharmaceuticals",
          hours: 7,
          topics: [
            "Haematinics: Ferrous sulphate, Ferrous fumarate, Ferric ammonium citrate, Ferrous ascorbate, Carbonyl iron.",
            "Gastro-intestinal Agents: Antacids (Aluminium hydroxide gel, Magnesium hydroxide, Magaldrate, Sodium bicarbonate, Calcium Carbonate), Acidifying agents, Adsorbents, Protectives, Cathartics.",
            "Topical agents: Silver Nitrate, Ionic Silver, Chlorhexidine Gluconate, Hydrogen peroxide, Boric acid, Bleaching powder, Potassium permanganate.",
            "Dental products: Calcium carbonate, Sodium fluoride, Denture cleaners, Denture adhesives, Mouth washes.",
            "Medicinal gases: Carbon dioxide, nitrous oxide, oxygen."
          ]
        },
        {
          chapterNumber: 4,
          title: "Nomenclature of Heterocyclic Compounds",
          hours: 2,
          topics: [
            "Introduction to nomenclature of organic chemical systems with particular reference to heterocyclic compounds containing up to Three rings."
          ]
        },
        {
          chapterNumber: 5,
          title: "Drugs Acting on Central Nervous System",
          hours: 9,
          topics: [
            "Anaesthetics: Thiopental Sodium*, Ketamine Hydrochloride*, Propofol",
            "Sedatives and Hypnotics: Diazepam*, Alprazolam*, Nitrazepam, Phenobarbital*",
            "Antipsychotics: Chlorpromazine Hydrochloride*, Haloperidol*, Risperidone*, Sulpiride*, Olanzapine, Quetiapine, Lurasidone",
            "Anticonvulsants: Phenytoin*, Carbamazepine*, Clonazepam, Valproic Acid*, Gabapentin*, Topiramate, Vigabatrin, Lamotrigine",
            "Anti-Depressants: Amitriptyline Hydrochloride*, Imipramine Hydrochloride*, Fluoxetine*, Venlafaxine, Duloxetine, Sertraline, Citalopram, Escitalopram, Fluvoxamine, Paroxetine"
          ]
        },
        {
          chapterNumber: 6,
          title: "Drugs Acting on Autonomic Nervous System",
          hours: 9,
          topics: [
            "Sympathomimetic Agents: Direct Acting: Nor-Epinephrine*, Epinephrine, Phenylephrine, Dopamine*, Terbutaline, Salbutamol (Albuterol), Naphazoline*, Tetrahydrozoline. Indirect Acting: Hydroxy Amphetamine, Pseudoephedrine. Mixed Mechanism: Ephedrine, Metaraminol.",
            "Adrenergic Antagonists: Alpha Blockers: Tolazoline, Phentolamine, Phenoxybenzamine, Prazosin. Beta Blockers: Propranolol*, Atenolol*, Carvedilol.",
            "Cholinergic Drugs & Related Agents: Direct: Acetylcholine*, Carbachol, Pilocarpine. Cholinesterase Inhibitors: Neostigmine*, Edrophonium Chloride, Tacrine Hydrochloride, Pralidoxime Chloride, Echothiophate Iodide.",
            "Cholinergic Blocking Agents: Atropine Sulphate*, Ipratropium Bromide. Synthetic: Tropicamide, Cyclopentolate HCl, Clidinium Bromide, Dicyclomine Hydrochloride*."
          ]
        },
        {
          chapterNumber: 7,
          title: "Drugs Acting on Cardiovascular System",
          hours: 5,
          topics: [
            "Anti-Arrhythmic Drugs: Quinidine Sulphate, Procainamide HCl, Verapamil, Phenytoin Sodium*, Lidocaine HCl, Lorcainide HCl, Amiodarone, Sotalol.",
            "Anti-Hypertensive Agents: Propranolol*, Captopril*, Ramipril, Methyldopate HCl, Clonidine HCl, Hydralazine HCl, Nifedipine.",
            "Antianginal Agents: Isosorbide Dinitrate."
          ]
        },
        {
          chapterNumber: 8,
          title: "Diuretics",
          hours: 2,
          topics: [
            "Acetazolamide, Frusemide*, Bumetanide, Chlorthalidone, Benzthiazide, Metolazone, Xipamide, Spironolactone."
          ]
        },
        {
          chapterNumber: 9,
          title: "Hypoglycemic Agents",
          hours: 3,
          topics: [
            "Insulin and its Preparations, Metformin*, Glibenclamide*, Glimepiride, Pioglitazone, Repaglinide, Gliflozins, Gliptins."
          ]
        },
        {
          chapterNumber: 10,
          title: "Analgesic & Anti-Inflammatory Agents",
          hours: 3,
          topics: [
            "Morphine Analogues, Narcotic Antagonists; Nonsteroidal Anti-Inflammatory Agents (NSAIDs): Aspirin*, Diclofenac, Ibuprofen*, Piroxicam, Celecoxib, Mefenamic Acid, Paracetamol*, Aceclofenac."
          ]
        },
        {
          chapterNumber: 11,
          title: "Anti-Infective Agents",
          hours: 8,
          topics: [
            "Antifungal Agents: Amphotericin-B, Griseofulvin, Miconazole, Ketoconazole*, Itraconazole, Fluconazole*, Naftifine Hydrochloride.",
            "Urinary Tract Anti-Infective Agents: Norfloxacin, Ciprofloxacin, Ofloxacin*, Moxifloxacin.",
            "Anti-Tubercular Agents: INH*, Ethambutol, Para Amino Salicylic Acid, Pyrazinamide, Rifampicin, Bedaquiline, Delamanid, Pretomanid*.",
            "Antiviral Agents: Amantadine HCl, Idoxuridine, Acyclovir*, Foscarnet, Zidovudine, Ribavirin, Remdesivir, Favipiravir.",
            "Antimalarials: Quinine Sulphate, Chloroquine Phosphate*, Primaquine Phosphate, Mefloquine*, Cycloguanil, Pyrimethamine, Artemisinin.",
            "Sulfonamides: Sulfanilamide, Sulfadiazine, Sulfamethoxazole, Sulfacetamide*, Mafenide Acetate, Cotrimoxazole, Dapsone*."
          ]
        },
        {
          chapterNumber: 12,
          title: "Antibiotics",
          hours: 8,
          topics: [
            "Penicillin G, Amoxicillin*, Cloxacillin, Streptomycin, Tetracyclines: Doxycycline, Minocycline, Macrolides: Erythromycin, Azithromycin, Miscellaneous: Chloramphenicol*, Clindamycin."
          ]
        },
        {
          chapterNumber: 13,
          title: "Anti-Neoplastic Agents",
          hours: 3,
          topics: [
            "Cyclophosphamide*, Busulfan, Mercaptopurine, Fluorouracil*, Methotrexate, Dactinomycin, Doxorubicin HCl, Vinblastine Sulphate, Cisplatin*, Dromostanolone Propionate."
          ]
        }
      ],
      practicalExperiments: [
        "Limit test for: Chlorides; sulphate; Iron; heavy metals.",
        "Identification tests for Anions and Cations as per Indian Pharmacopoeia.",
        "Fundamentals of Volumetric analysis: Preparation and standardization of Sodium Hydroxide, Potassium Permanganate.",
        "Assay of Ferrous sulphate (redox titration), Calcium gluconate (complexometric), Sodium chloride (Modified Volhard's), Ascorbic acid (iodometry), Ibuprofen (alkalimetry).",
        "Fundamentals of preparative organic chemistry: Determination of Melting point and boiling point of organic compounds.",
        "Preparation of organic compounds: Benzoic acid from Benzamide; Picric acid from Phenol.",
        "Identification and test for purity of pharmaceuticals: Aspirin, Caffeine, Paracetamol, Sulfanilamide.",
        "Systematic Qualitative analysis experiments (4 substances)."
      ],
      assignments: [
        "Different monographs and formularies available and their major contents.",
        "Significance of quality control and quality assurance in pharmaceutical industries.",
        "Overview on Green Chemistry.",
        "Various software programs available for computer aided drug discovery.",
        "Various instrumentations used for characterization and quantification of drug."
      ]
    },
    {
      id: "pharmacognosy",
      theoryCode: "ER20-13T",
      practicalCode: "ER20-13P",
      title: "Pharmacognosy",
      accent: "var(--subj-pharmacognosy)",
      accentName: "green",
      totalTheoryHours: 75,
      totalTutorialHours: 25,
      theoryWeeklyHours: 3,
      tutorialWeeklyHours: 1,
      practicalWeeklyHours: 3,
      practicalTotalHours: 75,
      scope: "Impart knowledge on medicinal uses of natural crude drugs, phytoconstituents, evaluation, alternative systems of medicine, nutraceuticals, herbal cosmetics.",
      objectives: [
        "Occurrence, distribution, isolation, identification tests of common phytoconstituents",
        "Therapeutic activity and pharmaceutical applications of various natural drug substances",
        "Biological source, chemical constituents of selected crude drugs and therapeutic efficacy",
        "Basic concepts in quality control of crude drugs and various system of medicines",
        "Applications of herbs in health foods and cosmetics"
      ],
      outcomes: [
        "Identify the important/common crude drugs of natural origin",
        "Describe the uses of herbs in nutraceuticals and cosmeceuticals",
        "Discuss the principles of alternative system of medicines",
        "Describe the importance of quality control of drugs of natural origin"
      ],
      chapters: [
        {
          chapterNumber: 1,
          title: "Introduction & Scope of Pharmacognosy",
          hours: 2,
          topics: ["Definition, history, present status and scope of Pharmacognosy."]
        },
        {
          chapterNumber: 2,
          title: "Classification of Crude Drugs",
          hours: 4,
          topics: ["Classification of drugs: Alphabetical, Taxonomical, Morphological, Pharmacological, Chemical, Chemo-taxonomical."]
        },
        {
          chapterNumber: 3,
          title: "Quality Control of Crude Drugs",
          hours: 6,
          topics: ["Quality control of crude drugs: Different methods of adulteration of crude drugs; Evaluation of crude drugs."]
        },
        {
          chapterNumber: 4,
          title: "Phytoconstituents Overview",
          hours: 6,
          topics: [
            "Brief outline of occurrence, distribution, isolation, identification tests, therapeutic activity and pharmaceutical applications of: alkaloids, terpenoids, glycosides, volatile oils, tannins and resins."
          ]
        },
        {
          chapterNumber: 5,
          title: "Biological Source, Chemistry & Efficacy",
          hours: 30,
          topics: [
            "Laxatives: Aloe, Castor oil, Ispaghula, Senna",
            "Cardiotonic: Digitalis, Arjuna",
            "Carminatives and G.I. regulators: Coriander, Fennel, Cardamom, Ginger, Clove, Black Pepper, Asafoetida, Nutmeg, Cinnamon",
            "Astringents: Myrobalan, Black Catechu, Pale Catechu",
            "Drugs acting on nervous system: Hyoscyamus, Belladonna, Ephedra, Opium, Tea leaves, Coffee seeds, Coca",
            "Anti-hypertensive: Rauwolfia; Anti-tussive: Vasaka, Tolu Balsam; Anti-rheumatics: Colchicum seed; Anti-tumour: Vinca, Podophyllum",
            "Antidiabetics: Pterocarpus, Gymnema; Diuretics: Gokhru, Punarnava; Anti-dysenteric: Ipecacuanha",
            "Antiseptics & disinfectants: Benzoin, Myrrh, Neem, Turmeric; Antimalarials: Cinchona, Artemisia; Oxytocic: Ergot",
            "Vitamins: Cod liver oil, Shark liver oil; Enzymes: Papaya, Diastase, Pancreatin, Yeast",
            "Pharmaceutical Aids: Kaolin, Lanolin, Beeswax, Acacia, Tragacanth, Sodium alginate, Agar, Guar gum, Gelatine",
            "Miscellaneous: Squill, Galls, Ashwagandha, Tulsi, Guggul"
          ]
        },
        {
          chapterNumber: 6,
          title: "Surgical Dressings & Sutures",
          hours: 3,
          topics: [
            "Plant fibres used as surgical dressings: Cotton, silk, wool and regenerated fibres.",
            "Sutures – Surgical Catgut and Ligatures."
          ]
        },
        {
          chapterNumber: 7,
          title: "Traditional Systems & Ayurvedic Preparations",
          hours: 8,
          topics: [
            "Basic principles involved in the traditional systems of medicine like: Ayurveda, Siddha, Unani and Homeopathy.",
            "Method of preparation of Ayurvedic formulations like: Arista, Asava, Gutika, Taila, Churna, Lehya and Bhasma."
          ]
        },
        {
          chapterNumber: 8,
          title: "Medicinal Plants in Economy",
          hours: 2,
          topics: ["Role of medicinal and aromatic plants in national economy and their export potential."]
        },
        {
          chapterNumber: 9,
          title: "Herbs as Health Food",
          hours: 4,
          topics: [
            "Brief introduction and therapeutic applications of: Nutraceuticals, Antioxidants, Pro-biotics, Pre-biotics, Dietary fibres, Omega-3-fatty acids, Spirulina, Carotenoids, Soya and Garlic."
          ]
        },
        {
          chapterNumber: 10,
          title: "Herbal Formulations",
          hours: 4,
          topics: ["Introduction to herbal formulations."]
        },
        {
          chapterNumber: 11,
          title: "Herbal Cosmetics",
          hours: 4,
          topics: [
            "Herbal cosmetics: Sources, chemical constituents, commercial preparations, therapeutic and cosmetic uses of: Aloe vera gel, Almond oil, Lavender oil, Olive oil, Rosemary oil, Sandal Wood oil."
          ]
        },
        {
          chapterNumber: 12,
          title: "Phytochemical Investigation",
          hours: 2,
          topics: ["Phytochemical investigation of drugs."]
        }
      ],
      practicalExperiments: [
        "Morphological Identification of: Ispaghula, Senna, Coriander, Fennel, Cardamom, Ginger, Nutmeg, Black Pepper, Cinnamon, Clove, Ephedra, Rauwolfia, Gokhru, Punarnava, Cinchona, Agar.",
        "Gross anatomical studies (Transverse Section) of: Ajwain, Datura, Cinnamon, Cinchona, Coriander, Ashwagandha, Liquorice, Clove, Curcuma, Nux_vomica, Vasaka.",
        "Physical and chemical tests for evaluation of any FIVE of: Asafoetida, Benzoin, Pale catechu, Black catechu, Castor oil, Acacia, Tragacanth, Agar, Guar gum, Gelatine."
      ],
      assignments: [
        "Market preparations of various dosage forms of Ayurvedic, Unani, Siddha, Homeopathic (Classical and Proprietary), indications, and their labelling requirements.",
        "Market preparations of various herbal formulations and herbal cosmetics, indications, and their labelling requirements.",
        "Herb-Drug interactions documented in the literature and their clinical significances."
      ],
      fieldVisit: "Visit in groups to a medicinal garden and traditional systems pharmacies with individual submitted learning reports."
    },
    {
      id: "hap",
      theoryCode: "ER20-14T",
      practicalCode: "ER20-14P",
      title: "Human Anatomy & Physiology",
      accent: "var(--subj-hap)",
      accentName: "coral",
      totalTheoryHours: 75,
      totalTutorialHours: 25,
      theoryWeeklyHours: 3,
      tutorialWeeklyHours: 1,
      practicalWeeklyHours: 3,
      practicalTotalHours: 75,
      scope: "Imparts basic knowledge on structure and functions of the human body, homeostasis mechanisms and homeostatic imbalances.",
      objectives: [
        "Structure and functions of various organ systems and organs of the human body",
        "Homeostatic mechanisms and their imbalances in the human body",
        "Various vital physiological parameters of the human body and their significances"
      ],
      outcomes: [
        "Describe various organ systems of the human body",
        "Discuss anatomical features of important human organs and tissues",
        "Explain homeostatic mechanisms regulating normal physiology in human system",
        "Discuss significance of various vital physiological parameters"
      ],
      chapters: [
        {
          chapterNumber: 1,
          title: "Scope & Terminologies",
          hours: 2,
          topics: ["Scope of Anatomy and Physiology; Definition of various terminologies."]
        },
        {
          chapterNumber: 2,
          title: "Structure of Cell",
          hours: 2,
          topics: ["Structure of Cell: Components and its functions."]
        },
        {
          chapterNumber: 3,
          title: "Tissues of the Human Body",
          hours: 4,
          topics: ["Tissues: Epithelial, Connective, Muscular and Nervous tissues – their sub-types and characteristics."]
        },
        {
          chapterNumber: 4,
          title: "Osseous System & Joints",
          hours: 6,
          topics: [
            "Osseous system: structure and functions of bones of axial and appendicular skeleton (3 Hours)",
            "Classification, types and movements of joints, disorders of joints (3 Hours)"
          ]
        },
        {
          chapterNumber: 5,
          title: "Haemopoietic System",
          hours: 8,
          topics: [
            "Composition and functions of blood",
            "Process of Hemopoiesis",
            "Characteristics and functions of RBCs, WBCs, and platelets",
            "Mechanism of Blood Clotting",
            "Importance of Blood groups"
          ]
        },
        {
          chapterNumber: 6,
          title: "Lymphatic System",
          hours: 3,
          topics: [
            "Lymph and lymphatic system, composition, function and its formation.",
            "Structure and functions of spleen and lymph node."
          ]
        },
        {
          chapterNumber: 7,
          title: "Cardiovascular System",
          hours: 8,
          topics: [
            "Anatomy and Physiology of heart",
            "Blood vessels and circulation (Pulmonary, coronary and systemic circulation)",
            "Cardiac cycle and Heart sounds, Basics of ECG",
            "Blood pressure and its regulation"
          ]
        },
        {
          chapterNumber: 8,
          title: "Respiratory System",
          hours: 4,
          topics: [
            "Anatomy of respiratory organs and their functions.",
            "Regulation, and Mechanism of respiration.",
            "Respiratory volumes and capacities – definitions"
          ]
        },
        {
          chapterNumber: 9,
          title: "Digestive System",
          hours: 8,
          topics: [
            "Anatomy and Physiology of the GIT",
            "Anatomy and functions of accessory glands",
            "Physiology of digestion and absorption"
          ]
        },
        {
          chapterNumber: 10,
          title: "Skeletal Muscles",
          hours: 2,
          topics: [
            "Histology, Physiology of muscle contraction, Disorder of skeletal muscles."
          ]
        },
        {
          chapterNumber: 11,
          title: "Nervous System",
          hours: 8,
          topics: [
            "Classification of nervous system",
            "Anatomy and physiology of cerebrum, cerebellum, mid brain",
            "Function of hypothalamus, medulla oblongata and basal ganglia",
            "Spinal cord-structure and reflexes",
            "Names and functions of cranial nerves.",
            "Anatomy and physiology of sympathetic and parasympathetic nervous system (ANS)"
          ]
        },
        {
          chapterNumber: 12,
          title: "Sense Organs",
          hours: 6,
          topics: ["Sense organs - Anatomy and physiology of Eye, Ear, Skin, Tongue, Nose."]
        },
        {
          chapterNumber: 13,
          title: "Urinary System",
          hours: 4,
          topics: [
            "Anatomy and physiology of urinary system",
            "Physiology of urine formation",
            "Renin - angiotensin system",
            "Clearance tests and micturition"
          ]
        },
        {
          chapterNumber: 14,
          title: "Endocrine System",
          hours: 6,
          topics: [
            "Endocrine system (Hormones and their functions): Pituitary gland, Adrenal gland, Thyroid and parathyroid gland, Pancreas and gonads."
          ]
        },
        {
          chapterNumber: 15,
          title: "Reproductive System",
          hours: 4,
          topics: [
            "Anatomy of male and female reproductive system",
            "Physiology of menstruation, Spermatogenesis and Oogenesis, Pregnancy and parturition."
          ]
        }
      ],
      practicalExperiments: [
        "Study of compound microscope.",
        "General techniques for the collection of blood.",
        "Microscopic examination of Epithelial, Cardiac muscle, Smooth muscle, Skeletal muscle, Connective tissue, and Nervous tissue slides.",
        "Study of Human Skeleton - Axial and appendicular skeleton.",
        "Determination of Blood group, ESR, Haemoglobin content, Bleeding time and Clotting time.",
        "Determination of WBC count of blood.",
        "Determination of RBC count of blood.",
        "Determination of Differential count of blood.",
        "Recording Blood Pressure in various postures, different arms, before/after exertion.",
        "Recording Body temperature, Pulse rate/ Heart rate, Respiratory Rate.",
        "Recording Pulse Oxygen (before and after exertion).",
        "Recording force of air expelled using Peak Flow Meter.",
        "Measurement of height, weight, and BMI.",
        "Study of organ systems with models/charts: Cardiovascular, Respiratory, Digestive, Urinary, Endocrine, Reproductive, Nervous, Eye, Ear, Skin."
      ]
    },
    {
      id: "social",
      theoryCode: "ER20-15T",
      practicalCode: "ER20-15P",
      title: "Social Pharmacy",
      accent: "var(--subj-social)",
      accentName: "violet",
      totalTheoryHours: 75,
      totalTutorialHours: 25,
      theoryWeeklyHours: 3,
      tutorialWeeklyHours: 1,
      practicalWeeklyHours: 3,
      practicalTotalHours: 75,
      scope: "Impart basic knowledge on public health, epidemiology, preventive care, and social health related concepts; emphasize roles of pharmacists in public health programs.",
      objectives: [
        "Public health and national health programs",
        "Preventive healthcare",
        "Food and nutrition related health issues",
        "Health education and health promotion",
        "General roles and responsibilities of pharmacists in public health"
      ],
      outcomes: [
        "Discuss roles of pharmacists in various national health programs",
        "Describe various sources of health hazards and disease preventive measures",
        "Discuss healthcare issues associated with food and nutritional substances",
        "Describe general roles and responsibilities of pharmacists in public health"
      ],
      chapters: [
        {
          chapterNumber: 1,
          title: "Introduction to Social Pharmacy",
          hours: 9,
          topics: [
            "Definition and Scope. Social Pharmacy as a discipline and its scope in improving public health. Role of Pharmacists in Public Health. (2 Hours)",
            "Concept of Health - WHO Definition, various dimensions, determinants, and health indicators. (3 Hours)",
            "National Health Policy – Indian perspective. (1 Hour)",
            "Public and Private Health System in India, National Health Mission. (2 Hours)",
            "Introduction to Millennium Development Goals, Sustainable Development Goals, FIP Development Goals. (1 Hour)"
          ]
        },
        {
          chapterNumber: 2,
          title: "Preventive Healthcare & Environment",
          hours: 18,
          topics: [
            "Demography and Family Planning. (3 Hours)",
            "Mother and child health, importance of breastfeeding, ill effects of infant milk substitutes and bottle feeding. (2 Hours)",
            "Overview of Vaccines, types of immunity and immunization. (4 Hours)",
            "Effect of Environment on Health – Water pollution, safe drinking water, waterborne diseases, air, noise, sewage, solid waste, occupational illnesses, Environmental pollution due to pharmaceuticals. (7 Hours)",
            "Psychosocial Pharmacy: Drugs of misuse and abuse – psychotropics, narcotics, alcohol, tobacco products. Social Impact and suicidal behaviours. (2 Hours)"
          ]
        },
        {
          chapterNumber: 3,
          title: "Nutrition and Health",
          hours: 10,
          topics: [
            "Basics of nutrition – Macronutrients and Micronutrients. (3 Hours)",
            "Importance of water and fibres in diet. (1 Hour)",
            "Balanced diet, Malnutrition, nutrition deficiency diseases, ill effects of junk foods, calorific/nutritive values, fortification of food. (3 Hours)",
            "Introduction to food safety, adulteration of foods, artificial ripening, pesticides, genetically modified foods. (1 Hour)",
            "Dietary supplements, nutraceuticals, food supplements – indications, benefits, Drug-Food Interactions. (2 Hours)"
          ]
        },
        {
          chapterNumber: 4,
          title: "Microbiology, Epidemiology & Communicable Diseases",
          hours: 28,
          topics: [
            "Introduction to Microbiology and common microorganisms. (3 Hours)",
            "Epidemiology: Introduction and applications; terms (epidemic, pandemic, endemic, mode of transmission, outbreak, quarantine, isolation, incubation period, contact tracing, morbidity, mortality). (2 Hours)",
            "Respiratory infections – chickenpox, measles, rubella, mumps, influenza (Avian-Flu, H1N1, SARS, MERS, COVID-19), diphtheria, whooping cough, meningococcal meningitis, acute respiratory infections, tuberculosis, Ebola. (7 Hours)",
            "Intestinal infections – poliomyelitis, viral hepatitis, cholera, acute diarrheal diseases, typhoid, amebiasis, worm infestations, food poisoning. (7 Hours)",
            "Arthropod-borne infections - dengue, malaria, filariasis and chikungunya. (4 Hours)",
            "Surface infections – trachoma, tetanus, leprosy. (2 Hours)",
            "STDs, HIV/AIDS. (3 Hours)"
          ]
        },
        {
          chapterNumber: 5,
          title: "National Health Programs in India",
          hours: 8,
          topics: [
            "Introduction to health systems and all ongoing National Health programs in India, their objectives, functioning, outcome, and the role of pharmacists."
          ]
        },
        {
          chapterNumber: 6,
          title: "Pharmacoeconomics",
          hours: 2,
          topics: [
            "Pharmacoeconomics – Introduction, basic terminologies, importance of pharmacoeconomics."
          ]
        }
      ],
      practicalExperiments: [
        "National immunization schedule for children, adult vaccine schedule, Vaccines not included in NIP.",
        "RCH – reproductive and child health – nutritional aspects, relevant national health programmes.",
        "Family planning devices.",
        "Microscopical observation of different microbes (readymade slides).",
        "Oral Health and Hygiene.",
        "Personal hygiene and etiquettes – hand washing techniques, Cough and sneeze etiquettes.",
        "Various types of masks, PPE gear, wearing/using them, and disposal.",
        "Menstrual hygiene, products used.",
        "First Aid – Theory, basics, demonstration, hands on training, audio-visuals, and practice, BSL Systems [SCA, FBAO, CPR, AED].",
        "Emergency treatment for medical emergency cases viz. snake bite, dog bite, insecticide poisoning, fractures, burns, epilepsy etc.",
        "Role of Pharmacist in Disaster Management.",
        "Marketed preparations of disinfectants, antiseptics, fumigating agents, antilarval agents, mosquito repellents, etc.",
        "Health Communication in regional languages for mass education on 5 communicable diseases.",
        "Water purification techniques, use of water testing kit, KMnO4/bleaching powder calculations.",
        "Counselling children on junk foods, balanced diets – using IEC (Simulation Experiments).",
        "Preparation of charts on nutrition, caloric needs of groups, glycemic index.",
        "Tobacco cessation, counselling, identifying tobacco products through charts/pictures."
      ],
      assignments: [
        "An overview of Women's Health Issues.",
        "Study the labels of various packed foods to understand nutritional contents.",
        "Breastfeeding counselling, guidance – using IEC.",
        "Information about organizations working on de-addiction services in the region.",
        "Role of a pharmacist in disaster management – A case study.",
        "Overview on the National Tuberculosis Elimination Programme (NTEP).",
        "Drug disposal systems in the country, at industry level and citizen level.",
        "Various Prebiotics or Probiotics (dietary and market products).",
        "Emergency preparedness: Fire, Police departments, health department.",
        "Prepare poster/presentation on Health Days (AIDS Day, Handwashing Day, ORS day, World Diabetes Day, World Heart Day).",
        "List of home medicines, their storage, safe handling, and disposal of unused medicines.",
        "Responsible Use of Medicines: From Purchase to Disposal.",
        "Collection of newspaper clips (minimum 5) relevant to any one topic with collective summary.",
        "Read minimum one article from Pharma/Science Periodicals and prepare summary.",
        "Potential roles of pharmacists in rural India."
      ],
      fieldVisits: [
        "Garbage Treatment Plant",
        "Sewage Treatment Plant",
        "Bio-medical Waste Treatment Plant",
        "Effluent Treatment Plant",
        "Water purification plant",
        "Orphanage / Elderly-Care-Home / School and or Hostel/Home for persons with disabilities",
        "Primary health care centre"
      ]
    }
  ]
};

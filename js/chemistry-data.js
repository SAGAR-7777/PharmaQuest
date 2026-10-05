// Pharmaceutical Chemistry Starred Drugs & Heterocyclic Ring Database
// Sourced directly from ER20-12T Chapters 4 through 13

export const HETEROCYCLIC_RINGS = [
  {
    name: "Pyridine",
    heteroatom: "Nitrogen (1)",
    ringSize: "6-membered unsaturated",
    exampleDrugs: "Isoniazid (INH*), Nicotinic acid, Sulfapyridine",
    svgIcon: "⬡ [N]"
  },
  {
    name: "Imidazole",
    heteroatom: "Nitrogen (2 at 1,3 positions)",
    ringSize: "5-membered unsaturated",
    exampleDrugs: "Metronidazole, Ketoconazole*, Histamine",
    svgIcon: "⬠ [N, N]"
  },
  {
    name: "Hydantoin (Imidazolidinedione)",
    heteroatom: "Nitrogen (2)",
    ringSize: "5-membered saturated diketo",
    exampleDrugs: "Phenytoin* (5,5-diphenylhydantoin)",
    svgIcon: "⬠ [N-CO-N-CO]"
  },
  {
    name: "Benzodiazepine",
    heteroatom: "Nitrogen (2)",
    ringSize: "Fused Benzene + 7-membered 1,4-diazepine",
    exampleDrugs: "Diazepam*, Alprazolam*, Nitrazepam",
    svgIcon: "⬡-⬡ [N, N]"
  },
  {
    name: "Phenothiazine",
    heteroatom: "Nitrogen (1) and Sulfur (1)",
    ringSize: "Tricyclic (Two benzene rings fused to 1,4-thiazine)",
    exampleDrugs: "Chlorpromazine Hydrochloride*",
    svgIcon: "⬡-[N,S]-⬡"
  },
  {
    name: "Quinoline",
    heteroatom: "Nitrogen (1)",
    ringSize: "Fused Benzene + Pyridine",
    exampleDrugs: "Chloroquine Phosphate*, Cinchona alkaloids",
    svgIcon: "⬡-⬡ [N]"
  }
];

export const STARRED_DRUGS = [
  {
    name: "Phenytoin Sodium*",
    category: "Anticonvulsants",
    courseChapter: "Chapter 5 (CNS)",
    chemicalName: "Sodium 5,5-diphenylimidazolidine-2,4-dione",
    ringSystem: "Hydantoin ring",
    uses: "Grand mal (tonic-clonic) seizures, psychomotor seizures, prevention of seizures post-neurosurgery, digitalis-induced ventricular arrhythmias.",
    storage: "Preserve in tightly-closed, moisture-resistant containers protected from light. Carbon dioxide from air converts sodium salt to insoluble free phenytoin.",
    formulations: "Phenytoin Tablets IP, Phenytoin Oral Suspension IP, Phenytoin Sodium Injection IP.",
    brandNames: "Dilantin, Eptoin, Epsolin."
  },
  {
    name: "Propranolol Hydrochloride*",
    category: "Adrenergic Antagonists (Beta Blocker)",
    courseChapter: "Chapter 6 & 7 (ANS & CVS)",
    chemicalName: "(2RS)-1-(Isopropylamino)-3-(naphthalen-1-yloxy)propan-2-ol hydrochloride",
    ringSystem: "Naphthalene nucleus with aryloxypropanolamine chain",
    uses: "Essential hypertension, angina pectoris, cardiac arrhythmias, migraine prophylaxis, essential tremor.",
    storage: "Store in well-closed, light-resistant containers at room temperature below 30°C.",
    formulations: "Propranolol Tablets IP, Propranolol Injection IP, Extended-release capsules.",
    brandNames: "Ciplar, Inderal, Betacap."
  },
  {
    name: "Isoniazid (INH*)",
    category: "Anti-Tubercular Agents",
    courseChapter: "Chapter 11 (Anti-Infective)",
    chemicalName: "Pyridine-4-carbohydrazide",
    ringSystem: "Pyridine ring",
    uses: "First-line primary chemotherapeutic drug for active tuberculosis; prophylaxis of latent M. tuberculosis in high-risk individuals.",
    storage: "Preserve in well-closed, light-resistant containers. Avoid contact with heavy metals.",
    formulations: "Isoniazid Tablets IP, Isoniazid Syrup IP, Fixed-dose combinations (4-FDC with RIF, PZA, EMB).",
    brandNames: "Solonex, R-Cinex (comb), AKT-4 (comb)."
  },
  {
    name: "Aspirin* (Acetylsalicylic Acid)",
    category: "Analgesic & NSAIDs",
    courseChapter: "Chapter 10 (Analgesic & Anti-inflammatory)",
    chemicalName: "2-Acetoxybenzoic acid",
    ringSystem: "Benzene ring with ester and carboxylic acid ortho substituents",
    uses: "Mild to moderate pain, fever reduction, rheumatoid arthritis, antiplatelet agent in low doses (75–150 mg) for myocardial infarction prevention.",
    storage: "Keep in airtight containers in dry conditions; moisture hydrolyzes aspirin into salicylic acid and acetic acid (vinegar odor).",
    formulations: "Aspirin Gastro-resistant Tablets IP, Dispersible Aspirin Tablets IP.",
    brandNames: "Disprin, Ecosprin, Colsprin."
  },
  {
    name: "Metformin Hydrochloride*",
    category: "Hypoglycemic Agents (Biguanides)",
    courseChapter: "Chapter 9 (Endocrine)",
    chemicalName: "1,1-Dimethylbiguanide hydrochloride",
    ringSystem: "Acyclic biguanide chain",
    uses: "First-line medication for type 2 diabetes mellitus; improves insulin sensitivity, suppresses hepatic gluconeogenesis, lowers intestinal glucose absorption.",
    storage: "Store in airtight containers at controlled room temperature, protected from moisture.",
    formulations: "Metformin Tablets IP, Metformin Sustained-Release Tablets IP.",
    brandNames: "Glyciphage, Glycomet, Glucophage."
  },
  {
    name: "Amoxicillin*",
    category: "Antibiotics (Aminopenicillins)",
    courseChapter: "Chapter 12 (Antibiotics)",
    chemicalName: "(2S,5R,6R)-6-[[(2R)-2-Amino-2-(4-hydroxyphenyl)acetyl]amino]-3,3-dimethyl-7-oxo-4-thia-1-azabicyclo[3.2.0]heptane-2-carboxylic acid",
    ringSystem: "Fused beta-lactam and thiazolidine rings (Penam nucleus)",
    uses: "Upper/lower respiratory infections, otitis media, urinary tract infections, eradication of H. pylori in peptic ulcers (often combined with Clavulanic acid).",
    storage: "Airtight containers at temperatures not exceeding 25°C. Suspensions after reconstitution stable for 7-14 days under refrigeration.",
    formulations: "Amoxicillin Capsules IP, Amoxicillin Oral Suspension IP, Amoxicillin and Potassium Clavulanate Injection IP.",
    brandNames: "Mox, Novamox, Augmentin (with clavulanate)."
  }
];

// Laboratory Notebook Experiment Dossiers
// Directly sourced from ER20-11P, ER20-12P, ER20-13P, ER20-14P, ER20-15P practical syllabi

export const PRACTICAL_EXPERIMENTS = [
  {
    id: "exp-01",
    experimentNo: "01",
    courseId: "chemistry",
    courseCode: "ER20-12P",
    title: "Limit Test for Chlorides in a Given Sample",
    aim: "To perform the limit test for chlorides on the given sample of inorganic pharmaceutical as per the Indian Pharmacopoeia standards.",
    principle: "The limit test for chloride is based on the precipitation reaction between soluble chloride ions and silver nitrate reagent in the presence of dilute nitric acid to form insoluble silver chloride (AgCl), which imparts opalescence. The opalescence produced in the test solution is visually compared with that produced in a standard solution containing a known quantity of chloride ions.\n\nReaction: Cl⁻ + AgNO₃  —(dil. HNO₃)→  AgCl ↓ (white opalescence) + NO₃⁻",
    requirements: {
      apparatus: "Nessler cylinders (50 mL pair), Pipettes, Glass rod, Measuring cylinder.",
      chemicals: "Dilute Nitric Acid (10%), Silver Nitrate (5% w/v), Standard Sodium Chloride solution (0.05845% w/v, containing 25 ppm chloride), Purified water."
    },
    procedure: [
      "Take two clean 50 mL Nessler cylinders and label them as 'TEST' and 'STANDARD'.",
      "In the 'TEST' cylinder, dissolve the specified quantity of sample (1.0 g) in 10 mL of water, add 10 mL of dilute nitric acid, and dilute with water to about 40 mL.",
      "In the 'STANDARD' cylinder, pipette 1.0 mL of standard sodium chloride solution, add 10 mL of dilute nitric acid, and dilute to about 40 mL with water.",
      "Add 1.0 mL of 5% Silver Nitrate solution to both cylinders.",
      "Make up both volumes to 50 mL with purified water.",
      "Stir both solutions immediately with separate glass rods and set aside for 5 minutes in dark/indirect light.",
      "Compare the opalescence developed in both cylinders by viewing longitudinally against a black background."
    ],
    observation: "The opalescence produced in the test solution is LESS opalescent than that of the standard chloride solution.",
    result: "The given sample of pharmaceutical substance PASSES the limit test for chlorides as per the Indian Pharmacopoeia.",
    precautions: [
      "Use chloride-free distilled water throughout the experiment.",
      "Dilute Nitric Acid is added to prevent precipitation of other acid radicals like carbonate, phosphate, and sulphate with silver nitrate.",
      "Always view against a black background for standard visual comparison."
    ],
    vivaQuestions: [
      {
        q: "Why is dilute Nitric acid added in the limit test for chloride?",
        a: "Dilute nitric acid provides an acidic medium and prevents the precipitation of other anions (such as carbonates, sulphates, and phosphates) as silver salts."
      },
      {
        q: "Why are Nessler cylinders used instead of test tubes?",
        a: "Nessler cylinders have a flat, transparent optical bottom of uniform thickness which enables accurate longitudinal observation of opalescence."
      }
    ]
  },
  {
    id: "exp-02",
    experimentNo: "02",
    courseId: "pharmaceutics",
    courseCode: "ER20-11P",
    title: "Preparation and Dispensing of Simple Syrup IP",
    aim: "To prepare, evaluate and dispense 50 mL of Simple Syrup as per the Indian Pharmacopoeia.",
    principle: "Simple Syrup IP is a nearly saturated aqueous solution of sucrose (66.7% w/w). The high osmotic pressure created by this concentration acts as a natural self-preservative, preventing the growth of bacteria, moulds, and fungi without requiring additional chemical preservatives. Overheating during dissolution must be avoided to prevent inversion of sucrose into glucose and fructose, which can cause discoloration and caramelization.",
    requirements: {
      apparatus: "Beaker (250 mL), Glass rod, Hot plate / Water bath, Measuring cylinder, Dispensing bottle, Cotton wool.",
      chemicals: "Sucrose IP (Purified cane sugar crystals), Purified Water IP."
    },
    procedure: [
      "Calculate the required quantities for 50 mL of Simple Syrup (Master Formula: Sucrose 667 g, Purified water q.s. to 1000 g).",
      "Weigh 33.35 g of Sucrose IP and measure approximately 17 mL of Purified Water.",
      "Transfer sucrose and water into a clean beaker and heat gently on a water bath with continuous stirring until completely dissolved.",
      "Filter the hot solution through cotton wool into a calibrated container while warm.",
      "Allow the solution to cool to room temperature and adjust the final weight to 50 g with purified water.",
      "Transfer into a clean, amber-colored glass bottle, cork tightly, and apply the official label."
    ],
    observation: "A clear, viscous, colorless to pale straw-colored liquid with a characteristic sweet taste and specific gravity between 1.313 and 1.330 at 20°C.",
    result: "50 mL of Simple Syrup IP was prepared, evaluated, and dispensed in a clean bottle with proper labelling.",
    precautions: [
      "Do not boil the syrup directly; prolonged excessive heating leads to caramelization and darkening.",
      "Do not cool before filtration, as viscosity increases rapidly with cooling, impeding filtration."
    ],
    vivaQuestions: [
      {
        q: "What is the concentration of sucrose in Simple Syrup IP vs USP?",
        a: "Simple Syrup IP has a concentration of 66.7% w/w, whereas Simple Syrup USP has a concentration of 85% w/v (equivalent to 64.74% w/w)."
      },
      {
        q: "Why does simple syrup not require any added preservatives?",
        a: "Because of its high osmotic pressure (66.7% w/w sucrose), any microorganism entering the syrup undergoes osmotic dehydration (plasmolysis) and cannot proliferate."
      }
    ]
  },
  {
    id: "exp-03",
    experimentNo: "03",
    courseId: "pharmacognosy",
    courseCode: "ER20-13P",
    title: "Transverse Section (T.S.) and Microscopical Study of Senna Leaf",
    aim: "To prepare a transverse section of Senna leaf, stain, mount, and identify the diagnostic anatomical characteristics under a compound microscope.",
    principle: "Senna (Cassia angustifolia) has an isobilateral leaf anatomy characterized by paracytic (rubiaceous) stomata, non-glandular unicellular warty trichomes, prism crystals of calcium oxalate in the parenchymatous sheath, and mucilage cavities.",
    requirements: {
      apparatus: "Compound microscope, Razor blade, Watch glass, Glass slide, Coverslip, Camel hair brush, Dropper.",
      chemicals: "Senna leaves, Phloroglucinol, Concentrated HCl, Chloral hydrate, Glycerine (50%)."
    },
    procedure: [
      "Take a preserved or softened Senna leaflet and cut a transverse section through the midrib region using a sharp razor blade.",
      "Transfer thin sections using a camel hair brush into a watch glass containing water.",
      "Select the thinnest, uniform section and clear it by warming gently in chloral hydrate solution.",
      "Stain the section with Phloroglucinol and Concentrated HCl (1:1) to identify lignified tissues (xylem vessels turn pink/red).",
      "Mount the section on a clean slide using 50% glycerine, place a coverslip without air bubbles, and examine under low and high power."
    ],
    observation: "Isobilateral palisade mesophyll present on both surfaces; Unicellular, conical, thick-walled warty trichomes; Paracytic stomata; Calcium oxalate prism crystals surrounding vascular bundle forming a crystal sheath.",
    result: "The transverse section of the given leaf specimen displays diagnostic features confirming Cassia angustifolia (Senna).",
    precautions: [
      "Section must be one cell thick for crisp optical clarity under the objective lens.",
      "Avoid boiling chloral hydrate vigorously as it may rupture delicate epidermal tissues."
    ],
    vivaQuestions: [
      {
        q: "What type of stomata and trichomes are characteristic of Senna?",
        a: "Senna has paracytic (rubiaceous) stomata (guard cells flanked by two subsidiary cells whose long axes are parallel to the pore) and unicellular, conical, thick-walled warty trichomes."
      }
    ]
  },
  {
    id: "exp-04",
    experimentNo: "04",
    courseId: "hap",
    courseCode: "ER20-14P",
    title: "Determination of Human Blood Group (ABO and Rh factor)",
    aim: "To determine the ABO blood group and Rh factor of the human subject using standard antisera.",
    principle: "Blood grouping relies on the principle of hemagglutination. RBCs possess specific surface antigens (A, B, D). When mixed with corresponding monoclonal antibodies (Antisera A, B, D), an antigen-antibody reaction occurs, resulting in visible clumping (agglutination) of red blood cells.",
    requirements: {
      apparatus: "Porcelain tile / glass slides, Sterile disposable lancet, 70% alcohol swab, Cotton, Toothpicks.",
      chemicals: "Anti-A antiserum (blue), Anti-B antiserum (yellow), Anti-D antiserum (colorless)."
    },
    procedure: [
      "Clean the tip of the left ring finger with 70% alcohol swab and allow it to air-dry.",
      "Prick the finger with a sterile disposable lancet to obtain a free drop of blood.",
      "Place three individual drops of blood on three separate wells of a clean white tile labelled A, B, and D.",
      "Add one drop of Anti-A to spot A, one drop of Anti-B to spot B, and one drop of Anti-D to spot D.",
      "Mix each well thoroughly using separate clean ends of toothpicks to avoid cross-contamination.",
      "Gently rock the tile for 2 minutes and observe for agglutination (clumping)."
    ],
    observation: "Agglutination observed in wells A and D. Well B remains smooth and homogenous without clumping.",
    result: "The blood group of the tested subject is confirmed as **A Positive (A +ve)**.",
    precautions: [
      "Never reuse lancets; discard immediately into sharps biohazard waste container.",
      "Use separate toothpicks for each well to prevent false positive agglutination."
    ],
    vivaQuestions: [
      {
        q: "Which blood group is known as the universal donor and why?",
        a: "Blood group O negative (O -ve) is the universal donor because its RBCs lack A, B, and Rh(D) surface antigens, preventing immune rejection in standard recipients."
      }
    ]
  }
];

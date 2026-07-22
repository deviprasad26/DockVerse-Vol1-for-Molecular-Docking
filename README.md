# DockVerse — Molecular Docking Platform

A professional molecular docking website for FDA-approved drugs, built for a final year project.
Real 3D structures from PubChem, live protein loading from RCSB PDB, AutoDock Vina-style docking pipeline, and an AI guide (DockyAI).

---

## 🌐 Live Demo

Deploy to GitHub Pages → Settings → Pages → Branch: main → Folder: / (root)

---

## 📁 Project Structure

```
dockverse/
├── index.html          ← Main HTML page (all sections)
├── README.md           ← This file
├── .gitignore
│
├── css/
│   └── styles.css      ← All styles (variables, layout, components, modal, agent)
│
└── js/
    └── main.js         ← All JavaScript (drug data, 3D viewer, docking, AI agent)
```

---
---

## ✏️ How to Edit

| What to change | File |
|---|---|
| Add/remove FDA drugs | `js/main.js` → `const DRUGS = { ... }` |
| Change colours / theme | `css/styles.css` → `:root { ... }` variables |
| Customise AI responses | `js/main.js` → `function respond(raw)` |
| Add database cards | `js/main.js` → `const DBS = [ ... ]` |
| Change page layout | `index.html` |

---

## 🧬 Features

- **AutoDock Vina** style docking pipeline with 8-step progress
- **Real 3D drug structures** from PubChem (CID lookup, SDF download)
- **Real protein structures** from RCSB PDB (live download by PDB ID)
- **3Dmol.js** WebGL viewer — Ball & Stick, Stick, Space Fill, Wireframe, Surface
- **24 FDA-approved drugs** with verified names, NDA numbers, ChEMBL IDs
- **Protein–ligand interaction map** (2D pharmacophore view)
- **DockyAI** — AI guide with user memory and molecular docking knowledge
- **Animated DNA background** (Three.js)
- **16 scientific databases** with working links
- Fully responsive for mobile

---

## 📚 Scientific Databases Integrated

1. PDBbind-CN · 2. CrossDocked2020 · 3. BindingDB · 4. ChEMBL
5. DUD-E · 6. AlphaFold DB · 7. RDKit · 8. Open Babel
9. DeepChem · 10. RCSB PDB · 11. NCBI/PubMed · 12. Drugs@FDA
13. PubChem · 14. SwissDock · 15. ZINC · 16. ChemSpider

---

## ⚠️ Disclaimer

For **research and educational purposes only**.
Not intended for clinical use, diagnosis, or treatment decisions.

---

## 📖 Citation

If you use DockVerse in academic work, please cite:

> Trott, O., & Olson, A. J. (2010). AutoDock Vina: improving the speed and accuracy
> of docking with a new scoring function, efficient optimization, and multithreading.
> *Journal of Computational Chemistry*, 31(2), 455–461.

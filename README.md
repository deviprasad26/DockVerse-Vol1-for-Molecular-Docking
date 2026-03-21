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

## 🚀 How to Deploy on GitHub Pages

### Step 1 — Create a GitHub repository
1. Go to [github.com](https://github.com) → **New repository**
2. Name it `dockverse` (or anything you like)
3. Set it to **Public**
4. Click **Create repository**

### Step 2 — Upload your files
**Option A — Upload via browser:**
1. Click **uploading an existing file**
2. Drag all files and folders (`index.html`, `css/`, `js/`, `README.md`)
3. Click **Commit changes**

**Option B — Via Git (command line):**
```bash
git init
git add .
git commit -m "Initial commit — DockVerse"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dockverse.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages
1. Go to your repository → **Settings**
2. Scroll to **Pages** (left sidebar)
3. Under **Source** → select **Deploy from a branch**
4. Branch: **main** · Folder: **/ (root)**
5. Click **Save**

### Step 4 — Your site is live!
```
https://YOUR_USERNAME.github.io/dockverse
```
*(Takes ~1-2 minutes to go live after first deploy)*

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

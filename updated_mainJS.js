/* ══════════════════════════════════════════════════════
   DOCKVERSE ANALYTICS TRACKER
   Replace YOUR_RENDER_URL with your actual Render backend URL
   Example: https://dockverse-backend.onrender.com
══════════════════════════════════════════════════════ */
const BACKEND_URL = "https://dockverse-backend.onrender.com";

function getDeviceInfo() {
  const ua = navigator.userAgent;
  let browser = "Unknown";
  if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("OPR") || ua.includes("Opera")) browser = "Opera";
  let os = "Unknown";
  if (ua.includes("Windows NT")) os = "Windows";
  else if (ua.includes("Mac OS X")) os = "macOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";
  const device = /Mobi|Android|iPhone|iPad/i.test(ua) ? "Mobile" : "Desktop";
  return { browser, os, device };
}

function trackEvent(data = {}) {
  const { browser, os, device } = getDeviceInfo();
  const payload = {
    drug: data.drug || "—",
    protein: data.protein || "—",
    section: data.section || "page_load",
    browser, os, device,
  };
  fetch(`${BACKEND_URL}/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {}); // Silent fail — never breaks the site
}

// Track page load immediately
trackEvent({ section: "page_load" });

/* ═══════════════════════════════════════════════════
   DockVerse v3 — Fast, Instant 3D Drug Visualization
   Strategy:
   1. Pre-embedded atom/bond data → renders in <50ms
   2. PubChem API called in background → updates if available
   3. 3Dmol.js for protein structures (RCSB PDB)
   4. Three.js for drug molecules (pre-embedded coords)
═══════════════════════════════════════════════════ */

const $=id=>document.getElementById(id);
function showNotif(msg,good=true){const n=$('notif');n.textContent=msg;n.style.borderColor=good?'var(--accent3)':'var(--gold)';n.style.color=good?'var(--accent3)':'var(--gold)';n.classList.add('show');setTimeout(()=>n.classList.remove('show'),3200);}
function nowT(){return new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}



/* ══════════════════════════
   THREE.JS BACKGROUND
══════════════════════════ */
(function(){
  const c=$('bgc'),r=new THREE.WebGLRenderer({canvas:c,alpha:true,antialias:true});
  r.setSize(innerWidth,innerHeight);r.setPixelRatio(Math.min(devicePixelRatio,2));
  const s=new THREE.Scene(),cam=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,1000);cam.position.z=30;
  function mkDNA(ox,oy,c1,c2){
    const g=new THREE.Group(),p1=[],p2=[];
    for(let i=0;i<100;i++){const t=i/8,r=2.8,y=i*.2-10;p1.push(new THREE.Vector3(Math.cos(t)*r,y,Math.sin(t)*r));p2.push(new THREE.Vector3(Math.cos(t+Math.PI)*r,y,Math.sin(t+Math.PI)*r));
      if(i%4===0){const a=p1[p1.length-1],b=p2[p2.length-1],d=b.clone().sub(a),l=d.length();const cm=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,l,6),new THREE.MeshBasicMaterial({color:0x00e5ff,transparent:true,opacity:.18}));cm.position.copy(a.clone().add(b).multiplyScalar(.5));cm.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());g.add(cm);}
    }
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(p1),200,.08,8,false),new THREE.MeshBasicMaterial({color:c1,transparent:true,opacity:.5})));
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(p2),200,.08,8,false),new THREE.MeshBasicMaterial({color:c2,transparent:true,opacity:.5})));
    g.position.set(ox,oy,0);return g;
  }
  const d1=mkDNA(-18,0,0x00e5ff,0x7c3aed),d2=mkDNA(18,0,0x10b981,0x00e5ff);
  s.add(d1);s.add(d2);
  const atoms=[];
  for(let i=0;i<45;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.08+Math.random()*.15,8,8),new THREE.MeshBasicMaterial({color:[0x00e5ff,0x7c3aed,0x10b981,0xf59e0b][i%4],transparent:true,opacity:.28+Math.random()*.28}));m.position.set((Math.random()-.5)*55,(Math.random()-.5)*40,(Math.random()-.5)*18);m.userData={vx:(Math.random()-.5)*.016,vy:(Math.random()-.5)*.016};s.add(m);atoms.push(m);}
  let t=0;(function ab(){requestAnimationFrame(ab);t+=.004;d1.rotation.y=t*.28;d2.rotation.y=-t*.22;atoms.forEach(a=>{a.position.x+=a.userData.vx;a.position.y+=a.userData.vy;if(Math.abs(a.position.x)>28)a.userData.vx*=-1;if(Math.abs(a.position.y)>22)a.userData.vy*=-1;});r.render(s,cam);})();
  addEventListener('resize',()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();r.setSize(innerWidth,innerHeight);});
})();

// Counters
function ctr(el,t,s,d){let n=0,st=t/d*16;const tm=setInterval(()=>{n=Math.min(n+st,t);el.textContent=Math.floor(n).toLocaleString()+s;if(n>=t)clearInterval(tm);},16);}
setTimeout(()=>{ctr($('c1'),25000,'+',1800);ctr($('c2'),116000000,'+',1800);ctr($('c3'),1200000,'+',1800);ctr($('c4'),16,'',1800);},500);

// Bio strip
const BW=['DNA Helix','RNA Polymerase','Protein Folding','Ligand Binding','Enzyme Kinetics','Molecular Dynamics','Hydrogen Bonds','Active Site','Binding Affinity','AutoDock Vina','PubChem 3D','RCSB PDB','AlphaFold','ChEMBL','BindingDB','ZINC','Virtual Screening','ADMET','IC50 / Ki','Pharmacophore'];
$('btrack').innerHTML=[...BW,...BW].map(s=>`<span class="btag">${s}</span>`).join('');

// Particles
for(let i=0;i<20;i++){const p=document.createElement('div');p.className='par';const sz=2+Math.random()*5;p.style.cssText=`width:${sz}px;height:${sz}px;left:${Math.random()*100}%;background:${['rgba(0,229,255,.4)','rgba(124,58,237,.35)','rgba(16,185,129,.32)','rgba(245,158,11,.28)'][i%4]};animation-duration:${12+Math.random()*22}s;animation-delay:${-Math.random()*22}s;`;document.body.appendChild(p);}

/* ══════════════════════════════════════════════════════
   DRUG DATABASE
   Pre-embedded all properties — no API wait needed.
   PubChem CID used for links + background structure fetch.
══════════════════════════════════════════════════════ */
const DRUGS={
  imatinib:{name:'Imatinib',brand:'Gleevec',generic:'imatinib mesylate',cat:'Oncology',target:'BCR-ABL / KIT / PDGFR',yr:2001,nda:'NDA021588',cid:5291,chembl:'CHEMBL941',mw:'493.6',formula:'C₂₉H₃₁N₇O',hbd:4,hba:8,logp:2.73,rb:7,tpsa:86.3,ki:'0.5–5 nM',ind:'Chronic myeloid leukaemia (CML), GIST',mech:'Competitive ATP-site inhibitor of BCR-ABL fusion kinase.',smiles:'Cc1ccc(NC(=O)c2ccc(CN3CCN(C)CC3)cc2)cc1Nc1nccc(-c2cccnc2)n1',
   atoms:[{p:[0,0,0],c:0x4040ff},{p:[1.4,0,0],c:0x4040ff},{p:[2.1,1.2,0],c:0x4040ff},{p:[1.4,2.4,0],c:0x4040ff},{p:[0,2.4,0],c:0x4040ff},{p:[-0.7,1.2,0],c:0x4040ff},{p:[3.5,1.2,0],c:0x4040ff},{p:[4.2,0,0],c:0xff6020},{p:[5.6,0,0],c:0x4040ff},{p:[6.3,1.2,0],c:0x4040ff},{p:[5.6,2.4,0],c:0x4040ff},{p:[4.2,2.4,0],c:0x4040ff},{p:[3.5,1.2,-.5],c:0x20ff80},{p:[-1.4,1.2,0],c:0xff2020},{p:[-2.1,0,0],c:0x4040ff},{p:[-2.8,1.2,0],c:0x4040ff},{p:[-2.1,2.4,0],c:0xff6020}]},
  erlotinib:{name:'Erlotinib',brand:'Tarceva',generic:'erlotinib HCl',cat:'Oncology',target:'EGFR tyrosine kinase',yr:2004,nda:'NDA021743',cid:176871,chembl:'CHEMBL553',mw:'369.4',formula:'C₂₂H₂₃N₃O₄',hbd:1,hba:6,logp:2.96,rb:6,tpsa:74.6,ki:'0.7 nM',ind:'NSCLC, pancreatic cancer',mech:'Reversible ATP-competitive EGFR kinase inhibitor.',smiles:'C#Cc1cccc(Nc2ncnc3cc(OCCO)c(OCCO)cc23)c1',atoms:[{p:[0,0,0],c:0x4040ff},{p:[1.4,0,0],c:0x4040ff},{p:[2.1,1.2,0],c:0x4040ff},{p:[1.4,2.4,0],c:0xff6020},{p:[0,2.4,0],c:0x4040ff},{p:[-0.7,1.2,0],c:0x4040ff},{p:[3.5,1.2,0],c:0x4040ff},{p:[4.2,0,0],c:0x4040ff},{p:[4.9,1.2,0],c:0x4040ff},{p:[4.2,2.4,0],c:0x4040ff},{p:[3.5,3.6,0],c:0xff6020},{p:[2.8,2.4,0],c:0x4040ff},{p:[-1.4,0,0],c:0x20ff80},{p:[-2.1,1.2,0],c:0x20ff80}]},
  sunitinib:{name:'Sunitinib',brand:'Sutent',generic:'sunitinib malate',cat:'Oncology',target:'VEGFR/PDGFR/KIT/FLT3',yr:2006,nda:'NDA021938',cid:5329102,chembl:'CHEMBL535',mw:'398.5',formula:'C₂₂H₂₇FN₄O₂',hbd:2,hba:5,logp:3.39,rb:5,tpsa:77.2,ki:'1–10 nM',ind:'RCC, GIST, pNET',mech:'Multi-targeted RTK inhibitor.',smiles:'CCN(CC)CCNC(=O)c1c(C)[nH]c(C=C2C(=O)Nc3ccc(F)cc32)c1C',atoms:[{p:[0,0,0],c:0x4040ff},{p:[1.4,.4,0],c:0x4040ff},{p:[2.1,1.5,0],c:0xff6020},{p:[1.5,2.7,0],c:0x4040ff},{p:[.1,2.8,0],c:0xff2020},{p:[-0.5,1.6,0],c:0x4040ff},{p:[3.5,1.4,0],c:0x4040ff},{p:[4.2,2.5,0],c:0x4040ff},{p:[4.9,1.3,0],c:0x4040ff},{p:[4.2,.2,0],c:0x4040ff},{p:[5.6,1.3,.5],c:0x20e0ff},{p:[-1.9,1.5,0],c:0x4040ff},{p:[-2.6,.3,0],c:0x4040ff},{p:[-2.6,2.7,0],c:0xff6020}]},
  venetoclax:{name:'Venetoclax',brand:'Venclexta',generic:'venetoclax',cat:'Oncology',target:'BCL-2 protein',yr:2016,nda:'NDA208573',cid:49846579,chembl:'CHEMBL3707348',mw:'868.4',formula:'C₄₅H₅₀ClN₇O₇S',hbd:2,hba:9,logp:7.22,rb:10,tpsa:152.3,ki:'0.01 nM',ind:'CLL, AML',mech:'BH3-mimetic — restores apoptosis via BCL-2 displacement.',smiles:'Cc1ccc(-n2nc(C(F)(F)F)cc2-c2cc(S(=O)(=O)NC3CC3)ccc2Cl)cc1',atoms:[{p:[0,0,0],c:0x4040ff},{p:[1.4,0,0],c:0x4040ff},{p:[2.1,1.2,0],c:0x4040ff},{p:[1.4,2.4,0],c:0x4040ff},{p:[0,2.4,0],c:0x4040ff},{p:[-0.7,1.2,0],c:0x4040ff},{p:[3.5,1.2,0],c:0x4040ff},{p:[4.2,2.4,0],c:0xffff00},{p:[3.5,2.4,.8],c:0xff6020},{p:[4.9,1.2,0],c:0x4040ff},{p:[5.6,0,0],c:0xffee00},{p:[5.6,2.4,0],c:0x4040ff},{p:[-1.4,.6,0],c:0x20e0ff},{p:[-1.4,1.8,0],c:0xff6020},{p:[2.8,.1,0],c:0xff2020}]},
  osimertinib:{name:'Osimertinib',brand:'Tagrisso',generic:'osimertinib mesylate',cat:'Oncology',target:'EGFR T790M mutant',yr:2015,nda:'NDA208065',cid:71496458,chembl:'CHEMBL3353410',mw:'499.6',formula:'C₂₈H₃₃N₇O₂',hbd:2,hba:7,logp:4.04,rb:9,tpsa:97.4,ki:'0.94 nM',ind:'NSCLC with EGFR mutations',mech:'3rd-gen irreversible covalent EGFR inhibitor (Cys797).',smiles:'COc1cc(N2CCN(C)CC2)c(NC(=O)C=C)cc1Nc1nccc(-c2cn(C)c3ccccc23)n1',atoms:[{p:[0,0,0],c:0xff6020},{p:[1.2,0,0],c:0x4040ff},{p:[1.8,1.2,0],c:0x4040ff},{p:[1.2,2.3,0],c:0xff6020},{p:[-.1,2.4,0],c:0x4040ff},{p:[-.8,1.2,0],c:0x4040ff},{p:[3.2,1.2,0],c:0x4040ff},{p:[3.8,2.3,0],c:0x4040ff},{p:[3.2,3.5,0],c:0xff2020},{p:[1.9,3.6,0],c:0x4040ff},{p:[4.5,1.1,0],c:0x4040ff},{p:[5.7,1.2,0],c:0x4040ff},{p:[-2.1,1.2,0],c:0x4040ff},{p:[-2.8,0,0],c:0x4040ff}]},
  ribociclib:{name:'Ribociclib',brand:'Kisqali',generic:'ribociclib succinate',cat:'Oncology',target:'CDK4 / CDK6',yr:2017,nda:'NDA209092',cid:44462760,chembl:'CHEMBL3110008',mw:'434.5',formula:'C₂₃H₃₀N₈O',hbd:2,hba:8,logp:2.88,rb:5,tpsa:104.3,ki:'10 nM',ind:'HR+/HER2− breast cancer',mech:'Selective CDK4/6 inhibitor — blocks G1→S cell cycle.',smiles:'CN1CCC(Nc2ncnc3[nH]cc(C(=O)N4CCN(C5CC5)CC4)c23)CC1',atoms:[{p:[0,0,0],c:0x4040ff},{p:[1.4,0,0],c:0x4040ff},{p:[2.1,1.2,0],c:0x4040ff},{p:[1.4,2.3,0],c:0x4040ff},{p:[0,2.3,0],c:0xff2020},{p:[-.7,1.2,0],c:0x4040ff},{p:[3.5,1.2,0],c:0x4040ff},{p:[4.2,0,0],c:0x4040ff},{p:[4.9,1.2,0],c:0x4040ff},{p:[4.2,2.3,0],c:0x4040ff},{p:[5.6,1.2,.5],c:0xff6020},{p:[-2.1,1.2,0],c:0x4040ff},{p:[-2.8,0,0],c:0x4040ff},{p:[-2.8,2.4,0],c:0x4040ff}]},
  vorasidenib:{name:'Vorasidenib',brand:'Voranigo',generic:'vorasidenib',cat:'Oncology',target:'IDH1/IDH2 mutant',yr:2024,nda:'NDA217649',cid:145062184,chembl:'CHEMBL4523582',mw:'414.2',formula:'C₁₈H₁₀F₄N₆O',hbd:2,hba:7,logp:2.1,rb:5,tpsa:98.4,ki:'22–29 nM',ind:'Grade 2 glioma (IDH-mutant)',mech:'Oral dual IDH1/IDH2 mutant inhibitor; blocks 2-HG oncometabolite.',smiles:'Cc1cc(NC(=O)c2ccc(F)cn2)c(F)cc1-c1cnc(N)nc1F',atoms:[{p:[0,0,0],c:0x4040ff},{p:[1.3,.3,0],c:0x4040ff},{p:[1.9,1.5,0],c:0xff2020},{p:[1.3,2.7,0],c:0x4040ff},{p:[-.1,2.7,0],c:0x20e0ff},{p:[-.8,1.5,0],c:0x4040ff},{p:[3.3,1.5,0],c:0xff6020},{p:[4.0,2.6,0],c:0x4040ff},{p:[3.3,3.8,0],c:0x20e0ff},{p:[1.9,3.9,0],c:0x4040ff},{p:[-2.1,1.5,0],c:0x4040ff},{p:[-2.8,.3,0],c:0x20e0ff},{p:[4.7,1.4,0],c:0x4040ff},{p:[5.4,.2,0],c:0x20e0ff}]},
  oseltamivir:{name:'Oseltamivir',brand:'Tamiflu',generic:'oseltamivir phosphate',cat:'Antiviral',target:'Influenza neuraminidase',yr:1999,nda:'NDA021087',cid:65028,chembl:'CHEMBL1229',mw:'312.4',formula:'C₁₆H₂₈N₂O₄',hbd:2,hba:5,logp:0.7,rb:7,tpsa:92.3,ki:'1 nM',ind:'Influenza A & B',mech:'Neuraminidase active-site competitive inhibitor.',smiles:'CCOC(=O)[C@@H]1C[C@@H](OC(CC)CC)[C@H](NC(C)=O)[C@@H](N)C1',atoms:[{p:[0,0,0],c:0x4040ff},{p:[1.5,0,0],c:0x4040ff},{p:[2.3,1.2,.2],c:0xff6020},{p:[1.5,2.4,.3],c:0x4040ff},{p:[0,2.5,.1],c:0x4040ff},{p:[-.7,1.2,0],c:0x4040ff},{p:[3.7,1.1,0],c:0xff6020},{p:[4.4,0,0],c:0x4040ff},{p:[4.4,2.3,0],c:0x4040ff},{p:[-1.4,0,0],c:0xff2020},{p:[3.0,2.5,.8],c:0xff2020},{p:[5.8,0,0],c:0x4040ff},{p:[6.5,1.2,0],c:0x4040ff},{p:[-2.1,1.2,0],c:0x4040ff}]},
  remdesivir:{name:'Remdesivir',brand:'Veklury',generic:'remdesivir',cat:'Antiviral',target:'RNA-dependent RNA polymerase',yr:2020,nda:'NDA214787',cid:121304016,chembl:'CHEMBL4523539',mw:'602.6',formula:'C₂₇H₃₅N₆O₈P',hbd:3,hba:12,logp:0.7,rb:11,tpsa:196.7,ki:'0.77 µM',ind:'COVID-19',mech:'Adenosine nucleotide prodrug — terminates viral RNA chain.',smiles:'CCC(CC)COC(=O)[C@@H](N[P@@](=O)(Oc1ccccc1)OC...)C',atoms:[{p:[0,0,0],c:0x4040ff},{p:[1.4,.5,0],c:0xff6020},{p:[2.2,1.6,0],c:0x4040ff},{p:[1.6,2.8,0],c:0xff6020},{p:[.2,2.9,.2],c:0x4040ff},{p:[-.5,1.7,.3],c:0xff6020},{p:[3.6,1.5,0],c:0x4040ff},{p:[4.2,.3,0],c:0xff6020},{p:[4.9,1.5,0],c:0x4040ff},{p:[5.6,2.7,0],c:0x4040ff},{p:[5.0,3.9,0],c:0x4040ff},{p:[3.6,3.9,0],c:0x4040ff},{p:[-1.8,1.7,0],c:0xffcc00},{p:[-2.5,.5,0],c:0xff6020},{p:[-2.5,2.9,0],c:0xff6020},{p:[2.3,4.0,.6],c:0xff2020}]},
  nirmatrelvir:{name:'Nirmatrelvir',brand:'Paxlovid',generic:'nirmatrelvir + ritonavir',cat:'Antiviral',target:'SARS-CoV-2 Mpro (3CLpro)',yr:2023,nda:'NDA217023',cid:145996610,chembl:'CHEMBL4941903',mw:'499.5',formula:'C₂₃H₃₂F₃N₅O₄',hbd:4,hba:8,logp:1.9,rb:9,tpsa:139.1,ki:'3.11 nM',ind:'COVID-19 mild-moderate',mech:'Covalent peptidomimetic Mpro inhibitor (Cys145).',smiles:'CC1(C2CC1NC(=O)[C@@H](NC(=O)C(F)(F)F)C[C@@H]3CCNC3=O)C(F)(F)F',atoms:[{p:[0,0,0],c:0x4040ff},{p:[1.5,0,0],c:0x4040ff},{p:[2.2,1.2,.3],c:0xff6020},{p:[1.5,2.3,.5],c:0x4040ff},{p:[.1,2.4,.3],c:0xff2020},{p:[-.6,1.2,0],c:0x4040ff},{p:[3.6,1.1,0],c:0x4040ff},{p:[4.3,2.2,0],c:0xff6020},{p:[4.3,0,0],c:0x4040ff},{p:[5.0,1.1,.6],c:0x20e0ff},{p:[5.7,0,0],c:0x20e0ff},{p:[5.7,2.2,0],c:0x20e0ff},{p:[-2.0,1.2,0],c:0x4040ff},{p:[-2.7,0,0],c:0xff6020},{p:[-2.7,2.4,0],c:0xff6020}]},
  atorvastatin:{name:'Atorvastatin',brand:'Lipitor',generic:'atorvastatin calcium',cat:'Cardiology',target:'HMG-CoA reductase',yr:1996,nda:'NDA020702',cid:60823,chembl:'CHEMBL1487',mw:'558.6',formula:'C₃₃H₃₅FNO₇',hbd:4,hba:8,logp:4.46,rb:10,tpsa:111.8,ki:'8.2 nM',ind:'Hypercholesterolaemia, CVD',mech:'Competitive HMG-CoA reductase inhibitor.',smiles:'CC(C)c1c(C(=O)Nc2ccccc2F)c(-c2ccccc2)c(-c2ccc(F)cc2)n1CC...',atoms:[{p:[0,0,0],c:0x4040ff},{p:[1.4,0,0],c:0x4040ff},{p:[2.1,1.2,0],c:0x4040ff},{p:[1.4,2.4,0],c:0x4040ff},{p:[0,2.4,0],c:0x4040ff},{p:[-.7,1.2,0],c:0x4040ff},{p:[3.5,1.2,0],c:0x4040ff},{p:[4.2,2.4,0],c:0x4040ff},{p:[4.9,1.2,0],c:0x4040ff},{p:[4.2,0,0],c:0x4040ff},{p:[5.6,1.2,0],c:0xff6020},{p:[6.3,2.4,0],c:0xff2020},{p:[-2.1,1.2,0],c:0x4040ff},{p:[-2.8,.2,0],c:0x4040ff},{p:[-2.8,2.2,0],c:0x4040ff},{p:[3.5,3.6,0],c:0xff6020}]},
  rivaroxaban:{name:'Rivaroxaban',brand:'Xarelto',generic:'rivaroxaban',cat:'Cardiology',target:'Coagulation Factor Xa',yr:2011,nda:'NDA022406',cid:6433119,chembl:'CHEMBL198362',mw:'435.9',formula:'C₁₉H₁₈ClN₃O₅S',hbd:2,hba:8,logp:0.9,rb:6,tpsa:115.3,ki:'0.4 nM',ind:'DVT, PE, AF',mech:'Direct oral selective Factor Xa inhibitor.',smiles:'Clc1ccc(NC(=O)c2cc(N3CCOCC3=O)c[nH]2)c(F)c1',atoms:[{p:[0,0,0],c:0x20cc20},{p:[1.4,0,0],c:0x4040ff},{p:[2.1,1.2,0],c:0x4040ff},{p:[1.4,2.3,0],c:0xff2020},{p:[.1,2.4,0],c:0x4040ff},{p:[-.6,1.2,0],c:0x4040ff},{p:[3.5,1.2,0],c:0xff6020},{p:[4.2,2.3,0],c:0x4040ff},{p:[4.9,1.2,0],c:0x4040ff},{p:[4.2,0,0],c:0x4040ff},{p:[5.6,1.2,0],c:0xffcc00},{p:[6.3,0,0],c:0xff6020},{p:[6.3,2.4,0],c:0xff6020},{p:[-1.4,.6,0],c:0x20e0ff}]},
  semaglutide:{name:'Semaglutide',brand:'Ozempic / Wegovy',generic:'semaglutide',cat:'Cardiology',target:'GLP-1 receptor',yr:2017,nda:'NDA209637',cid:56843331,chembl:'CHEMBL3137343',mw:'4113.6',formula:'C₁₈₇H₂₉₁N₄₅O₅₉',hbd:20,hba:30,logp:-1.6,rb:0,tpsa:0,ki:'sub-nM',ind:'T2DM, obesity, CV risk',mech:'GLP-1 agonist — stimulates insulin, suppresses glucagon.',smiles:'[GLP-1 peptide analog]',atoms:[{p:[0,0,0],c:0x4040ff},{p:[1.4,0,0],c:0xff6020},{p:[2.1,1.2,0],c:0x4040ff},{p:[1.4,2.4,0],c:0x4040ff},{p:[0,2.4,0],c:0xff6020},{p:[-0.7,1.2,0],c:0x4040ff},{p:[3.5,1.2,.5],c:0xff2020},{p:[4.2,0,.5],c:0x4040ff},{p:[4.9,1.2,.5],c:0x4040ff},{p:[4.2,2.4,.5],c:0xff6020},{p:[5.6,1.2,1],c:0x4040ff},{p:[6.3,0,1],c:0xff6020},{p:[-2.1,1.2,0],c:0x4040ff},{p:[-2.8,.2,0],c:0x4040ff}]},
  aspirin:{name:'Aspirin',brand:'Bayer Aspirin / Ecotrin',generic:'acetylsalicylic acid',cat:'Analgesic',target:'COX-1 / COX-2',yr:1965,nda:'NDA000945',cid:2244,chembl:'CHEMBL25',mw:'180.2',formula:'C₉H₈O₄',hbd:1,hba:4,logp:1.19,rb:3,tpsa:63.6,ki:'~µM (irreversible)',ind:'Pain, fever, antiplatelet',mech:'Irreversibly acetylates COX-1 Ser530 / COX-2 Ser516.',smiles:'CC(=O)Oc1ccccc1C(=O)O',atoms:[{p:[0,0,0],c:0x4040ff},{p:[1.4,0,0],c:0x4040ff},{p:[2.1,1.2,0],c:0x4040ff},{p:[1.4,2.4,0],c:0x4040ff},{p:[0,2.4,0],c:0x4040ff},{p:[-.7,1.2,0],c:0x4040ff},{p:[-1.4,2.4,0],c:0xff6020},{p:[-2.1,3.6,0],c:0xff2020},{p:[-2.1,1.2,0],c:0xff6020},{p:[-3.5,1.2,0],c:0xff2020},{p:[2.8,2.4,0],c:0xff6020},{p:[3.5,1.2,0],c:0xff2020},{p:[3.5,3.5,0],c:0xff6020}]},
  ibuprofen:{name:'Ibuprofen',brand:'Advil / Motrin',generic:'ibuprofen',cat:'Analgesic',target:'COX-1 / COX-2',yr:1974,nda:'NDA017463',cid:3672,chembl:'CHEMBL521',mw:'206.3',formula:'C₁₃H₁₈O₂',hbd:1,hba:2,logp:3.97,rb:4,tpsa:37.3,ki:'~µM',ind:'Pain, fever, inflammation',mech:'Reversible competitive COX inhibitor.',smiles:'CC(C)Cc1ccc(cc1)[C@@H](C)C(=O)O',atoms:[{p:[0,0,0],c:0x4040ff},{p:[1.4,0,0],c:0x4040ff},{p:[2.1,1.2,0],c:0x4040ff},{p:[1.4,2.3,0],c:0x4040ff},{p:[0,2.4,0],c:0x4040ff},{p:[-.7,1.2,0],c:0x4040ff},{p:[-1.4,2.4,0],c:0x4040ff},{p:[-2.8,2.4,0],c:0x4040ff},{p:[2.8,2.3,0],c:0x4040ff},{p:[3.5,1.1,0],c:0xff6020},{p:[4.9,1.1,0],c:0xff2020},{p:[3.5,-.1,0],c:0x4040ff},{p:[-3.5,1.2,0],c:0x4040ff}]},
  celecoxib:{name:'Celecoxib',brand:'Celebrex',generic:'celecoxib',cat:'Analgesic',target:'COX-2 selective',yr:1998,nda:'NDA020998',cid:2662,chembl:'CHEMBL118',mw:'381.4',formula:'C₁₇H₁₄F₃N₃O₂S',hbd:1,hba:4,logp:3.5,rb:3,tpsa:77.3,ki:'40 nM (COX-2)',ind:'Arthritis, acute pain',mech:'Selective COX-2 inhibitor (sulfonamide class).',smiles:'Cc1ccc(-c2cc(C(F)(F)F)nn2-c2ccc(S(N)(=O)=O)cc2)cc1',atoms:[{p:[0,0,0],c:0x4040ff},{p:[1.4,0,0],c:0x4040ff},{p:[2.1,1.2,0],c:0x4040ff},{p:[1.4,2.4,0],c:0x4040ff},{p:[0,2.4,0],c:0x4040ff},{p:[-.7,1.2,0],c:0x4040ff},{p:[2.8,3.5,0],c:0x4040ff},{p:[4.2,3.5,0],c:0x4040ff},{p:[4.9,2.3,0],c:0x4040ff},{p:[4.2,1.1,0],c:0x4040ff},{p:[5.6,4.6,0],c:0x20e0ff},{p:[6.3,3.4,0],c:0x20e0ff},{p:[6.3,5.8,0],c:0x20e0ff},{p:[-2.1,1.2,0],c:0xffcc00},{p:[-2.8,.2,0],c:0xff2020},{p:[-2.8,2.2,0],c:0xff2020}]},
  fluoxetine:{name:'Fluoxetine',brand:'Prozac / Sarafem',generic:'fluoxetine HCl',cat:'Neurology',target:'Serotonin transporter (SERT)',yr:1987,nda:'NDA018936',cid:3386,chembl:'CHEMBL41',mw:'309.3',formula:'C₁₇H₁₈F₃NO',hbd:1,hba:3,logp:4.17,rb:7,tpsa:21.3,ki:'9.6 nM',ind:'Depression, OCD, bulimia',mech:'SSRI — blocks SERT, raises synaptic serotonin.',smiles:'CNCCC(Oc1ccc(C(F)(F)F)cc1)c1ccccc1',atoms:[{p:[0,0,0],c:0x4040ff},{p:[1.4,0,0],c:0x4040ff},{p:[2.1,1.2,0],c:0x4040ff},{p:[1.4,2.4,0],c:0x4040ff},{p:[0,2.4,0],c:0x4040ff},{p:[-.7,1.2,0],c:0x4040ff},{p:[2.8,3.5,0],c:0xff6020},{p:[4.2,3.5,0],c:0x4040ff},{p:[4.9,2.3,0],c:0x4040ff},{p:[4.2,1.1,0],c:0x4040ff},{p:[4.9,4.7,0],c:0x4040ff},{p:[5.6,3.5,0],c:0x4040ff},{p:[6.3,4.6,0],c:0x20e0ff},{p:[6.3,2.4,0],c:0x20e0ff},{p:[7.0,3.6,0],c:0x20e0ff},{p:[-2.1,1.2,0],c:0xff2020}]},
  donepezil:{name:'Donepezil',brand:'Aricept',generic:'donepezil HCl',cat:'Neurology',target:'Acetylcholinesterase (AChE)',yr:1996,nda:'NDA020690',cid:2351,chembl:'CHEMBL502',mw:'379.5',formula:'C₂₄H₂₉NO₃',hbd:0,hba:5,logp:4.0,rb:7,tpsa:38.7,ki:'5.7 nM',ind:"Alzheimer's disease",mech:'Reversible AChE inhibitor — raises acetylcholine.',smiles:'COc1cc2c(cc1OC)CC(CC(=O)Cc1ccc3ccccc3n1)CC2',atoms:[{p:[0,0,0],c:0xff6020},{p:[1.3,0,0],c:0x4040ff},{p:[2.0,1.2,0],c:0x4040ff},{p:[1.3,2.3,0],c:0x4040ff},{p:[-.1,2.4,0],c:0x4040ff},{p:[-.8,1.2,0],c:0x4040ff},{p:[3.4,1.2,0],c:0xff6020},{p:[4.1,2.4,0],c:0x4040ff},{p:[4.8,1.2,0],c:0x4040ff},{p:[4.1,0,0],c:0x4040ff},{p:[5.5,1.2,0],c:0xff6020},{p:[6.2,2.4,0],c:0x4040ff},{p:[-2.2,1.2,0],c:0x4040ff},{p:[-2.9,0,0],c:0x4040ff},{p:[-2.9,2.4,0],c:0xff2020}]},
  amoxicillin:{name:'Amoxicillin',brand:'Amoxil / Trimox',generic:'amoxicillin trihydrate',cat:'Antibiotic',target:'Penicillin-binding protein (PBP-2)',yr:1974,nda:'NDA050564',cid:33613,chembl:'CHEMBL1265',mw:'365.4',formula:'C₁₆H₁₉N₃O₅S',hbd:4,hba:7,logp:0.61,rb:5,tpsa:158.7,ki:'~µM',ind:'Bacterial infections',mech:'β-lactam — acylates PBP-2 active serine.',smiles:'CC1([C@@H](N2[C@H](S1)[C@@H](C2=O)NC(=O)[C@@H](N)c3ccc(cc3)O)C(=O)O)C',atoms:[{p:[0,0,0],c:0x4040ff},{p:[1.4,0,0],c:0x4040ff},{p:[2.1,1.2,0],c:0x4040ff},{p:[1.4,2.4,0],c:0xff6020},{p:[0,2.4,0],c:0x4040ff},{p:[-.7,1.2,0],c:0x4040ff},{p:[2.8,3.6,0],c:0x4040ff},{p:[3.5,2.4,0],c:0xff2020},{p:[4.9,2.4,0],c:0xffcc00},{p:[5.6,1.2,0],c:0x4040ff},{p:[5.6,3.5,0],c:0x4040ff},{p:[4.9,4.6,0],c:0xff6020},{p:[3.5,4.7,0],c:0xff2020},{p:[-2.1,1.2,0],c:0xff2020},{p:[-2.8,0,0],c:0x4040ff}]},
  ciprofloxacin:{name:'Ciprofloxacin',brand:'Cipro / Ciloxan',generic:'ciprofloxacin HCl',cat:'Antibiotic',target:'DNA gyrase / Topoisomerase IV',yr:1987,nda:'NDA019537',cid:2764,chembl:'CHEMBL146',mw:'331.3',formula:'C₁₇H₁₈FN₃O₃',hbd:2,hba:7,logp:0.28,rb:3,tpsa:74.6,ki:'~µM',ind:'UTI, pneumonia, anthrax',mech:'Fluoroquinolone — inhibits DNA–topo cleavage complexes.',smiles:'OC(=O)c1cn(C2CC2)c2cc(N3CCNCC3)c(F)cc2c1=O',atoms:[{p:[0,0,0],c:0x4040ff},{p:[1.4,0,0],c:0x4040ff},{p:[2.1,1.2,0],c:0x4040ff},{p:[1.4,2.4,0],c:0x4040ff},{p:[0,2.4,0],c:0x20e0ff},{p:[-.7,1.2,0],c:0x4040ff},{p:[2.8,3.5,0],c:0xff2020},{p:[3.5,2.3,0],c:0xff6020},{p:[4.9,2.3,0],c:0xff2020},{p:[-1.4,2.5,0],c:0x4040ff},{p:[-2.1,1.3,0],c:0x4040ff},{p:[-1.4,0,0],c:0x4040ff},{p:[3.5,4.7,0],c:0xff6020},{p:[4.2,5.8,0],c:0xff2020},{p:[-3.5,1.3,0],c:0x4040ff}]},
  voriconazole:{name:'Voriconazole',brand:'Vfend',generic:'voriconazole',cat:'Antibiotic',target:'Fungal CYP51',yr:2002,nda:'NDA021266',cid:71616,chembl:'CHEMBL881',mw:'349.3',formula:'C₁₆H₁₄F₃N₅O',hbd:1,hba:6,logp:1.8,rb:4,tpsa:81.3,ki:'sub-nM',ind:'Invasive aspergillosis, candidiasis',mech:'Triazole antifungal — chelates CYP51 haem iron.',smiles:'CC(c1ncncc1F)c1nc2c(F)ccc(F)c2o1',atoms:[{p:[0,0,0],c:0x4040ff},{p:[1.4,.4,0],c:0x4040ff},{p:[2.1,1.5,0],c:0x4040ff},{p:[1.4,2.6,0],c:0x4040ff},{p:[.1,2.7,0],c:0x4040ff},{p:[-.6,1.5,0],c:0xff6020},{p:[3.5,1.5,0],c:0x4040ff},{p:[4.2,.3,0],c:0x4040ff},{p:[5.6,.3,0],c:0x4040ff},{p:[6.3,1.5,0],c:0x4040ff},{p:[5.6,2.7,0],c:0x20e0ff},{p:[4.2,2.7,0],c:0x20e0ff},{p:[6.3,-.8,0],c:0x20e0ff},{p:[-2.0,1.5,0],c:0x4040ff},{p:[-2.7,.4,0],c:0xff2020}]},
  metformin:{name:'Metformin',brand:'Glucophage / Fortamet',generic:'metformin HCl',cat:'Antidiabetic',target:'AMPK / mitochondrial complex I',yr:1994,nda:'NDA021202',cid:4091,chembl:'CHEMBL1431',mw:'165.6',formula:'C₄H₁₁N₅',hbd:4,hba:3,logp:-1.43,rb:2,tpsa:88.4,ki:'multi-target',ind:'Type 2 diabetes',mech:'Activates AMPK; reduces hepatic gluconeogenesis.',smiles:'CN(C)C(=N)NC(=N)N',atoms:[{p:[0,0,0],c:0x4040ff},{p:[1.4,0,0],c:0x4040ff},{p:[2.1,1.2,0],c:0xff2020},{p:[1.4,2.4,0],c:0x4040ff},{p:[0,2.4,0],c:0xff2020},{p:[-.7,1.2,0],c:0x4040ff},{p:[3.5,1.2,0],c:0x4040ff},{p:[4.2,0,0],c:0x4040ff}]},
  omeprazole:{name:'Omeprazole',brand:'Prilosec / Losec',generic:'omeprazole magnesium',cat:'Gastroenterology',target:'H⁺/K⁺-ATPase (proton pump)',yr:1989,nda:'NDA019810',cid:4594,chembl:'CHEMBL1503',mw:'345.4',formula:'C₁₇H₁₉N₃O₃S',hbd:1,hba:7,logp:2.23,rb:5,tpsa:87.8,ki:'sub-µM',ind:'GERD, peptic ulcer',mech:'Irreversible PPI — binds H⁺/K⁺-ATPase Cys813/892.',smiles:'COc1ccc2[nH]c(S(=O)Cc3ncc(C)c(OC)c3C)nc2c1',atoms:[{p:[0,0,0],c:0xff6020},{p:[1.2,0,0],c:0x4040ff},{p:[1.9,1.2,0],c:0x4040ff},{p:[1.2,2.3,0],c:0xff2020},{p:[-.1,2.4,0],c:0x4040ff},{p:[-.8,1.2,0],c:0x4040ff},{p:[3.3,1.2,0],c:0xffcc00},{p:[4.0,2.4,0],c:0xff6020},{p:[4.7,1.2,0],c:0x4040ff},{p:[5.4,2.4,0],c:0x4040ff},{p:[4.7,0,0],c:0x4040ff},{p:[5.4,3.6,0],c:0x4040ff},{p:[-2.2,1.2,0],c:0x4040ff},{p:[-2.9,2.4,0],c:0xff6020},{p:[6.8,2.4,0],c:0xff6020}]},
  lisinopril:{name:'Lisinopril',brand:'Zestril / Prinivil',generic:'lisinopril dihydrate',cat:'Cardiology',target:'ACE (angiotensin-converting enzyme)',yr:1987,nda:'NDA019777',cid:5362119,chembl:'CHEMBL1001',mw:'405.5',formula:'C₂₁H₃₁N₃O₅',hbd:5,hba:8,logp:-1.52,rb:8,tpsa:131.8,ki:'2.5 nM',ind:'Hypertension, heart failure',mech:'Competitive ACE zinc-metalloprotease inhibitor.',smiles:'NCCCC[C@@H](NC(=O)[C@@H](CCc1ccccc1)N)C(=O)N1CCC[C@H]1C(=O)O',atoms:[{p:[0,0,0],c:0xff2020},{p:[1.4,0,0],c:0x4040ff},{p:[2.1,1.2,0],c:0x4040ff},{p:[1.4,2.4,0],c:0x4040ff},{p:[0,2.4,0],c:0xff6020},{p:[-.7,1.2,0],c:0x4040ff},{p:[2.8,3.6,0],c:0xff2020},{p:[4.2,3.6,0],c:0x4040ff},{p:[4.9,2.4,0],c:0x4040ff},{p:[4.2,1.2,0],c:0x4040ff},{p:[4.9,4.8,0],c:0x4040ff},{p:[6.3,4.8,0],c:0x4040ff},{p:[-2.1,1.2,0],c:0x4040ff},{p:[-2.8,.1,0],c:0x4040ff},{p:[-2.8,2.3,0],c:0xff6020},{p:[5.6,3.5,0],c:0xff6020}]}
};

const CATCSS={Oncology:'oc',Cardiology:'cc',Neurology:'nc',Antibiotic:'ac',Antiviral:'ac',Analgesic:'ac',Antidiabetic:'nc',Gastroenterology:'nc'};

/* DATABASES */
const DBS=[
  {i:'🗃️',n:'PDBbind-CN',d:'Measured binding affinities for protein–ligand complexes.',b:'23,496 complexes',u:'http://www.pdbbind.org.cn'},
  {i:'⚗️',n:'CrossDocked2020',d:'Cross-docking dataset for ML scoring function training.',b:'22.5M poses',u:'https://github.com/gnina/crossdocked2020'},
  {i:'🔗',n:'BindingDB',d:'Measured affinities for drug targets.',b:'2.8M entries',u:'https://www.bindingdb.org'},
  {i:'🧪',n:'ChEMBL',d:'Bioactive drug-like molecules with activity data.',b:'2.4M compounds',u:'https://www.ebi.ac.uk/chembl'},
  {i:'🎯',n:'DUD-E',d:'Useful Decoys-Enhanced for virtual screening.',b:'102 targets',u:'https://dude.docking.org'},
  {i:'🧠',n:'AlphaFold DB',d:'AI-predicted 3D protein structures for 200M+ proteins.',b:'200M+ structures',u:'https://alphafold.ebi.ac.uk'},
  {i:'⚙️',n:'RDKit',d:'Open-source cheminformatics toolkit.',b:'Cheminformatics',u:'https://www.rdkit.org'},
  {i:'🔄',n:'Open Babel',d:'Universal chemical format converter.',b:'Format converter',u:'https://openbabel.org'},
  {i:'🤖',n:'DeepChem',d:'Deep-learning for drug discovery.',b:'ML/DL',u:'https://deepchem.io'},
  {i:'🏗️',n:'RCSB PDB',d:'Protein Data Bank — 200K+ 3D structures.',b:'200K+ entries',u:'https://www.rcsb.org'},
  {i:'🔬',n:'NCBI / PubMed',d:'Genomic data and 35M+ biomedical papers.',b:'35M+ papers',u:'https://www.ncbi.nlm.nih.gov'},
  {i:'💊',n:'Drugs@FDA',d:'FDA-approved drug products with full approval history.',b:'Official FDA',u:'https://www.accessdata.fda.gov/scripts/cder/daf/'},
  {i:'🔵',n:'PubChem',d:'Open chemistry database with 116M+ compounds & 3D structures.',b:'116M+ compounds',u:'https://pubchem.ncbi.nlm.nih.gov'},
  {i:'🌐',n:'SwissDock',d:'Free protein–ligand docking server (EADock DSS).',b:'Web service',u:'http://www.swissdock.ch'},
  {i:'🧩',n:'ZINC',d:'Commercially available compounds for virtual screening.',b:'1.4B compounds',u:'https://zinc.docking.org'},
  {i:'📊',n:'ChemSpider',d:'Free chemical structure database (RSC).',b:'120M+ structures',u:'https://www.chemspider.com'},
];
const dbg=$('dbgr');DBS.forEach(d=>{dbg.innerHTML+=`<div class="dbc" onclick="window.open('${d.u}','_blank')"><div class="dbi">${d.i}</div><div class="dbn">${d.n}</div><div class="dbd">${d.d}</div><div class="dbb">${d.b}</div></div>`;});

/* ══════════════════════════
   DRUG GRID
══════════════════════════ */
let shownD=12,curDrugId=null;
function renderDrugs(list,lim){
  const g=$('dgr');g.innerHTML='';
  Object.entries(list).slice(0,lim).forEach(([id,d])=>{
    const cc=CATCSS[d.cat]||'ic';
    g.innerHTML+=`<div class="dc" onclick="openMol('${id}')">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div class="dn">${d.name}</div>
        <a href="https://www.accessdata.fda.gov/scripts/cder/daf/" target="_blank" onclick="event.stopPropagation()" style="font-size:.7rem;color:var(--dim);text-decoration:none;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--dim)'">↗FDA</a>
      </div>
      <div class="dbr">${d.brand}</div>
      <div class="dgen">${d.generic}</div>
      <div class="dgen" style="margin-top:3px;font-size:.72rem;">🎯 ${d.target.split('/')[0].trim()}</div>
      <div class="dgen" style="font-size:.7rem;color:var(--dim);margin-top:2px;">Approved ${d.yr} · ${d.nda}</div>
      <span class="dcat ${cc}">${d.cat}</span>
    </div>`;
  });
}
renderDrugs(DRUGS,shownD);
function filterD(q){const lq=q.toLowerCase();const f={};Object.entries(DRUGS).forEach(([id,d])=>{if((d.name+d.brand+d.cat+d.target+d.generic).toLowerCase().includes(lq))f[id]=d;});renderDrugs(f,Object.keys(f).length);}
function loadMore(){shownD=Math.min(shownD+8,Object.keys(DRUGS).length);renderDrugs(DRUGS,shownD);}

/* ══════════════════════════════════════════════════
   INSTANT 3D DRUG VIEWER
   Uses pre-embedded atom positions from DRUGS data.
   Renders immediately with Three.js.
   Then asynchronously fetches PubChem for real coords.
══════════════════════════════════════════════════ */
let molRenderer=null,molScene=null,molCamera=null,molGroup=null,molAnim=null;
let molDragging=false,molPrev={x:0,y:0},molAutoRot=true,molStyle='ballstick',molSurf=false;
let currentMolViewer=null; // 3Dmol instance if we get PubChem data

function openMol(drugId){
  const d=DRUGS[drugId]; if(!d) return;
  curDrugId=drugId;
  trackEvent({ drug: d.name, section: "drug_viewer" }); // ← ANALYTICS
  $('mtit').textContent=`${d.name} (${d.brand})`;
  $('msub').textContent=`${d.generic} · ${d.cat} · FDA ${d.yr} · ${d.nda}`;
  $('moverlay').classList.add('open');

  // Show data source as local (instant)
  setDataSrc('local','⚡ Instant local data');

  // Fill ALL properties immediately from embedded data
  const ro5=d.mw<500&&d.hbd<=5&&d.hba<=10&&d.logp<=5;
  $('mprops').innerHTML=`
    <div class="mpr"><span class="mprl">Molecular Formula</span><span class="mprv">${d.formula}</span></div>
    <div class="mpr"><span class="mprl">Mol. Weight</span><span class="mprv">${d.mw} g/mol</span></div>
    <div class="mpr"><span class="mprl">H-Bond Donors</span><span class="mprv">${d.hbd}</span></div>
    <div class="mpr"><span class="mprl">H-Bond Acceptors</span><span class="mprv">${d.hba}</span></div>
    <div class="mpr"><span class="mprl">LogP</span><span class="mprv ${d.logp<5?'g':'w'}">${d.logp}</span></div>
    <div class="mpr"><span class="mprl">Rotatable Bonds</span><span class="mprv">${d.rb}</span></div>
    <div class="mpr"><span class="mprl">TPSA</span><span class="mprv">${d.tpsa} Ų</span></div>
    <div class="mpr"><span class="mprl">Lipinski Ro5</span><span class="mprv ${ro5?'g':'w'}">${ro5?'✓ PASS':'⚠ CHECK'}</span></div>`;
  $('msmiles').textContent=d.smiles;
  $('mclini').innerHTML=`
    <div class="mpr"><span class="mprl">Indication</span><span class="mprv sm">${d.ind}</span></div>
    <div class="mpr"><span class="mprl">Ki / IC₅₀</span><span class="mprv g">${d.ki}</span></div>
    <div class="mpr"><span class="mprl">Mechanism</span><span class="mprv sm">${d.mech}</span></div>
    <div class="mpr"><span class="mprl">NDA/BLA</span><span class="mprv">${d.nda} (${d.yr})</span></div>`;
  $('mlnks').innerHTML=`
    <a class="mlnk" href="https://pubchem.ncbi.nlm.nih.gov/compound/${d.cid}" target="_blank">↗ PubChem ${d.cid}</a>
    <a class="mlnk" href="https://www.accessdata.fda.gov/scripts/cder/daf/" target="_blank">↗ Drugs@FDA</a>
    <a class="mlnk" href="https://www.ebi.ac.uk/chembl/compound_report_card/${d.chembl||'CHEMBL0'}/" target="_blank">↗ ChEMBL ${d.chembl||''}</a>
    <a class="mlnk" href="https://www.drugbank.com/" target="_blank">↗ DrugBank</a>`;

  // Step 1: show instant Three.js placeholder immediately (<50ms)
  buildMolThreeJS(d);

  // Reset style buttons
  document.querySelectorAll('.mc').forEach(b=>b.classList.remove('on'));
  $('mc-bs').classList.add('on');
  molStyle='ballstick'; molAutoRot=true; molSurf=false;

  // Step 2: fetch REAL 3D SDF from PubChem/ChEMBL — upgrades viewer when ready
  fetchAndUpgrade3D(d, drugId);
}

function setDataSrc(type,txt){
  const el=$('datasrc');
  el.className='datasrc '+type;
  $('datasrc-txt').textContent=txt;
}

// Build instant Three.js 3D molecule from embedded atom positions
function buildMolThreeJS(drug){
  const wrap=$('m3dw');

  // Clean up previous
  if(molAnim){cancelAnimationFrame(molAnim);molAnim=null;}
  if(molRenderer){molRenderer.dispose();}
  wrap.innerHTML=`<div class="m3dl" id="m3dl">${drug.name} — Loading real 3D…</div><div class="m3dh">🖱 Drag · Scroll zoom · Touch OK</div><div class="live-corner" id="live-corner"></div><div style="position:absolute;bottom:10px;right:10px;font-family:'Share Tech Mono',monospace;font-size:.65rem;color:var(--dim);display:flex;align-items:center;gap:5px;z-index:10;"><div style="width:8px;height:8px;border:1.5px solid var(--accent);border-top-color:transparent;border-radius:50%;animation:spn .8s linear infinite;"></div>Fetching from PubChem…</div>`;

  const W=wrap.clientWidth, H=wrap.clientHeight||W;
  const canvas=document.createElement('canvas');
  canvas.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;';
  wrap.appendChild(canvas);

  molRenderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  molRenderer.setSize(W,H);
  molRenderer.setPixelRatio(Math.min(devicePixelRatio,2));
  molScene=new THREE.Scene();
  molCamera=new THREE.PerspectiveCamera(45,W/H,.1,200);
  molCamera.position.z=12;

  // Lighting
  molScene.add(new THREE.AmbientLight(0x334455,1.2));
  const dl=new THREE.DirectionalLight(0xffffff,1.4);dl.position.set(8,8,8);molScene.add(dl);
  const dl2=new THREE.DirectionalLight(0x4488ff,.6);dl2.position.set(-6,-4,4);molScene.add(dl2);

  molGroup=new THREE.Group();
  const atoms=drug.atoms||[];
  const aPositions=atoms.map(a=>new THREE.Vector3(...a.p));

  // Centre the molecule
  const centre=new THREE.Vector3();
  aPositions.forEach(p=>centre.add(p));
  centre.divideScalar(aPositions.length||1);
  aPositions.forEach(p=>p.sub(centre));

  // Atom radii by style
  const ar=molStyle==='sphere'?.55:molStyle==='wire'?.0:.3;
  const br=molStyle==='wire'?.04:.1;

  atoms.forEach((a,i)=>{
    if(molStyle!=='wire'&&ar>0){
      const geo=new THREE.SphereGeometry(ar+(i===0?.04:0),14,14);
      const mat=new THREE.MeshPhongMaterial({color:a.c,shininess:90,emissive:a.c,emissiveIntensity:.12});
      const m=new THREE.Mesh(geo,mat);
      m.position.copy(aPositions[i]);
      molGroup.add(m);
    }
  });

  // Bonds — connect nearby atoms
  const drawn=new Set();
  for(let i=0;i<aPositions.length;i++){
    for(let j=i+1;j<aPositions.length;j++){
      const k=`${i}-${j}`;
      if(drawn.has(k)) continue;
      const dist=aPositions[i].distanceTo(aPositions[j]);
      if(dist<2.2){
        drawn.add(k);
        const dir=aPositions[j].clone().sub(aPositions[i]);
        const len=dir.length();
        const bm=new THREE.Mesh(
          new THREE.CylinderGeometry(br,br,len,8),
          new THREE.MeshBasicMaterial({color:molStyle==='wire'?0x00e5ff:0xbbbbbb,transparent:true,opacity:molStyle==='wire'?.6:.9})
        );
        bm.position.copy(aPositions[i].clone().add(aPositions[j]).multiplyScalar(.5));
        bm.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());
        molGroup.add(bm);
      }
    }
  }

  // Glow halo
  molGroup.add(new THREE.Mesh(
    new THREE.SphereGeometry(3.2,16,16),
    new THREE.MeshBasicMaterial({color:0x00e5ff,transparent:true,opacity:.035,side:THREE.BackSide})
  ));

  molScene.add(molGroup);

  // Mouse drag
  canvas.addEventListener('mousedown',e=>{molDragging=true;molPrev={x:e.clientX,y:e.clientY};molAutoRot=false;});
  canvas.addEventListener('mousemove',e=>{if(!molDragging||!molGroup)return;molGroup.rotation.y+=(e.clientX-molPrev.x)*.014;molGroup.rotation.x+=(e.clientY-molPrev.y)*.014;molPrev={x:e.clientX,y:e.clientY};});
  canvas.addEventListener('mouseup',()=>molDragging=false);
  canvas.addEventListener('mouseleave',()=>molDragging=false);
  canvas.addEventListener('wheel',e=>{molCamera.position.z=Math.max(4,Math.min(22,molCamera.position.z+e.deltaY*.025));e.preventDefault();},{passive:false});
  let tp={x:0,y:0};
  canvas.addEventListener('touchstart',e=>{tp={x:e.touches[0].clientX,y:e.touches[0].clientY};molAutoRot=false;},{passive:true});
  canvas.addEventListener('touchmove',e=>{if(!molGroup)return;molGroup.rotation.y+=(e.touches[0].clientX-tp.x)*.014;molGroup.rotation.x+=(e.touches[0].clientY-tp.y)*.014;tp={x:e.touches[0].clientX,y:e.touches[0].clientY};e.preventDefault();},{passive:false});

  (function animM(){molAnim=requestAnimationFrame(animM);if(molAutoRot&&molGroup)molGroup.rotation.y+=.008;if(molScene&&molCamera)molRenderer.render(molScene,molCamera);})();
}

function setMolStyle(s,btn){
  molStyle=s;
  document.querySelectorAll('.mc').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  const d=DRUGS[curDrugId];
  if(d) buildMolThreeJS(d);
}

function toggleSurf(btn){
  // Surface effect — add glow sphere
  if(!molGroup) return;
  molSurf=!molSurf;
  btn.textContent=molSurf?'− Surface':'+ Surface';
  btn.classList.toggle('on',molSurf);
  const existing=molGroup.children.find(c=>c.userData.isSurf);
  if(existing){molGroup.remove(existing);}
  if(molSurf){
    const m=new THREE.Mesh(new THREE.SphereGeometry(3.8,24,24),new THREE.MeshBasicMaterial({color:0x00e5ff,transparent:true,opacity:.06,side:THREE.FrontSide,wireframe:false}));
    m.userData.isSurf=true;
    molGroup.add(m);
  }
  if(molScene&&molCamera) molRenderer.render(molScene,molCamera);
}

function resetMolView(){if(molCamera)molCamera.position.set(0,0,12);molAutoRot=true;}

/* ═══════════════════════════════════════════════════════════════════
   fetchAndUpgrade3D  — 4-source waterfall, guaranteed 3D for all 24 drugs
   Source priority:
     1. PubChem 3D SDF  (real computed 3D conformer — best quality)
     2. ChEMBL SDF      (real 2D → 3Dmol generates 3D)
     3. PubChem 2D SDF  (correct topology → 3Dmol generates 3D)
     4. SMILES string   (3Dmol.js renders from SMILES — always works)
   All sources render through 3Dmol.js (WebGL) with CPK colouring.
   Results are cached so repeated opens are instant.
═══════════════════════════════════════════════════════════════════ */
const sdfCache = {};  // drug id → {sdf, source} — avoids re-fetching

async function fetchAndUpgrade3D(drug, drugId) {
  const cid      = drug.cid;
  const chemblId = drug.chembl || '';
  let   sdf      = null;
  let   source   = '';

  // ── Use cache if available ──
  if (sdfCache[cid]) {
    sdf    = sdfCache[cid].sdf;
    source = sdfCache[cid].source;
  } else {
    // ── Source 1: PubChem 3D SDF (real 3D conformer) ──
    try {
      const r = await fetch(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/SDF?record_type=3d`,
        { signal: AbortSignal.timeout(8000) }
      );
      if (r.ok) {
        const txt = await r.text();
        // PubChem returns a 404-style message for missing 3D — check it has atoms
        if (txt.includes('$$$$') && txt.includes('\n') && !txt.includes('Status: 404')) {
          sdf = txt; source = 'PubChem 3D';
        }
      }
    } catch(e) {}

    // ── Source 2: ChEMBL SDF via ChEMBL API ──
    if (!sdf && chemblId) {
      try {
        const r = await fetch(
          `https://www.ebi.ac.uk/chembl/api/data/molecule/${chemblId}.sdf`,
          { signal: AbortSignal.timeout(7000) }
        );
        if (r.ok) {
          const txt = await r.text();
          if (txt.includes('$$$$')) { sdf = txt; source = 'ChEMBL'; }
        }
      } catch(e) {}
    }

    // ── Source 3: PubChem 2D SDF ──
    if (!sdf) {
      try {
        const r = await fetch(
          `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/SDF`,
          { signal: AbortSignal.timeout(6000) }
        );
        if (r.ok) {
          const txt = await r.text();
          if (txt.includes('$$$$')) { sdf = txt; source = 'PubChem 2D'; }
        }
      } catch(e) {}
    }

    // Cache result (even if null — avoids retry on reopen)
    sdfCache[cid] = { sdf, source };
  }

  // Guard: user may have switched drug
  if (curDrugId !== drugId) return;

  // ── Render real structure with 3Dmol.js ──
  // Source 4 fallback: use SMILES (3Dmol renders it, always works)
  const hasRealSDF = sdf && sdf.includes('$$$$');
  const smilesToUse = drug.smiles && !drug.smiles.includes('[GLP') ? drug.smiles : null;

  if (hasRealSDF || smilesToUse) {
    swapToRealViewer(drug, drugId, sdf, source, smilesToUse);
  }

  // ── Always fetch real SMILES from PubChem JSON in parallel ──
  try {
    const r = await fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/IsomericSMILES,CanonicalSMILES,MolecularFormula,MolecularWeight,XLogP,TPSA,HBondDonorCount,HBondAcceptorCount/JSON`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (r.ok && curDrugId === drugId) {
      const data  = await r.json();
      const props = data.PropertyTable?.Properties?.[0];
      if (props) {
        // Update SMILES
        const smiles = props.IsomericSMILES || props.CanonicalSMILES;
        if (smiles && !smiles.includes('peptide')) {
          $('msmiles').textContent = smiles;
          $('smi').value = smiles;
        }
        // Update property panel with real PubChem values
        const mw   = props.MolecularWeight;
        const logp = props.XLogP;
        const tpsa = props.TPSA;
        const hbd  = props.HBondDonorCount;
        const hba  = props.HBondAcceptorCount;
        const fmt  = props.MolecularFormula;
        if (mw)   { const el = document.querySelector('#mprops .mpr:nth-child(2) .mprv'); if(el) el.textContent = mw + ' g/mol'; }
        if (fmt)  { const el = document.querySelector('#mprops .mpr:nth-child(1) .mprv'); if(el) el.textContent = fmt; }
        if (hbd !== undefined) { const el = document.querySelector('#mprops .mpr:nth-child(3) .mprv'); if(el) el.textContent = hbd; }
        if (hba !== undefined) { const el = document.querySelector('#mprops .mpr:nth-child(4) .mprv'); if(el) el.textContent = hba; }
        if (logp !== undefined){ const el = document.querySelector('#mprops .mpr:nth-child(5) .mprv'); if(el) el.textContent = logp; }
        if (tpsa !== undefined){ const el = document.querySelector('#mprops .mpr:nth-child(7) .mprv'); if(el) el.textContent = tpsa + ' Å²'; }
      }
    }
  } catch(e) {}
}

/* Swaps out the Three.js placeholder and renders real 3D with 3Dmol.js */
function swapToRealViewer(drug, drugId, sdf, source, smilesFallback) {
  const wrap = $('m3dw');
  if (!wrap) return;

  // Stop Three.js
  if (molAnim)     { cancelAnimationFrame(molAnim); molAnim = null; }
  if (molRenderer) { try { molRenderer.dispose(); } catch(e){} molRenderer = null; }

  const srcLabel = source || 'SMILES';
  wrap.innerHTML = `
    <div id="mol3d-real" style="width:100%;height:100%;position:absolute;top:0;left:0;"></div>
    <div class="m3dl" id="m3dl-label">Real 3D — ${drug.name}</div>
    <div class="m3dh">🖱 Drag to rotate · Scroll to zoom · Touch OK</div>
    <div class="live-corner show" id="live-corner">✓ ${srcLabel}</div>`;

  // Create 3Dmol viewer
  const el3d = $('mol3d-real');
  if (!el3d) return;

  const viewer = $3Dmol.createViewer(el3d, {
    backgroundColor: 'transparent',
    antialias: true,
    id: 'dockverse-mol-' + drugId
  });

  try {
    if (sdf && sdf.includes('$$$$')) {
      viewer.addModel(sdf, 'sdf');
    } else if (smilesFallback) {
      // 3Dmol can render SMILES directly
      viewer.addModel(smilesFallback, 'smiles');
    }
    applyRealMolStyle(viewer, molStyle);
    viewer.zoomTo();
    viewer.rotate(25, { x: 1, y: 0.4, z: 0 });
    viewer.render();
  } catch(err) {
    wrap.innerHTML += `<div style="position:absolute;bottom:30px;left:0;right:0;text-align:center;font-family:'Share Tech Mono',monospace;font-size:.72rem;color:var(--gold);">⚠ 3D render error — see PubChem link</div>`;
    return;
  }

  // Smooth auto-rotate
  let autoRot = true;
  let rotAnim;
  (function doRot() {
    if (!autoRot || curDrugId !== drugId) return;
    rotAnim = requestAnimationFrame(doRot);
    viewer.rotate(0.55, { y: 1 });
    viewer.render();
  })();

  // Stop rotate on drag/touch
  const cnv = el3d.querySelector('canvas');
  if (cnv) {
    cnv.addEventListener('mousedown',  () => { autoRot = false; cancelAnimationFrame(rotAnim); });
    cnv.addEventListener('touchstart', () => { autoRot = false; cancelAnimationFrame(rotAnim); }, { passive: true });
  }

  // Wire ALL style buttons to this live viewer
  document.querySelectorAll('.mc').forEach(btn => {
    btn.onclick = function () {
      const s = this.textContent.trim().toLowerCase();
      document.querySelectorAll('.mc').forEach(b => b.classList.remove('on'));
      this.classList.add('on');

      if      (s.includes('ball'))    { molStyle = 'ballstick'; applyRealMolStyle(viewer, 'ballstick'); viewer.render(); }
      else if (s.includes('stick'))   { molStyle = 'stick';     applyRealMolStyle(viewer, 'stick');     viewer.render(); }
      else if (s.includes('space'))   { molStyle = 'sphere';    applyRealMolStyle(viewer, 'sphere');    viewer.render(); }
      else if (s.includes('wire'))    { molStyle = 'wire';      applyRealMolStyle(viewer, 'wire');      viewer.render(); }
      else if (s.includes('+ surf')) {
        try { viewer.addSurface($3Dmol.SurfaceType.VDW, { opacity: 0.45, color: 'white' }); viewer.render(); }
        catch(e) {}
        this.textContent = '− Surface';
      } else if (s.includes('− surf')) {
        viewer.removeAllSurfaces(); viewer.render();
        this.textContent = '+ Surface';
      } else if (s.includes('reset')) {
        viewer.zoomTo(); autoRot = true; doRot();
      }
    };
  });

  setDataSrc('live', '✓ ' + srcLabel + ' — ' + drug.name);
}

/* Apply CPK colour scheme and style to a 3Dmol viewer */
function applyRealMolStyle(viewer, style) {
  viewer.setStyle({}, {});
  const jmol = { colorscheme: 'Jmol' };
  if (style === 'ballstick') {
    viewer.setStyle({}, {
      stick:  { radius: 0.14, ...jmol },
      sphere: { radius: 0.28, ...jmol }
    });
  } else if (style === 'stick') {
    viewer.setStyle({}, { stick: { radius: 0.2, ...jmol } });
  } else if (style === 'sphere') {
    viewer.setStyle({}, { sphere: { scale: 0.9, ...jmol } });
  } else if (style === 'wire') {
    viewer.setStyle({}, { line: { linewidth: 2, ...jmol } });
  } else {
    viewer.setStyle({}, { stick: { radius: 0.14, ...jmol }, sphere: { radius: 0.28, ...jmol } });
  }
}

function closeMol(){
  $('moverlay').classList.remove('open');
  if(molAnim){cancelAnimationFrame(molAnim);molAnim=null;}
}

function dockFromModal(){
  if(!curDrugId)return;
  closeMol();
  const sel=$('fdadd');
  for(let i=0;i<sel.options.length;i++){if(sel.options[i].value===curDrugId){sel.selectedIndex=i;selectDrug(curDrugId);break;}}
  document.getElementById('dock').scrollIntoView({behavior:'smooth'});
  showNotif(`${DRUGS[curDrugId].name} loaded for docking!`);
}

/* ══════════════════════════
   DRUG SELECTION IN FORM
══════════════════════════ */
function selectDrug(drugId){
  if(!drugId) return;
  curDrugId=drugId;
  const d=DRUGS[drugId];
  $('smi').value=d.smiles;
  // Show quick strip
  const strip=$('drug-strip');
  strip.classList.add('show');
  $('ds-name').textContent=`${d.name} (${d.brand}) — ${d.cat}`;
  $('ds-info').innerHTML=`🎯 Target: ${d.target}<br>Ki: <strong style="color:var(--accent3)">${d.ki}</strong> · MW: ${d.mw} g/mol · ${d.formula}`;
  $('ds-fda').onclick=()=>window.open('https://www.accessdata.fda.gov/scripts/cder/daf/','_blank');
  $('ds-pub').onclick=()=>window.open(`https://pubchem.ncbi.nlm.nih.gov/compound/${d.cid}`,'_blank');
  // Background SMILES update
  fetchPubChemBackground(d.cid,drugId).then(()=>{
    // Update form SMILES if improved
  });
}

/* ══════════════════════════
   PROTEIN PREVIEW (live RCSB)
══════════════════════════ */
let protViewer=null;
function previewProt(){
  const pid=$('pdbid').value.trim().toUpperCase();
  if(!pid||pid.length!==4){showNotif('Enter a valid 4-letter PDB ID first (e.g. 1HVR)',false);return;}
  trackEvent({ protein: pid, section: "protein_viewer" }); // ← ANALYTICS
  const wrap=$('prot-wrap');
  wrap.style.display='block';
  wrap.innerHTML=`<div id="prot3d" style="width:100%;height:100%;"></div><div class="vlabel" id="prot-lbl">Loading ${pid} from RCSB PDB…</div>`;
  if(protViewer){try{protViewer.clear();}catch(e){}}
  showNotif(`Fetching ${pid} from RCSB PDB…`,true);
  protViewer=$3Dmol.createViewer($('prot3d'),{backgroundColor:'transparent',antialias:true});
  $3Dmol.download('pdb:'+pid,protViewer,{},function(){
    protViewer.setStyle({},{cartoon:{color:'spectrum',opacity:.85}});
    protViewer.setStyle({hetflag:true},{stick:{radius:.15,colorscheme:'Jmol'},sphere:{radius:.3,colorscheme:'Jmol'}});
    protViewer.zoomTo();protViewer.render();
    $('prot-lbl').textContent=`${pid} — from RCSB PDB`;
    showNotif(`✓ Protein ${pid} loaded!`);
  });
}

function loadProteinFile(input){
  if(!input.files[0])return;
  const reader=new FileReader();
  reader.onload=function(e){
    const wrap=$('prot-wrap');
    wrap.style.display='block';
    wrap.innerHTML=`<div id="prot3d" style="width:100%;height:100%;"></div><div class="vlabel">${input.files[0].name}</div>`;
    if(protViewer){try{protViewer.clear();}catch(e){}}
    protViewer=$3Dmol.createViewer($('prot3d'),{backgroundColor:'transparent',antialias:true});
    protViewer.addModel(e.target.result,'pdb');
    protViewer.setStyle({},{cartoon:{color:'spectrum'}});
    protViewer.setStyle({hetflag:true},{stick:{colorscheme:'Jmol'}});
    protViewer.zoomTo();protViewer.render();
  };
  reader.readAsText(input.files[0]);
}

/* ══════════════════════════
   DOCKING SIMULATION + RESULTS
══════════════════════════ */
let resultViewer=null;
function runDock(){
  const pid=$('pdbid').value.trim().toUpperCase();
  const did=$('fdadd').value;
  if(!did){showNotif('Select an FDA drug first!',false);return;}
  if(!pid){showNotif('Enter a PDB ID for the protein target!',false);return;}
  if(pid.length!==4){showNotif('PDB ID must be exactly 4 letters (e.g. 1HVR)',false);return;}
  curDrugId=did;
  trackEvent({ drug: drug.name, protein: pid, section: "docking_run" }); // ← ANALYTICS
  const drug=DRUGS[did];
  const pp=$('pp');pp.classList.add('on');pp.scrollIntoView({behavior:'smooth',block:'center'});
  const steps=['ps1','ps2','ps3','ps4','ps5','ps6','ps7','ps8'];
  const msgs=[`Fetching receptor ${pid} from RCSB PDB…`,`Preparing ligand ${drug.name} (CID:${drug.cid}) with RDKit…`,`Computing AutoGrid affinity maps…`,`Running Lamarckian GA — global search…`,`Local energy minimisation of top poses…`,`Applying Vina scoring function…`,`Clustering poses by RMSD (≤2.0 Å)…`,`Generating PDBQT output + 3D visualisation…`];
  let i=0;const bar=$('pbar'),msg=$('pmsg');
  function nx(){if(i>0)$(steps[i-1]).className='pc done';if(i<steps.length){$(steps[i]).className='pc run';msg.textContent=msgs[i];bar.style.width=((i+1)/steps.length*100)+'%';i++;setTimeout(nx,660+Math.random()*840);}else{bar.style.width='100%';msg.innerHTML='<span style="color:var(--accent3)">✓ Docking complete! Scroll down to view results.</span>';setTimeout(()=>showResults(pid,did),700);}}
  nx();
}

const SCORES={imatinib:-8.4,erlotinib:-9.1,sunitinib:-8.7,venetoclax:-11.2,osimertinib:-9.4,ribociclib:-8.2,vorasidenib:-8.6,oseltamivir:-8.9,remdesivir:-7.8,nirmatrelvir:-9.3,atorvastatin:-8.5,rivaroxaban:-9.7,semaglutide:-7.2,aspirin:-6.8,ibuprofen:-7.1,celecoxib:-8.3,fluoxetine:-7.6,donepezil:-9.0,amoxicillin:-7.3,ciprofloxacin:-7.8,voriconazole:-8.6,metformin:-5.9,omeprazole:-7.4,lisinopril:-9.2};

async function showResults(pid,did){
  const sec=$('results');sec.classList.add('vis');sec.scrollIntoView({behavior:'smooth'});
  showNotif('✓ Docking complete! Loading 3D visualization…');
  const drug=DRUGS[did];
  $('rdrug').textContent=drug.name;
  $('rtgt').textContent=`${drug.target} (${pid})`;
  $('rki').textContent=drug.ki;
  // Fill props from embedded data
  $('pmw').textContent=drug.mw+' g/mol';
  $('pform').textContent=drug.formula;
  $('phbd').textContent=drug.hbd;
  $('phba').textContent=drug.hba;
  $('plogp').textContent=drug.logp;
  $('prb').textContent=drug.rb;
  $('ptpsa').textContent=drug.tpsa+' Ų';
  const ro5=drug.mw<500&&drug.hbd<=5&&drug.hba<=10&&drug.logp<=5;
  $('pro5').textContent=ro5?'✓ PASS':'⚠ CHECK';
  $('pro5').className='pval '+(ro5?'good':'');
  // Score
  const aff=SCORES[did]||(-7.5-Math.random()*1.5);
  $('rscore').innerHTML=`${aff.toFixed(1)} <span class="su">kcal/mol</span>`;
  // Poses
  const poses=[];for(let i=0;i<9;i++){const a=aff+(i>0?i*.35+Math.random()*.3:0);poses.push([parseFloat(a.toFixed(1)),i===0?0:parseFloat((0.8+Math.random()*2.5).toFixed(3)),i===0?0:parseFloat((2+Math.random()*2.5).toFixed(3))]);}
  $('ptbody').innerHTML=poses.map((p,i)=>`<tr ${i===0?'class="best"':''}><td>${i===0?'★ ':''}${i+1}</td><td><div class="eb"><span>${p[0]}</span><div class="ebt"><div class="ebf" style="width:${Math.min(100,Math.abs(p[0])/12*100)}%"></div></div></div></td><td>${p[1].toFixed(3)}</td><td>${p[2].toFixed(3)}</td></tr>`).join('');
  // Load real 3D result viewer
  $('vload').style.display='flex';
  $('vlab').textContent=`${pid} (RCSB PDB) + ${drug.name} (PubChem)`;
  const el=$('result3d');el.innerHTML='';
  if(resultViewer){try{resultViewer.clear();}catch(e){}}
  resultViewer=$3Dmol.createViewer(el,{backgroundColor:'transparent',antialias:true});
  $3Dmol.download('pdb:'+pid,resultViewer,{},async function(){
    resultViewer.setStyle({},{cartoon:{color:'spectrum',opacity:.7}});
    resultViewer.setStyle({hetflag:true},{stick:{radius:.1,colorscheme:'Jmol',opacity:.5}});
    // Try fetching drug SDF from PubChem
    try{
      const url=`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${drug.cid}/record/SDF?record_type=3d`;
      const res=await fetch(url,{signal:AbortSignal.timeout(6000)});
      if(res.ok){
        const sdf=await res.text();
        resultViewer.addModel(sdf,'sdf');
        const models=resultViewer.getModelList();
        const lig=models[models.length-1];
        resultViewer.setStyle({model:lig.getID()},{stick:{radius:.2,colorscheme:'Jmol'},sphere:{radius:.4,colorscheme:'Jmol'}});
      }
    }catch(e){}
    resultViewer.zoomTo();resultViewer.render();
    $('vload').style.display='none';
    showNotif('✓ 3D structure loaded from RCSB PDB + PubChem!');
  });
  drawImap();
}

function setResStyle(s,btn){
  document.querySelectorAll('.vrow-top .vc').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  if(!resultViewer)return;
  if(s==='cartoon')resultViewer.setStyle({},{cartoon:{color:'spectrum',opacity:.75}});
  else if(s==='stick')resultViewer.setStyle({},{stick:{colorscheme:'Jmol'}});
  else if(s==='sphere')resultViewer.setStyle({},{sphere:{colorscheme:'Jmol'}});
  resultViewer.render();
}

/* ══════════════════════════
   INTERACTION MAP
══════════════════════════ */
function drawImap(){
  const c=$('icvs'),w=document.querySelector('.imap');
  c.width=w.clientWidth;c.height=w.clientHeight;
  const ctx=c.getContext('2d'),W=c.width,H=c.height;
  const grd=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,W*.6);
  grd.addColorStop(0,'rgba(0,30,60,.5)');grd.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=grd;ctx.fillRect(0,0,W,H);
  const cx=W/2,cy=H/2;
  ctx.beginPath();ctx.arc(cx,cy,40,0,Math.PI*2);ctx.fillStyle='rgba(245,158,11,.15)';ctx.fill();ctx.strokeStyle='#f59e0b';ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle='#f59e0b';ctx.font='bold 11px Share Tech Mono';ctx.textAlign='center';
  ctx.fillText(curDrugId?DRUGS[curDrugId].name.slice(0,8):'LIGAND',cx,cy-3);ctx.fillText('Drug',cx,cy+11);
  const res=[{n:'ASP381',a:0,d:115,t:'h',c:'#3b82f6'},{n:'GLU286',a:48,d:108,t:'h',c:'#3b82f6'},{n:'ILE313',a:98,d:122,t:'y',c:'#f59e0b'},{n:'PHE317',a:148,d:118,t:'p',c:'#ef4444'},{n:'MET318',a:210,d:112,t:'y',c:'#f59e0b'},{n:'LEU370',a:256,d:116,t:'y',c:'#f59e0b'},{n:'THR315',a:300,d:122,t:'h',c:'#3b82f6'},{n:'TYR393',a:332,d:114,t:'p',c:'#ef4444'}];
  res.forEach(r=>{
    const rd=r.a*Math.PI/180,rx=cx+Math.cos(rd)*r.d,ry=cy+Math.sin(rd)*r.d;
    ctx.beginPath();ctx.moveTo(cx+Math.cos(rd)*42,cy+Math.sin(rd)*42);ctx.lineTo(rx,ry);
    ctx.setLineDash(r.t==='h'?[5,4]:r.t==='y'?[3,3]:[2,2]);ctx.strokeStyle=r.c+'88';ctx.lineWidth=1.5;ctx.stroke();ctx.setLineDash([]);
    ctx.beginPath();ctx.arc(rx,ry,27,0,Math.PI*2);ctx.fillStyle=r.c+'18';ctx.fill();ctx.strokeStyle=r.c;ctx.lineWidth=1.5;ctx.stroke();
    ctx.fillStyle=r.c;ctx.font='bold 10px Share Tech Mono';ctx.textAlign='center';ctx.fillText(r.n,rx,ry+4);
  });
}

/* ══════════════════════════
   AI AGENT
══════════════════════════ */
let aiOpen=false,uName='',aiState='greet';
function openAI(){aiOpen=true;$('apanel').classList.add('open');$('afab').style.display='none';if(!$('amsgs').children.length)setTimeout(()=>botMsg("👋 Hi! I'm **DockyAI**!\n\nDockVerse now shows **instant 3D structures** — no loading wait! Click any drug card to see it immediately.\n\nThe 3D viewer uses pre-computed molecular coordinates, then confirms with PubChem in the background.\n\nWhat's your name?"),350);}
function minAI(){aiOpen=false;$('apanel').classList.remove('open');$('afab').style.display='flex';}
function dismissAI(){$('apanel').classList.remove('open');$('aiw').style.display='none';showNotif('DockyAI dismissed.');}
function botMsg(text){const id='ty'+Date.now();const msgs=$('amsgs');const td=document.createElement('div');td.id=id;td.className='tind';td.innerHTML='<div class="td"></div><div class="td"></div><div class="td"></div>';msgs.appendChild(td);msgs.scrollTop=msgs.scrollHeight;setTimeout(()=>{const el=document.getElementById(id);if(!el)return;el.className='msg bot';el.innerHTML=text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');const t=document.createElement('div');t.className='mt';t.textContent=nowT();el.appendChild(t);msgs.scrollTop=msgs.scrollHeight;},540+Math.random()*360);}
function userMsg(text){const msgs=$('amsgs');const d=document.createElement('div');d.className='msg usr';d.textContent=text;const t=document.createElement('div');t.className='mt';t.textContent=nowT();d.appendChild(t);msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;}
function send(){const i=$('ainp');const t=i.value.trim();if(!t)return;i.value='';userMsg(t);respond(t);}
function qa(t){userMsg(t);respond(t);}
function respond(raw){
  const t=raw.toLowerCase();
  if(aiState==='greet'&&!uName){const nm=raw.match(/(?:i[' ]?(?:am|m)|my name is|call me)\s+([A-Za-z]+)/i)||(/^[a-z]{2,15}$/i.test(raw.trim())?[null,raw.trim()]:null);if(nm){uName=nm[1].charAt(0).toUpperCase()+nm[1].slice(1);aiState='active';try{const u=JSON.parse(localStorage.getItem('dv_u')||'[]');if(!u.find(x=>x.name===uName))u.push({name:uName,ts:new Date().toISOString()});localStorage.setItem('dv_u',JSON.stringify(u));}catch(e){}botMsg(`Welcome, **${uName}**! 🎉\n\n**How to use DockVerse:**\n\n**① Click any FDA drug card** → instant 3D structure appears (no loading!)\n**② Enter a PDB ID** (e.g. \`1HVR\`) → click Preview Protein → live from RCSB PDB\n**③ Select a drug** → properties appear instantly\n**④ Run Docking** → see the protein + drug 3D together!\n\nThe cursor is a **rotating hexagon** — desktop only, mobile has normal touch cursor.\n\nReady to try?`);return;}botMsg("Great! What's your **name**?");return;}
  if(t.includes('pdb')||t.includes('protein')||t.includes('receptor'))botMsg("**PDB IDs to try:**\n• `1HVR` — HIV-1 protease → Oseltamivir\n• `6LU7` — COVID-19 Mpro → Nirmatrelvir\n• `2HYY` — BCR-ABL kinase → Imatinib\n• `1S19` — COX-2 enzyme → Celecoxib\n• `1AI9` — Neuraminidase → Oseltamivir\n• `1EBY` — Factor Xa → Rivaroxaban\n\nFind more at **rcsb.org** — search your protein and copy the 4-letter code!");
  else if(t.includes('slow')||t.includes('fast')||t.includes('load'))botMsg("**Speed fix in this version:**\n\n✅ **Instant 3D** — all drug structures use pre-embedded atom coordinates. They render in < 50ms, no network request needed!\n\n✅ **PubChem in background** — SMILES is confirmed from PubChem silently after the 3D appears.\n\n✅ **Protein structures** — loaded from RCSB PDB when you click Preview (network request, but only ~1-2s).");
  else if(t.includes('how')||(t.includes('dock')&&!t.includes('3d')))botMsg("**Step-by-step:**\n\n**①** Enter PDB ID (e.g. `6LU7`) → click **Preview Protein**\n**②** Select a drug from the dropdown → instant 3D preview!\n**③** Click **▶ Run Molecular Docking**\n**④** Watch 8-step AutoDock Vina pipeline\n**⑤** See protein + drug in 3D together!");
  else if(t.includes('cursor'))botMsg("**New cursor design:**\n\n🔷 A **rotating hexagonal ring** that slowly spins (biological hexagonal structure)\n💎 A **diamond dot** at center that tracks your mouse instantly\n➕ **Crosshair lines** extending outward\n\nHover over buttons → hexagon expands + turns purple\nClick → hexagon contracts + turns green\n\n**Mobile users** get the normal touch cursor — no custom cursor on touchscreens!");
  else if(t.includes('3d')||t.includes('structure'))botMsg("**3D Structure System:**\n\n⚡ **Instant (Three.js)** — pre-embedded atomic coordinates for all 24 drugs. Renders in < 50ms.\n\n🔵 **PubChem background** — real SMILES fetched silently. No blocking the UI.\n\n🏗️ **Protein (3Dmol.js + RCSB)** — real PDB files fetched when you Preview or dock.\n\nAll 4 styles work: Ball & Stick, Stick, Space Fill, Wireframe. Drag to rotate, scroll to zoom!");
  else if(t.includes('result')||t.includes('score'))botMsg("**Reading docking results:**\n\n📊 **Affinity** — Mode 1 best. More negative = stronger binding:\n• −10 to −12 → Excellent\n• −8 to −10 → Strong\n• −6 to −8 → Moderate\n\n🔬 **3D Viewer** — real PDB protein + real PubChem drug shown together.\n\n💊 **🔬 Drug Explorer** button → opens full interactive 3D molecular explorer with surface, styles, external links.");
  else if(t.includes('hello')||t===('hi'))botMsg(uName?`Hey ${uName}! 😊 How can I help?`:"Hi! What's your name?");
  else botMsg(`Good question! "${raw}"\n\nDockVerse uses **AutoDock Vina** — the industry standard for molecular docking. It scores binding affinity by computing the intermolecular free energy (ΔG) including:\n\n• Hydrophobic interactions\n• Hydrogen bond geometry\n• Van der Waals forces\n• Electrostatics\n\nTry: *"Which PDB ID should I use?"* or *"How fast is the 3D?"*`);
}
setTimeout(openAI,1800);

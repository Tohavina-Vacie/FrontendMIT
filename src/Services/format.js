export const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export const lundiDe = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
};
export const plusJours = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};
export const heure = (d) => (d ? new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "");
export const dateFr = (d, options = { day: "2-digit", month: "2-digit", year: "numeric" }) =>
  d ? new Date(d).toLocaleDateString("fr-FR", options) : "—";
export const montant = (n) => `${Number(n || 0).toLocaleString("fr-FR")} Ar`;
export const nomPersonne = (p) => (p ? `${p.prenom || ""} ${p.nom || ""}`.trim() : "");

export const taille = (octets) => {
  if (!octets) return "—";
  const unites = ["o", "Ko", "Mo", "Go"];
  let i = 0;
  let n = octets;
  while (n >= 1024 && i < 3) { n /= 1024; i += 1; }
  return `${n.toFixed(i ? 1 : 0)} ${unites[i]}`;
};

// Valeur pour <input type="datetime-local">
export const versChampDateHeure = (d) => {
  const x = new Date(d);
  x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
  return x.toISOString().slice(0, 16);
};

export const typeFichier = (nom = "") => {
  const ext = nom.split(".").pop().toLowerCase();
  const types = { pdf: "PDF Document", zip: "Archive ZIP", doc: "Document Word", docx: "Document Word", xls: "Feuille Excel",
    xlsx: "Feuille Excel", ppt: "Présentation", pptx: "Présentation", png: "Image", jpg: "Image", jpeg: "Image", txt: "Texte" };
  return types[ext] || (ext ? `Fichier ${ext.toUpperCase()}` : "Fichier");
};

const COULEURS = ["#3b82f6", "#e8761f", "#10b981", "#a855f7", "#14b8a6", "#ef4444", "#eab308"];
export const couleurDe = (cle = "") => {
  let h = 0;
  for (const c of String(cle)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return COULEURS[h % COULEURS.length];
};

export const libelleSemaine = (lundi) => {
  const fin = plusJours(lundi, 4);
  return `Semaine du ${lundi.getDate()} au ${fin.getDate()} ${fin.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`;
};

// ===== Super admin =====
export const depuis = (d) => {
  if (!d) return "Jamais";
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if (s < 60) return "À l'instant";
  if (s < 3600) return `Il y a ${Math.floor(s / 60)} min`;
  if (s < 86400) return `Il y a ${Math.floor(s / 3600)} h`;
  if (s < 172800) return "Hier";
  return dateFr(d);
};

export const dureeUptime = (sec = 0) => {
  const j = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return j ? `${j} j ${h} h` : h ? `${h} h ${m} min` : `${m} min`;
};

export const appareil = (ua = "") => {
  const nav = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "Navigateur";
  const os = /Windows/.test(ua) ? "Windows" : /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : /Mac OS X/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "Autre";
  return `${nav} / ${os}`;
};

// Identifiant de la session en cours, lu dans le jeton de connexion
export const sidCourant = () => {
  try {
    const charge = localStorage.getItem("token").split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(charge)).sid;
  } catch {
    return null;
  }
};

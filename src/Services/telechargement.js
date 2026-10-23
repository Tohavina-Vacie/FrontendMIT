import { ORIGINE } from "./api";

// Télécharge un fichier protégé (le jeton de connexion est envoyé dans l'en-tête)
export async function telecharger(chemin, params, nomFichier) {
  const filtres = Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v));
  const qs = Object.keys(filtres).length ? `?${new URLSearchParams(filtres)}` : "";
  const res = await fetch(`${ORIGINE}/api${chemin}${qs}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.message || `Erreur ${res.status}`);
  }
  const url = URL.createObjectURL(await res.blob());
  const a = document.createElement("a");
  a.href = url;
  a.download = nomFichier;
  a.click();
  URL.revokeObjectURL(url);
}

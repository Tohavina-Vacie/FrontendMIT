// Adapte VITE_API_URL dans .env (ex: VITE_API_URL=http://localhost:5000/api)
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const ORIGINE = BASE.replace(/\/api$/, "");

export const urlFichier = (chemin) =>
  !chemin
    ? null
    : chemin.startsWith("http")
      ? chemin
      : `${ORIGINE}/${chemin.replace(/^\/+/, "")}`;

export async function api(chemin, { method = "GET", body, params } = {}) {
  const token = localStorage.getItem("token");
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const estFormData = body instanceof FormData;
  if (body && !estFormData) headers["Content-Type"] = "application/json";

  const filtres = params
    ? Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    : {};
  const qs = Object.keys(filtres).length
    ? "?" + new URLSearchParams(filtres)
    : "";

  const res = await fetch(`${BASE}${chemin}${qs}`, {
    method,
    headers,
    body: body ? (estFormData ? body : JSON.stringify(body)) : undefined,
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth:expire"));
    }
    const erreur = new Error(data.message || `Erreur ${res.status} sur ${chemin}`);
    erreur.donnees = data; // détails renvoyés par le serveur (ex. conflits)
    erreur.status = res.status;
    throw erreur;
  }
  return data;
}

import { useCallback, useEffect, useState } from "react";
import { api } from "../../services/api";
import { telecharger } from "../../services/telechargement";
import Icone from "../../assets/Components/Icone";
import { dateFr, nomPersonne } from "../../services/format";

const SEVERITES = { INFO: ["vert", "Info"], WARNING: ["orange", "Alerte"], ERROR: ["rouge", "Erreur"] };
const ACTIONS = ["Connexion", "Échec connexion", "Création utilisateur", "Modification utilisateur", "Suppression utilisateur", "Désignation administrateur",
  "Retrait des droits admin", "Désactivation administrateur", "Réactivation administrateur", "Réinitialisation mot de passe", "Suppression administrateur",
  "Déconnexion globale", "Déconnexion d'une session", "Modification de la configuration"];
const PAR_PAGE = 15;
const heureLongue = (d) => new Date(d).toLocaleTimeString("fr-FR");

const versParams = (f) => ({
  severite: f.severite,
  action: f.action,
  du: f.du ? new Date(`${f.du}T00:00:00`).toISOString() : "",
  au: f.au ? new Date(`${f.au}T23:59:59.999`).toISOString() : "",
});

export default function LogsSuper() {
  const [filtres, setFiltres] = useState({ severite: "", action: "", du: "", au: "" });
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [erreur, setErreur] = useState("");

  const charger = useCallback(() => {
    api("/super-admin/logs", { params: { ...versParams(filtres), page, limite: PAR_PAGE } }).then(setData).catch((e) => setErreur(e.message));
  }, [filtres, page]);
  useEffect(() => { charger(); }, [charger]);

  const filtrer = (n) => (e) => { setFiltres({ ...filtres, [n]: e.target.value }); setPage(1); };

  const exporter = async () => {
    setErreur("");
    try { await telecharger("/super-admin/logs/export", versParams(filtres), "logs.csv"); } catch (err) { setErreur(err.message); }
  };

  return (
    <>
      <div className="dash-entete-page">
        <div>
          <h1 className="dash-titre">Logs</h1>
          <p className="dash-sous">Journal des actions, des connexions et des erreurs de la plateforme.</p>
        </div>
        <button type="button" className="dash-btn" onClick={exporter}><Icone nom="download" /> Exporter CSV</button>
      </div>

      <div className="dash-filtres">
        <div>
          <label htmlFor="l-sev">Sévérité</label>
          <select id="l-sev" className="form-select" value={filtres.severite} onChange={filtrer("severite")}>
            <option value="">Toutes</option><option value="INFO">Info</option><option value="WARNING">Alerte</option><option value="ERROR">Erreur</option>
          </select>
        </div>
        <div>
          <label htmlFor="l-act">Action</label>
          <select id="l-act" className="form-select" value={filtres.action} onChange={filtrer("action")}>
            <option value="">Toutes les actions</option>
            {ACTIONS.map((a) => <option key={a}>{a}</option>)}
          </select>
        </div>
        <div><label htmlFor="l-du">Du</label><input id="l-du" type="date" className="form-control" value={filtres.du} onChange={filtrer("du")} /></div>
        <div><label htmlFor="l-au">Au</label><input id="l-au" type="date" className="form-control" value={filtres.au} onChange={filtrer("au")} /></div>
      </div>

      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <section className="dash-carte">
        <div className="dash-table-zone">
          <table className="dash-table">
            <thead><tr><th>Horodatage</th><th>Utilisateur</th><th>Action</th><th>Détails</th><th>IP</th><th>Sévérité</th></tr></thead>
            <tbody>
              {(data?.logs || []).map((l) => {
                const [couleur, libelle] = SEVERITES[l.severite] || ["gris", l.severite];
                return (
                  <tr key={l._id}>
                    <td style={{ whiteSpace: "nowrap" }}>{dateFr(l.createdAt)} {heureLongue(l.createdAt)}</td>
                    <td>{nomPersonne(l.utilisateur) || l.email_tente || "Système"}</td>
                    <td><strong>{l.action}</strong></td>
                    <td style={{ color: "#8c9bbd", maxWidth: 280, wordBreak: "break-word" }}>{l.details || "—"}</td>
                    <td>{l.ip || "—"}</td>
                    <td><span className={`dash-tag ${couleur}`}>{libelle}</span></td>
                  </tr>
                );
              })}
              {data && data.logs.length === 0 && <tr><td colSpan="6" className="dash-vide">Aucune entrée pour ces filtres.</td></tr>}
              {!data && !erreur && <tr><td colSpan="6" className="dash-vide">Chargement…</td></tr>}
            </tbody>
          </table>
        </div>
        {data && (
          <div className="dash-pagination">
            <span>{data.total} entrée(s) · page {data.page} sur {Math.max(1, data.pages)}</span>
            <div className="d-flex gap-2">
              <button type="button" className="dash-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>Précédent</button>
              <button type="button" className="dash-btn principal" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Suivant</button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

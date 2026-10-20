import { useCallback, useEffect, useState } from "react";
import { api, urlFichier } from "../../services/api";
import Icone from "../../assets/Components/Icone";
import Modale, { Champ } from "../../assets/Components/Modale";
import { dateFr, nomPersonne } from "../../services/format";

const VIDE = { titre: "", description: "", entreprise: "", statut: "ouverte" };
const STATUTS = { en_attente: "En attente", acceptee: "Acceptée", refusee: "Refusée" };

export default function AlternanceAdmin() {
  const [onglet, setOnglet] = useState("offres");
  const [offres, setOffres] = useState([]);
  const [candidatures, setCandidatures] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [edition, setEdition] = useState(null);
  const [erreur, setErreur] = useState("");

  const charger = useCallback(() => {
    api("/offres").then(setOffres).catch((e) => setErreur(e.message));
    api("/candidatures").then(setCandidatures).catch((e) => setErreur(e.message));
  }, []);
  useEffect(() => { charger(); }, [charger]);
  useEffect(() => { api("/entreprises").then(setEntreprises).catch(() => {}); }, []);

  const fermer = () => { setEdition(null); setErreur(""); };
  const maj = (n) => (e) => setEdition({ ...edition, [n]: e.target.value });

  const enregistrer = async (e) => {
    e.preventDefault();
    setErreur("");
    const { id, ...body } = edition;
    try {
      if (id) await api(`/offres/${id}`, { method: "PUT", body });
      else await api("/offres", { method: "POST", body });
      fermer();
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };
  const agir = async (fn) => {
    setErreur("");
    try { await fn(); charger(); } catch (err) { setErreur(err.message); }
  };
  const enAttente = candidatures.filter((c) => c.statut === "en_attente").length;

  return (
    <>
      <div className="dash-entete-page">
        <div>
          <h1 className="dash-titre">Offres &amp; Candidatures</h1>
          <p className="dash-sous">Publiez les offres d'alternance et traitez les candidatures des étudiants.</p>
        </div>
        {onglet === "offres" && <button type="button" className="dash-btn principal" onClick={() => setEdition({ ...VIDE })}><Icone nom="plus" /> Nouvelle offre</button>}
      </div>

      <div className="dash-onglets" role="tablist">
        <button type="button" className={onglet === "offres" ? "actif" : ""} onClick={() => setOnglet("offres")}>Offres ({offres.length})</button>
        <button type="button" className={onglet === "candidatures" ? "actif" : ""} onClick={() => setOnglet("candidatures")}>Candidatures ({enAttente} en attente)</button>
      </div>

      {erreur && !edition && <div className="alert alert-danger">{erreur}</div>}

      {onglet === "offres" && (
        <section className="dash-carte">
          <div className="dash-table-zone">
            <table className="dash-table">
              <thead><tr><th>Offre</th><th>Entreprise</th><th>Publiée le</th><th>Statut</th><th></th></tr></thead>
              <tbody>
                {offres.map((o) => (
                  <tr key={o._id}>
                    <td><strong>{o.titre}</strong></td>
                    <td>{o.entreprise?.nom || "—"}</td>
                    <td>{dateFr(o.date_publication)}</td>
                    <td><span className={`dash-tag ${o.statut === "ouverte" ? "vert" : "gris"}`}>{o.statut === "ouverte" ? "Ouverte" : "Fermée"}</span></td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <button type="button" className="dash-mini-btn" aria-label={`Modifier ${o.titre}`}
                        onClick={() => setEdition({ id: o._id, titre: o.titre, description: o.description, entreprise: o.entreprise?._id || "", statut: o.statut })}><Icone nom="edit" taille={15} /></button>
                      <button type="button" className="dash-mini-btn" aria-label={`Supprimer ${o.titre}`}
                        onClick={() => window.confirm(`Supprimer l'offre « ${o.titre} » ?`) && agir(() => api(`/offres/${o._id}`, { method: "DELETE" }))}><Icone nom="trash" taille={15} /></button>
                    </td>
                  </tr>
                ))}
                {offres.length === 0 && <tr><td colSpan="5" className="dash-vide">Aucune offre publiée.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {onglet === "candidatures" && (
        <section className="dash-carte">
          <div className="dash-table-zone">
            <table className="dash-table">
              <thead><tr><th>Candidat</th><th>Offre</th><th>Date</th><th>CV</th><th>Statut</th><th></th></tr></thead>
              <tbody>
                {candidatures.map((c) => (
                  <tr key={c._id}>
                    <td><strong>{nomPersonne(c.utilisateur) || "Compte supprimé"}</strong><small className="d-block" style={{ color: "#8c9bbd" }}>{c.utilisateur?.email}</small></td>
                    <td>{c.offre?.titre || "Offre supprimée"}</td>
                    <td>{dateFr(c.date_candidature)}</td>
                    <td><a href={urlFichier(c.cv)} target="_blank" rel="noreferrer" style={{ color: "#e8761f" }}>Voir le CV</a></td>
                    <td>
                      <select className="form-select form-select-sm w-auto" aria-label="Statut de la candidature" value={c.statut}
                        onChange={(e) => agir(() => api(`/candidatures/${c._id}`, { method: "PUT", body: { statut: e.target.value } }))}>
                        {Object.entries(STATUTS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button type="button" className="dash-mini-btn" aria-label="Supprimer la candidature"
                        onClick={() => window.confirm("Supprimer cette candidature ?") && agir(() => api(`/candidatures/${c._id}`, { method: "DELETE" }))}><Icone nom="trash" taille={15} /></button>
                    </td>
                  </tr>
                ))}
                {candidatures.length === 0 && <tr><td colSpan="6" className="dash-vide">Aucune candidature.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {edition && (
        <Modale large titre={edition.id ? "Modifier l'offre" : "Nouvelle offre"} onSubmit={enregistrer} onClose={fermer} erreur={erreur}>
          <Champ id="o-titre" label="Titre"><input id="o-titre" className="form-control" required placeholder="Ex : Alternant développeur web" value={edition.titre} onChange={maj("titre")} /></Champ>
          <div className="row">
            <Champ id="o-ent" label="Entreprise" className="col-sm-6 mb-3">
              <select id="o-ent" className="form-select" required value={edition.entreprise} onChange={maj("entreprise")}>
                <option value="" disabled>Choisissez une entreprise</option>
                {entreprises.map((en) => <option key={en._id} value={en._id}>{en.nom}</option>)}
              </select>
            </Champ>
            <Champ id="o-statut" label="Statut" className="col-sm-6 mb-3">
              <select id="o-statut" className="form-select" value={edition.statut} onChange={maj("statut")}><option value="ouverte">Ouverte</option><option value="fermee">Fermée</option></select>
            </Champ>
          </div>
          <Champ id="o-desc" label="Description"><textarea id="o-desc" rows="5" className="form-control" required value={edition.description} onChange={maj("description")} /></Champ>
        </Modale>
      )}
    </>
  );
}

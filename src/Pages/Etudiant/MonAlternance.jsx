import { useCallback, useEffect, useState } from "react";
import { api } from "../../services/api";
import Modale, { Champ } from "../../assets/Components/Modale";
import { dateFr, nomPersonne } from "../../services/format";

const CONVENTIONS = { active: ["vert", "Active"], validation: ["orange", "En validation"], terminee: ["gris", "Terminée"], annulee: ["gris", "Annulée"] };
const CANDIDATURES = { en_attente: ["orange", "En attente"], acceptee: ["vert", "Acceptée"], refusee: ["rouge", "Refusée"] };

export default function MonAlternance() {
  const [onglet, setOnglet] = useState("offres");
  const [offres, setOffres] = useState(null);
  const [candidatures, setCandidatures] = useState([]);
  const [conventions, setConventions] = useState([]);
  const [postuler, setPostuler] = useState(null); // offre choisie
  const [cv, setCv] = useState(null);
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");

  const charger = useCallback(() => {
    api("/offres").then(setOffres).catch((e) => setErreur(e.message));
    api("/candidatures/mes-candidatures").then(setCandidatures).catch(() => {});
    api("/conventions/mes-conventions").then(setConventions).catch(() => {});
  }, []);
  useEffect(() => { charger(); }, [charger]);

  const dejaCandidat = (offreId) => candidatures.some((c) => c.offre?._id === offreId);

  const envoyer = async (e) => {
    e.preventDefault();
    setErreur("");
    const fd = new FormData();
    fd.append("offre", postuler._id);
    fd.append("cv", cv);
    try {
      await api("/candidatures", { method: "POST", body: fd });
      setPostuler(null);
      setCv(null);
      setMessage("Votre candidature a bien été envoyée.");
      setOnglet("candidatures");
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  const ouvertes = (offres || []).filter((o) => o.statut === "ouverte");

  return (
    <>
      <h1 className="dash-titre">Alternance</h1>
      <p className="dash-sous">Offres, candidatures et conventions d'alternance.</p>

      <div className="dash-onglets" role="tablist">
        {[["offres", `Offres (${ouvertes.length})`], ["candidatures", `Mes candidatures (${candidatures.length})`], ["conventions", `Conventions (${conventions.length})`]].map(([id, label]) => (
          <button type="button" key={id} className={onglet === id ? "actif" : ""} onClick={() => { setOnglet(id); setMessage(""); }}>{label}</button>
        ))}
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {erreur && !postuler && <div className="alert alert-danger">{erreur}</div>}

      {onglet === "offres" && (
        <div className="dash-grille-cours">
          {!offres && !erreur && <p className="dash-sous">Chargement…</p>}
          {offres && ouvertes.length === 0 && <div className="dash-carte"><p className="dash-vide">Aucune offre ouverte pour le moment.</p></div>}
          {ouvertes.map((o) => (
            <article className="dash-carte" key={o._id}>
              <span className="dash-tag orange">{o.entreprise?.nom || "Entreprise"}</span>
              <h3>{o.titre}</h3>
              <small>Publiée le {dateFr(o.date_publication)}</small>
              <p className="mt-2" style={{ color: "#c3cde6", fontSize: ".88rem", whiteSpace: "pre-line" }}>{o.description}</p>
              <button type="button" className="dash-btn principal" disabled={dejaCandidat(o._id)} onClick={() => { setErreur(""); setPostuler(o); }}>
                {dejaCandidat(o._id) ? "Déjà candidat" : "Postuler"}
              </button>
            </article>
          ))}
        </div>
      )}

      {onglet === "candidatures" && (
        <section className="dash-carte">
          <div className="dash-table-zone">
            <table className="dash-table">
              <thead><tr><th>Offre</th><th>Entreprise</th><th>Date</th><th>Statut</th></tr></thead>
              <tbody>
                {candidatures.map((c) => {
                  const [couleur, libelle] = CANDIDATURES[c.statut] || ["gris", c.statut];
                  return (
                    <tr key={c._id}>
                      <td><strong>{c.offre?.titre || "Offre supprimée"}</strong></td>
                      <td>{c.offre?.entreprise?.nom || "—"}</td>
                      <td>{dateFr(c.date_candidature)}</td>
                      <td><span className={`dash-tag ${couleur}`}>{libelle}</span></td>
                    </tr>
                  );
                })}
                {candidatures.length === 0 && <tr><td colSpan="4" className="dash-vide">Vous n'avez pas encore postulé.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {onglet === "conventions" && (
        <div className="dash-grille-cours">
          {conventions.length === 0 && <div className="dash-carte"><p className="dash-vide">Aucune convention pour le moment. L'administration la créera dès que votre entreprise d'accueil sera confirmée.</p></div>}
          {conventions.map((c) => {
            const [couleur, libelle] = CONVENTIONS[c.statut] || ["gris", c.statut];
            return (
              <article className="dash-carte" key={c._id}>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="dash-tag orange">{c.type === "stage" ? "Stage" : "Alternance"}</span>
                  <span className={`dash-tag ${couleur}`}>{libelle}</span>
                </div>
                <h3>{c.entreprise?.nom || "Entreprise"}</h3>
                <small>{c.poste}</small>
                <dl className="dash-infos mt-3 mb-0">
                  <div><dt>Début</dt><dd>{dateFr(c.date_debut)}</dd></div>
                  <div><dt>Fin</dt><dd>{dateFr(c.date_fin)}</dd></div>
                  <div className="large"><dt>Tuteur pédagogique</dt><dd>{nomPersonne(c.tuteur) || "Non désigné"}</dd></div>
                </dl>
              </article>
            );
          })}
        </div>
      )}

      {postuler && (
        <Modale titre={`Postuler : ${postuler.titre}`} envoi="Envoyer ma candidature" onSubmit={envoyer} onClose={() => { setPostuler(null); setCv(null); setErreur(""); }} erreur={erreur}>
          <p style={{ color: "#c9d6f5" }}>{postuler.entreprise?.nom}</p>
          <Champ id="cv" label="Votre CV" className="mb-4">
            <input id="cv" type="file" className="form-control" required accept=".pdf,.doc,.docx" onChange={(e) => setCv(e.target.files[0])} />
            <small style={{ color: "#8c9bbd" }}>PDF ou Word — 5 Mo maximum.</small>
          </Champ>
        </Modale>
      )}
    </>
  );
}

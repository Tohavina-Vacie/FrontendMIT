import { useCallback, useEffect, useState } from "react";
import { api } from "../../services/api";
import Icone from "../../assets/Components/Icone";
import Modale, { Champ } from "../../assets/Components/Modale";
import { dateFr, heure, nomPersonne, plusJours } from "../../services/format";

const jourChamp = (d) => new Date(d).toISOString().slice(0, 10);

export default function AbsencesAdmin() {
  const [absences, setAbsences] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [filtres, setFiltres] = useState({ etudiant: "", justifiee: "" });
  const [ajout, setAjout] = useState(null);
  const [seances, setSeances] = useState([]);
  const [edition, setEdition] = useState(null);
  const [erreur, setErreur] = useState("");

  const charger = useCallback(() => {
    api("/absences", { params: filtres }).then(setAbsences).catch((e) => setErreur(e.message));
  }, [filtres]);
  useEffect(() => { charger(); }, [charger]);
  useEffect(() => { api("/users", { params: { role: "etudiant" } }).then(setEtudiants).catch(() => {}); }, []);

  // Séances récentes de la promotion de l'étudiant choisi
  useEffect(() => {
    setSeances([]);
    const etu = etudiants.find((u) => u.id === ajout?.etudiant);
    const formation = etu?.formation?._id || etu?.formation;
    if (!formation || !etu?.niveau) return;
    api("/seances", { params: { formation, niveau: etu.niveau, du: plusJours(new Date(), -45).toISOString(), au: plusJours(new Date(), 1).toISOString() } })
      .then((l) => setSeances([...l].reverse())).catch(() => {});
  }, [ajout?.etudiant, etudiants]);

  const fermer = () => { setAjout(null); setEdition(null); setErreur(""); };

  const enregistrerAjout = async (e) => {
    e.preventDefault();
    setErreur("");
    const body = { etudiant: ajout.etudiant };
    if (ajout.seance) body.seance = ajout.seance;
    if (ajout.date) body.date = new Date(ajout.date).toISOString();
    if (ajout.motif) body.motif = ajout.motif;
    try {
      await api("/absences", { method: "POST", body });
      fermer();
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };
  const enregistrerEdition = async (e) => {
    e.preventDefault();
    setErreur("");
    try {
      await api(`/absences/${edition.id}`, { method: "PUT", body: { justifiee: edition.justifiee, motif: edition.motif } });
      fermer();
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };
  const supprimer = async (a) => {
    if (!window.confirm("Supprimer cette absence ?")) return;
    try {
      await api(`/absences/${a._id}`, { method: "DELETE" });
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  return (
    <>
      <div className="dash-entete-page">
        <div>
          <h1 className="dash-titre">Absences</h1>
          <p className="dash-sous">Enregistrez les absences et gérez leur justification.</p>
        </div>
        <button type="button" className="dash-btn principal" onClick={() => setAjout({ etudiant: "", seance: "", date: jourChamp(new Date()), motif: "" })}><Icone nom="plus" /> Enregistrer une absence</button>
      </div>

      <div className="dash-filtres">
        <div>
          <label htmlFor="ab-etu">Étudiant</label>
          <select id="ab-etu" className="form-select" value={filtres.etudiant} onChange={(e) => setFiltres({ ...filtres, etudiant: e.target.value })}>
            <option value="">Tous les étudiants</option>
            {etudiants.map((u) => <option key={u.id} value={u.id}>{nomPersonne(u)}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="ab-just">Justification</label>
          <select id="ab-just" className="form-select" value={filtres.justifiee} onChange={(e) => setFiltres({ ...filtres, justifiee: e.target.value })}>
            <option value="">Toutes</option>
            <option value="false">Non justifiées</option>
            <option value="true">Justifiées</option>
          </select>
        </div>
      </div>

      {erreur && !ajout && !edition && <div className="alert alert-danger">{erreur}</div>}

      <section className="dash-carte">
        <div className="dash-table-zone">
          <table className="dash-table">
            <thead><tr><th>Étudiant</th><th>Cours</th><th>Date</th><th>Motif</th><th>Statut</th><th></th></tr></thead>
            <tbody>
              {absences.map((a) => (
                <tr key={a._id}>
                  <td><strong>{nomPersonne(a.etudiant) || "Compte supprimé"}</strong><small className="d-block" style={{ color: "#8c9bbd" }}>{a.etudiant?.numero_etudiant}</small></td>
                  <td>{a.seance?.cours?.titre || "—"}</td>
                  <td>{dateFr(a.date)}</td>
                  <td>{a.motif || "—"}</td>
                  <td><span className={`dash-tag ${a.justifiee ? "vert" : "rouge"}`}>{a.justifiee ? "Justifiée" : "Non justifiée"}</span></td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <button type="button" className="dash-mini-btn" aria-label="Modifier l'absence" onClick={() => setEdition({ id: a._id, justifiee: a.justifiee, motif: a.motif || "" })}><Icone nom="edit" taille={15} /></button>
                    <button type="button" className="dash-mini-btn" aria-label="Supprimer l'absence" onClick={() => supprimer(a)}><Icone nom="trash" taille={15} /></button>
                  </td>
                </tr>
              ))}
              {absences.length === 0 && <tr><td colSpan="6" className="dash-vide">Aucune absence.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {ajout && (
        <Modale titre="Enregistrer une absence" onSubmit={enregistrerAjout} onClose={fermer} erreur={erreur}>
          <Champ id="aa-etu" label="Étudiant">
            <select id="aa-etu" className="form-select" required value={ajout.etudiant} onChange={(e) => setAjout({ ...ajout, etudiant: e.target.value, seance: "" })}>
              <option value="" disabled>Choisissez un étudiant</option>
              {etudiants.map((u) => <option key={u.id} value={u.id}>{nomPersonne(u)}</option>)}
            </select>
          </Champ>
          <Champ id="aa-seance" label="Séance (optionnel)">
            <select id="aa-seance" className="form-select" value={ajout.seance} onChange={(e) => setAjout({ ...ajout, seance: e.target.value })} disabled={!seances.length}>
              <option value="">{seances.length ? "— Aucune séance précise —" : "Aucune séance récente trouvée"}</option>
              {seances.map((s) => <option key={s._id} value={s._id}>{s.cours?.titre} — {dateFr(s.debut)} {heure(s.debut)}</option>)}
            </select>
          </Champ>
          <Champ id="aa-date" label="Date"><input id="aa-date" type="date" className="form-control" value={ajout.date} onChange={(e) => setAjout({ ...ajout, date: e.target.value })} /></Champ>
          <Champ id="aa-motif" label="Motif (optionnel)"><input id="aa-motif" className="form-control" placeholder="Ex : maladie" value={ajout.motif} onChange={(e) => setAjout({ ...ajout, motif: e.target.value })} /></Champ>
        </Modale>
      )}

      {edition && (
        <Modale titre="Modifier l'absence" onSubmit={enregistrerEdition} onClose={fermer} erreur={erreur}>
          <div className="form-check mb-3">
            <input id="ae-just" type="checkbox" className="form-check-input" checked={edition.justifiee} onChange={(e) => setEdition({ ...edition, justifiee: e.target.checked })} />
            <label htmlFor="ae-just" className="form-check-label">Absence justifiée</label>
          </div>
          <Champ id="ae-motif" label="Motif"><input id="ae-motif" className="form-control" value={edition.motif} onChange={(e) => setEdition({ ...edition, motif: e.target.value })} /></Champ>
        </Modale>
      )}
    </>
  );
}

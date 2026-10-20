import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import Icone from "../../assets/Components/Icone";
import Modale, { Champ } from "../../assets/Components/Modale";
import { dateFr, nomPersonne } from "../../services/format";

const STATUTS = { active: ["vert", "Active"], validation: ["orange", "En validation"], terminee: ["gris", "Terminée"], annulee: ["gris", "Annulée"] };
const jourChamp = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");
const VIDE = { etudiant: "", entreprise: "", poste: "", type: "alternance", date_debut: "", date_fin: "", tuteur: "", statut: "validation" };

export default function StagesAdmin() {
  const [stats, setStats] = useState(null);
  const [conventions, setConventions] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [filtre, setFiltre] = useState("");
  const [edition, setEdition] = useState(null);
  const [erreur, setErreur] = useState("");

  const charger = useCallback(() => {
    api("/conventions/stats").then(setStats).catch((e) => setErreur(e.message));
    api("/conventions", { params: { statut: filtre } }).then(setConventions).catch((e) => setErreur(e.message));
  }, [filtre]);
  useEffect(() => { charger(); }, [charger]);
  useEffect(() => {
    api("/entreprises").then(setEntreprises).catch(() => {});
    api("/users", { params: { role: "etudiant" } }).then(setEtudiants).catch(() => {});
    api("/users", { params: { role: "enseignant" } }).then(setEnseignants).catch(() => {});
  }, []);

  const maj = (n) => (e) => setEdition({ ...edition, [n]: e.target.value });
  const fermer = () => { setEdition(null); setErreur(""); };

  const enregistrer = async (e) => {
    e.preventDefault();
    setErreur("");
    const body = Object.fromEntries(Object.entries(edition).filter(([k, v]) => k !== "id" && v !== ""));
    try {
      if (edition.id) await api(`/conventions/${edition.id}`, { method: "PUT", body });
      else await api("/conventions", { method: "POST", body });
      fermer();
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };
  const supprimer = async (c) => {
    if (!window.confirm("Supprimer cette convention ?")) return;
    try {
      await api(`/conventions/${c._id}`, { method: "DELETE" });
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };
  const modifier = (c) => setEdition({ id: c._id, etudiant: c.etudiant?._id || "", entreprise: c.entreprise?._id || "", poste: c.poste, type: c.type || "alternance",
    date_debut: jourChamp(c.date_debut), date_fin: jourChamp(c.date_fin), tuteur: c.tuteur?._id || "", statut: c.statut });

  return (
    <>
      <div className="dash-entete-page">
        <div>
          <h1 className="dash-titre">Stages &amp; Alternance</h1>
          <p className="dash-sous">MIT Madagascar — Suivi des placements professionnels.</p>
        </div>
        <button type="button" className="dash-btn principal" onClick={() => setEdition({ ...VIDE })}><Icone nom="plus" /> Nouvelle convention</button>
      </div>
      {erreur && !edition && <div className="alert alert-danger">{erreur}</div>}

      {stats && (
        <div className="dash-stats">
          <div className="dash-carte dash-stat"><div className="titre">Alternants placés</div><div className="valeur">{stats.alternants_places}</div><div className="sous">Avec une convention active</div></div>
          <div className="dash-carte dash-stat"><div className="titre">En recherche active</div><div className="valeur">{stats.en_recherche_active}</div><div className="sous">Sans convention active</div></div>
          <div className="dash-carte dash-stat"><div className="titre">Conventions signées</div><div className="valeur">{stats.conventions_signees}</div><div className="sous">{stats.conventions_en_validation} en validation</div></div>
        </div>
      )}

      <div className="dash-colonnes">
        <section className="dash-carte">
          <h2>Conventions et stages
            <select className="form-select w-auto" aria-label="Filtrer par statut" value={filtre} onChange={(e) => setFiltre(e.target.value)}>
              <option value="">Tous les statuts</option>
              {Object.entries(STATUTS).map(([v, [, l]]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </h2>
          <div className="dash-table-zone">
            <table className="dash-table">
              <thead><tr><th>Étudiant</th><th>Entreprise</th><th>Poste</th><th>Période</th><th>Tuteur</th><th>Statut</th><th></th></tr></thead>
              <tbody>
                {conventions.map((c) => {
                  const [couleur, libelle] = STATUTS[c.statut] || ["gris", c.statut];
                  return (
                    <tr key={c._id}>
                      <td><strong>{nomPersonne(c.etudiant) || "—"}</strong></td>
                      <td>{c.entreprise?.nom || "—"}</td>
                      <td>{c.poste}<small className="d-block" style={{ color: "#8c9bbd" }}>{c.type === "stage" ? "Stage" : "Alternance"}</small></td>
                      <td style={{ whiteSpace: "nowrap" }}>{dateFr(c.date_debut)} → {dateFr(c.date_fin)}</td>
                      <td>{nomPersonne(c.tuteur) || "—"}</td>
                      <td><span className={`dash-tag ${couleur}`}>{libelle}</span></td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <button type="button" className="dash-mini-btn" aria-label="Modifier la convention" onClick={() => modifier(c)}><Icone nom="edit" taille={15} /></button>
                        <button type="button" className="dash-mini-btn" aria-label="Supprimer la convention" onClick={() => supprimer(c)}><Icone nom="trash" taille={15} /></button>
                      </td>
                    </tr>
                  );
                })}
                {conventions.length === 0 && <tr><td colSpan="7" className="dash-vide">Aucune convention.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dash-carte">
          <h2>Entreprises partenaires <Link to="/admin/entreprises">Gérer</Link></h2>
          {(stats?.entreprises_partenaires || []).map((e) => (
            <div className="dash-ligne" key={e.entreprise._id}>
              <div><strong>{e.entreprise.nom}</strong><small>{e.alternants} alternant(s)</small></div>
            </div>
          ))}
          {(stats?.entreprises_partenaires || []).length === 0 && <p className="dash-vide">Aucune entreprise n'accueille d'alternant pour le moment.</p>}
        </section>
      </div>

      {edition && (
        <Modale large titre={edition.id ? "Modifier la convention" : "Nouvelle convention"} onSubmit={enregistrer} onClose={fermer} erreur={erreur}>
          <div className="row">
            <Champ id="cv-etu" label="Étudiant" className="col-sm-6 mb-3">
              <select id="cv-etu" className="form-select" required value={edition.etudiant} onChange={maj("etudiant")}>
                <option value="" disabled>Choisissez un étudiant</option>
                {etudiants.map((u) => <option key={u.id} value={u.id}>{nomPersonne(u)}</option>)}
              </select>
            </Champ>
            <Champ id="cv-ent" label="Entreprise" className="col-sm-6 mb-3">
              <select id="cv-ent" className="form-select" required value={edition.entreprise} onChange={maj("entreprise")}>
                <option value="" disabled>Choisissez une entreprise</option>
                {entreprises.map((e) => <option key={e._id} value={e._id}>{e.nom}</option>)}
              </select>
            </Champ>
            <Champ id="cv-poste" label="Poste" className="col-sm-6 mb-3"><input id="cv-poste" className="form-control" required placeholder="Ex : Développeur web junior" value={edition.poste} onChange={maj("poste")} /></Champ>
            <Champ id="cv-type" label="Type" className="col-sm-6 mb-3">
              <select id="cv-type" className="form-select" value={edition.type} onChange={maj("type")}><option value="alternance">Alternance</option><option value="stage">Stage</option></select>
            </Champ>
            <Champ id="cv-deb" label="Date de début" className="col-sm-6 mb-3"><input id="cv-deb" type="date" className="form-control" required value={edition.date_debut} onChange={maj("date_debut")} /></Champ>
            <Champ id="cv-fin" label="Date de fin" className="col-sm-6 mb-3"><input id="cv-fin" type="date" className="form-control" required value={edition.date_fin} onChange={maj("date_fin")} /></Champ>
            <Champ id="cv-tut" label="Tuteur pédagogique" className="col-sm-6 mb-3">
              <select id="cv-tut" className="form-select" value={edition.tuteur} onChange={maj("tuteur")}>
                <option value="">— Aucun —</option>
                {enseignants.map((u) => <option key={u.id} value={u.id}>{nomPersonne(u)}</option>)}
              </select>
            </Champ>
            <Champ id="cv-stat" label="Statut" className="col-sm-6 mb-3">
              <select id="cv-stat" className="form-select" value={edition.statut} onChange={maj("statut")}>
                {Object.entries(STATUTS).map(([v, [, l]]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </Champ>
          </div>
        </Modale>
      )}
    </>
  );
}

import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../Context/AuthContext";
import Icone from "../../assets/Components/Icone";

const valeur = (v) => (v === null || v === undefined ? "—" : v);
const couleur = (m) => (m == null ? "gris" : m >= 14 ? "vert" : m >= 10 ? "orange" : "rouge");

export default function MesNotes() {
  const { user } = useAuth();
  const formationId = user.formation?._id || user.formation;
  const [semestres, setSemestres] = useState([]);
  const [semestre, setSemestre] = useState("");
  const [d, setD] = useState(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    if (!formationId || !user.niveau) return;
    api("/cours", { params: { formation: formationId, niveau: user.niveau } })
      .then((c) => setSemestres([...new Set(c.map((x) => x.semestre))].sort()))
      .catch(() => {});
  }, [formationId, user.niveau]);

  useEffect(() => {
    setD(null);
    setErreur("");
    api("/notes/mes-notes", { params: { semestre } }).then(setD).catch((e) => setErreur(e.message));
  }, [semestre]);

  return (
    <>
      <div className="dash-entete-page">
        <div>
          <h1 className="dash-titre">Mes Notes</h1>
          <p className="dash-sous">Relevé de notes, coefficients et validation des crédits ECTS.</p>
        </div>
        {semestres.length > 0 && (
          <select className="form-select w-auto" aria-label="Semestre" value={semestre} onChange={(e) => setSemestre(e.target.value)}>
            <option value="">Tous les semestres</option>
            {semestres.map((s) => <option key={s}>{s}</option>)}
          </select>
        )}
      </div>

      {erreur && <div className="alert alert-danger">{erreur}</div>}
      {!erreur && !d && <p className="dash-sous">Chargement…</p>}

      {d && (
        <>
          <div className="dash-stats">
            <div className="dash-carte dash-stat"><div className="titre">Moyenne générale</div>
              <div className="valeur">{d.moyenne_generale != null ? `${d.moyenne_generale} / 20` : "—"}</div>
              <div className="sous">{d.mention || "Aucune note validée"}</div></div>
            <div className="dash-carte dash-stat"><div className="titre">Rang dans la promotion</div>
              <div className="valeur">{d.rang ? `${d.rang}${d.rang === 1 ? "er" : "ème"} / ${d.effectif_promotion}` : "—"}</div>
              <div className="sous">{d.rang ? "Classement de votre promotion" : "Pas encore classé"}</div></div>
            <div className="dash-carte dash-stat"><div className="titre">ECTS validés</div>
              <div className="valeur">{d.ects_valides ?? 0} / {d.ects_total ?? 0}</div>
              <div className="sous">Crédits obtenus</div></div>
          </div>

          <section className="dash-carte">
            <h2>Détail des évaluations
              <button type="button" className="dash-btn" onClick={() => window.print()}><Icone nom="printer" /> Imprimer le relevé</button>
            </h2>
            <div className="dash-table-zone">
              <table className="dash-table">
                <thead><tr><th>Matière</th><th>CC1</th><th>CC2</th><th>Examen</th><th>Moyenne</th><th>Coef.</th><th>ECTS</th><th>Statut</th></tr></thead>
                <tbody>
                  {d.notes.map((l) => (
                    <tr key={l.cours.id}>
                      <td><strong>{l.cours.titre}</strong></td>
                      <td>{valeur(l.cc1)}</td><td>{valeur(l.cc2)}</td><td>{valeur(l.examen)}</td>
                      <td><strong className="dash-note">{valeur(l.moyenne)}</strong></td>
                      <td>{l.coefficient}</td><td>{l.ects}</td>
                      <td><span className={`dash-tag ${couleur(l.moyenne)}`}>{l.statut || "En attente"}</span></td>
                    </tr>
                  ))}
                  {d.notes.length === 0 && <tr><td colSpan="8" className="dash-vide">Aucun cours pour cette période.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
}

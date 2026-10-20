import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { dateFr } from "../../services/format";

export default function MesAbsences() {
  const [d, setD] = useState(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    api("/absences/mes-absences").then(setD).catch((e) => setErreur(e.message));
  }, []);

  return (
    <>
      <h1 className="dash-titre">Mes Absences</h1>
      <p className="dash-sous">Suivi de vos absences et de leur justification.</p>
      {erreur && <div className="alert alert-danger">{erreur}</div>}
      {!d && !erreur && <p className="dash-sous">Chargement…</p>}
      {d && (
        <>
          <div className="dash-stats">
            <div className="dash-carte dash-stat"><div className="titre">Total</div><div className="valeur">{d.justifiees + d.non_justifiees}</div><div className="sous">Absences enregistrées</div></div>
            <div className="dash-carte dash-stat"><div className="titre">Justifiées</div><div className="valeur">{d.justifiees}</div><div className="sous">Acceptées par l'administration</div></div>
            <div className="dash-carte dash-stat"><div className="titre">Non justifiées</div><div className={`valeur${d.non_justifiees ? " dash-neg" : ""}`}>{d.non_justifiees}</div><div className="sous">À régulariser</div></div>
          </div>
          <section className="dash-carte">
            <h2>Historique</h2>
            <div className="dash-table-zone">
              <table className="dash-table">
                <thead><tr><th>Date</th><th>Cours</th><th>Motif</th><th>Statut</th></tr></thead>
                <tbody>
                  {d.absences.map((a) => (
                    <tr key={a._id}>
                      <td>{dateFr(a.date)}</td>
                      <td>{a.seance?.cours?.titre || "—"}</td>
                      <td>{a.motif || "—"}</td>
                      <td><span className={`dash-tag ${a.justifiee ? "vert" : "rouge"}`}>{a.justifiee ? "Justifiée" : "Non justifiée"}</span></td>
                    </tr>
                  ))}
                  {d.absences.length === 0 && <tr><td colSpan="4" className="dash-vide">Aucune absence enregistrée.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
}

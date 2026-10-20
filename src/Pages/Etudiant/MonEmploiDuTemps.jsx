import { useEffect, useState } from "react";
import { api } from "../../services/api";
import Icone from "../../assets/Components/Icone";
import GrilleSemaine, { Legende, NavSemaine } from "../../assets/Components/GrilleSemaine";
import { lundiDe, plusJours } from "../../services/format";

export default function MonEmploiDuTemps() {
  const [lundi, setLundi] = useState(lundiDe());
  const [seances, setSeances] = useState(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    setSeances(null);
    setErreur("");
    api("/seances/mon-planning", { params: { du: lundi.toISOString(), au: plusJours(lundi, 7).toISOString() } })
      .then(setSeances)
      .catch((e) => setErreur(e.message));
  }, [lundi]);

  return (
    <>
      <div className="dash-entete-page">
        <div>
          <h1 className="dash-titre">Mon Emploi du Temps</h1>
          <p className="dash-sous">Planification hebdomadaire de vos enseignements.</p>
        </div>
        <NavSemaine lundi={lundi} onChange={setLundi} />
      </div>

      {erreur && <div className="alert alert-danger">{erreur}</div>}
      {!erreur && !seances && <p className="dash-sous">Chargement…</p>}
      {seances && (
        <section className="dash-carte">
          <div className="d-flex justify-content-end mb-3">
            <button type="button" className="dash-btn" onClick={() => window.print()}><Icone nom="printer" /> Exporter en PDF</button>
          </div>
          <GrilleSemaine seances={seances} lundi={lundi} />
          <Legende seances={seances} />
        </section>
      )}
    </>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

function Stat({ titre, valeur, badge, sous }) {
  return (
    <div className="dash-carte dash-stat">
      <div className="entete">
        <span className="titre">{titre}</span>
        {badge && <span className="dash-badge">{badge}</span>}
      </div>
      <div className="valeur">{valeur}</div>
      <div className="sous">{sous}</div>
    </div>
  );
}

export default function Stages() {
  const [d, setD] = useState(null);
  const [entreprises, setEntreprises] = useState([]);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    api("/dashboard/admin").then(setD).catch((e) => setErreur(e.message));
    api("/entreprises").then(setEntreprises).catch(() => {});
  }, []);

  return (
    <>
      <h1 className="dash-titre">Stages &amp; Alternance</h1>
      <p className="dash-sous">MIT Madagascar — Suivi des placements professionnels.</p>
      {erreur && <div className="alert alert-danger">{erreur}</div>}

      {d && (
        <div className="dash-stats">
          <Stat titre="Alternants placés" valeur={d.alternance.places} badge={`${d.alternance.taux_placement}%`} sous="Des étudiants actifs" />
          <Stat titre="En recherche active" valeur={Math.max(0, d.etudiants_actifs - d.alternance.places)} sous="Étudiants sans convention active" />
          <Stat titre="Candidatures en attente" valeur={d.candidatures_en_attente} sous="À traiter" />
        </div>
      )}

      <div className="dash-colonnes">
        <section className="dash-carte">
          <h2>Conventions et stages actifs</h2>
          <p className="dash-vide">Aucune convention à afficher pour le moment.</p>
        </section>

        <section className="dash-carte">
          <h2>Entreprises partenaires <Link to="/admin/entreprises">Gérer</Link></h2>
          {entreprises.length === 0 && <p className="dash-vide">Aucune entreprise enregistrée.</p>}
          {entreprises.map((e) => (
            <div className="dash-ligne" key={e._id}>
              <div><strong>{e.nom}</strong><small>{e.secteur_activite} — {e.adresse}</small></div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}

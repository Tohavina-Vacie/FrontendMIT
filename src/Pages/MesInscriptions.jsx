import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import BadgeStatut from "../assets/Components/BadgeStatut";
import "../styles/auth.css";
import "../styles/formations.css";

const formatDate = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "—");

export default function MesInscriptions() {
  const [inscriptions, setInscriptions] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    api("/inscriptions/mes-inscriptions")
      .then(setInscriptions)
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false));
  }, []);

  return (
    <div className="cat-page">
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 className="mb-4">Mes inscriptions</h1>

        {erreur && <div className="alert alert-danger">{erreur}</div>}
        {chargement && <p>Chargement…</p>}

        {!chargement && !erreur && inscriptions.length === 0 && (
          <div className="formation-card">
            <div className="corps">
              <p>Vous n'êtes inscrit à aucune formation pour le moment.</p>
              <Link to="/catalogue" className="btn btn-orange align-self-start">Découvrir les formations</Link>
            </div>
          </div>
        )}

        <div className="d-grid gap-3">
          {inscriptions.map((i) => (
            <article className="formation-card" key={i._id}>
              <div className="corps">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <h2 className="h5 mb-0">{i.formation?.titre || "Formation supprimée"}</h2>
                  <BadgeStatut statut={i.statut} />
                </div>
                <div className="mt-3">
                  {i.formation?.niveau && <span className="pastille accent">{i.formation.niveau}</span>}
                  {i.formation?.duree && <span className="pastille">{i.formation.duree}</span>}
                  <span className="pastille">Demande du {formatDate(i.date_inscription)}</span>
                </div>
                {i.formation?._id && (
                  <Link to={`/catalogue/${i.formation._id}`} className="text-warning mt-2">Voir la formation</Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

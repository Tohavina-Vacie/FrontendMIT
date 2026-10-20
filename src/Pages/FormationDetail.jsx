import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, urlFichier } from "../services/api";
import { useAuth } from "../Context/AuthContext";
import "../styles/auth.css";
import "../styles/formations.css";

export default function FormationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [formation, setFormation] = useState(null);
  const [message, setMessage] = useState(null); // { type, texte }
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    api(`/formations/${id}`)
      .then(setFormation)
      .catch((e) => setMessage({ type: "danger", texte: e.message }));
  }, [id]);

  const sInscrire = async () => {
    setEnvoi(true);
    setMessage(null);
    try {
      await api("/inscriptions", { method: "POST", body: { formation: id } });
      setMessage({ type: "success", texte: "Votre demande d'inscription a bien été envoyée." });
    } catch (err) {
      setMessage({ type: "danger", texte: err.message });
    } finally {
      setEnvoi(false);
    }
  };

  if (!formation) {
    return <div className="cat-page container">{message ? <div className="alert alert-danger">{message.texte}</div> : "Chargement…"}</div>;
  }

  return (
    <div className="cat-page">
      <div className="container" style={{ maxWidth: 900 }}>
        <Link to="/catalogue" className="text-warning">Retour aux formations</Link>
        <h1 className="my-3">{formation.titre}</h1>

        {formation.image && <img className="detail-image mb-4" src={urlFichier(formation.image)} alt={formation.titre} />}

        <div className="mb-3">
          <span className="pastille accent">{formation.niveau}</span>
          <span className="pastille">Durée : {formation.duree}</span>
          {formation.rythme && <span className="pastille">Rythme : {formation.rythme}</span>}
          {formation.categorie && <span className="pastille">{formation.categorie}</span>}
        </div>

        <p style={{ whiteSpace: "pre-line", color: "#c9d6f5" }}>{formation.description}</p>

        {message && <div className={`alert alert-${message.type} mt-4`}>{message.texte}</div>}

        <div className="mt-4">
          {!user && <Link to="/connexion" className="btn btn-orange">Se connecter pour s'inscrire</Link>}
          {user && ["etudiant", "admin", "super_admin"].includes(user.role) && (
            <button className="btn btn-orange" onClick={sInscrire} disabled={envoi}>
              {envoi ? "Envoi…" : "S'inscrire à cette formation"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

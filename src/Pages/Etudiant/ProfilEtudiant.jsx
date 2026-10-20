import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { urlFichier } from "../../services/api";

const formatDate = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "—");

export default function ProfilEtudiant() {
  const { user } = useAuth();

  return (
    <>
      <h1 className="dash-titre">Mon profil étudiant</h1>
      <p className="dash-sous">Consultez vos informations personnelles et académiques.</p>

      <div className="dash-profil">
        <section className="dash-carte dash-profil-carte">
          {user.photo ? (
            <img className="dash-avatar" src={urlFichier(user.photo)} alt="Photo de profil" />
          ) : (
            <div className="dash-avatar">{user.prenom?.[0]}{user.nom?.[0]}</div>
          )}
          <h2 style={{ justifyContent: "center", marginBottom: 4 }}>{user.prenom} {user.nom}</h2>
          <p style={{ color: "#8c9bbd", fontSize: ".9rem" }}>{user.email}</p>
          {user.niveau && <span className="dash-pastille">{user.niveau}</span>}
        </section>

        <section className="dash-carte">
          <h2>Informations académiques &amp; personnelles</h2>
          <dl className="dash-infos mb-0">
            <div><dt>Formation</dt><dd>{user.formation?.titre || "Non affectée"}</dd></div>
            <div><dt>Numéro étudiant</dt><dd>{user.numero_etudiant || "—"}</dd></div>
            <div><dt>Date de naissance</dt><dd>{formatDate(user.date_naissance)}</dd></div>
            <div><dt>Téléphone</dt><dd>{user.telephone || "—"}</dd></div>
            <div className="large"><dt>Adresse</dt><dd>{user.adresse || "—"}</dd></div>
          </dl>
        </section>
      </div>

      <div className="text-end mt-3">
        <Link to="/etudiant/parametres" className="btn btn-orange">Modifier mon profil</Link>
      </div>
    </>
  );
}

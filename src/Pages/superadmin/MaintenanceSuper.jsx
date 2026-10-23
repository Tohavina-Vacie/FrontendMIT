import { Link } from "react-router-dom";
import Interrupteur from "../../assets/Components/Interrupteur";
import useConfiguration from "../../services/useConfiguration";

export default function MaintenanceSuper() {
  const { config, erreur, enCours, changer } = useConfiguration();

  const modifier = (valeur) => {
    if (valeur && !window.confirm("Activer la maintenance bloquera tous les utilisateurs, sauf les super admins. Continuer ?")) return;
    changer("mode_maintenance", valeur);
  };

  return (
    <>
      <h1 className="dash-titre">Maintenance</h1>
      <p className="dash-sous">Verrouillez la plateforme pendant une intervention.</p>
      {erreur && <div className="alert alert-danger">{erreur}</div>}
      {!config && !erreur && <p className="dash-sous">Chargement…</p>}
      {config && (
        <>
          <section className="dash-carte mb-3">
            <Interrupteur id="maintenance" titre="Mode maintenance" description="Quand il est activé, seuls les super admins peuvent se connecter et utiliser la plateforme."
              checked={config.mode_maintenance} disabled={enCours === "mode_maintenance"} onChange={modifier} />
            <p className="mt-3 mb-0" style={{ color: config.mode_maintenance ? "#f0903f" : "#8c9bbd" }}>
              {config.mode_maintenance ? "La plateforme est en maintenance : les autres utilisateurs reçoivent un message d'indisponibilité." : "La plateforme est accessible à tous les utilisateurs."}
            </p>
          </section>
          <section className="dash-carte">
            <h2>Avant une intervention</h2>
            <p style={{ color: "#c9d6f5" }}>Activer la maintenance bloque les nouvelles requêtes, mais ne ferme pas les sessions déjà ouvertes. Pour déconnecter tout le monde, utilisez la page Sécurité.</p>
            <Link to="/super-admin/securite" className="dash-btn">Ouvrir la page Sécurité</Link>
          </section>
        </>
      )}
    </>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import useConfiguration from "../../services/useConfiguration";
import { depuis, dureeUptime, heure, nomPersonne } from "../../services/format";

const ROLES = { super_admin: ["orange", "Super admin"], admin: ["vert", "Admin"] };
const SEVERITES = { INFO: ["vert", "Info"], WARNING: ["orange", "Alerte"], ERROR: ["rouge", "Erreur"] };

function Etat({ libelle, etat, texte }) {
  return <span className="dash-etat-item"><i className={`point ${etat}`} />{libelle} : <span>{texte}</span></span>;
}

function Stat({ titre, valeur, sous, badge }) {
  return (
    <div className="dash-carte dash-stat">
      <div className="entete"><span className="titre">{titre}</span>{badge && <span className="dash-badge">{badge}</span>}</div>
      <div className="valeur">{valeur}</div>
      <div className="sous">{sous}</div>
    </div>
  );
}

export default function SuperAccueil() {
  const [vue, setVue] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [erreur, setErreur] = useState("");
  const { config } = useConfiguration();

  useEffect(() => {
    api("/super-admin/vue-ensemble").then(setVue).catch((e) => setErreur(e.message));
    api("/super-admin/administrateurs").then(setAdmins).catch(() => {});
  }, []);

  const sys = vue?.systeme;
  const options = [["mode_maintenance", "Maintenance générale"], ["inscriptions_ouvertes", "Inscriptions ouvertes"], ["sauvegarde_auto", "Sauvegarde automatique"]];

  return (
    <>
      <h1 className="dash-titre">Vue d'ensemble</h1>
      <p className="dash-sous">Supervision globale de la plateforme MIT Madagascar.</p>
      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <div className="dash-etat">
        <strong>État du système :</strong>
        <Etat libelle="Serveur" etat={sys ? "ok" : "verif"} texte={sys ? sys.serveur : "Vérification…"} />
        <Etat libelle="Base de données" etat={!sys ? "verif" : sys.base_de_donnees === "Connecté" ? "ok" : "ko"} texte={sys ? sys.base_de_donnees : "Vérification…"} />
        <Etat libelle="En ligne depuis" etat={sys ? "ok" : "verif"} texte={sys ? dureeUptime(sys.uptime_secondes) : "…"} />
        <Etat libelle="Maintenance" etat={!sys ? "verif" : sys.mode_maintenance ? "warn" : "ok"} texte={sys ? (sys.mode_maintenance ? "Activée" : "Désactivée") : "…"} />
      </div>

      <div className="dash-stats">
        <Stat titre="Utilisateurs actifs" valeur={vue ? vue.utilisateurs_actifs : "…"} badge="Total actifs" sous="Étudiants, enseignants et équipes" />
        <Stat titre="Administrateurs" valeur={vue ? vue.administrateurs : "…"} badge="Accès élevé" sous="Admins et super admins" />
        <Stat titre="Sessions actives" valeur={vue ? vue.sessions_actives : "…"} badge="Temps réel" sous="Appareils connectés" />
        <Stat titre="Requêtes API / jour" valeur={vue ? vue.requetes_api_aujourdhui.toLocaleString("fr-FR") : "…"} sous={vue ? `${vue.logs_aujourdhui} action(s) journalisée(s), dont ${vue.erreurs_aujourdhui} erreur(s)` : "…"} />
      </div>

      <div className="dash-colonnes">
        <section className="dash-carte">
          <h2>Gestion des administrateurs <Link to="/super-admin/administrateurs">Gérer</Link></h2>
          <div className="dash-table-zone">
            <table className="dash-table">
              <thead><tr><th>Nom</th><th>Rôle</th><th>Dernière connexion</th><th>Statut</th></tr></thead>
              <tbody>
                {admins.map((a) => {
                  const [couleur, libelle] = ROLES[a.role] || ["gris", a.role];
                  return (
                    <tr key={a._id}>
                      <td><strong>{nomPersonne(a)}</strong></td>
                      <td><span className={`dash-tag ${couleur}`}>{libelle}</span></td>
                      <td>{depuis(a.derniere_connexion)}</td>
                      <td><span className={`dash-tag ${a.statut === "actif" ? "vert" : "gris"}`}>{a.statut === "actif" ? "Actif" : "Inactif"}</span></td>
                    </tr>
                  );
                })}
                {admins.length === 0 && <tr><td colSpan="4" className="dash-vide">Aucun administrateur.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <div className="dash-colonne">
          <section className="dash-carte">
            <h2>Configuration système <Link to="/super-admin/configuration">Modifier</Link></h2>
            {options.map(([champ, libelle]) => (
              <div className="dash-ligne" key={champ}>
                <span>{libelle}</span>
                <span className={`dash-tag ${config ? (config[champ] ? (champ === "mode_maintenance" ? "orange" : "vert") : "gris") : "gris"}`}>{config ? (config[champ] ? "Activé" : "Désactivé") : "…"}</span>
              </div>
            ))}
          </section>

          <section className="dash-carte">
            <h2>Flux des actions de sécurité <Link to="/super-admin/logs">Tout voir</Link></h2>
            {vue && vue.derniers_logs.length === 0 && <p className="dash-vide">Aucune action enregistrée.</p>}
            {(vue?.derniers_logs || []).map((l) => {
              const [couleur] = SEVERITES[l.severite] || ["gris"];
              return (
                <div className="dash-flux" key={l._id}>
                  <div><strong>{l.action}</strong><small>Par : {nomPersonne(l.utilisateur) || l.email_tente || "Système"}</small></div>
                  <span className={`dash-tag ${couleur}`}>{heure(l.createdAt)}</span>
                </div>
              );
            })}
          </section>
        </div>
      </div>
    </>
  );
}

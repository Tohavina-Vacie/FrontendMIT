import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ORIGINE, api } from "../../services/api";
import { dateFr, nomPersonne } from "../../services/format";

const ROLES = { super_admin: ["orange", "Super admin"], admin: ["vert", "Admin"] };

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
  const [serveur, setServeur] = useState("verif");
  const [base, setBase] = useState("verif");
  const [users, setUsers] = useState(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    fetch(`${ORIGINE}/`).then((r) => setServeur(r.ok ? "ok" : "ko")).catch(() => setServeur("ko"));
    api("/formations").then(() => setBase("ok")).catch(() => setBase("ko")); // répond seulement si MongoDB est joignable
    api("/users").then(setUsers).catch((e) => setErreur(e.message));
  }, []);

  const resume = useMemo(() => {
    const liste = users || [];
    const compte = (role) => liste.filter((u) => u.role === role).length;
    return {
      total: liste.length,
      actifs: liste.filter((u) => u.statut === "actif").length,
      admins: liste.filter((u) => ["admin", "super_admin"].includes(u.role)),
      etudiants: compte("etudiant"),
      enseignants: compte("enseignant"),
      entreprises: compte("entreprise"),
    };
  }, [users]);

  const texte = { verif: "Vérification…", ok: null, ko: null };

  return (
    <>
      <h1 className="dash-titre">Vue d'ensemble</h1>
      <p className="dash-sous">Supervision globale de la plateforme MIT Madagascar.</p>

      <div className="dash-etat">
        <strong>État du système :</strong>
        <Etat libelle="Serveur" etat={serveur} texte={texte[serveur] || (serveur === "ok" ? "Opérationnel" : "Injoignable")} />
        <Etat libelle="Base de données" etat={base} texte={texte[base] || (base === "ok" ? "Connectée" : "Indisponible")} />
      </div>

      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <div className="dash-stats">
        <Stat titre="Utilisateurs globaux" valeur={users ? resume.total : "…"} badge="Total" sous={`${resume.actifs} compte(s) actif(s)`} />
        <Stat titre="Administrateurs" valeur={users ? resume.admins.length : "…"} badge="Accès élevé" sous="Admins et super admins" />
        <Stat titre="Étudiants" valeur={users ? resume.etudiants : "…"} sous="Comptes étudiants" />
        <Stat titre="Enseignants" valeur={users ? resume.enseignants : "…"} sous={`${resume.entreprises} compte(s) entreprise`} />
      </div>

      <div className="dash-colonnes">
        <section className="dash-carte">
          <h2>Gestion des administrateurs <Link to="/super-admin/administrateurs">Gérer</Link></h2>
          <div className="dash-table-zone">
            <table className="dash-table">
              <thead><tr><th>Nom</th><th>E-mail</th><th>Rôle</th><th>Statut</th><th>Inscrit le</th></tr></thead>
              <tbody>
                {resume.admins.map((u) => {
                  const [couleur, libelle] = ROLES[u.role];
                  return (
                    <tr key={u.id}>
                      <td><strong>{nomPersonne(u)}</strong></td>
                      <td>{u.email}</td>
                      <td><span className={`dash-tag ${couleur}`}>{libelle}</span></td>
                      <td><span className={`dash-tag ${u.statut === "actif" ? "vert" : "gris"}`}>{u.statut === "actif" ? "Actif" : "Inactif"}</span></td>
                      <td>{dateFr(u.date_inscription)}</td>
                    </tr>
                  );
                })}
                {users && resume.admins.length === 0 && <tr><td colSpan="5" className="dash-vide">Aucun administrateur.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dash-carte">
          <h2>Accès rapides</h2>
          <Link className="dash-rapide" to="/super-admin/administrateurs"><span><strong>Nouvel administrateur</strong><small>Créer un compte admin ou super admin</small></span></Link>
          <Link className="dash-rapide" to="/super-admin/roles"><span><strong>Rôles</strong><small>Répartition des comptes par rôle</small></span></Link>
          <Link className="dash-rapide" to="/admin"><span><strong>Console admin</strong><small>Étudiants, cours, notes, finances…</small></span></Link>
        </section>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { api } from "../../services/api";

const ROLES = [
  ["super_admin", "Super admin", "Supervision de la plateforme et gestion des administrateurs."],
  ["admin", "Administrateur", "Gestion de l'établissement : étudiants, enseignants, formations, notes et finances."],
  ["enseignant", "Enseignant", "Cours, séances et saisie des notes de ses matières."],
  ["etudiant", "Étudiant", "Suivi de son parcours : cours, notes, documents, paiements et alternance."],
  ["entreprise", "Entreprise", "Partenaire d'alternance et de stage."],
];

export default function Roles() {
  const [users, setUsers] = useState(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    api("/users").then(setUsers).catch((e) => setErreur(e.message));
  }, []);

  const compte = (role, statut) => (users || []).filter((u) => u.role === role && (!statut || u.statut === statut)).length;

  return (
    <>
      <h1 className="dash-titre">Rôles</h1>
      <p className="dash-sous">Répartition des comptes par rôle sur la plateforme.</p>
      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <div className="dash-roles">
        {ROLES.map(([role, nom, description]) => (
          <article className="dash-carte" key={role}>
            <span className="dash-tag orange">{role}</span>
            <h3>{nom}</h3>
            <div className="nombre">{users ? compte(role) : "…"}</div>
            <p className="mb-2">{users ? `${compte(role, "actif")} actif(s)` : "Chargement…"}</p>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </>
  );
}

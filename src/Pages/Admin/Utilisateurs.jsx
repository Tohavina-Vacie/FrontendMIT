import GestionUtilisateurs from "./GestionUtilisateurs";

export default function Utilisateurs() {
  return (
    <GestionUtilisateurs
      titre="Utilisateurs"
      sousTitre="Tous les comptes de la plateforme : étudiants, enseignants, entreprises et administrateurs."
      libelleAjout="Ajouter un utilisateur"
      recherche="Rechercher par nom, e-mail…"
      fichierCsv="utilisateurs"
    />
  );
}

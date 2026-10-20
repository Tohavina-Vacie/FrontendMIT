import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { urlFichier } from "../../services/api";
import Icone from "../../assets/Components/Icone";
import "../../styles/dashboard.css";

export const MENU_ETUDIANT = [
  ["Accueil", "/etudiant", "home"],
  ["Mon profil", "/etudiant/profil", "user"],
  ["Mes cours", "/etudiant/cours", "book"],
  ["Emploi du temps", "/etudiant/emploi-du-temps", "calendar"],
  ["Mes notes", "/etudiant/notes", "edit"],
  ["Absences", "/etudiant/absences", "alert"],
  ["Documents", "/etudiant/documents", "file"],
  ["Alternance", "/etudiant/alternance", "repeat"],
  ["Paiements", "/etudiant/paiements", "wallet"],
  ["Messagerie", "/etudiant/messagerie", "message"],
  ["Paramètres", "/etudiant/parametres", "settings"],
];

export const MENU_ADMIN = [
  ["Dashboard", "/admin", "grid"],
  ["Étudiants", "/admin/etudiants", "users"],
  ["Enseignants", "/admin/enseignants", "cap"],
  ["Formations", "/admin/formations", "book"],
  ["Cours", "/admin/cours", "edit"],
  ["Inscriptions", "/admin/inscriptions", "clipboard"],
  ["Emploi du temps", "/admin/emploi-du-temps", "calendar"],
  ["Notes", "/admin/notes", "edit"],
  ["Absences", "/admin/absences", "alert"],
  ["Documents", "/admin/documents", "file"],
  ["Stages", "/admin/stages", "briefcase"],
  ["Offres", "/admin/alternance", "repeat"],
  ["Finances", "/admin/finances", "wallet"],
  ["Messages", "/admin/messages", "mail"],
  ["Rapports", "/admin/rapports", "chart"],
  ["Paramètres", "/admin/parametres", "settings"],
  ["Utilisateurs", "/admin/utilisateurs", "user"],
];

export const MENU_SUPER = [
  ["Vue d'ensemble", "/super-admin", "chart"],
  ["Administrateurs", "/super-admin/administrateurs", "users"],
  ["Rôles", "/super-admin/roles", "user"],
  ["Établissements", "/super-admin/etablissements", "briefcase"],
  ["Configuration", "/super-admin/configuration", "settings"],
  ["Logs", "/super-admin/logs", "clipboard"],
  ["Sécurité", "/super-admin/securite", "shield"],
  ["Base de données", "/super-admin/base-de-donnees", "database"],
  ["API", "/super-admin/api", "code"],
  ["Maintenance", "/super-admin/maintenance", "tool"],
  ["Paramètres avancés", "/super-admin/parametres", "sliders"],
  ["Console admin", "/admin", "grid"],
];

// Mise en page commune : barre latérale + barre du haut + contenu
export default function DashboardLayout({
  menu = MENU_ETUDIANT,
  libelle = "Étudiant",
  recherche = "Rechercher un cours, un document…",
  sousLogo = "MADAGASCAR",
  mode = "",
  modeLabel = "",
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [ouvert, setOuvert] = useState(false);

  const deconnexion = () => {
    logout();
    navigate("/connexion");
  };
  // Le super admin retrouve un lien vers son espace depuis la console admin
  const menuAffiche = menu === MENU_ADMIN && user.role === "super_admin" ? [...menu, ["Super admin", "/super-admin", "shield"]] : menu;
  const sousTitre = user.role === "etudiant" && user.niveau ? `${libelle} - ${user.niveau}` : libelle;

  return (
    <div className="dash">
      <aside className={`dash-side${ouvert ? " ouvert" : ""}`}>
        <Link to="/" className="dash-logo">
          <span className="barre" /> <b>MIT</b>
          <small>{sousLogo}</small>
        </Link>
        <nav onClick={() => setOuvert(false)}>
          {menuAffiche.map(([label, chemin, icone]) =>
            chemin === null ? (
              <div key={label} className="dash-groupe">{label}</div>
            ) : (
              <NavLink key={chemin} to={chemin} end={chemin === menu[0][1]}
                className={({ isActive }) => `dash-lien${isActive ? " actif" : ""}`}>
                <Icone nom={icone} /> {label}
              </NavLink>
            ),
          )}
        </nav>
        <button type="button" className="dash-lien dash-sortie" onClick={deconnexion}>
          <Icone nom="logout" /> Se déconnecter
        </button>
        {(mode || modeLabel) && <div className="dash-mode">{mode || modeLabel}</div>}
      </aside>
      {ouvert && <div className="dash-voile" onClick={() => setOuvert(false)} />}

      <div className="dash-corps">
        <header className="dash-top">
          <button type="button" className="dash-burger" onClick={() => setOuvert(true)} aria-label="Ouvrir le menu">☰</button>
          <label className="dash-recherche">
            <Icone nom="search" />
            <input placeholder={recherche} />
          </label>
          <div className="dash-top-droite">
            <button type="button" className="dash-icone-btn" aria-label="Notifications"><Icone nom="bell" /></button>
            <div className="dash-user">
              <div>
                <div className="nom">{user.prenom} {user.nom}</div>
                <small>{sousTitre}</small>
              </div>
              {user.photo ? (
                <img className="dash-avatar" src={urlFichier(user.photo)} alt="" />
              ) : (
                <div className="dash-avatar">{user.prenom?.[0]}{user.nom?.[0]}</div>
              )}
            </div>
          </div>
        </header>
        <main className="dash-contenu"><Outlet /></main>
      </div>
    </div>
  );
}

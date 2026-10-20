import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const LIENS = {
  etudiant: [
    ["Tableau de bord", "/etudiant"],
    ["Mes inscriptions", "/mes-inscriptions"],
    ["Catalogue des formations", "/catalogue"],
  ],
  enseignant: [["Mon profil", "/profil"]],
  entreprise: [["Mon profil", "/profil"]],
  admin: [
    ["Tableau de bord", "/admin"],
    ["Utilisateurs", "/admin/utilisateurs"],
    ["Formations", "/admin/formations"],
    ["Inscriptions", "/admin/inscriptions"],
    ["Entreprises", "/admin/entreprises"],
    ["Mon profil", "/profil"],
  ],
};
LIENS.super_admin = [["Super admin", "/super-admin"], ...LIENS.admin];

// À placer dans la Navbar à la place du bouton « Se connecter »
export default function MenuUtilisateur() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [ouvert, setOuvert] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const fermer = (e) => ref.current && !ref.current.contains(e.target) && setOuvert(false);
    document.addEventListener("mousedown", fermer);
    return () => document.removeEventListener("mousedown", fermer);
  }, []);

  if (!user) {
    return <Link to="/connexion" className="btn btn-orange">Se connecter</Link>;
  }

  const deconnexion = () => {
    setOuvert(false);
    logout();
    navigate("/");
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button type="button" className="btn btn-orange" onClick={() => setOuvert(!ouvert)}
        aria-expanded={ouvert} aria-haspopup="menu">
        Mon espace ▾
      </button>

      {ouvert && (
        <div role="menu" style={{
          position: "absolute", right: 0, top: "calc(100% + 8px)", minWidth: 230, zIndex: 2000,
          background: "#0f2250", border: "1px solid #27407f", borderRadius: 12, padding: 8,
          boxShadow: "0 12px 30px rgba(0,0,0,.4)",
        }}>
          <div style={{ padding: "8px 12px", color: "#c9d6f5", fontSize: ".85rem" }}>
            {user.prenom} {user.nom}<br />
            <small style={{ color: "#8fa3d1" }}>{user.role}</small>
          </div>
          <hr style={{ margin: "4px 0", borderColor: "#27407f" }} />
          {(LIENS[user.role] || LIENS.enseignant).map(([label, chemin]) => (
            <Link key={chemin} to={chemin} role="menuitem" onClick={() => setOuvert(false)}
              style={{ display: "block", padding: "8px 12px", color: "#fff", textDecoration: "none", borderRadius: 8 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1b3a7a")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              {label}
            </Link>
          ))}
          <hr style={{ margin: "4px 0", borderColor: "#27407f" }} />
          <button type="button" role="menuitem" onClick={deconnexion}
            style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px",
              color: "#ff9a9a", background: "transparent", border: 0, borderRadius: 8, cursor: "pointer" }}>
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}

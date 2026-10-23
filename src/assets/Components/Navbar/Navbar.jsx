import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

const links = [
  { label: "Ecole", to: "/ecole" },
  { label: "Formations", to: "/formations" },
  { label: "Alternance", to: "/alternance" },
  { label: "Entreprises", to: "/entreprises" },
  { label: "Documentation", to: "/documentation" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top navbar-mit">
      <div className="container-fluid px-3 px-lg-4">
        <Link to="/" className="navbar-brand brand-mit" onClick={close}>
          <span className="brand-mit-logo"><img src="/entreprises/logo.jpg" alt="" srcset="" width={120} height={80}/></span>
          <span className="brand-mit-sub"></span>
        </Link>

        <button
          type="button"
          className="navbar-toggler"
          onClick={() => setOpen((o) => !o)}
          aria-controls="menu-principal"
          aria-expanded={open}
          aria-label="Afficher ou masquer le menu"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div id="menu-principal" className={`collapse navbar-collapse ${open ? "show" : ""}`}>
          <ul className="navbar-nav mx-lg-auto align-items-lg-center gap-lg-2 mt-3 mt-lg-0">
            {links.map((l) => (
              <li className="nav-item" key={l.label}>
                {l.to ? (
                  <NavLink to={l.to} end className="nav-link" onClick={close}>
                    {l.label}
                  </NavLink>
                ) : (
                  <a href={l.href} className="nav-link" onClick={close}>
                    {l.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <div className="d-flex flex-column flex-lg-row gap-2 my-3 my-lg-0">
            <a href="/contact" className="btn btn-nav btn-nav-dark" onClick={close}>
              Nous contacter
            </a>
            <a href="#" className="btn btn-nav btn-nav-mid" onClick={close}>
              Rendez-vous
            </a>
            <Link to="/connexion" className="btn btn-nav" onClick={close}>
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
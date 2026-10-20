import { useEffect, useMemo, useState } from "react";
import { api, urlFichier } from "../services/api";
import "../styles/auth.css";
import "../styles/formations.css";

const initiales = (nom = "") =>
  nom.split(" ").filter(Boolean).slice(0, 2).map((m) => m[0].toUpperCase()).join("");

export default function EntreprisesListe() {
  const [entreprises, setEntreprises] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [secteur, setSecteur] = useState("");
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    api("/entreprises")
      .then(setEntreprises)
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false));
  }, []);

  const secteurs = [...new Set(entreprises.map((e) => e.secteur_activite).filter(Boolean))];

  const visibles = useMemo(
    () =>
      entreprises.filter(
        (e) =>
          (!secteur || e.secteur_activite === secteur) &&
          `${e.nom} ${e.adresse}`.toLowerCase().includes(recherche.toLowerCase()),
      ),
    [entreprises, recherche, secteur],
  );

  return (
    <div className="cat-page">
      <div className="container">
        <h1 className="mb-2">Nos entreprises partenaires</h1>
        <p className="mb-4" style={{ color: "#c9d6f5" }}>
          Les entreprises qui accueillent nos étudiants en alternance.
        </p>

        <div className="row g-2 mb-4">
          <div className="col-md-8">
            <input className="form-control" placeholder="Rechercher une entreprise" value={recherche}
              onChange={(e) => setRecherche(e.target.value)} />
          </div>
          <div className="col-md-4">
            <select className="form-select" value={secteur} onChange={(e) => setSecteur(e.target.value)}>
              <option value="">Tous les secteurs</option>
              {secteurs.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {erreur && <div className="alert alert-danger">{erreur}</div>}
        {chargement && <p>Chargement des entreprises…</p>}
        {!chargement && !erreur && visibles.length === 0 && <p>Aucune entreprise ne correspond à votre recherche.</p>}

        <div className="row g-4">
          {visibles.map((e) => (
            <div className="col-sm-6 col-lg-4" key={e._id}>
              <article className="formation-card">
                <div className="d-flex align-items-center justify-content-center"
                  style={{ height: 120, background: "#fff" }}>
                  {e.logo ? (
                    <img src={urlFichier(e.logo)} alt={`Logo ${e.nom}`}
                      style={{ maxHeight: 90, maxWidth: "80%", objectFit: "contain" }} />
                  ) : (
                    <span style={{ fontSize: "2rem", fontWeight: 700, color: "#0a1a3f" }}>{initiales(e.nom)}</span>
                  )}
                </div>
                <div className="corps">
                  <h2 className="h5">{e.nom}</h2>
                  <span className="pastille accent align-self-start">{e.secteur_activite}</span>
                  <p className="mb-0" style={{ WebkitLineClamp: 2 }}>{e.adresse}</p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

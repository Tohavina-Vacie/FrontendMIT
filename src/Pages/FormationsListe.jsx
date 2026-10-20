import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, urlFichier } from "../services/api";
import "../styles/auth.css";
import "../styles/formations.css";

export default function FormationsListe() {
  const [formations, setFormations] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [categorie, setCategorie] = useState("");
  const [niveau, setNiveau] = useState("");
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    api("/formations")
      .then(setFormations)
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false));
  }, []);

  const options = (champ) => [...new Set(formations.map((f) => f[champ]).filter(Boolean))];

  const visibles = useMemo(
    () =>
      formations.filter(
        (f) =>
          (!categorie || f.categorie === categorie) &&
          (!niveau || f.niveau === niveau) &&
          `${f.titre} ${f.description}`.toLowerCase().includes(recherche.toLowerCase()),
      ),
    [formations, recherche, categorie, niveau],
  );

  return (
    <div className="cat-page">
      <div className="container">
        <h1 className="mb-4">Nos formations</h1>

        <div className="row g-2 mb-4">
          <div className="col-md-6">
            <input className="form-control" placeholder="Rechercher une formation" value={recherche} onChange={(e) => setRecherche(e.target.value)} />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={categorie} onChange={(e) => setCategorie(e.target.value)}>
              <option value="">Toutes les catégories</option>
              {options("categorie").map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={niveau} onChange={(e) => setNiveau(e.target.value)}>
              <option value="">Tous les niveaux</option>
              {options("niveau").map((n) => <option key={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {erreur && <div className="alert alert-danger">{erreur}</div>}
        {chargement && <p>Chargement des formations…</p>}
        {!chargement && !erreur && visibles.length === 0 && <p>Aucune formation ne correspond à votre recherche.</p>}

        <div className="row g-4">
          {visibles.map((f) => (
            <div className="col-md-6 col-lg-4" key={f._id}>
              <article className="formation-card">
                {f.image ? (
                  <img className="visuel" src={urlFichier(f.image)} alt={f.titre} />
                ) : (
                  <div className="visuel">Pas d'image</div>
                )}
                <div className="corps">
                  <h2 className="h5">{f.titre}</h2>
                  <p>{f.description}</p>
                  <div className="infos">
                    <span className="pastille accent">{f.niveau}</span>
                    <span className="pastille">{f.duree}</span>
                    {f.rythme && <span className="pastille">{f.rythme}</span>}
                    {f.categorie && <span className="pastille">{f.categorie}</span>}
                    <Link to={`/catalogue/${f._id}`} className="btn btn-orange w-100 mt-2">Voir la formation</Link>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

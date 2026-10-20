import { useCallback, useEffect, useState } from "react";
import { api, urlFichier } from "../../services/api";
import "../../styles/auth.css";

const VIDE = { nom: "", secteur_activite: "", adresse: "" };

export default function EntreprisesAdmin() {
  const [entreprises, setEntreprises] = useState([]);
  const [edition, setEdition] = useState(null); // null | objet (_id présent = modification)
  const [logo, setLogo] = useState(null);
  const [erreur, setErreur] = useState("");

  const charger = useCallback(() => {
    api("/entreprises").then(setEntreprises).catch((e) => setErreur(e.message));
  }, []);
  useEffect(charger, [charger]);

  const fermer = () => { setEdition(null); setLogo(null); setErreur(""); };

  const enregistrer = async (e) => {
    e.preventDefault();
    setErreur("");
    const fd = new FormData();
    Object.keys(VIDE).forEach((c) => edition[c] && fd.append(c, edition[c]));
    if (logo) fd.append("logo", logo);
    try {
      if (edition._id) await api(`/entreprises/${edition._id}`, { method: "PUT", body: fd });
      else await api("/entreprises", { method: "POST", body: fd });
      fermer();
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  const supprimer = async (en) => {
    if (!window.confirm(`Supprimer l'entreprise « ${en.nom} » ?`)) return;
    try {
      await api(`/entreprises/${en._id}`, { method: "DELETE" });
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  const champ = (n, l, placeholder) => (
    <div className="mb-3">
      <label htmlFor={n}>{l}</label>
      <input id={n} className="form-control" required placeholder={placeholder} value={edition[n] || ""}
        onChange={(e) => setEdition({ ...edition, [n]: e.target.value })} />
    </div>
  );

  return (
    <div className="admin-page">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h1 className="h3 mb-0">Entreprises</h1>
          <button className="btn btn-orange" onClick={() => setEdition({ ...VIDE })}>Ajouter une entreprise</button>
        </div>

        {erreur && !edition && <div className="alert alert-danger">{erreur}</div>}

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr><th>Logo</th><th>Nom</th><th>Secteur d'activité</th><th>Adresse</th><th></th></tr>
            </thead>
            <tbody>
              {entreprises.map((en) => (
                <tr key={en._id}>
                  <td style={{ width: 80 }}>
                    {en.logo && (
                      <img src={urlFichier(en.logo)} alt="" width="56" height="40"
                        style={{ objectFit: "contain", background: "#fff", borderRadius: 6 }} />
                    )}
                  </td>
                  <td>{en.nom}</td>
                  <td>{en.secteur_activite}</td>
                  <td>{en.adresse}</td>
                  <td className="text-end text-nowrap">
                    <button className="btn btn-sm btn-bleu me-2" onClick={() => setEdition({ ...VIDE, ...en })}>Modifier</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => supprimer(en)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {entreprises.length === 0 && <tr><td colSpan="5" className="text-center">Aucune entreprise pour le moment</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {edition && (
        <div className="overlay">
          <form className="auth-card" onSubmit={enregistrer}>
            <h1>{edition._id ? "Modifier l'entreprise" : "Nouvelle entreprise"}</h1>
            {champ("nom", "Nom de l'entreprise", "Ex : Orange Madagascar")}
            {champ("secteur_activite", "Secteur d'activité", "Ex : Télécommunications")}
            {champ("adresse", "Adresse", "Adresse complète")}
            <div className="mb-4">
              <label htmlFor="logo">Logo</label>
              <input id="logo" type="file" accept="image/*" className="form-control" onChange={(e) => setLogo(e.target.files[0])} />
            </div>
            {erreur && <div className="alert alert-danger">{erreur}</div>}
            <div className="d-flex gap-2">
              <button className="btn btn-orange flex-grow-1">Enregistrer</button>
              <button type="button" className="btn btn-outline-light" onClick={fermer}>Annuler</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

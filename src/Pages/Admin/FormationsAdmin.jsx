import { useCallback, useEffect, useState } from "react";
import { api, urlFichier } from "../../services/api";
import "../../styles/auth.css";
import "../../styles/formations.css";

const VIDE = { titre: "", description: "", duree: "", niveau: "", categorie: "", rythme: "" };

export default function FormationsAdmin() {
  const [formations, setFormations] = useState([]);
  const [edition, setEdition] = useState(null); // null | objet (_id présent = modification)
  const [image, setImage] = useState(null);
  const [erreur, setErreur] = useState("");

  const charger = useCallback(() => {
    api("/formations").then(setFormations).catch((e) => setErreur(e.message));
  }, []);
  useEffect(charger, [charger]);

  const fermer = () => { setEdition(null); setImage(null); setErreur(""); };

  const enregistrer = async (e) => {
    e.preventDefault();
    setErreur("");
    const fd = new FormData();
    Object.keys(VIDE).forEach((c) => edition[c] && fd.append(c, edition[c]));
    if (image) fd.append("image", image);
    try {
      if (edition._id) await api(`/formations/${edition._id}`, { method: "PUT", body: fd });
      else await api("/formations", { method: "POST", body: fd });
      fermer();
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  const supprimer = async (f) => {
    if (!window.confirm(`Supprimer la formation « ${f.titre} » ?`)) return;
    try {
      await api(`/formations/${f._id}`, { method: "DELETE" });
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  const champ = (n, l, requis = false) => (
    <div className="col-sm-6 mb-3">
      <label htmlFor={n}>{l}</label>
      <input id={n} className="form-control" required={requis} value={edition[n] || ""}
        onChange={(e) => setEdition({ ...edition, [n]: e.target.value })} />
    </div>
  );

  return (
    <div className="admin-page">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h1 className="h3 mb-0">Formations</h1>
          <button className="btn btn-orange" onClick={() => setEdition({ ...VIDE })}>Ajouter une formation</button>
        </div>

        {erreur && !edition && <div className="alert alert-danger">{erreur}</div>}

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr><th></th><th>Titre</th><th>Niveau</th><th>Durée</th><th>Catégorie</th><th></th></tr>
            </thead>
            <tbody>
              {formations.map((f) => (
                <tr key={f._id}>
                  <td style={{ width: 70 }}>
                    {f.image && <img src={urlFichier(f.image)} alt="" width="56" height="40" style={{ objectFit: "cover", borderRadius: 6 }} />}
                  </td>
                  <td>{f.titre}</td>
                  <td>{f.niveau}</td>
                  <td>{f.duree}</td>
                  <td>{f.categorie || "—"}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-bleu me-2" onClick={() => setEdition({ ...VIDE, ...f })}>Modifier</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => supprimer(f)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {formations.length === 0 && <tr><td colSpan="6" className="text-center">Aucune formation pour le moment</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {edition && (
        <div className="overlay">
          <form className="auth-card large" onSubmit={enregistrer} style={{ maxHeight: "90vh", overflowY: "auto" }}>
            <h1>{edition._id ? "Modifier la formation" : "Nouvelle formation"}</h1>
            <div className="row">
              {champ("titre", "Titre", true)}
              {champ("niveau", "Niveau (ex : Licence, Master)", true)}
              {champ("duree", "Durée (ex : 3 ans)", true)}
              {champ("rythme", "Rythme (ex : Alternance)")}
              {champ("categorie", "Catégorie")}
              <div className="col-sm-6 mb-3">
                <label htmlFor="image">Image</label>
                <input id="image" type="file" accept="image/*" className="form-control" onChange={(e) => setImage(e.target.files[0])} />
              </div>
              <div className="col-12 mb-3">
                <label htmlFor="description">Description</label>
                <textarea id="description" rows="4" className="form-control" required value={edition.description}
                  onChange={(e) => setEdition({ ...edition, description: e.target.value })} />
              </div>
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

import { useCallback, useEffect, useState } from "react";
import { api, urlFichier } from "../../services/api";
import Icone from "../../assets/Components/Icone";
import FormulaireDocument, { documentVide, envoyerDocument } from "../../assets/Components/FormulaireDocument";
import { dateFr, nomPersonne, taille } from "../../services/format";

const VISIBILITES = { public: ["vert", "Public"], formation: ["orange", "Formation"], prive: ["gris", "Privé"] };

export default function DocumentsAdmin() {
  const [documents, setDocuments] = useState([]);
  const [formations, setFormations] = useState([]);
  const [filtres, setFiltres] = useState({ formation: "", visibilite: "" });
  const [edition, setEdition] = useState(null);
  const [fichier, setFichier] = useState(null);
  const [erreur, setErreur] = useState("");

  const charger = useCallback(() => {
    api("/documents/tous", { params: filtres }).then(setDocuments).catch((e) => setErreur(e.message));
  }, [filtres]);
  useEffect(() => { charger(); }, [charger]);
  useEffect(() => { api("/formations").then(setFormations).catch(() => {}); }, []);

  const fermer = () => { setEdition(null); setFichier(null); setErreur(""); };
  const enregistrer = async (e) => {
    e.preventDefault();
    setErreur("");
    try {
      await envoyerDocument(edition, fichier);
      fermer();
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };
  const supprimer = async (d) => {
    if (!window.confirm(`Supprimer « ${d.titre} » ?`)) return;
    try {
      await api(`/documents/${d._id}`, { method: "DELETE" });
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };
  const modifier = (d) => setEdition({ id: d._id, titre: d.titre, type: d.type, categorie: d.categorie || "", visibilite: d.visibilite === "formation" ? "formation" : "public", formation: d.formation?._id || "" });

  return (
    <>
      <div className="dash-entete-page">
        <div>
          <h1 className="dash-titre">Documents</h1>
          <p className="dash-sous">Supports de cours et documents administratifs de l'établissement.</p>
        </div>
        <button type="button" className="dash-btn principal" onClick={() => setEdition(documentVide(true))}><Icone nom="plus" /> Ajouter un document</button>
      </div>

      <div className="dash-filtres">
        <div>
          <label htmlFor="dd-formation">Formation</label>
          <select id="dd-formation" className="form-select" value={filtres.formation} onChange={(e) => setFiltres({ ...filtres, formation: e.target.value })}>
            <option value="">Toutes les formations</option>
            {formations.map((f) => <option key={f._id} value={f._id}>{f.titre}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="dd-vis">Visibilité</label>
          <select id="dd-vis" className="form-select" value={filtres.visibilite} onChange={(e) => setFiltres({ ...filtres, visibilite: e.target.value })}>
            <option value="">Toutes</option>
            <option value="public">Public</option>
            <option value="formation">Formation</option>
            <option value="prive">Privé</option>
          </select>
        </div>
      </div>

      {erreur && !edition && <div className="alert alert-danger">{erreur}</div>}

      <section className="dash-carte">
        <div className="dash-table-zone">
          <table className="dash-table">
            <thead><tr><th>Nom</th><th>Catégorie</th><th>Visibilité</th><th>Formation</th><th>Propriétaire</th><th>Taille</th><th>Ajouté le</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
            <tbody>
              {documents.map((d) => {
                const [couleur, libelle] = VISIBILITES[d.visibilite] || ["gris", d.visibilite];
                return (
                  <tr key={d._id}>
                    <td><strong>{d.titre}</strong><small className="d-block" style={{ color: "#8c9bbd" }}>{d.type}</small></td>
                    <td>{d.categorie || "—"}</td>
                    <td><span className={`dash-tag ${couleur}`}>{libelle}</span></td>
                    <td>{d.formation?.titre || "—"}</td>
                    <td>{nomPersonne(d.proprietaire) || "—"}</td>
                    <td>{taille(d.taille)}</td>
                    <td>{dateFr(d.date_ajout)}</td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <a className="dash-mini-btn" href={urlFichier(d.fichier)} target="_blank" rel="noreferrer" aria-label={`Voir ${d.titre}`}><Icone nom="eye" taille={15} /></a>
                      <button type="button" className="dash-mini-btn" aria-label={`Modifier ${d.titre}`} onClick={() => modifier(d)}><Icone nom="edit" taille={15} /></button>
                      <button type="button" className="dash-mini-btn" aria-label={`Supprimer ${d.titre}`} onClick={() => supprimer(d)}><Icone nom="trash" taille={15} /></button>
                    </td>
                  </tr>
                );
              })}
              {documents.length === 0 && <tr><td colSpan="8" className="dash-vide">Aucun document.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {edition && <FormulaireDocument admin formations={formations} valeurs={edition} setValeurs={setEdition} setFichier={setFichier} erreur={erreur} onSubmit={enregistrer} onClose={fermer} />}
    </>
  );
}

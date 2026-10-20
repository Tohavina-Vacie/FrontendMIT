import { useCallback, useEffect, useState } from "react";
import { api, urlFichier } from "../../services/api";
import { useAuth } from "../../Context/AuthContext";
import Icone from "../../assets/Components/Icone";
import FormulaireDocument, { documentVide, envoyerDocument } from "../../assets/Components/FormulaireDocument";
import { dateFr, taille } from "../../services/format";

export default function MesDocuments() {
  const { user } = useAuth();
  const [d, setD] = useState(null);
  const [categorie, setCategorie] = useState("");
  const [edition, setEdition] = useState(null);
  const [fichier, setFichier] = useState(null);
  const [erreur, setErreur] = useState("");

  const charger = useCallback(() => {
    api("/documents/mes-documents", { params: { categorie } }).then(setD).catch((e) => setErreur(e.message));
  }, [categorie]);
  useEffect(() => { charger(); }, [charger]);

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
  const supprimer = async (doc) => {
    if (!window.confirm(`Supprimer « ${doc.titre} » ?`)) return;
    try {
      await api(`/documents/${doc._id}`, { method: "DELETE" });
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  return (
    <>
      <div className="dash-entete-page">
        <div>
          <h1 className="dash-titre">Documents</h1>
          <p className="dash-sous">Consultez et organisez vos supports de cours et justificatifs administratifs.</p>
        </div>
        <button type="button" className="dash-btn principal" onClick={() => setEdition(documentVide(false))}><Icone nom="plus" /> Ajouter un document</button>
      </div>

      {erreur && !edition && <div className="alert alert-danger">{erreur}</div>}
      {!d && !erreur && <p className="dash-sous">Chargement…</p>}

      {d && (
        <>
          <div className="dash-stats">
            <button type="button" className="dash-carte dash-stat text-start" style={{ color: "inherit" }} onClick={() => setCategorie("")}>
              <div className="titre">Toutes catégories</div>
              <div className="valeur">{d.par_categorie.reduce((s, c) => s + c.nombre, 0)}</div>
              <div className="sous">fichier(s)</div>
            </button>
            {d.par_categorie.map((c) => (
              <button type="button" key={c.categorie || "autre"} className="dash-carte dash-stat text-start" style={{ color: "inherit", borderColor: categorie === c.categorie ? "#e8761f" : undefined }}
                onClick={() => setCategorie(c.categorie || "")}>
                <div className="titre">{c.categorie || "Sans catégorie"}</div>
                <div className="valeur">{c.nombre}</div>
                <div className="sous">fichier(s)</div>
              </button>
            ))}
            <div className="dash-carte dash-stat">
              <div className="entete"><span className="titre">Espace de stockage</span><span className="dash-note">{d.stockage.pourcentage}%</span></div>
              <div className="dash-progres"><span style={{ width: `${Math.min(100, d.stockage.pourcentage)}%` }} /></div>
              <div className="sous mt-2">{taille(d.stockage.utilise_octets)} sur {taille(d.stockage.limite_octets)} utilisés</div>
            </div>
          </div>

          <section className="dash-carte">
            <h2>Fichiers récents</h2>
            <div className="dash-table-zone">
              <table className="dash-table">
                <thead><tr><th>Nom</th><th>Type</th><th>Taille</th><th>Date d'ajout</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
                <tbody>
                  {d.documents.map((doc) => (
                    <tr key={doc._id}>
                      <td><span className="dash-nom"><span style={{ color: "#e8761f" }}><Icone nom="file" taille={16} /></span>{doc.titre}</span></td>
                      <td>{doc.type}</td>
                      <td>{taille(doc.taille)}</td>
                      <td>{dateFr(doc.date_ajout)}</td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <a className="dash-mini-btn" href={urlFichier(doc.fichier)} target="_blank" rel="noreferrer" aria-label={`Voir ${doc.titre}`}><Icone nom="eye" taille={15} /></a>
                        <a className="dash-mini-btn" href={urlFichier(doc.fichier)} download aria-label={`Télécharger ${doc.titre}`}><Icone nom="download" taille={15} /></a>
                        {String(doc.proprietaire) === String(user.id) && (
                          <button type="button" className="dash-mini-btn" aria-label={`Supprimer ${doc.titre}`} onClick={() => supprimer(doc)}><Icone nom="trash" taille={15} /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {d.documents.length === 0 && <tr><td colSpan="5" className="dash-vide">Aucun document pour le moment.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {edition && <FormulaireDocument valeurs={edition} setValeurs={setEdition} setFichier={setFichier} erreur={erreur} onSubmit={enregistrer} onClose={fermer} />}
    </>
  );
}

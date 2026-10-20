import { useCallback, useEffect, useMemo, useState } from "react";
import { api, urlFichier } from "../../services/api";
import Icone from "../../assets/Components/Icone";
import FormulaireUtilisateur, { enregistrerUtilisateur, versFormulaire, videUtilisateur } from "../../assets/Components/FormulaireUtilisateur";

const CONTRATS = { temps_plein: ["vert", "Temps plein"], vacataire: ["orange", "Vacataire"] };

export default function Enseignants() {
  const [users, setUsers] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [edition, setEdition] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [erreur, setErreur] = useState("");

  const charger = useCallback(() => {
    api("/users", { params: { role: "enseignant" } }).then(setUsers).catch((e) => setErreur(e.message));
  }, []);
  useEffect(() => { charger(); }, [charger]);

  const visibles = useMemo(() => {
    const q = recherche.toLowerCase();
    return users.filter((u) => `${u.nom} ${u.prenom} ${u.specialite || ""}`.toLowerCase().includes(q));
  }, [users, recherche]);

  const fermer = () => { setEdition(null); setPhoto(null); setErreur(""); };

  const enregistrer = async (e) => {
    e.preventDefault();
    setErreur("");
    try {
      await enregistrerUtilisateur(edition, photo);
      fermer();
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  const supprimer = async (u) => {
    if (!window.confirm(`Supprimer ${u.prenom} ${u.nom} ?`)) return;
    try {
      await api(`/users/${u.id}`, { method: "DELETE" });
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  return (
    <>
      <div className="dash-entete-page">
        <div>
          <h1 className="dash-titre">Corps Enseignant</h1>
          <p className="dash-sous">Pilotez les intervenants et leurs spécialités académiques.</p>
        </div>
        <button type="button" className="dash-btn principal" onClick={() => setEdition(videUtilisateur("enseignant"))}>
          <Icone nom="plus" /> Ajouter un enseignant
        </button>
      </div>

      <div className="mb-4" style={{ maxWidth: 420 }}>
        <input className="form-control" placeholder="Rechercher un enseignant…" aria-label="Rechercher un enseignant"
          value={recherche} onChange={(e) => setRecherche(e.target.value)} />
      </div>

      {erreur && !edition && <div className="alert alert-danger">{erreur}</div>}
      {visibles.length === 0 && !erreur && <p className="dash-sous">Aucun enseignant trouvé.</p>}

      <div className="dash-grille-cartes">
        {visibles.map((u) => {
          const [couleur, libelle] = CONTRATS[u.type_contrat] || ["gris", "Contrat non renseigné"];
          return (
            <article className="dash-carte dash-prof" key={u.id}>
              <div className="haut">
                {u.photo ? <img className="dash-avatar grand" src={urlFichier(u.photo)} alt="" />
                  : <div className="dash-avatar grand">{u.prenom?.[0]}{u.nom?.[0]}</div>}
                <div>
                  <strong>{u.prenom} {u.nom}</strong>
                  <div className="specialite">{u.specialite || "Spécialité non renseignée"}</div>
                </div>
              </div>
              <dl className="mb-0">
                <dt>Contact</dt>
                <dd>{u.email}{u.telephone ? ` · ${u.telephone}` : ""}</dd>
              </dl>
              <div className="pied">
                <div>
                  <span className={`dash-tag ${couleur}`}>{libelle}</span>
                  {u.statut === "inactif" && <span className="dash-tag gris ms-2">Inactif</span>}
                </div>
                <div>
                  <a className="dash-mini-btn" href={`mailto:${u.email}`} aria-label={`Écrire à ${u.prenom} ${u.nom}`}><Icone nom="mail" taille={15} /></a>
                  <button type="button" className="dash-mini-btn" aria-label={`Modifier ${u.prenom} ${u.nom}`} onClick={() => setEdition(versFormulaire(u))}><Icone nom="edit" taille={15} /></button>
                  <button type="button" className="dash-mini-btn" aria-label={`Supprimer ${u.prenom} ${u.nom}`} onClick={() => supprimer(u)}><Icone nom="trash" taille={15} /></button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {edition && (
        <FormulaireUtilisateur valeurs={edition} setValeurs={setEdition} roles={["enseignant"]}
          setPhoto={setPhoto} erreur={erreur} onSubmit={enregistrer} onClose={fermer} />
      )}
    </>
  );
}

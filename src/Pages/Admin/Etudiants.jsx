import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, urlFichier } from "../../services/api";
import Icone from "../../assets/Components/Icone";
import FormulaireUtilisateur, { enregistrerUtilisateur, versFormulaire, videUtilisateur } from "../../assets/Components/FormulaireUtilisateur";

const PAR_PAGE = 8;

const exporterCsv = (lignes) => {
  const entetes = ["Nom", "Prénom", "Email", "Téléphone", "N° étudiant", "Formation", "Niveau", "Statut"];
  const echapper = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const contenu = [entetes, ...lignes.map((u) => [u.nom, u.prenom, u.email, u.telephone, u.numero_etudiant, u.formation?.titre, u.niveau, u.statut])]
    .map((l) => l.map(echapper).join(";")).join("\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF" + contenu], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "etudiants.csv";
  a.click();
  URL.revokeObjectURL(url);
};

export default function Etudiants() {
  const [users, setUsers] = useState([]);
  const [formations, setFormations] = useState([]);
  const [filtres, setFiltres] = useState({ formation: "", niveau: "", statut: "" });
  const [recherche, setRecherche] = useState("");
  const [page, setPage] = useState(0);
  const [edition, setEdition] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [erreur, setErreur] = useState("");
  const [params, setParams] = useSearchParams();

  const charger = useCallback(() => {
    api("/users", { params: { role: "etudiant", formation: filtres.formation, statut: filtres.statut } })
      .then(setUsers)
      .catch((e) => setErreur(e.message));
  }, [filtres.formation, filtres.statut]);

  useEffect(() => { charger(); }, [charger]);
  useEffect(() => { api("/formations").then(setFormations).catch(() => {}); }, []);
  // Le lien « Nouvel étudiant » du dashboard ouvre directement le formulaire
  useEffect(() => {
    if (params.get("ajouter")) {
      setEdition(videUtilisateur("etudiant"));
      setParams({}, { replace: true });
    }
  }, [params, setParams]);

  const niveaux = [...new Set(users.map((u) => u.niveau).filter(Boolean))];

  const visibles = useMemo(() => {
    const q = recherche.toLowerCase();
    return users.filter((u) =>
      (!filtres.niveau || u.niveau === filtres.niveau) &&
      `${u.nom} ${u.prenom} ${u.email} ${u.numero_etudiant || ""}`.toLowerCase().includes(q));
  }, [users, filtres.niveau, recherche]);

  const totalPages = Math.max(1, Math.ceil(visibles.length / PAR_PAGE));
  const courante = Math.min(page, totalPages - 1);
  const debut = courante * PAR_PAGE;
  const affiches = visibles.slice(debut, debut + PAR_PAGE);

  const filtrer = (changement) => { setFiltres({ ...filtres, ...changement }); setPage(0); };
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
          <h1 className="dash-titre">Gestion des Étudiants</h1>
          <p className="dash-sous">Consultez la liste des étudiants inscrits, gérez les dossiers et suivez leur statut.</p>
        </div>
        <div className="dash-barre-actions">
          <button type="button" className="dash-btn" onClick={() => exporterCsv(visibles)}><Icone nom="download" /> Exporter CSV</button>
          <button type="button" className="dash-btn" onClick={() => window.print()}><Icone nom="printer" /> Imprimer</button>
          <button type="button" className="dash-btn principal" onClick={() => setEdition(videUtilisateur("etudiant"))}><Icone nom="plus" /> Ajouter étudiant</button>
        </div>
      </div>

      <div className="dash-filtres">
        <div>
          <label htmlFor="rech">Recherche</label>
          <input id="rech" className="form-control" placeholder="Nom, e-mail ou numéro étudiant" value={recherche}
            onChange={(e) => { setRecherche(e.target.value); setPage(0); }} />
        </div>
        <div>
          <label htmlFor="f-formation">Formation</label>
          <select id="f-formation" className="form-select" value={filtres.formation} onChange={(e) => filtrer({ formation: e.target.value })}>
            <option value="">Toutes les filières</option>
            {formations.map((f) => <option key={f._id} value={f._id}>{f.titre}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="f-niveau">Année</label>
          <select id="f-niveau" className="form-select" value={filtres.niveau} onChange={(e) => filtrer({ niveau: e.target.value })}>
            <option value="">Toutes les années</option>
            {niveaux.map((n) => <option key={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="f-statut">Statut du compte</label>
          <select id="f-statut" className="form-select" value={filtres.statut} onChange={(e) => filtrer({ statut: e.target.value })}>
            <option value="">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>
        </div>
      </div>

      {erreur && !edition && <div className="alert alert-danger">{erreur}</div>}

      <section className="dash-carte">
        <div className="dash-table-zone">
          <table className="dash-table">
            <thead>
              <tr><th>Nom complet</th><th>N° étudiant</th><th>Formation</th><th>Année</th><th>Statut</th><th style={{ textAlign: "right" }}>Actions</th></tr>
            </thead>
            <tbody>
              {affiches.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="dash-nom">
                      {u.photo ? <img className="dash-avatar petit" src={urlFichier(u.photo)} alt="" />
                        : <div className="dash-avatar petit">{u.prenom?.[0]}{u.nom?.[0]}</div>}
                      {u.prenom} {u.nom}
                    </div>
                  </td>
                  <td>{u.numero_etudiant || "—"}</td>
                  <td>{u.formation?.titre || "—"}</td>
                  <td>{u.niveau || "—"}</td>
                  <td><span className={`dash-tag ${u.statut === "actif" ? "vert" : "gris"}`}>{u.statut === "actif" ? "Actif" : "Inactif"}</span></td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <button type="button" className="dash-mini-btn" aria-label={`Modifier ${u.prenom} ${u.nom}`} onClick={() => setEdition(versFormulaire(u))}><Icone nom="edit" taille={15} /></button>
                    <button type="button" className="dash-mini-btn" aria-label={`Supprimer ${u.prenom} ${u.nom}`} onClick={() => supprimer(u)}><Icone nom="trash" taille={15} /></button>
                  </td>
                </tr>
              ))}
              {affiches.length === 0 && <tr><td colSpan="6" className="dash-vide">Aucun étudiant trouvé.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="dash-pagination">
          <span>
            {visibles.length === 0 ? "Aucun étudiant" : `Affichage de ${debut + 1}-${debut + affiches.length} sur ${visibles.length} étudiant(s)`}
          </span>
          <div className="d-flex gap-2">
            <button type="button" className="dash-btn" disabled={courante === 0} onClick={() => setPage(courante - 1)}>Précédent</button>
            <button type="button" className="dash-btn principal" disabled={courante >= totalPages - 1} onClick={() => setPage(courante + 1)}>Suivant</button>
          </div>
        </div>
      </section>

      {edition && (
        <FormulaireUtilisateur valeurs={edition} setValeurs={setEdition} formations={formations} roles={["etudiant"]}
          setPhoto={setPhoto} erreur={erreur} onSubmit={enregistrer} onClose={fermer} />
      )}
    </>
  );
}

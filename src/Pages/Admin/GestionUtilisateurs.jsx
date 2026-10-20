import { useCallback, useEffect, useMemo, useState } from "react";
import { api, urlFichier } from "../../services/api";
import { useAuth } from "../../Context/AuthContext";
import Icone from "../../assets/Components/Icone";
import "../../styles/auth.css";

const ROLES = ["super_admin", "admin", "enseignant", "etudiant", "entreprise"];
const CHAMPS = ["nom", "prenom", "email", "mot_de_passe", "role", "statut", "telephone", "adresse",
  "date_naissance", "formation", "niveau", "specialite", "type_contrat"];
const VIDE = Object.fromEntries(CHAMPS.map((c) => [c, ""]));
VIDE.statut = "actif";
const PAR_PAGE = 8;

const nomComplet = (u) => `${u.prenom || ""} ${u.nom || ""}`.trim();
const versFormulaire = (u) => ({
  ...VIDE, id: u.id, nom: u.nom || "", prenom: u.prenom || "", email: u.email || "", role: u.role,
  statut: u.statut || "actif", telephone: u.telephone || "", adresse: u.adresse || "",
  date_naissance: (u.date_naissance || "").slice(0, 10), formation: u.formation?._id || u.formation || "",
  niveau: u.niveau || "", specialite: u.specialite || "", type_contrat: u.type_contrat || "",
});

function Avatar({ u, petit }) {
  const classe = `dash-avatar${petit ? " petit" : ""}`;
  return u.photo ? <img className={classe} src={urlFichier(u.photo)} alt="" />
    : <div className={classe}>{u.prenom?.[0]}{u.nom?.[0]}</div>;
}

// roleFixe : "etudiant" | "enseignant" (sinon tous les rôles, avec filtre)
export default function GestionUtilisateurs({
  roleFixe, titre, sousTitre, libelleAjout, vue = "tableau",
  recherche = "Rechercher…", fichierCsv = "utilisateurs",
}) {
  const { user: moi } = useAuth();
  const [users, setUsers] = useState([]);
  const [formations, setFormations] = useState([]);
  const [filtres, setFiltres] = useState({ role: "", statut: "", formation: "", niveau: "" });
  const [texte, setTexte] = useState("");
  const [page, setPage] = useState(1);
  const [edition, setEdition] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [erreur, setErreur] = useState("");
  const vide = { ...VIDE, role: roleFixe || "etudiant" };

  const charger = useCallback(() => {
    api("/users", { params: { role: roleFixe || filtres.role, statut: filtres.statut, formation: filtres.formation } })
      .then(setUsers).catch((e) => setErreur(e.message));
  }, [roleFixe, filtres.role, filtres.statut, filtres.formation]);
  useEffect(charger, [charger]);
  useEffect(() => { api("/formations").then(setFormations).catch(() => {}); }, []);
  useEffect(() => setPage(1), [texte, filtres, roleFixe]);

  const visibles = useMemo(() => users.filter((u) =>
    (!filtres.niveau || u.niveau === filtres.niveau) &&
    `${nomComplet(u)} ${u.email} ${u.numero_etudiant || ""}`.toLowerCase().includes(texte.toLowerCase())), [users, filtres.niveau, texte]);
  const niveaux = [...new Set(users.map((u) => u.niveau).filter(Boolean))];
  const nbPages = Math.max(1, Math.ceil(visibles.length / PAR_PAGE));
  const debut = (page - 1) * PAR_PAGE;
  const affiches = vue === "tableau" ? visibles.slice(debut, debut + PAR_PAGE) : visibles;

  // Seul le super admin peut gérer les rôles admin / super_admin
  const rolesDispo = moi.role === "super_admin" ? ROLES : ROLES.filter((r) => !["super_admin", "admin"].includes(r));
  const fermer = () => { setEdition(null); setPhoto(null); setErreur(""); };

  const enregistrer = async (e) => {
    e.preventDefault();
    setErreur("");
    try {
      if (edition.id) {
        const fd = new FormData();
        CHAMPS.forEach((c) => edition[c] && fd.append(c, edition[c]));
        if (photo) fd.append("photo", photo);
        await api(`/users/${edition.id}`, { method: "PUT", body: fd });
      } else {
        // La création (POST) n'accepte pas de fichier : la photo s'ajoute ensuite en modification
        await api("/users", { method: "POST", body: Object.fromEntries(CHAMPS.filter((c) => edition[c]).map((c) => [c, edition[c]])) });
      }
      fermer();
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  const supprimer = async (u) => {
    if (!window.confirm(`Supprimer ${nomComplet(u)} ?`)) return;
    try {
      await api(`/users/${u.id}`, { method: "DELETE" });
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  const exporterCsv = () => {
    const cellule = (v) => {
      let t = String(v ?? "");
      if (/^[=+\-@]/.test(t)) t = `'${t}`; // évite l'exécution de formules dans Excel
      return `"${t.replace(/"/g, '""')}"`;
    };
    const lignes = [["Nom", "Prénom", "Email", "Téléphone", "Rôle", "Statut", "N° étudiant", "Formation", "Niveau"],
      ...visibles.map((u) => [u.nom, u.prenom, u.email, u.telephone, u.role, u.statut, u.numero_etudiant, u.formation?.titre, u.niveau])];
    const blob = new Blob(["\ufeff" + lignes.map((l) => l.map(cellule).join(";")).join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${fichierCsv}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const maj = (n) => (e) => setEdition({ ...edition, [n]: e.target.value });
  const champ = (n, l, type = "text", requis = false, placeholder = "") => (
    <div className="col-sm-6 mb-3">
      <label htmlFor={n}>{l}</label>
      <input id={n} type={type} className="form-control" required={requis} placeholder={placeholder} value={edition[n]} onChange={maj(n)} />
    </div>
  );
  const setFiltre = (n) => (e) => setFiltres({ ...filtres, [n]: e.target.value });

  return (
    <>
      <div className="dash-entete-page">
        <div>
          <h1 className="dash-titre">{titre}</h1>
          <p className="dash-sous">{sousTitre}</p>
        </div>
        <div className="dash-actions">
          {vue === "tableau" && (
            <>
              <button type="button" className="btn btn-sombre" onClick={exporterCsv}><Icone nom="download" taille={16} /> Exporter CSV</button>
              <button type="button" className="btn btn-sombre" onClick={() => window.print()}>Imprimer</button>
            </>
          )}
          <button type="button" className="btn btn-orange" onClick={() => setEdition({ ...vide })}>+ {libelleAjout}</button>
        </div>
      </div>

      <div className="dash-filtres">
        <input className="form-control" placeholder={recherche} value={texte} onChange={(e) => setTexte(e.target.value)} aria-label="Rechercher" />
        {!roleFixe && (
          <select className="form-select" value={filtres.role} onChange={setFiltre("role")} aria-label="Rôle">
            <option value="">Tous les rôles</option>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
        )}
        {roleFixe === "etudiant" && (
          <>
            <select className="form-select" value={filtres.formation} onChange={setFiltre("formation")} aria-label="Formation">
              <option value="">Toutes les filières</option>
              {formations.map((f) => <option key={f._id} value={f._id}>{f.titre}</option>)}
            </select>
            <select className="form-select" value={filtres.niveau} onChange={setFiltre("niveau")} aria-label="Année">
              <option value="">Toutes les années</option>
              {niveaux.map((n) => <option key={n}>{n}</option>)}
            </select>
          </>
        )}
        <select className="form-select" value={filtres.statut} onChange={setFiltre("statut")} aria-label="Statut">
          <option value="">Tous les statuts</option>
          <option>actif</option>
          <option>inactif</option>
        </select>
      </div>

      {erreur && !edition && <div className="alert alert-danger">{erreur}</div>}

      {vue === "tableau" ? (
        <section className="dash-carte">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr><th>Nom complet</th><th>{roleFixe ? "Formation" : "Rôle"}</th><th>{roleFixe ? "Année" : "Email"}</th><th>N° étudiant</th><th>Statut</th><th /></tr>
              </thead>
              <tbody>
                {affiches.map((u) => (
                  <tr key={u.id}>
                    <td><div className="dash-personne"><Avatar u={u} petit /> {nomComplet(u)}</div></td>
                    <td>{roleFixe ? (u.formation?.titre || "—") : u.role}</td>
                    <td>{roleFixe ? (u.niveau || "—") : u.email}</td>
                    <td>{u.numero_etudiant || "—"}</td>
                    <td><span className={`dash-tag ${u.statut === "actif" ? "vert" : "gris"}`}>{u.statut}</span></td>
                    <td className="text-end text-nowrap">
                      <button className="btn btn-sm btn-bleu me-2" onClick={() => setEdition(versFormulaire(u))}>Modifier</button>
                      <button className="btn btn-sm btn-outline-danger" disabled={u.id === moi.id} onClick={() => supprimer(u)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
                {affiches.length === 0 && <tr><td colSpan="6" className="text-center" style={{ color: "#8c9bbd" }}>Aucun résultat</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="dash-pagination">
            <span>Affichage de {visibles.length ? debut + 1 : 0}-{Math.min(debut + PAR_PAGE, visibles.length)} sur {visibles.length}</span>
            <span className="d-flex gap-2">
              <button type="button" className="btn btn-sombre btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Précédent</button>
              <button type="button" className="btn btn-orange btn-sm" disabled={page >= nbPages} onClick={() => setPage(page + 1)}>Suivant</button>
            </span>
          </div>
        </section>
      ) : (
        <div className="dash-grille-cartes">
          {affiches.map((u) => (
            <article className="dash-carte dash-prof" key={u.id}>
              <div className="haut">
                <Avatar u={u} />
                <div><strong>{nomComplet(u)}</strong><div className="spec">{u.specialite || "Spécialité non renseignée"}</div></div>
              </div>
              <div className="bas">
                <span className={`dash-tag ${u.type_contrat === "temps_plein" ? "vert" : u.type_contrat ? "" : "gris"}`}>
                  {u.type_contrat === "temps_plein" ? "Temps plein" : u.type_contrat === "vacataire" ? "Vacataire" : "Contrat non renseigné"}
                </span>
                <span>
                  <a href={`mailto:${u.email}`} aria-label={`Écrire à ${nomComplet(u)}`}><Icone nom="mail" taille={16} /></a>
                  <button type="button" aria-label="Modifier" onClick={() => setEdition(versFormulaire(u))}><Icone nom="edit" taille={16} /></button>
                  <button type="button" aria-label="Supprimer" disabled={u.id === moi.id} onClick={() => supprimer(u)}>✕</button>
                </span>
              </div>
            </article>
          ))}
          {affiches.length === 0 && <p className="dash-vide">Aucun résultat</p>}
        </div>
      )}

      {edition && (
        <div className="overlay">
          <form className="auth-card large" onSubmit={enregistrer} style={{ maxHeight: "90vh", overflowY: "auto" }}>
            <h1>{edition.id ? "Modifier" : libelleAjout}</h1>
            <div className="row">
              {champ("nom", "Nom", "text", true, "Nom de famille")}
              {champ("prenom", "Prénom", "text", true, "Prénom")}
              {champ("email", "Email", "email", true, "exemple@email.com")}
              {champ("mot_de_passe", edition.id ? "Nouveau mot de passe (optionnel)" : "Mot de passe", "password", !edition.id, "Mot de passe")}
              {!roleFixe && (
                <div className="col-sm-6 mb-3">
                  <label htmlFor="role">Rôle</label>
                  <select id="role" className="form-select" value={edition.role} onChange={maj("role")}>
                    {rolesDispo.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
              )}
              <div className="col-sm-6 mb-3">
                <label htmlFor="statut">Statut</label>
                <select id="statut" className="form-select" value={edition.statut} onChange={maj("statut")}>
                  <option>actif</option>
                  <option>inactif</option>
                </select>
              </div>
              {champ("telephone", "Téléphone", "tel", false, "034 00 000 00")}
              {champ("date_naissance", "Date de naissance", "date")}
              <div className="col-12 mb-3">
                <label htmlFor="adresse">Adresse</label>
                <input id="adresse" className="form-control" placeholder="Adresse complète" value={edition.adresse} onChange={maj("adresse")} />
              </div>
              {edition.role === "etudiant" && (
                <>
                  <div className="col-sm-6 mb-3">
                    <label htmlFor="formation">Formation</label>
                    <select id="formation" className="form-select" value={edition.formation} onChange={maj("formation")}>
                      <option value="">— Aucune —</option>
                      {formations.map((f) => <option key={f._id} value={f._id}>{f.titre}</option>)}
                    </select>
                  </div>
                  {champ("niveau", "Niveau", "text", false, "Ex : L3")}
                </>
              )}
              {edition.role === "enseignant" && (
                <>
                  {champ("specialite", "Spécialité", "text", false, "Ex : Cybersécurité")}
                  <div className="col-sm-6 mb-3">
                    <label htmlFor="contrat">Type de contrat</label>
                    <select id="contrat" className="form-select" value={edition.type_contrat} onChange={maj("type_contrat")}>
                      <option value="">—</option>
                      <option value="temps_plein">Temps plein</option>
                      <option value="vacataire">Vacataire</option>
                    </select>
                  </div>
                </>
              )}
              {edition.id && (
                <div className="col-12 mb-3">
                  <label htmlFor="photo">Photo</label>
                  <input id="photo" type="file" accept="image/*" className="form-control" onChange={(e) => setPhoto(e.target.files[0])} />
                </div>
              )}
            </div>
            {erreur && <div className="alert alert-danger">{erreur}</div>}
            <div className="d-flex gap-2">
              <button className="btn btn-orange flex-grow-1">Enregistrer</button>
              <button type="button" className="btn btn-outline-light" onClick={fermer}>Annuler</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

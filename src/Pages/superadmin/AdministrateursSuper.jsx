import { useCallback, useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../Context/AuthContext";
import Icone from "../../assets/Components/Icone";
import FormulaireUtilisateur, { enregistrerUtilisateur, versFormulaire, videUtilisateur } from "../../assets/Components/FormulaireUtilisateur";
import { dateFr, nomPersonne } from "../../services/format";

const ROLES = { super_admin: ["orange", "Super admin"], admin: ["vert", "Admin"] };

export default function AdministrateursSuper() {
  const { user: moi } = useAuth();
  const [liste, setListe] = useState([]);
  const [edition, setEdition] = useState(null);
  const [erreur, setErreur] = useState("");

  const charger = useCallback(() => {
    Promise.all([api("/users", { params: { role: "admin" } }), api("/users", { params: { role: "super_admin" } })])
      .then(([a, s]) => setListe([...s, ...a]))
      .catch((e) => setErreur(e.message));
  }, []);
  useEffect(() => { charger(); }, [charger]);

  const fermer = () => { setEdition(null); setErreur(""); };

  const enregistrer = async (e) => {
    e.preventDefault();
    setErreur("");
    try {
      await enregistrerUtilisateur(edition, null);
      fermer();
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };
  const supprimer = async (u) => {
    if (!window.confirm(`Supprimer le compte de ${nomPersonne(u)} ?`)) return;
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
          <h1 className="dash-titre">Administrateurs</h1>
          <p className="dash-sous">Gérez les comptes qui ont accès à l'administration de la plateforme.</p>
        </div>
        <button type="button" className="dash-btn principal" onClick={() => setEdition(videUtilisateur("admin"))}><Icone nom="plus" /> Nouvel administrateur</button>
      </div>

      {erreur && !edition && <div className="alert alert-danger">{erreur}</div>}

      <section className="dash-carte">
        <div className="dash-table-zone">
          <table className="dash-table">
            <thead><tr><th>Nom</th><th>E-mail</th><th>Téléphone</th><th>Rôle</th><th>Statut</th><th>Inscrit le</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
            <tbody>
              {liste.map((u) => {
                const [couleur, libelle] = ROLES[u.role] || ["gris", u.role];
                return (
                  <tr key={u.id}>
                    <td><strong>{nomPersonne(u)}</strong></td>
                    <td>{u.email}</td>
                    <td>{u.telephone || "—"}</td>
                    <td><span className={`dash-tag ${couleur}`}>{libelle}</span></td>
                    <td><span className={`dash-tag ${u.statut === "actif" ? "vert" : "gris"}`}>{u.statut === "actif" ? "Actif" : "Inactif"}</span></td>
                    <td>{dateFr(u.date_inscription)}</td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <button type="button" className="dash-mini-btn" aria-label={`Modifier ${nomPersonne(u)}`} onClick={() => setEdition(versFormulaire(u))}><Icone nom="edit" taille={15} /></button>
                      <button type="button" className="dash-mini-btn" aria-label={`Supprimer ${nomPersonne(u)}`} disabled={u.id === moi.id} onClick={() => supprimer(u)}><Icone nom="trash" taille={15} /></button>
                    </td>
                  </tr>
                );
              })}
              {liste.length === 0 && <tr><td colSpan="7" className="dash-vide">Aucun administrateur.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {edition && (
        <FormulaireUtilisateur valeurs={edition} setValeurs={setEdition} roles={["admin", "super_admin"]}
          setPhoto={() => {}} erreur={erreur} onSubmit={enregistrer} onClose={fermer} />
      )}
    </>
  );
}

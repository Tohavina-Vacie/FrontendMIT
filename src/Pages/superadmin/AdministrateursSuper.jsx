import { useCallback, useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../Context/AuthContext";
import Icone from "../../assets/Components/Icone";
import Modale, { Champ } from "../../assets/Components/Modale";
import ChampMotDePasse from "../../assets/Components/ChampMotDePasse";
import { depuis, nomPersonne } from "../../services/format";

const ROLES = { super_admin: ["orange", "Super admin"], admin: ["vert", "Admin"] };
const BASE = "/super-admin/administrateurs";

export default function AdministrateursSuper() {
  const { user: moi } = useAuth();
  const [liste, setListe] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [modale, setModale] = useState(null); // { type, ... }
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");

  const charger = useCallback(() => {
    api(BASE).then(setListe).catch((e) => setErreur(e.message));
  }, []);
  useEffect(() => { charger(); }, [charger]);

  const ouvrir = async (m) => {
    setErreur(""); setMessage("");
    if (m.type === "designer") {
      try {
        const tous = await api("/users");
        setUtilisateurs(tous.filter((u) => !["admin", "super_admin"].includes(u.role) && u.statut === "actif"));
      } catch (err) { return setErreur(err.message); }
    }
    setModale(m);
  };
  const fermer = () => { setModale(null); setErreur(""); };

  // Envoie la requête de la fenêtre ouverte, puis recharge la liste
  const valider = (appel, succes) => async (e) => {
    e.preventDefault();
    setErreur("");
    try {
      await appel();
      setMessage(succes);
      setModale(null);
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  const statut = async (a) => {
    setErreur(""); setMessage("");
    try {
      await api(`${BASE}/${a._id}/statut`, { method: "PUT", body: { statut: a.statut === "actif" ? "inactif" : "actif" } });
      charger();
    } catch (err) { setErreur(err.message); }
  };
  const supprimer = async (a) => {
    if (!window.confirm(`Supprimer le compte de ${nomPersonne(a)} ?`)) return;
    setErreur(""); setMessage("");
    try {
      await api(`${BASE}/${a._id}`, { method: "DELETE" });
      charger();
    } catch (err) { setErreur(err.message); }
  };

  const maj = (n) => (e) => setModale({ ...modale, [n]: e.target.value });

  return (
    <>
      <div className="dash-entete-page">
        <div>
          <h1 className="dash-titre">Administrateurs</h1>
          <p className="dash-sous">Gérez les comptes qui ont accès à l'administration de la plateforme.</p>
        </div>
        <div className="dash-barre-actions">
          <button type="button" className="dash-btn" onClick={() => ouvrir({ type: "designer", utilisateur: "", role: "admin" })}>Désigner un utilisateur</button>
          <button type="button" className="dash-btn principal" onClick={() => ouvrir({ type: "creer", nom: "", prenom: "", email: "", mot_de_passe: "", role: "admin" })}><Icone nom="plus" /> Nouvel administrateur</button>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {erreur && !modale && <div className="alert alert-danger">{erreur}</div>}

      <section className="dash-carte">
        <div className="dash-table-zone">
          <table className="dash-table">
            <thead><tr><th>Nom</th><th>E-mail</th><th>Rôle</th><th>Dernière connexion</th><th>Statut</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
            <tbody>
              {liste.map((a) => {
                const [couleur, libelle] = ROLES[a.role] || ["gris", a.role];
                const moiMeme = a._id === moi.id;
                return (
                  <tr key={a._id}>
                    <td><strong>{nomPersonne(a)}</strong>{moiMeme && <span className="dash-tag gris ms-2">Vous</span>}</td>
                    <td>{a.email}</td>
                    <td><span className={`dash-tag ${couleur}`}>{libelle}</span></td>
                    <td>{depuis(a.derniere_connexion)}</td>
                    <td><span className={`dash-tag ${a.statut === "actif" ? "vert" : "gris"}`}>{a.statut === "actif" ? "Actif" : "Inactif"}</span></td>
                    <td style={{ textAlign: "right" }}>
                      <div className="d-flex gap-1 justify-content-end flex-wrap">
                        <button type="button" className="dash-btn petit" onClick={() => ouvrir({ type: "mdp", cible: a, mot_de_passe: "" })}>Mot de passe</button>
                        <button type="button" className="dash-btn petit" disabled={moiMeme} onClick={() => statut(a)}>{a.statut === "actif" ? "Désactiver" : "Réactiver"}</button>
                        <button type="button" className="dash-btn petit" disabled={moiMeme} onClick={() => ouvrir({ type: "revoquer", cible: a, role: "enseignant" })}>Retirer les droits</button>
                        <button type="button" className="dash-mini-btn" disabled={moiMeme} aria-label={`Supprimer ${nomPersonne(a)}`} onClick={() => supprimer(a)}><Icone nom="trash" taille={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {liste.length === 0 && <tr><td colSpan="6" className="dash-vide">Aucun administrateur.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {modale?.type === "creer" && (
        <Modale titre="Nouvel administrateur" onSubmit={valider(() => api(BASE, { method: "POST", body: { nom: modale.nom, prenom: modale.prenom, email: modale.email, mot_de_passe: modale.mot_de_passe, role: modale.role } }), "Administrateur créé.")} onClose={fermer} erreur={erreur}>
          <Champ id="a-nom" label="Nom"><input id="a-nom" className="form-control" required placeholder="Nom" value={modale.nom} onChange={maj("nom")} /></Champ>
          <Champ id="a-prenom" label="Prénom"><input id="a-prenom" className="form-control" required placeholder="Prénom" value={modale.prenom} onChange={maj("prenom")} /></Champ>
          <Champ id="a-email" label="E-mail"><input id="a-email" type="email" className="form-control" required placeholder="exemple@email.com" value={modale.email} onChange={maj("email")} /></Champ>
          <Champ id="a-mdp" label="Mot de passe"><ChampMotDePasse id="a-mdp" name="mdp" placeholder="Mot de passe" autoComplete="new-password" value={modale.mot_de_passe} onChange={maj("mot_de_passe")} /></Champ>
          <Champ id="a-role" label="Rôle" className="mb-4">
            <select id="a-role" className="form-select" value={modale.role} onChange={maj("role")}><option value="admin">Admin</option><option value="super_admin">Super admin</option></select>
          </Champ>
        </Modale>
      )}

      {modale?.type === "designer" && (
        <Modale titre="Désigner un administrateur" envoi="Désigner" onSubmit={valider(() => api(`${BASE}/${modale.utilisateur}/designer`, { method: "PUT", body: { role: modale.role } }), "Droits d'administration accordés.")} onClose={fermer} erreur={erreur}>
          <p style={{ color: "#c9d6f5", fontSize: ".9rem" }}>Donne les droits d'administration à un compte existant. Ses sessions ouvertes seront fermées.</p>
          <Champ id="d-user" label="Utilisateur">
            <select id="d-user" className="form-select" required value={modale.utilisateur} onChange={maj("utilisateur")}>
              <option value="" disabled>Choisissez un utilisateur</option>
              {utilisateurs.map((u) => <option key={u.id} value={u.id}>{nomPersonne(u)} ({u.role})</option>)}
            </select>
          </Champ>
          <Champ id="d-role" label="Nouveau rôle" className="mb-4">
            <select id="d-role" className="form-select" value={modale.role} onChange={maj("role")}><option value="admin">Admin</option><option value="super_admin">Super admin</option></select>
          </Champ>
        </Modale>
      )}

      {modale?.type === "mdp" && (
        <Modale titre={`Mot de passe de ${nomPersonne(modale.cible)}`} envoi="Réinitialiser" onSubmit={valider(() => api(`${BASE}/${modale.cible._id}/mot-de-passe`, { method: "PUT", body: { mot_de_passe: modale.mot_de_passe } }), "Mot de passe réinitialisé : ses sessions ont été fermées.")} onClose={fermer} erreur={erreur}>
          <Champ id="m-mdp" label="Nouveau mot de passe" className="mb-4"><ChampMotDePasse id="m-mdp" name="mdp" placeholder="Nouveau mot de passe" autoComplete="new-password" value={modale.mot_de_passe} onChange={maj("mot_de_passe")} /></Champ>
        </Modale>
      )}

      {modale?.type === "revoquer" && (
        <Modale titre={`Retirer les droits de ${nomPersonne(modale.cible)}`} envoi="Retirer les droits" onSubmit={valider(() => api(`${BASE}/${modale.cible._id}/revoquer`, { method: "PUT", body: { role: modale.role } }), "Droits d'administration retirés.")} onClose={fermer} erreur={erreur}>
          <p style={{ color: "#c9d6f5", fontSize: ".9rem" }}>Le compte reste actif avec un rôle ordinaire. Le dernier super admin ne peut pas être retiré.</p>
          <Champ id="r-role" label="Nouveau rôle" className="mb-4">
            <select id="r-role" className="form-select" value={modale.role} onChange={maj("role")}><option value="enseignant">Enseignant</option><option value="etudiant">Étudiant</option><option value="entreprise">Entreprise</option></select>
          </Champ>
        </Modale>
      )}
    </>
  );
}

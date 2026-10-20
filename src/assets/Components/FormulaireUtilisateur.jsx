import { api } from "../../services/api";
import "../../styles/auth.css";

export const CHAMPS = ["nom", "prenom", "email", "mot_de_passe", "role", "statut", "telephone", "adresse",
  "date_naissance", "formation", "niveau", "specialite", "type_contrat"];

export const videUtilisateur = (role = "etudiant") => ({
  ...Object.fromEntries(CHAMPS.map((c) => [c, ""])),
  role,
  statut: "actif",
});

// Transforme un utilisateur reçu de l'API en valeurs de formulaire
export const versFormulaire = (u) => ({
  ...videUtilisateur(u.role),
  id: u.id,
  nom: u.nom || "", prenom: u.prenom || "", email: u.email || "",
  statut: u.statut || "actif",
  telephone: u.telephone || "", adresse: u.adresse || "",
  date_naissance: (u.date_naissance || "").slice(0, 10),
  formation: u.formation?._id || u.formation || "",
  niveau: u.niveau || "", specialite: u.specialite || "", type_contrat: u.type_contrat || "",
});

// Création (POST, sans fichier) ou modification (PUT, photo possible)
export function enregistrerUtilisateur(v, photo) {
  if (v.id) {
    const fd = new FormData();
    CHAMPS.forEach((c) => v[c] && fd.append(c, v[c]));
    if (photo) fd.append("photo", photo);
    return api(`/users/${v.id}`, { method: "PUT", body: fd });
  }
  const donnees = Object.fromEntries(CHAMPS.filter((c) => v[c]).map((c) => [c, v[c]]));
  return api("/users", { method: "POST", body: donnees });
}

export default function FormulaireUtilisateur({ valeurs, setValeurs, formations = [], roles, setPhoto, erreur, onSubmit, onClose }) {
  const maj = (n) => (e) => setValeurs({ ...valeurs, [n]: e.target.value });
  const champ = (n, l, type = "text", requis = false, placeholder = "") => (
    <div className="col-sm-6 mb-3">
      <label htmlFor={`u-${n}`}>{l}</label>
      <input id={`u-${n}`} type={type} className="form-control" required={requis} placeholder={placeholder}
        value={valeurs[n]} onChange={maj(n)} />
    </div>
  );
  const nomRole = { etudiant: "étudiant", enseignant: "enseignant" }[valeurs.role] || "utilisateur";

  return (
    <div className="overlay">
      <form className="auth-card large" onSubmit={onSubmit} style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <h1>{valeurs.id ? `Modifier ${nomRole === "utilisateur" ? "l'utilisateur" : `l'${nomRole}`}` : `Nouvel ${nomRole}`}</h1>
        <div className="row">
          {champ("nom", "Nom", "text", true, "Nom de famille")}
          {champ("prenom", "Prénom", "text", true, "Prénom")}
          {champ("email", "Email", "email", true, "exemple@email.com")}
          {champ("mot_de_passe", valeurs.id ? "Nouveau mot de passe (optionnel)" : "Mot de passe", "password", !valeurs.id, "Mot de passe")}
          {roles.length > 1 && (
            <div className="col-sm-6 mb-3">
              <label htmlFor="u-role">Rôle</label>
              <select id="u-role" className="form-select" value={valeurs.role} onChange={maj("role")}>
                {roles.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
          )}
          <div className="col-sm-6 mb-3">
            <label htmlFor="u-statut">Statut</label>
            <select id="u-statut" className="form-select" value={valeurs.statut} onChange={maj("statut")}>
              <option>actif</option>
              <option>inactif</option>
            </select>
          </div>
          {champ("telephone", "Téléphone", "tel", false, "034 00 000 00")}
          {champ("date_naissance", "Date de naissance", "date")}
          <div className="col-12 mb-3">
            <label htmlFor="u-adresse">Adresse</label>
            <input id="u-adresse" className="form-control" placeholder="Adresse complète" value={valeurs.adresse} onChange={maj("adresse")} />
          </div>

          {valeurs.role === "etudiant" && (
            <>
              <div className="col-sm-6 mb-3">
                <label htmlFor="u-formation">Formation</label>
                <select id="u-formation" className="form-select" value={valeurs.formation} onChange={maj("formation")}>
                  <option value="">— Aucune —</option>
                  {formations.map((f) => <option key={f._id} value={f._id}>{f.titre}</option>)}
                </select>
              </div>
              {champ("niveau", "Niveau", "text", false, "Ex : Bachelor 1")}
            </>
          )}
          {valeurs.role === "enseignant" && (
            <>
              {champ("specialite", "Spécialité", "text", false, "Ex : Génie logiciel")}
              <div className="col-sm-6 mb-3">
                <label htmlFor="u-contrat">Type de contrat</label>
                <select id="u-contrat" className="form-select" value={valeurs.type_contrat} onChange={maj("type_contrat")}>
                  <option value="">—</option>
                  <option value="temps_plein">Temps plein</option>
                  <option value="vacataire">Vacataire</option>
                </select>
              </div>
            </>
          )}
          {valeurs.id && (
            <div className="col-12 mb-3">
              <label htmlFor="u-photo">Photo</label>
              <input id="u-photo" type="file" accept="image/*" className="form-control" onChange={(e) => setPhoto(e.target.files[0])} />
            </div>
          )}
        </div>
        {erreur && <div className="alert alert-danger">{erreur}</div>}
        <div className="d-flex gap-2">
          <button className="btn btn-orange flex-grow-1">Enregistrer</button>
          <button type="button" className="btn btn-outline-light" onClick={onClose}>Annuler</button>
        </div>
      </form>
    </div>
  );
}

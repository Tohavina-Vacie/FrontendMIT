import { api } from "../../services/api";
import { typeFichier } from "../../services/format";
import Modale, { Champ } from "./Modale";

export const documentVide = (admin) => ({ titre: "", categorie: "", visibilite: admin ? "public" : "prive", formation: "" });

// Envoi multipart : le fichier part dans le champ « fichier », comme l'attend la route
export function envoyerDocument(v, fichier) {
  if (fichier && fichier.size > 5 * 1024 * 1024) return Promise.reject(new Error("Le fichier dépasse la taille maximale de 5 Mo"));
  const fd = new FormData();
  ["titre", "categorie", "visibilite", "formation"].forEach((c) => v[c] && fd.append(c, v[c]));
  if (fichier) {
    fd.append("fichier", fichier);
    fd.append("type", typeFichier(fichier.name));
  } else if (v.type) {
    fd.append("type", v.type);
  }
  return v.id ? api(`/documents/${v.id}`, { method: "PUT", body: fd }) : api("/documents", { method: "POST", body: fd });
}

export default function FormulaireDocument({ admin = false, formations = [], valeurs, setValeurs, setFichier, erreur, onSubmit, onClose }) {
  const maj = (n) => (e) => setValeurs({ ...valeurs, [n]: e.target.value });
  return (
    <Modale titre={valeurs.id ? "Modifier le document" : "Ajouter un document"} onSubmit={onSubmit} onClose={onClose} erreur={erreur}>
      <Champ id="d-titre" label="Titre">
        <input id="d-titre" className="form-control" required placeholder="Ex : Cours_Python_S4" value={valeurs.titre} onChange={maj("titre")} />
      </Champ>
      <Champ id="d-cat" label="Catégorie">
        <input id="d-cat" className="form-control" list="d-categories" placeholder="Ex : Cours, Projets, Administratif"
          value={valeurs.categorie} onChange={maj("categorie")} />
        <datalist id="d-categories">
          <option value="Cours" /><option value="Projets" /><option value="Administratif" /><option value="Relevés de notes" />
        </datalist>
      </Champ>
      {admin && (
        <>
          <Champ id="d-vis" label="Visibilité">
            <select id="d-vis" className="form-select" value={valeurs.visibilite} onChange={maj("visibilite")}>
              <option value="public">Public (visible par tous)</option>
              <option value="formation">Réservé à une formation</option>
            </select>
          </Champ>
          {valeurs.visibilite === "formation" && (
            <Champ id="d-form" label="Formation">
              <select id="d-form" className="form-select" required value={valeurs.formation} onChange={maj("formation")}>
                <option value="" disabled>Choisissez une formation</option>
                {formations.map((f) => <option key={f._id} value={f._id}>{f.titre}</option>)}
              </select>
            </Champ>
          )}
        </>
      )}
      <Champ id="d-fichier" label={valeurs.id ? "Remplacer le fichier (optionnel)" : "Fichier"} className="mb-4">
        <input id="d-fichier" type="file" className="form-control" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" required={!valeurs.id} onChange={(e) => setFichier(e.target.files[0])} />
        <small style={{ color: "#8c9bbd" }}>PDF, Word ou image (JPG, PNG, WebP) — 5 Mo maximum.</small>
      </Champ>
    </Modale>
  );
}

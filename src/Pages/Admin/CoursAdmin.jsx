import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../services/api";
import Icone from "../../assets/Components/Icone";
import Modale, { Champ } from "../../assets/Components/Modale";
import { nomPersonne } from "../../services/format";

const NOMBRES = ["ects", "coefficient", "heures_semaine"];
const VIDE = { titre: "", code: "", description: "", formation: "", niveau: "", semestre: "", enseignant: "", ects: "", coefficient: "1", heures_semaine: "" };

const versFormulaire = (c) => ({
  ...VIDE, ...Object.fromEntries(Object.keys(VIDE).map((k) => [k, c[k] == null ? "" : String(c[k])])),
  _id: c._id, formation: c.formation?._id || "", enseignant: c.enseignant?._id || "",
});

export default function CoursAdmin() {
  const [cours, setCours] = useState([]);
  const [formations, setFormations] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [filtre, setFiltre] = useState("");
  const [edition, setEdition] = useState(null);
  const [erreur, setErreur] = useState("");
  const [params, setParams] = useSearchParams();

  const charger = useCallback(() => {
    api("/cours", { params: { formation: filtre } }).then(setCours).catch((e) => setErreur(e.message));
  }, [filtre]);
  useEffect(() => { charger(); }, [charger]);
  useEffect(() => {
    api("/formations").then(setFormations).catch(() => {});
    api("/users", { params: { role: "enseignant" } }).then(setEnseignants).catch(() => {});
  }, []);
  useEffect(() => {
    if (params.get("ajouter")) { setEdition({ ...VIDE }); setParams({}, { replace: true }); }
  }, [params, setParams]);

  const maj = (n) => (e) => setEdition({ ...edition, [n]: e.target.value });
  const fermer = () => { setEdition(null); setErreur(""); };

  const enregistrer = async (e) => {
    e.preventDefault();
    setErreur("");
    const body = {};
    Object.keys(VIDE).forEach((k) => {
      if (edition[k] !== "") body[k] = NOMBRES.includes(k) ? Number(edition[k]) : edition[k];
    });
    try {
      if (edition._id) await api(`/cours/${edition._id}`, { method: "PUT", body });
      else await api("/cours", { method: "POST", body });
      fermer();
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  const supprimer = async (c) => {
    if (!window.confirm(`Supprimer le cours « ${c.titre} » ?`)) return;
    try {
      await api(`/cours/${c._id}`, { method: "DELETE" });
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  const champ = (n, l, type = "text", requis = false, placeholder = "", extra = {}) => (
    <Champ id={`c-${n}`} label={l} className="col-sm-6 mb-3">
      <input id={`c-${n}`} type={type} className="form-control" required={requis} placeholder={placeholder} value={edition[n]} onChange={maj(n)} {...extra} />
    </Champ>
  );

  return (
    <>
      <div className="dash-entete-page">
        <div>
          <h1 className="dash-titre">Cours</h1>
          <p className="dash-sous">Modules enseignés par formation, niveau et semestre.</p>
        </div>
        <button type="button" className="dash-btn principal" onClick={() => setEdition({ ...VIDE })}><Icone nom="plus" /> Ajouter un cours</button>
      </div>

      <div className="mb-3" style={{ maxWidth: 320 }}>
        <select className="form-select" aria-label="Filtrer par formation" value={filtre} onChange={(e) => setFiltre(e.target.value)}>
          <option value="">Toutes les formations</option>
          {formations.map((f) => <option key={f._id} value={f._id}>{f.titre}</option>)}
        </select>
      </div>

      {erreur && !edition && <div className="alert alert-danger">{erreur}</div>}

      <section className="dash-carte">
        <div className="dash-table-zone">
          <table className="dash-table">
            <thead><tr><th>Cours</th><th>Formation</th><th>Niveau</th><th>Semestre</th><th>Enseignant</th><th>ECTS</th><th>Coef.</th><th>H/sem</th><th></th></tr></thead>
            <tbody>
              {cours.map((c) => (
                <tr key={c._id}>
                  <td><strong>{c.titre}</strong>{c.code && <small className="d-block" style={{ color: "#8c9bbd" }}>{c.code}</small>}</td>
                  <td>{c.formation?.titre || "—"}</td><td>{c.niveau}</td><td>{c.semestre}</td>
                  <td>{nomPersonne(c.enseignant) || "—"}</td><td>{c.ects}</td><td>{c.coefficient}</td><td>{c.heures_semaine}</td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <button type="button" className="dash-mini-btn" aria-label={`Modifier ${c.titre}`} onClick={() => setEdition(versFormulaire(c))}><Icone nom="edit" taille={15} /></button>
                    <button type="button" className="dash-mini-btn" aria-label={`Supprimer ${c.titre}`} onClick={() => supprimer(c)}><Icone nom="trash" taille={15} /></button>
                  </td>
                </tr>
              ))}
              {cours.length === 0 && <tr><td colSpan="9" className="dash-vide">Aucun cours enregistré.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {edition && (
        <Modale large titre={edition._id ? "Modifier le cours" : "Nouveau cours"} onSubmit={enregistrer} onClose={fermer} erreur={erreur}>
          <div className="row">
            {champ("titre", "Titre", "text", true, "Ex : Algorithmique avancée")}
            {champ("code", "Code (optionnel)", "text", false, "Ex : ALGO-301")}
            <Champ id="c-formation" label="Formation" className="col-sm-6 mb-3">
              <select id="c-formation" className="form-select" required value={edition.formation} onChange={maj("formation")}>
                <option value="" disabled>Choisissez une formation</option>
                {formations.map((f) => <option key={f._id} value={f._id}>{f.titre}</option>)}
              </select>
            </Champ>
            {champ("niveau", "Niveau", "text", true, "Ex : Bachelor 1")}
            {champ("semestre", "Semestre", "text", true, "Ex : S4")}
            <Champ id="c-enseignant" label="Enseignant" className="col-sm-6 mb-3">
              <select id="c-enseignant" className="form-select" value={edition.enseignant} onChange={maj("enseignant")}>
                <option value="">— À définir —</option>
                {enseignants.map((u) => <option key={u.id} value={u.id}>{nomPersonne(u)}</option>)}
              </select>
            </Champ>
            {champ("ects", "Crédits ECTS", "number", true, "", { min: 0 })}
            {champ("coefficient", "Coefficient", "number", false, "", { min: 0, step: "0.5" })}
            {champ("heures_semaine", "Heures par semaine", "number", false, "", { min: 0 })}
            <Champ id="c-description" label="Description (optionnel)" className="col-12 mb-3">
              <textarea id="c-description" rows="2" className="form-control" value={edition.description} onChange={maj("description")} />
            </Champ>
          </div>
        </Modale>
      )}
    </>
  );
}

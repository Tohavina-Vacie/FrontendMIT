import { useCallback, useEffect, useState } from "react";
import { api } from "../../services/api";
import Icone from "../../assets/Components/Icone";

const arrondi = (n) => Math.round(n * 100) / 100;
const versNombre = (v) => (v === "" || v === null || v === undefined ? null : Number(v));
const moyenneLocale = (l) => {
  const [a, b, c] = [l.cc1, l.cc2, l.examen].map(versNombre);
  return a === null || b === null || c === null ? null : arrondi(a * 0.2 + b * 0.3 + c * 0.5);
};

const TRANCHES = [
  ["[16 - 20] Excellent", (m) => m >= 16],
  ["[12 - 16] Bien", (m) => m >= 12 && m < 16],
  ["[10 - 12] Passable", (m) => m >= 10 && m < 12],
  ["[0 - 10] Insuffisant", (m) => m < 10],
];

export default function NotesAdmin() {
  const [formations, setFormations] = useState([]);
  const [formation, setFormation] = useState("");
  const [coursListe, setCoursListe] = useState([]);
  const [coursId, setCoursId] = useState("");
  const [data, setData] = useState(null);
  const [lignes, setLignes] = useState([]);
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    api("/formations").then((f) => { setFormations(f); if (f[0]) setFormation(f[0]._id); }).catch((e) => setErreur(e.message));
  }, []);
  useEffect(() => {
    if (!formation) return;
    api("/cours", { params: { formation } }).then((c) => { setCoursListe(c); setCoursId(c[0]?._id || ""); }).catch((e) => setErreur(e.message));
  }, [formation]);

  const charger = useCallback(() => {
    if (!coursId) { setData(null); setLignes([]); return; }
    api(`/notes/cours/${coursId}`).then((d) => {
      setData(d);
      setLignes(d.notes.map((n) => ({ ...n, cc1: n.cc1 ?? "", cc2: n.cc2 ?? "", examen: n.examen ?? "", modifie: false })));
    }).catch((e) => setErreur(e.message));
  }, [coursId]);
  useEffect(() => { setMessage(""); setErreur(""); charger(); }, [charger]);

  const change = (i, champ, valeur) => setLignes((l) => l.map((x, j) => (j === i ? { ...x, [champ]: valeur, modifie: true } : x)));
  const modifiees = lignes.filter((l) => l.modifie);
  const toutesValidees = lignes.length > 0 && lignes.every((l) => l.validee);

  const enregistrer = async () => {
    setMessage(""); setErreur("");
    if (!modifiees.length) return setMessage("Aucune modification à enregistrer.");
    try {
      await api("/notes/saisie", { method: "POST", body: { cours: coursId, notes: modifiees.map((l) => ({ etudiant: l.etudiant._id, cc1: versNombre(l.cc1), cc2: versNombre(l.cc2), examen: versNombre(l.examen) })) } });
      setMessage("Notes enregistrées.");
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };
  const valider = async () => {
    const validee = !toutesValidees;
    if (!window.confirm(validee ? "Valider les notes de ce cours ? Les étudiants pourront les consulter." : "Annuler la validation des notes de ce cours ?")) return;
    setMessage(""); setErreur("");
    try {
      const r = await api("/notes/valider", { method: "PUT", body: { cours: coursId, validee } });
      setMessage(`${r.message} (${r.modifiees} note(s))`);
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  const moyennes = (data?.notes || []).map((n) => n.moyenne).filter((m) => m !== null && m !== undefined);
  const st = data?.statistiques;

  return (
    <>
      <div className="dash-entete-page">
        <div>
          <h1 className="dash-titre">Saisie des Évaluations</h1>
          <p className="dash-sous">Encodez les notes de vos cohortes et suivez les moyennes.</p>
        </div>
        <div className="dash-barre-actions">
          <button type="button" className="dash-btn" onClick={() => window.print()}><Icone nom="printer" /> Générer bulletins</button>
          <button type="button" className="dash-btn" onClick={enregistrer} disabled={!modifiees.length}>Enregistrer ({modifiees.length})</button>
          <button type="button" className="dash-btn principal" onClick={valider} disabled={!lignes.length}>{toutesValidees ? "Annuler la validation" : "Valider les notes"}</button>
        </div>
      </div>

      <div className="dash-filtres">
        <div>
          <label htmlFor="n-formation">Filière concernée</label>
          <select id="n-formation" className="form-select" value={formation} onChange={(e) => setFormation(e.target.value)}>
            {formations.map((f) => <option key={f._id} value={f._id}>{f.titre}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="n-cours">Matière / Module</label>
          <select id="n-cours" className="form-select" value={coursId} onChange={(e) => setCoursId(e.target.value)}>
            {coursListe.length === 0 && <option value="">Aucun cours pour cette formation</option>}
            {coursListe.map((c) => <option key={c._id} value={c._id}>{c.titre} — {c.niveau}, {c.semestre}</option>)}
          </select>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {erreur && <div className="alert alert-danger">{erreur}</div>}

      {data && (
        <div className="dash-colonnes">
          <section className="dash-carte">
            <div className="dash-table-zone">
              <table className="dash-table">
                <thead><tr><th>Étudiant</th><th>CC1 (20%)</th><th>CC2 (30%)</th><th>Examen (50%)</th><th>Moyenne</th></tr></thead>
                <tbody>
                  {lignes.map((l, i) => {
                    const m = l.modifie ? moyenneLocale(l) : l.moyenne;
                    return (
                      <tr key={l.etudiant._id}>
                        <td><strong>{l.etudiant.prenom} {l.etudiant.nom}</strong>
                          {l.validee && <span className="dash-tag vert ms-2">Validée</span>}
                          <small className="d-block" style={{ color: "#8c9bbd" }}>{l.etudiant.numero_etudiant}</small></td>
                        {["cc1", "cc2", "examen"].map((c) => (
                          <td key={c}>
                            <input type="number" min="0" max="20" step="0.25" className="form-control dash-note-input" aria-label={`${c} de ${l.etudiant.nom}`}
                              value={l[c]} onChange={(e) => change(i, c, e.target.value)} />
                          </td>
                        ))}
                        <td><strong className="dash-note">{m == null ? "—" : m}</strong>{l.modifie && <small className="d-block" style={{ color: "#8c9bbd" }}>non enregistrée</small>}</td>
                      </tr>
                    );
                  })}
                  {lignes.length === 0 && <tr><td colSpan="5" className="dash-vide">Aucun étudiant actif dans cette formation et ce niveau.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>

          <div className="dash-colonne">
            <div className="dash-carte dash-stat">
              <div className="titre">Taux de réussite</div>
              <div className="valeur">{st?.taux_reussite == null ? "—" : `${st.taux_reussite}%`}</div>
              <div className="sous">Moyenne ≥ 10/20 · {st?.notes_completes ?? 0} note(s) complète(s) sur {st?.effectif ?? 0}</div>
            </div>
            <div className="dash-carte dash-stat">
              <div className="titre">Moyenne générale</div>
              <div className="valeur">{st?.moyenne_classe == null ? "—" : st.moyenne_classe}</div>
              <div className="sous">Sur l'ensemble de la classe</div>
            </div>
            <section className="dash-carte">
              <h2>Distribution des notes</h2>
              {TRANCHES.map(([label, test]) => {
                const nb = moyennes.filter(test).length;
                const pct = moyennes.length ? Math.round((nb / moyennes.length) * 100) : 0;
                return (
                  <div key={label}>
                    <div className="dash-barre-ligne"><span>{label}</span><span>{pct}%</span></div>
                    <div className="dash-progres"><span style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </section>
          </div>
        </div>
      )}
    </>
  );
}

import { useCallback, useEffect, useState } from "react";
import { api } from "../../services/api";
import Icone from "../../assets/Components/Icone";
import Modale, { Champ } from "../../assets/Components/Modale";
import GrilleSemaine, { Legende, NavSemaine } from "../../assets/Components/GrilleSemaine";
import { lundiDe, nomPersonne, plusJours, versChampDateHeure } from "../../services/format";

const TYPES = { cours: "Cours", tp: "TP", projet: "Projet", examen: "Examen", autre: "Autre" };
const TYPES_SALLE = { cours_theorique: "Cours théorique", labo: "Laboratoire", amphi: "Amphithéâtre", autre: "Autre" };

function GestionSalles({ salles, onClose, onChange }) {
  const vide = { nom: "", type: "cours_theorique", capacite: "", equipements: "" };
  const [edition, setEdition] = useState(vide);
  const [erreur, setErreur] = useState("");

  const enregistrer = async (e) => {
    e.preventDefault();
    setErreur("");
    const body = {
      nom: edition.nom, type: edition.type, capacite: Number(edition.capacite),
      equipements: edition.equipements.split(",").map((x) => x.trim()).filter(Boolean),
    };
    try {
      if (edition.id) await api(`/salles/${edition.id}`, { method: "PUT", body });
      else await api("/salles", { method: "POST", body });
      setEdition(vide);
      onChange();
    } catch (err) {
      setErreur(err.message);
    }
  };
  const supprimer = async (s) => {
    if (!window.confirm(`Supprimer la salle « ${s.nom} » ?`)) return;
    try {
      await api(`/salles/${s._id}`, { method: "DELETE" });
      onChange();
    } catch (err) {
      setErreur(err.message);
    }
  };

  return (
    <div className="overlay">
      <div className="auth-card large" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <h1>Salles</h1>
        {salles.map((s) => (
          <div className="dash-ligne" key={s._id} style={{ background: "#0a1a3f" }}>
            <div><strong>{s.nom}</strong><small>{TYPES_SALLE[s.type] || s.type} · {s.capacite} places{s.equipements?.length ? ` · ${s.equipements.join(", ")}` : ""}</small></div>
            <div>
              <button type="button" className="dash-mini-btn" aria-label={`Modifier ${s.nom}`}
                onClick={() => setEdition({ id: s._id, nom: s.nom, type: s.type, capacite: String(s.capacite), equipements: (s.equipements || []).join(", ") })}><Icone nom="edit" taille={15} /></button>
              <button type="button" className="dash-mini-btn" aria-label={`Supprimer ${s.nom}`} onClick={() => supprimer(s)}><Icone nom="trash" taille={15} /></button>
            </div>
          </div>
        ))}
        {salles.length === 0 && <p className="dash-vide">Aucune salle enregistrée.</p>}

        <form onSubmit={enregistrer} className="mt-3">
          <h2 className="h6 mb-3">{edition.id ? "Modifier la salle" : "Ajouter une salle"}</h2>
          <div className="row">
            <Champ id="sa-nom" label="Nom" className="col-sm-6 mb-3"><input id="sa-nom" className="form-control" required placeholder="Ex : Salle 101" value={edition.nom} onChange={(e) => setEdition({ ...edition, nom: e.target.value })} /></Champ>
            <Champ id="sa-type" label="Type" className="col-sm-6 mb-3">
              <select id="sa-type" className="form-select" value={edition.type} onChange={(e) => setEdition({ ...edition, type: e.target.value })}>
                {Object.entries(TYPES_SALLE).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </Champ>
            <Champ id="sa-cap" label="Capacité" className="col-sm-6 mb-3"><input id="sa-cap" type="number" min="1" className="form-control" required value={edition.capacite} onChange={(e) => setEdition({ ...edition, capacite: e.target.value })} /></Champ>
            <Champ id="sa-eq" label="Équipements (séparés par des virgules)" className="col-sm-6 mb-3"><input id="sa-eq" className="form-control" placeholder="Ex : Projecteur, 30 PC" value={edition.equipements} onChange={(e) => setEdition({ ...edition, equipements: e.target.value })} /></Champ>
          </div>
          {erreur && <div className="alert alert-danger">{erreur}</div>}
          <div className="d-flex gap-2">
            <button className="btn btn-orange flex-grow-1">{edition.id ? "Enregistrer" : "Ajouter"}</button>
            {edition.id && <button type="button" className="btn btn-outline-light" onClick={() => setEdition(vide)}>Nouvelle salle</button>}
            <button type="button" className="btn btn-outline-light" onClick={onClose}>Fermer</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EmploiDuTempsAdmin() {
  const [formations, setFormations] = useState([]);
  const [salles, setSalles] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [formation, setFormation] = useState("");
  const [coursListe, setCoursListe] = useState([]);
  const [niveau, setNiveau] = useState("");
  const [lundi, setLundi] = useState(lundiDe());
  const [tous, setTous] = useState([]);
  const [libres, setLibres] = useState(null);
  const [edition, setEdition] = useState(null);
  const [gestionSalles, setGestionSalles] = useState(false);
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    api("/formations").then((f) => { setFormations(f); if (f[0]) setFormation(f[0]._id); }).catch((e) => setErreur(e.message));
    api("/users", { params: { role: "enseignant" } }).then(setEnseignants).catch(() => {});
  }, []);

  const chargerSalles = useCallback(() => {
    api("/salles").then(setSalles).catch((e) => setErreur(e.message));
    const maintenant = new Date();
    api("/salles/disponibles", { params: { debut: maintenant.toISOString(), fin: new Date(maintenant.getTime() + 3600000).toISOString() } })
      .then((l) => setLibres(new Set(l.map((s) => s._id)))).catch(() => setLibres(null));
  }, []);
  useEffect(() => { chargerSalles(); }, [chargerSalles]);

  useEffect(() => {
    if (!formation) return;
    api("/cours", { params: { formation } }).then((c) => {
      setCoursListe(c);
      const niveaux = [...new Set(c.map((x) => x.niveau))];
      setNiveau((prec) => (niveaux.includes(prec) ? prec : niveaux[0] || ""));
    }).catch((e) => setErreur(e.message));
  }, [formation]);

  const chargerSeances = useCallback(() => {
    api("/seances", { params: { du: lundi.toISOString(), au: plusJours(lundi, 7).toISOString() } }).then(setTous).catch((e) => setErreur(e.message));
  }, [lundi]);
  useEffect(() => { chargerSeances(); }, [chargerSeances]);

  const niveaux = [...new Set(coursListe.map((c) => c.niveau))];
  const coursNiveau = coursListe.filter((c) => c.niveau === niveau);
  const seances = tous.filter((s) => s.formation?._id === formation && s.niveau === niveau);
  const brouillons = seances.filter((s) => !s.publiee).length;

  const nouvelle = () => {
    const d = new Date(lundi); d.setHours(8, 0, 0, 0);
    const f = new Date(lundi); f.setHours(10, 0, 0, 0);
    setErreur("");
    setEdition({ cours: "", enseignant: "", salle: "", type: "cours", debut: versChampDateHeure(d), fin: versChampDateHeure(f), publiee: false });
  };
  const modifier = (s) => {
    setErreur("");
    setEdition({ id: s._id, cours: s.cours?._id || "", enseignant: s.enseignant?._id || "", salle: s.salle?._id || "", type: s.type || "cours",
      debut: versChampDateHeure(s.debut), fin: versChampDateHeure(s.fin), publiee: !!s.publiee });
  };
  const maj = (n) => (e) => setEdition({ ...edition, [n]: e.target.value });
  const fermer = () => { setEdition(null); setErreur(""); };

  const enregistrer = async (e) => {
    e.preventDefault();
    setErreur("");
    const body = { cours: edition.cours, salle: edition.salle, type: edition.type, publiee: edition.publiee,
      debut: new Date(edition.debut).toISOString(), fin: new Date(edition.fin).toISOString() };
    if (edition.enseignant) body.enseignant = edition.enseignant;
    try {
      if (edition.id) await api(`/seances/${edition.id}`, { method: "PUT", body });
      else await api("/seances", { method: "POST", body });
      fermer();
      chargerSeances();
      chargerSalles();
    } catch (err) {
      const conflits = err.donnees?.conflits;
      setErreur(conflits?.length ? `${err.message} : ${conflits.join(" ; ")}` : err.message);
    }
  };
  const supprimer = async () => {
    if (!window.confirm("Supprimer cette séance ?")) return;
    try {
      await api(`/seances/${edition.id}`, { method: "DELETE" });
      fermer();
      chargerSeances();
    } catch (err) {
      setErreur(err.message);
    }
  };
  const publier = async (publiee) => {
    setMessage("");
    setErreur("");
    try {
      const r = await api("/seances/publier", { method: "PUT", body: { formation, niveau, du: lundi.toISOString(), au: plusJours(lundi, 7).toISOString(), publiee } });
      setMessage(`${r.message} (${r.modifiees} séance(s))`);
      chargerSeances();
    } catch (err) {
      setErreur(err.message);
    }
  };

  return (
    <>
      <div className="dash-entete-page">
        <div>
          <h1 className="dash-titre">Emploi du Temps</h1>
          <p className="dash-sous">MIT Madagascar — Gestion globale des formations.</p>
        </div>
        <div className="dash-barre-actions">
          <button type="button" className="dash-btn" onClick={() => publier(false)} disabled={!seances.length}>Dépublier</button>
          <button type="button" className="dash-btn principal" onClick={() => publier(true)} disabled={!seances.length}><Icone nom="clipboard" /> Publier l'emploi du temps</button>
        </div>
      </div>

      <div className="dash-filtres">
        <div>
          <label htmlFor="e-formation">Formation</label>
          <select id="e-formation" className="form-select" value={formation} onChange={(e) => setFormation(e.target.value)}>
            {formations.map((f) => <option key={f._id} value={f._id}>{f.titre}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="e-niveau">Niveau</label>
          <select id="e-niveau" className="form-select" value={niveau} onChange={(e) => setNiveau(e.target.value)}>
            {niveaux.length === 0 && <option value="">Aucun cours : créez-en dans « Cours »</option>}
            {niveaux.map((n) => <option key={n}>{n}</option>)}
          </select>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {erreur && !edition && <div className="alert alert-danger">{erreur}</div>}

      <div className="dash-colonnes">
        <section className="dash-carte">
          <div className="dash-entete-page" style={{ marginBottom: 16 }}>
            <NavSemaine lundi={lundi} onChange={setLundi} />
            <div className="d-flex align-items-center gap-3">
              {brouillons > 0 && <span className="dash-tag orange">{brouillons} brouillon(s)</span>}
              <button type="button" className="dash-btn principal" onClick={nouvelle} disabled={!coursNiveau.length}><Icone nom="plus" /> Ajouter une séance</button>
            </div>
          </div>
          <GrilleSemaine seances={seances} lundi={lundi} onSelect={modifier} />
          <Legende seances={seances} />
        </section>

        <section className="dash-carte">
          <h2>Disponibilité des salles <button type="button" className="dash-btn" onClick={() => setGestionSalles(true)}>Gérer</button></h2>
          {salles.length === 0 && <p className="dash-vide">Aucune salle enregistrée.</p>}
          {salles.map((s) => (
            <div className="dash-ligne" key={s._id}>
              <div><strong>{s.nom}</strong><small>{TYPES_SALLE[s.type] || s.type} · {s.capacite} places</small></div>
              {libres && <span className={`dash-tag ${libres.has(s._id) ? "vert" : "orange"}`}>{libres.has(s._id) ? "Libre" : "Occupé"}</span>}
            </div>
          ))}
          <p className="dash-sous mt-2 mb-0" style={{ fontSize: ".75rem" }}>Disponibilité pour l'heure à venir.</p>
        </section>
      </div>

      {edition && (
        <Modale large titre={edition.id ? "Modifier la séance" : "Nouvelle séance"} onSubmit={enregistrer} onClose={fermer} erreur={erreur}>
          <div className="row">
            <Champ id="s-cours" label="Cours" className="col-sm-6 mb-3">
              <select id="s-cours" className="form-select" required value={edition.cours} onChange={maj("cours")}>
                <option value="" disabled>Choisissez un cours</option>
                {coursNiveau.map((c) => <option key={c._id} value={c._id}>{c.titre}</option>)}
              </select>
            </Champ>
            <Champ id="s-ens" label="Enseignant" className="col-sm-6 mb-3">
              <select id="s-ens" className="form-select" value={edition.enseignant} onChange={maj("enseignant")}>
                <option value="">Enseignant du cours (par défaut)</option>
                {enseignants.map((u) => <option key={u.id} value={u.id}>{nomPersonne(u)}</option>)}
              </select>
            </Champ>
            <Champ id="s-salle" label="Salle" className="col-sm-6 mb-3">
              <select id="s-salle" className="form-select" required value={edition.salle} onChange={maj("salle")}>
                <option value="" disabled>Choisissez une salle</option>
                {salles.map((s) => <option key={s._id} value={s._id}>{s.nom} ({s.capacite} places)</option>)}
              </select>
            </Champ>
            <Champ id="s-type" label="Type de séance" className="col-sm-6 mb-3">
              <select id="s-type" className="form-select" value={edition.type} onChange={maj("type")}>
                {Object.entries(TYPES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </Champ>
            <Champ id="s-debut" label="Début" className="col-sm-6 mb-3"><input id="s-debut" type="datetime-local" className="form-control" required value={edition.debut} onChange={maj("debut")} /></Champ>
            <Champ id="s-fin" label="Fin" className="col-sm-6 mb-3"><input id="s-fin" type="datetime-local" className="form-control" required value={edition.fin} onChange={maj("fin")} /></Champ>
          </div>
          <div className="form-check mb-3">
            <input id="s-pub" type="checkbox" className="form-check-input" checked={edition.publiee} onChange={(e) => setEdition({ ...edition, publiee: e.target.checked })} />
            <label htmlFor="s-pub" className="form-check-label">Visible par les étudiants et les enseignants (publiée)</label>
          </div>
          {edition.id && <button type="button" className="btn btn-outline-danger btn-sm mb-3" onClick={supprimer}>Supprimer cette séance</button>}
        </Modale>
      )}
      {gestionSalles && <GestionSalles salles={salles} onClose={() => setGestionSalles(false)} onChange={chargerSalles} />}
    </>
  );
}

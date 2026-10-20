import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../Context/AuthContext";
import Icone from "../../assets/Components/Icone";
import { JOURS, heure, nomPersonne } from "../../services/format";

const jourHeure = (d) => `${JOURS[(new Date(d).getDay() + 6) % 7]} à ${heure(d)}`;

export default function MesCours() {
  const { user } = useAuth();
  const formationId = user.formation?._id || user.formation;
  const [cours, setCours] = useState(null);
  const [seances, setSeances] = useState([]);
  const [semestre, setSemestre] = useState("");
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    if (!formationId || !user.niveau) { setCours([]); return; }
    api("/cours", { params: { formation: formationId, niveau: user.niveau } }).then(setCours).catch((e) => setErreur(e.message));
    api("/seances/mon-planning", { params: { du: new Date().toISOString() } }).then(setSeances).catch(() => {});
  }, [formationId, user.niveau]);

  const semestres = useMemo(() => [...new Set((cours || []).map((c) => c.semestre))].sort(), [cours]);
  const visibles = (cours || []).filter((c) => !semestre || c.semestre === semestre);
  const prochain = (c) => seances.find((s) => s.cours?._id === c._id);

  return (
    <>
      <h1 className="dash-titre">Mes Cours</h1>
      <p className="dash-sous">Suivez vos modules et vos crédits ECTS.</p>
      {erreur && <div className="alert alert-danger">{erreur}</div>}
      {cours && cours.length === 0 && !erreur && (
        <div className="dash-carte"><p className="dash-vide">
          {formationId && user.niveau ? "Aucun cours n'est encore enregistré pour votre formation." : "Votre formation et votre niveau ne sont pas encore renseignés : contactez l'administration."}
        </p></div>
      )}

      {cours && cours.length > 0 && (
        <>
          <div className="dash-onglets" role="tablist">
            <button type="button" className={!semestre ? "actif" : ""} onClick={() => setSemestre("")}>Tous</button>
            {semestres.map((s) => <button type="button" key={s} className={semestre === s ? "actif" : ""} onClick={() => setSemestre(s)}>{s}</button>)}
          </div>

          <div className="dash-stats">
            <div className="dash-carte dash-stat"><div className="titre">Modules</div><div className="valeur">{visibles.length}</div><div className="sous">Inscrits</div></div>
            <div className="dash-carte dash-stat"><div className="titre">Crédits ECTS</div><div className="valeur">{visibles.reduce((s, c) => s + c.ects, 0)}</div><div className="sous">Total des crédits visés</div></div>
            <div className="dash-carte dash-stat"><div className="titre">Heures par semaine</div><div className="valeur">{visibles.reduce((s, c) => s + (c.heures_semaine || 0), 0)}</div><div className="sous">De cours</div></div>
          </div>

          <div className="dash-grille-cours">
            {visibles.map((c) => {
              const s = prochain(c);
              return (
                <article className="dash-carte" key={c._id}>
                  <span className="dash-tag orange">{c.ects} ECTS</span>
                  <h3>{c.titre}</h3>
                  <small>{nomPersonne(c.enseignant) || "Enseignant à confirmer"} · {c.semestre}</small>
                  <div className="dash-ligne mt-3 mb-0">
                    <span style={{ color: "#8c9bbd", display: "flex", gap: 8, alignItems: "center" }}><Icone nom="calendar" taille={15} /> Prochain cours</span>
                    <strong>{s ? jourHeure(s.debut) : "Non planifié"}</strong>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

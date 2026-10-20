import { Fragment } from "react";
import { JOURS, couleurDe, heure, libelleSemaine, nomPersonne, plusJours } from "../../services/format";

export function NavSemaine({ lundi, onChange }) {
  return (
    <div className="d-flex align-items-center gap-2">
      <button type="button" className="dash-icone-btn" aria-label="Semaine précédente" onClick={() => onChange(plusJours(lundi, -7))}>‹</button>
      <strong style={{ minWidth: 210, textAlign: "center" }}>{libelleSemaine(lundi)}</strong>
      <button type="button" className="dash-icone-btn" aria-label="Semaine suivante" onClick={() => onChange(plusJours(lundi, 7))}>›</button>
    </div>
  );
}

export function Legende({ seances }) {
  const cours = [...new Map(seances.filter((s) => s.cours).map((s) => [s.cours._id, s.cours])).values()];
  if (!cours.length) return null;
  return (
    <div className="dash-legende">
      {cours.map((c) => <span key={c._id}><i style={{ background: couleurDe(c._id) }} />{c.titre}</span>)}
    </div>
  );
}

const jourIndex = (s) => (new Date(s.debut).getDay() + 6) % 7;
const creneauDe = (s) => `${heure(s.debut)} - ${heure(s.fin)}`;

// Grille hebdomadaire : une ligne par créneau, une colonne par jour
export default function GrilleSemaine({ seances, lundi, onSelect }) {
  if (!seances.length) return <p className="dash-vide">Aucune séance cette semaine.</p>;
  const nbJours = Math.max(5, ...seances.map((s) => jourIndex(s) + 1));
  const creneaux = [...new Set(seances.map(creneauDe))].sort();

  return (
    <div className="dash-grille-zone">
      <div className="dash-grille" style={{ gridTemplateColumns: `110px repeat(${nbJours}, minmax(150px, 1fr))` }}>
        <div className="tete">Créneau</div>
        {JOURS.slice(0, nbJours).map((j, i) => <div className="tete" key={j}>{j} {plusJours(lundi, i).getDate()}</div>)}
        {creneaux.map((c) => (
          <Fragment key={c}>
            <div className="creneau">{c}</div>
            {JOURS.slice(0, nbJours).map((j, i) => (
              <div className="cellule" key={j}>
                {seances.filter((s) => jourIndex(s) === i && creneauDe(s) === c).map((s) => (
                  <button type="button" key={s._id} disabled={!onSelect}
                    className={`dash-seance${s.publiee === false ? " brouillon" : ""}`}
                    style={{ borderLeftColor: couleurDe(s.cours?._id) }} onClick={() => onSelect && onSelect(s)}>
                    <strong>{s.cours?.titre || "Cours"}</strong>
                    <small>{[nomPersonne(s.enseignant), s.salle?.nom].filter(Boolean).join(" · ")}</small>
                    {s.publiee === false && <small>Brouillon</small>}
                  </button>
                ))}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

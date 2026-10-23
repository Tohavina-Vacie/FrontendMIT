import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { plusJours } from "../../services/format";

const cle = (d) => d.toISOString().slice(0, 10);

export default function ApiSuper() {
  const [vue, setVue] = useState(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    api("/super-admin/vue-ensemble").then(setVue).catch((e) => setErreur(e.message));
  }, []);

  // 7 derniers jours, les jours sans requête valent 0
  const jours = useMemo(() => {
    const parJour = Object.fromEntries((vue?.requetes_api_7_jours || []).map((c) => [c.jour, c.total]));
    return Array.from({ length: 7 }, (_, i) => {
      const d = plusJours(new Date(), i - 6);
      return { jour: cle(d), etiquette: d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" }), total: parJour[cle(d)] || 0 };
    });
  }, [vue]);

  const max = Math.max(1, ...jours.map((j) => j.total));
  const total = jours.reduce((s, j) => s + j.total, 0);

  return (
    <>
      <h1 className="dash-titre">API</h1>
      <p className="dash-sous">Volume de requêtes reçues par le serveur.</p>
      {erreur && <div className="alert alert-danger">{erreur}</div>}
      {!vue && !erreur && <p className="dash-sous">Chargement…</p>}
      {vue && (
        <>
          <div className="dash-stats">
            <div className="dash-carte dash-stat"><div className="titre">Aujourd'hui</div><div className="valeur">{vue.requetes_api_aujourdhui.toLocaleString("fr-FR")}</div><div className="sous">Requêtes API</div></div>
            <div className="dash-carte dash-stat"><div className="titre">7 derniers jours</div><div className="valeur">{total.toLocaleString("fr-FR")}</div><div className="sous">Requêtes au total</div></div>
          </div>
          <section className="dash-carte">
            <h2>Requêtes par jour</h2>
            <div className="dash-barres">
              {jours.map((j) => (
                <div className="col" key={j.jour}>
                  <strong>{j.total.toLocaleString("fr-FR")}</strong>
                  <div className="barre" style={{ height: `${(j.total / max) * 100}%` }} title={`${j.total} requêtes`} />
                  <small>{j.etiquette}</small>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}

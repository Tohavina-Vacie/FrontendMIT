import { useCallback, useEffect, useState } from "react";
import { api } from "../../services/api";
import Icone from "../../assets/Components/Icone";
import { appareil, dateFr, depuis, heure, nomPersonne, sidCourant } from "../../services/format";

export default function SecuriteSuper() {
  const [sessions, setSessions] = useState(null);
  const [echecs, setEchecs] = useState(null);
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const sid = sidCourant();

  const charger = useCallback(() => {
    api("/super-admin/sessions").then(setSessions).catch((e) => setErreur(e.message));
    api("/super-admin/connexions-echouees").then(setEchecs).catch((e) => setErreur(e.message));
  }, []);
  useEffect(() => { charger(); }, [charger]);

  const deconnecter = async (s) => {
    const soi = s._id === sid;
    if (!window.confirm(soi ? "C'est votre propre session : vous serez déconnecté. Continuer ?" : `Déconnecter ${nomPersonne(s.utilisateur)} ?`)) return;
    setErreur(""); setMessage("");
    try {
      await api(`/super-admin/sessions/${s._id}/deconnecter`, { method: "PUT" });
      setMessage("Session déconnectée.");
      charger();
    } catch (err) { setErreur(err.message); }
  };

  const deconnexionGlobale = async () => {
    if (!window.confirm("Déconnecter TOUS les appareils, y compris le vôtre ? Chacun devra se reconnecter.")) return;
    setErreur(""); setMessage("");
    try {
      const r = await api("/super-admin/sessions/deconnexion-globale", { method: "PUT" });
      setMessage(`${r.message} (${r.sessions_fermees} session(s) fermée(s)).`);
      charger(); // votre propre session est fermée : vous serez ramené à la connexion
    } catch (err) { setErreur(err.message); }
  };

  return (
    <>
      <h1 className="dash-titre">Sécurité globale</h1>
      <p className="dash-sous">Sessions ouvertes et tentatives de connexion de la plateforme.</p>
      {message && <div className="alert alert-success">{message}</div>}
      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <div className="dash-colonnes" style={{ gridTemplateColumns: "1.7fr 1fr" }}>
        <div className="dash-stats" style={{ marginBottom: 0 }}>
          <div className="dash-carte dash-stat"><div className="titre">Sessions actives</div><div className="valeur">{sessions ? sessions.length : "…"}</div><div className="sous">Appareils connectés</div></div>
          <div className="dash-carte dash-stat"><div className="titre">Échecs de connexion (24 h)</div><div className={`valeur${echecs?.total_24h ? " dash-neg" : ""}`}>{echecs ? echecs.total_24h : "…"}</div><div className="sous">Tentatives refusées</div></div>
        </div>
        <section className="dash-carte">
          <h2>Contrôle d'urgence</h2>
          <button type="button" className="dash-urgence" onClick={deconnexionGlobale}>Forcer la déconnexion globale</button>
          <p className="dash-sous mt-2 mb-0" style={{ fontSize: ".78rem" }}>Action critique : elle déconnecte tous les appareils actifs, le vôtre compris.</p>
        </section>
      </div>

      <section className="dash-carte mt-3">
        <h2>Sessions actives</h2>
        <div className="dash-table-zone">
          <table className="dash-table">
            <thead><tr><th>Utilisateur</th><th>Rôle</th><th>Adresse IP</th><th>Appareil</th><th>Dernière activité</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
            <tbody>
              {(sessions || []).map((s) => (
                <tr key={s._id}>
                  <td><strong>{nomPersonne(s.utilisateur) || "Compte supprimé"}</strong>{s._id === sid && <span className="dash-tag gris ms-2">Cette session</span>}</td>
                  <td>{s.utilisateur?.role || "—"}</td>
                  <td>{s.ip || "—"}</td>
                  <td>{appareil(s.appareil)}</td>
                  <td>{depuis(s.derniere_activite)}</td>
                  <td style={{ textAlign: "right" }}><button type="button" className="dash-btn petit" style={{ color: "#f87171" }} onClick={() => deconnecter(s)}>Déconnecter</button></td>
                </tr>
              ))}
              {sessions && sessions.length === 0 && <tr><td colSpan="6" className="dash-vide">Aucune session active.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dash-carte mt-3">
        <h2>Tentatives de connexion échouées (24 h)</h2>
        {echecs && echecs.echecs.length === 0 && <p className="dash-vide">Aucune tentative échouée.</p>}
        {(echecs?.echecs || []).map((e) => (
          <div className="dash-alerte" key={e._id}>
            <Icone nom="alert" />
            <div>
              <strong>{e.email_tente || "Adresse inconnue"}</strong>
              <small>{dateFr(e.createdAt)} {heure(e.createdAt)} · IP {e.ip || "—"} · {e.details || "Échec de connexion"}</small>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

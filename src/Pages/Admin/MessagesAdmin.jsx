import { useCallback, useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../Context/AuthContext";
import Icone from "../../assets/Components/Icone";
import { dateFr, heure, nomPersonne } from "../../services/format";

const STATUTS = { non_lu: ["orange", "Non lu"], lu: ["gris", "Lu"], traite: ["vert", "Traité"] };

export default function MessagesAdmin() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [filtre, setFiltre] = useState("");
  const [choisi, setChoisi] = useState(null);
  const [reponse, setReponse] = useState("");
  const [info, setInfo] = useState("");
  const [erreur, setErreur] = useState("");

  const charger = useCallback(() => {
    api("/messages").then((l) => setMessages([...l].sort((a, b) => new Date(b.date_envoi) - new Date(a.date_envoi)))).catch((e) => setErreur(e.message));
  }, []);
  useEffect(() => { charger(); }, [charger]);

  const modifier = async (id, corps) => {
    setErreur("");
    try {
      const m = await api(`/messages/${id}`, { method: "PUT", body: corps });
      setMessages((l) => l.map((x) => (x._id === id ? { ...x, ...m } : x)));
      setChoisi((c) => (c && c._id === id ? { ...c, ...m } : c));
      return m;
    } catch (err) {
      setErreur(err.message);
      return null;
    }
  };

  const ouvrir = (m) => {
    setChoisi(m);
    setReponse(m.reponse || "");
    setInfo("");
    if (m.statut === "non_lu") modifier(m._id, { statut: "lu" });
  };

  const envoyerReponse = async () => {
    const m = await modifier(choisi._id, { reponse, date_reponse: new Date().toISOString(), repondu_par: user.id, statut: "traite" });
    if (m) setInfo("Réponse enregistrée. Elle est conservée dans le dossier ; pensez à l'envoyer aussi par e-mail.");
  };

  const supprimer = async () => {
    if (!window.confirm("Supprimer ce message ?")) return;
    try {
      await api(`/messages/${choisi._id}`, { method: "DELETE" });
      setChoisi(null);
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  const visibles = messages.filter((m) => !filtre || m.statut === filtre);
  const nonLus = messages.filter((m) => m.statut === "non_lu").length;

  return (
    <>
      <h1 className="dash-titre">Messages de contact</h1>
      <p className="dash-sous">Messages envoyés depuis le formulaire « Nous contacter » du site. {nonLus} non lu(s).</p>
      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <div className="dash-colonnes" style={{ gridTemplateColumns: "1fr 1.4fr" }}>
        <section className="dash-carte">
          <select className="form-select mb-3" aria-label="Filtrer par statut" value={filtre} onChange={(e) => setFiltre(e.target.value)}>
            <option value="">Tous les messages</option>
            <option value="non_lu">Non lus</option>
            <option value="lu">Lus</option>
            <option value="traite">Traités</option>
          </select>
          {visibles.length === 0 && <p className="dash-vide">Aucun message.</p>}
          {visibles.map((m) => {
            const [couleur, libelle] = STATUTS[m.statut] || ["gris", m.statut];
            return (
              <button type="button" key={m._id} className="dash-ligne w-100 text-start border-0 text-white" onClick={() => ouvrir(m)}
                style={{ outline: choisi?._id === m._id ? "1px solid #e8761f" : "none" }}>
                <div style={{ minWidth: 0 }}>
                  <strong>{m.sujet}</strong>
                  <small>{[m.prenom, m.nom].filter(Boolean).join(" ")} · {dateFr(m.date_envoi)}</small>
                </div>
                <span className={`dash-tag ${couleur}`}>{libelle}</span>
              </button>
            );
          })}
        </section>

        <section className="dash-carte">
          {!choisi && <p className="dash-vide">Sélectionnez un message pour le lire.</p>}
          {choisi && (
            <>
              <h2>{choisi.sujet}
                <button type="button" className="dash-mini-btn" aria-label="Supprimer le message" onClick={supprimer}><Icone nom="trash" taille={15} /></button>
              </h2>
              <dl className="dash-infos mb-3">
                <div><dt>De</dt><dd>{[choisi.prenom, choisi.nom].filter(Boolean).join(" ")}</dd></div>
                <div><dt>E-mail</dt><dd>{choisi.email}</dd></div>
                <div><dt>Téléphone</dt><dd>{choisi.telephone || "—"}</dd></div>
                <div><dt>Entreprise</dt><dd>{choisi.entreprise || "—"}</dd></div>
                <div className="large"><dt>Reçu le</dt><dd>{dateFr(choisi.date_envoi)} à {heure(choisi.date_envoi)}{choisi.utilisateur ? ` · compte : ${nomPersonne(choisi.utilisateur)}` : ""}</dd></div>
              </dl>
              <div className="dash-ligne" style={{ display: "block", whiteSpace: "pre-line" }}>{choisi.message}</div>

              <label htmlFor="reponse" className="mt-3">Réponse</label>
              <textarea id="reponse" rows="4" className="form-control mb-3" placeholder="Rédigez la réponse à conserver dans le dossier…" value={reponse} onChange={(e) => setReponse(e.target.value)} />
              {choisi.date_reponse && <p className="dash-sous mb-2" style={{ fontSize: ".8rem" }}>Dernière réponse le {dateFr(choisi.date_reponse)}.</p>}
              {info && <div className="alert alert-success">{info}</div>}
              <div className="dash-barre-actions">
                <button type="button" className="dash-btn principal" disabled={!reponse.trim()} onClick={envoyerReponse}>Enregistrer la réponse</button>
                <a className="dash-btn" href={`mailto:${choisi.email}?subject=${encodeURIComponent(`Re : ${choisi.sujet}`)}&body=${encodeURIComponent(reponse)}`}><Icone nom="mail" /> Répondre par e-mail</a>
                {choisi.statut !== "traite" && <button type="button" className="dash-btn" onClick={() => modifier(choisi._id, { statut: "traite" })}>Marquer comme traité</button>}
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}

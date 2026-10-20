import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import BadgeStatut, { STATUTS_INSCRIPTION } from "../../assets/Components/BadgeStatut";
import "../../styles/auth.css";

const formatDate = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "—");

export default function InscriptionsAdmin() {
  const [inscriptions, setInscriptions] = useState([]);
  const [statut, setStatut] = useState("");
  const [recherche, setRecherche] = useState("");
  const [erreur, setErreur] = useState("");
  const [creation, setCreation] = useState(null); // null | { utilisateur, formation }
  const [etudiants, setEtudiants] = useState([]);
  const [formations, setFormations] = useState([]);

  const charger = useCallback(() => {
    api("/inscriptions").then(setInscriptions).catch((e) => setErreur(e.message));
  }, []);
  useEffect(charger, [charger]);

  const ouvrirCreation = async () => {
    setErreur("");
    try {
      const [u, f] = await Promise.all([api("/users", { params: { role: "etudiant" } }), api("/formations")]);
      setEtudiants(u);
      setFormations(f);
      setCreation({ utilisateur: "", formation: "" });
    } catch (err) {
      setErreur(err.message);
    }
  };

  const creer = async (e) => {
    e.preventDefault();
    try {
      await api("/inscriptions", { method: "POST", body: creation });
      setCreation(null);
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  const changerStatut = async (id, nouveau) => {
    setErreur("");
    try {
      await api(`/inscriptions/${id}`, { method: "PUT", body: { statut: nouveau } });
      setInscriptions((liste) => liste.map((i) => (i._id === id ? { ...i, statut: nouveau } : i)));
    } catch (err) {
      setErreur(err.message);
    }
  };

  const supprimer = async (i) => {
    const nom = `${i.utilisateur?.prenom || ""} ${i.utilisateur?.nom || ""}`.trim() || "cet utilisateur";
    if (!window.confirm(`Supprimer l'inscription de ${nom} ?`)) return;
    try {
      await api(`/inscriptions/${i._id}`, { method: "DELETE" });
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  const visibles = useMemo(
    () =>
      inscriptions.filter(
        (i) =>
          (!statut || i.statut === statut) &&
          `${i.utilisateur?.nom} ${i.utilisateur?.prenom} ${i.utilisateur?.email} ${i.formation?.titre}`
            .toLowerCase()
            .includes(recherche.toLowerCase()),
      ),
    [inscriptions, statut, recherche],
  );

  const enAttente = inscriptions.filter((i) => i.statut === "en_attente").length;

  return (
    <div className="admin-page">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
          <h1 className="h3 mb-0">Inscriptions</h1>
          <button className="btn btn-orange" onClick={ouvrirCreation}>Inscrire un étudiant</button>
        </div>
        <p className="text-info">{enAttente} demande(s) en attente de validation</p>

        <div className="d-flex gap-2 mb-3 flex-wrap">
          <input className="form-control w-auto" style={{ minWidth: 260 }} placeholder="Rechercher un étudiant ou une formation"
            value={recherche} onChange={(e) => setRecherche(e.target.value)} />
          <select className="form-select w-auto" value={statut} onChange={(e) => setStatut(e.target.value)}>
            <option value="">Tous les statuts</option>
            {STATUTS_INSCRIPTION.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>

        {erreur && <div className="alert alert-danger">{erreur}</div>}

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr><th>Étudiant</th><th>Formation</th><th>Date</th><th>Statut</th><th>Changer le statut</th><th></th></tr>
            </thead>
            <tbody>
              {visibles.map((i) => (
                <tr key={i._id}>
                  <td>
                    {i.utilisateur ? `${i.utilisateur.prenom} ${i.utilisateur.nom}` : "Compte supprimé"}
                    <br /><small className="text-info">{i.utilisateur?.email}</small>
                  </td>
                  <td>{i.formation?.titre || "Formation supprimée"}</td>
                  <td>{formatDate(i.date_inscription)}</td>
                  <td><BadgeStatut statut={i.statut} /></td>
                  <td>
                    <select className="form-select form-select-sm w-auto" value={i.statut}
                      onChange={(e) => changerStatut(i._id, e.target.value)} aria-label="Changer le statut">
                      {STATUTS_INSCRIPTION.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-danger" onClick={() => supprimer(i)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {visibles.length === 0 && <tr><td colSpan="6" className="text-center">Aucune inscription trouvée</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {creation && (
        <div className="overlay">
          <form className="auth-card" onSubmit={creer}>
            <h1>Inscrire un étudiant</h1>
            <div className="mb-3">
              <label htmlFor="etu">Étudiant</label>
              <select id="etu" className="form-select" required value={creation.utilisateur}
                onChange={(e) => setCreation({ ...creation, utilisateur: e.target.value })}>
                <option value="" disabled>Choisissez un étudiant</option>
                {etudiants.map((u) => <option key={u.id} value={u.id}>{u.prenom} {u.nom} ({u.email})</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="for">Formation</label>
              <select id="for" className="form-select" required value={creation.formation}
                onChange={(e) => setCreation({ ...creation, formation: e.target.value })}>
                <option value="" disabled>Choisissez une formation</option>
                {formations.map((f) => <option key={f._id} value={f._id}>{f.titre}</option>)}
              </select>
            </div>
            {erreur && <div className="alert alert-danger">{erreur}</div>}
            <div className="d-flex gap-2">
              <button className="btn btn-orange flex-grow-1">Inscrire</button>
              <button type="button" className="btn btn-outline-light" onClick={() => { setCreation(null); setErreur(""); }}>Annuler</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";
import { api } from "../../services/api";
import Icone from "../../assets/Components/Icone";
import Modale, { Champ } from "../../assets/Components/Modale";
import { dateFr, montant, nomPersonne } from "../../services/format";

const STATUTS = { paye: ["vert", "Payé"], en_attente: ["orange", "En attente"], en_retard: ["rouge", "En retard"], annule: ["gris", "Annulé"] };
const COULEURS = ["#e8761f", "#06b6d4", "#10b981", "#ef4444", "#a855f7", "#eab308"];
const jourChamp = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

const exporterCsv = (paiements) => {
  const echapper = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lignes = [["Étudiant", "Description", "Montant", "Échéance", "Statut"],
    ...paiements.map((p) => [nomPersonne(p.etudiant), p.description, p.montant, dateFr(p.echeance), (STATUTS[p.statut_effectif] || [])[1] || p.statut_effectif])];
  const url = URL.createObjectURL(new Blob(["\uFEFF" + lignes.map((l) => l.map(echapper).join(";")).join("\n")], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "paiements.csv";
  a.click();
  URL.revokeObjectURL(url);
};

export default function Finances() {
  const [stats, setStats] = useState(null);
  const [paiements, setPaiements] = useState([]);
  const [depenses, setDepenses] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [statut, setStatut] = useState("");
  const [paiement, setPaiement] = useState(null);
  const [depense, setDepense] = useState(null);
  const [erreur, setErreur] = useState("");

  const charger = useCallback(() => {
    api("/paiements/stats").then(setStats).catch((e) => setErreur(e.message));
    api("/paiements", { params: { statut } }).then(setPaiements).catch((e) => setErreur(e.message));
    api("/depenses").then(setDepenses).catch(() => {});
  }, [statut]);
  useEffect(() => { charger(); }, [charger]);
  useEffect(() => { api("/users", { params: { role: "etudiant" } }).then(setEtudiants).catch(() => {}); }, []);

  const agir = async (fn) => {
    setErreur("");
    try { await fn(); charger(); } catch (err) { setErreur(err.message); }
  };

  const enregistrerPaiement = async (e) => {
    e.preventDefault();
    setErreur("");
    const body = { description: paiement.description || undefined, montant: Number(paiement.montant), echeance: paiement.echeance, statut: paiement.statut };
    if (!paiement.id) body.etudiant = paiement.etudiant;
    try {
      if (paiement.id) await api(`/paiements/${paiement.id}`, { method: "PUT", body });
      else await api("/paiements", { method: "POST", body });
      setPaiement(null);
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };
  const enregistrerDepense = async (e) => {
    e.preventDefault();
    setErreur("");
    const body = { libelle: depense.libelle, montant: Number(depense.montant), departement: depense.departement, date: depense.date || undefined };
    try {
      if (depense.id) await api(`/depenses/${depense.id}`, { method: "PUT", body });
      else await api("/depenses", { method: "POST", body });
      setDepense(null);
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  const max = Math.max(1, ...(stats?.depenses_par_departement || []).map((d) => d.total));

  return (
    <>
      <div className="dash-entete-page">
        <div>
          <h1 className="dash-titre">Gestion Financière</h1>
          <p className="dash-sous">MIT Madagascar — Trésorerie et scolarités.</p>
        </div>
      </div>
      {erreur && !paiement && !depense && <div className="alert alert-danger">{erreur}</div>}

      {stats && (
        <div className="dash-stats">
          <div className="dash-carte dash-stat"><div className="titre">Recettes totales</div><div className="valeur petit">{montant(stats.recettes_totales)}</div><div className="sous">Paiements encaissés</div></div>
          <div className="dash-carte dash-stat"><div className="titre">Dépenses opérationnelles</div><div className="valeur petit">{montant(stats.depenses_operationnelles)}</div><div className="sous">Dépenses enregistrées</div></div>
          <div className="dash-carte dash-stat"><div className="titre">Solde net</div><div className={`valeur petit${stats.solde_net < 0 ? " dash-neg" : ""}`}>{montant(stats.solde_net)}</div><div className="sous">Recettes moins dépenses</div></div>
          <div className="dash-carte dash-stat"><div className="titre">Factures en attente</div><div className="valeur petit">{montant(stats.factures_en_attente.montant)}</div>
            <div className="sous dash-neg">{stats.factures_en_retard.nombre} en retard ({montant(stats.factures_en_retard.montant)})</div></div>
        </div>
      )}

      <div className="dash-entete-page" style={{ marginTop: 8 }}>
        <h2 className="h5 mb-0">Suivi des paiements de scolarité</h2>
        <div className="dash-barre-actions">
          <select className="form-select w-auto" aria-label="Filtrer par statut" value={statut} onChange={(e) => setStatut(e.target.value)}>
            <option value="">Tous les statuts</option>
            {Object.entries(STATUTS).map(([v, [, l]]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <button type="button" className="dash-btn" onClick={() => window.print()}><Icone nom="printer" /> Imprimer</button>
          <button type="button" className="dash-btn" onClick={() => exporterCsv(paiements)}><Icone nom="download" /> Exporter CSV</button>
          <button type="button" className="dash-btn principal" onClick={() => setPaiement({ etudiant: "", description: "Scolarité", montant: "", echeance: "", statut: "en_attente" })}><Icone nom="plus" /> Nouveau paiement</button>
        </div>
      </div>

      <div className="dash-colonnes">
        <section className="dash-carte">
          <div className="dash-table-zone">
            <table className="dash-table">
              <thead><tr><th>Étudiant</th><th>Description</th><th>Montant</th><th>Échéance</th><th>Statut</th><th></th></tr></thead>
              <tbody>
                {paiements.map((p) => {
                  const [couleur, libelle] = STATUTS[p.statut_effectif] || ["gris", p.statut_effectif];
                  return (
                    <tr key={p._id}>
                      <td><strong>{nomPersonne(p.etudiant) || "Compte supprimé"}</strong></td>
                      <td>{p.description}</td>
                      <td><strong>{montant(p.montant)}</strong></td>
                      <td>{dateFr(p.echeance)}</td>
                      <td><span className={`dash-tag ${couleur}`}>{libelle}</span></td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        {p.statut !== "paye" && p.statut !== "annule" && (
                          <button type="button" className="dash-btn me-1" style={{ padding: "4px 10px" }} onClick={() => agir(() => api(`/paiements/${p._id}/payer`, { method: "PUT" }))}>Marquer payé</button>
                        )}
                        <button type="button" className="dash-mini-btn" aria-label="Modifier le paiement"
                          onClick={() => setPaiement({ id: p._id, description: p.description, montant: String(p.montant), echeance: jourChamp(p.echeance), statut: p.statut })}><Icone nom="edit" taille={15} /></button>
                        <button type="button" className="dash-mini-btn" aria-label="Supprimer le paiement"
                          onClick={() => window.confirm("Supprimer ce paiement ?") && agir(() => api(`/paiements/${p._id}`, { method: "DELETE" }))}><Icone nom="trash" taille={15} /></button>
                      </td>
                    </tr>
                  );
                })}
                {paiements.length === 0 && <tr><td colSpan="6" className="dash-vide">Aucun paiement.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <div className="dash-colonne">
          <section className="dash-carte">
            <h2>Dépenses par département</h2>
            {(stats?.depenses_par_departement || []).length === 0 && <p className="dash-vide">Aucune dépense enregistrée.</p>}
            {(stats?.depenses_par_departement || []).map((d, i) => (
              <div key={d.departement}>
                <div className="dash-barre-ligne"><span>{d.departement}</span><span style={{ color: "#8c9bbd" }}>{montant(d.total)}</span></div>
                <div className="dash-progres"><span style={{ width: `${(d.total / max) * 100}%`, background: COULEURS[i % COULEURS.length] }} /></div>
              </div>
            ))}
          </section>

          <section className="dash-carte">
            <h2>Dépenses récentes
              <button type="button" className="dash-btn" onClick={() => setDepense({ libelle: "", montant: "", departement: "", date: jourChamp(new Date()) })}><Icone nom="plus" /> Ajouter</button>
            </h2>
            {depenses.length === 0 && <p className="dash-vide">Aucune dépense.</p>}
            {depenses.slice(0, 6).map((d) => (
              <div className="dash-ligne" key={d._id}>
                <div><strong>{d.libelle}</strong><small>{d.departement} · {dateFr(d.date)}</small></div>
                <div className="d-flex align-items-center gap-2">
                  <strong>{montant(d.montant)}</strong>
                  <button type="button" className="dash-mini-btn" aria-label={`Modifier ${d.libelle}`}
                    onClick={() => setDepense({ id: d._id, libelle: d.libelle, montant: String(d.montant), departement: d.departement, date: jourChamp(d.date) })}><Icone nom="edit" taille={15} /></button>
                  <button type="button" className="dash-mini-btn" aria-label={`Supprimer ${d.libelle}`}
                    onClick={() => window.confirm("Supprimer cette dépense ?") && agir(() => api(`/depenses/${d._id}`, { method: "DELETE" }))}><Icone nom="trash" taille={15} /></button>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>

      {paiement && (
        <Modale titre={paiement.id ? "Modifier le paiement" : "Nouveau paiement"} onSubmit={enregistrerPaiement} onClose={() => { setPaiement(null); setErreur(""); }} erreur={erreur}>
          {!paiement.id && (
            <Champ id="p-etu" label="Étudiant">
              <select id="p-etu" className="form-select" required value={paiement.etudiant} onChange={(e) => setPaiement({ ...paiement, etudiant: e.target.value })}>
                <option value="" disabled>Choisissez un étudiant</option>
                {etudiants.map((u) => <option key={u.id} value={u.id}>{nomPersonne(u)} ({u.numero_etudiant})</option>)}
              </select>
            </Champ>
          )}
          <Champ id="p-desc" label="Description"><input id="p-desc" className="form-control" value={paiement.description} onChange={(e) => setPaiement({ ...paiement, description: e.target.value })} /></Champ>
          <Champ id="p-mont" label="Montant (Ar)"><input id="p-mont" type="number" min="0" className="form-control" required value={paiement.montant} onChange={(e) => setPaiement({ ...paiement, montant: e.target.value })} /></Champ>
          <Champ id="p-ech" label="Échéance"><input id="p-ech" type="date" className="form-control" required value={paiement.echeance} onChange={(e) => setPaiement({ ...paiement, echeance: e.target.value })} /></Champ>
          <Champ id="p-stat" label="Statut">
            <select id="p-stat" className="form-select" value={paiement.statut} onChange={(e) => setPaiement({ ...paiement, statut: e.target.value })}>
              <option value="en_attente">En attente</option><option value="paye">Payé</option><option value="annule">Annulé</option>
            </select>
          </Champ>
        </Modale>
      )}

      {depense && (
        <Modale titre={depense.id ? "Modifier la dépense" : "Nouvelle dépense"} onSubmit={enregistrerDepense} onClose={() => { setDepense(null); setErreur(""); }} erreur={erreur}>
          <Champ id="dp-lib" label="Libellé"><input id="dp-lib" className="form-control" required placeholder="Ex : Licences logicielles" value={depense.libelle} onChange={(e) => setDepense({ ...depense, libelle: e.target.value })} /></Champ>
          <Champ id="dp-mont" label="Montant (Ar)"><input id="dp-mont" type="number" min="0" className="form-control" required value={depense.montant} onChange={(e) => setDepense({ ...depense, montant: e.target.value })} /></Champ>
          <Champ id="dp-dep" label="Département"><input id="dp-dep" className="form-control" required placeholder="Ex : Département Informatique" value={depense.departement} onChange={(e) => setDepense({ ...depense, departement: e.target.value })} /></Champ>
          <Champ id="dp-date" label="Date"><input id="dp-date" type="date" className="form-control" value={depense.date} onChange={(e) => setDepense({ ...depense, date: e.target.value })} /></Champ>
        </Modale>
      )}
    </>
  );
}

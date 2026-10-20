import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { dateFr, montant } from "../../services/format";

const STATUTS = { paye: ["vert", "Payé"], en_attente: ["orange", "En attente"], en_retard: ["rouge", "En retard"], annule: ["gris", "Annulé"] };

export default function MesPaiements() {
  const [d, setD] = useState(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    api("/paiements/mes-paiements").then(setD).catch((e) => setErreur(e.message));
  }, []);

  return (
    <>
      <h1 className="dash-titre">Paiements</h1>
      <p className="dash-sous">Suivi de votre scolarité.</p>
      {erreur && <div className="alert alert-danger">{erreur}</div>}
      {!d && !erreur && <p className="dash-sous">Chargement…</p>}
      {d && (
        <>
          <div className="dash-stats">
            <div className="dash-carte dash-stat"><div className="titre">Déjà payé</div><div className="valeur">{montant(d.total_paye)}</div><div className="sous">Paiements reçus</div></div>
            <div className="dash-carte dash-stat"><div className="titre">Reste à payer</div><div className="valeur">{montant(d.total_restant)}</div><div className="sous">En attente ou en retard</div></div>
          </div>
          <section className="dash-carte">
            <h2>Échéancier</h2>
            <div className="dash-table-zone">
              <table className="dash-table">
                <thead><tr><th>Description</th><th>Montant</th><th>Échéance</th><th>Statut</th></tr></thead>
                <tbody>
                  {d.paiements.map((p) => {
                    const [couleur, libelle] = STATUTS[p.statut_effectif] || ["gris", p.statut_effectif];
                    return (
                      <tr key={p._id}>
                        <td>{p.description}</td><td><strong>{montant(p.montant)}</strong></td><td>{dateFr(p.echeance)}</td>
                        <td><span className={`dash-tag ${couleur}`}>{libelle}</span></td>
                      </tr>
                    );
                  })}
                  {d.paiements.length === 0 && <tr><td colSpan="4" className="dash-vide">Aucun paiement enregistré.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
}

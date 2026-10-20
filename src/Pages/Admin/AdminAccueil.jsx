import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import Icone from "../../assets/Components/Icone";

const nomPersonne = (p) => (p ? `${p.prenom || ""} ${p.nom || ""}`.trim() : "");

function Stat({ titre, valeur, sous, badge, negatif }) {
  return (
    <div className="dash-carte dash-stat">
      <div className="entete">
        <span className="titre">{titre}</span>
        {badge != null && <span className={`dash-badge${negatif ? " negatif" : ""}`}>{badge}</span>}
      </div>
      <div className="valeur">{valeur}</div>
      <div className="sous">{sous}</div>
    </div>
  );
}

const ACTIONS = [
  ["userplus", "Nouvel étudiant", "Créer un dossier d'inscription", "/admin/etudiants?ajouter=1"],
  ["file", "Générer un relevé", "Bulletins et attestations ECTS", "/admin/notes"],
  ["calendar", "Ajouter un cours", "Mise à jour de l'emploi du temps", "/admin/cours?ajouter=1"],
];

export default function AdminAccueil() {
  const [d, setD] = useState(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    api("/dashboard/admin").then(setD).catch((e) => setErreur(e.message));
  }, []);

  const titre = (
    <>
      <h1 className="dash-titre">Console d'Administration</h1>
      <p className="dash-sous">Rapport global de l'établissement MIT Madagascar.</p>
    </>
  );
  if (erreur) return <>{titre}<div className="alert alert-danger">{erreur}</div></>;
  if (!d) return <>{titre}<p className="dash-sous">Chargement…</p></>;

  const v = d.variation_etudiants_30j_pct;

  return (
    <>
      {titre}

      <div className="dash-stats">
        <Stat titre="Étudiants actifs" valeur={d.etudiants_actifs}
          badge={v == null ? null : `${v > 0 ? "+" : ""}${v}%`} negatif={v < 0}
          sous={`${d.inscrits_cette_annee} inscrit(s) cette année`} />
        <Stat titre="Enseignants" valeur={d.enseignants} badge="Actifs" sous="Équipe pédagogique" />
        <Stat titre="Taux de réussite" valeur={d.taux_reussite == null ? "—" : `${d.taux_reussite}%`}
          sous="Moyennes supérieures ou égales à 10" />
        <Stat titre="Contrats d'alternance" valeur={d.alternance.places} badge={`${d.alternance.taux_placement}%`}
          sous="Placés en entreprise" />
      </div>

      <div className="dash-stats">
        <Link to="/admin/alternance" className="dash-carte dash-stat" style={{ color: "inherit", textDecoration: "none" }}>
          <div className="titre">Candidatures en attente</div><div className="valeur">{d.candidatures_en_attente}</div><div className="sous">À traiter</div>
        </Link>
        <Link to="/admin/messages" className="dash-carte dash-stat" style={{ color: "inherit", textDecoration: "none" }}>
          <div className="titre">Messages de contact</div><div className="valeur">{d.messages_contact_non_lus}</div><div className="sous">Non lus</div>
        </Link>
      </div>

      <div className="dash-colonnes">
        <section className="dash-carte">
          <h2>Dernières inscriptions <Link to="/admin/etudiants">Voir les étudiants</Link></h2>
          <div className="dash-table-zone">
            <table className="dash-table">
              <thead><tr><th>Étudiant</th><th>Niveau</th><th>Filière</th><th>Statut alternance</th></tr></thead>
              <tbody>
                {d.dernieres_inscriptions.map((e) => (
                  <tr key={e.id}>
                    <td><strong>{nomPersonne(e)}</strong></td>
                    <td>{e.niveau || "—"}</td>
                    <td>{e.formation?.titre || "—"}</td>
                    <td><span className={`dash-tag ${e.alternance.startsWith("Placé") ? "vert" : "orange"}`}>{e.alternance}</span></td>
                  </tr>
                ))}
                {d.dernieres_inscriptions.length === 0 && <tr><td colSpan="4" className="dash-vide">Aucun étudiant inscrit pour le moment.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <div className="dash-colonne">
          <section className="dash-carte">
            <h2>Actions rapides</h2>
            {ACTIONS.map(([icone, label, sous, chemin]) => (
              <Link className="dash-rapide" to={chemin} key={label}>
                <Icone nom={icone} />
                <span><strong>{label}</strong><small>{sous}</small></span>
              </Link>
            ))}
          </section>

          <section className="dash-carte">
            <h2>Alertes académiques</h2>
            {d.alertes.length === 0 && <p className="dash-vide">Aucune alerte pour le moment.</p>}
            {d.alertes.map((a, i) => (
              <div className={`dash-alerte${a.type === "absences" ? "" : " info"}`} key={i}>
                <Icone nom="alert" />
                <div>
                  <strong>{a.message}</strong>
                  <small>{[nomPersonne(a.etudiant), a.etudiant?.niveau, a.entreprise?.nom].filter(Boolean).join(" · ")}</small>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, urlFichier } from "../../services/api";
import { useAuth } from "../../Context/AuthContext";
import BadgeStatut from "../../assets/Components/BadgeStatut";
import Icone from "../../assets/Components/Icone";

const maj = (t = "") => t.charAt(0).toUpperCase() + t.slice(1);
const jour = (d) => maj(new Date(d).toLocaleDateString("fr-FR", { weekday: "long" }));
const heure = (d) => (d ? new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "");
const dateCourte = (d) => (d ? new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "");
const nomPersonne = (p) => (p ? `${p.prenom || ""} ${p.nom || ""}`.trim() : "");

function Stat({ titre, valeur, sous, petit, evolution }) {
  return (
    <div className="dash-carte dash-stat">
      <div className="entete">
        <span className="titre">{titre}</span>
        {typeof evolution === "number" && (
          <span className={`dash-badge${evolution < 0 ? " negatif" : ""}`}>{evolution > 0 ? "+" : ""}{evolution}</span>
        )}
      </div>
      <div className={`valeur${petit ? " petit" : ""}`}>{valeur}</div>
      <div className="sous">{sous}</div>
    </div>
  );
}

export default function Accueil() {
  const { user } = useAuth();
  const [d, setD] = useState(null);
  const [erreur, setErreur] = useState("");
  const [inscriptions, setInscriptions] = useState([]);

  useEffect(() => {
    api("/dashboard/etudiant").then(setD).catch((e) => setErreur(e.message));
    api("/inscriptions/mes-inscriptions").then(setInscriptions).catch(() => {});
  }, []);

  const titre = (
    <>
      <h1 className="dash-titre">Bonjour, {user.prenom} !</h1>
      <p className="dash-sous">Ravi de vous revoir. Voici un résumé de votre activité académique.</p>
    </>
  );

  if (erreur) return <>{titre}<div className="alert alert-danger">{erreur}</div></>;
  if (!d) return <>{titre}<p className="dash-sous">Chargement…</p></>;

  const pc = d.prochain_cours;
  const planifiable = d.etudiant.formation && d.etudiant.niveau;
  const aucunCours = planifiable ? "Aucun cours planifié cette semaine." : "Votre formation et votre niveau ne sont pas encore renseignés : contactez l'administration.";
  const abs = d.absences;

  return (
    <>
      {titre}

      <div className="dash-stats">
        <Stat titre="Moyenne générale" evolution={d.evolution_semestre}
          valeur={d.moyenne_generale != null ? `${d.moyenne_generale} / 20` : "—"}
          sous={d.mention || "Aucune note validée"} />
        <Stat titre="Crédits ECTS" valeur={`${d.ects_valides ?? 0} / ${d.ects_total ?? 0}`}
          sous={d.etudiant.niveau || "Niveau non renseigné"} />
        <Stat titre="Absences" valeur={abs.justifiees + abs.non_justifiees}
          sous={<><span>{`Justifiées : ${abs.justifiees}, Non justifiées : ${abs.non_justifiees} · `}</span><Link to="/etudiant/absences" style={{ color: "#e8761f" }}>Détails</Link></>} />
        <Stat petit titre="Prochain cours" valeur={pc?.cours?.titre || "Aucun"}
          sous={pc ? `${jour(pc.debut)} ${heure(pc.debut)}${pc.salle?.nom ? ` · ${pc.salle.nom}` : ""}${pc.enseignant ? ` · ${nomPersonne(pc.enseignant)}` : ""}` : (planifiable ? "Aucune séance à venir" : "Planning non disponible")} />
      </div>

      <div className="dash-colonnes">
        <div className="dash-colonne">
          <section className="dash-carte">
            <h2>Mon emploi du temps <Link to="/etudiant/emploi-du-temps">Semaine en cours</Link></h2>
            {d.emploi_du_temps_semaine.length === 0 && <p className="dash-vide">{aucunCours}</p>}
            {d.emploi_du_temps_semaine.map((s) => (
              <div className="dash-ligne" key={s._id}>
                <div className="gauche">
                  <span className="dash-jour">{jour(s.debut)}</span>
                  <div>
                    <strong>{s.cours?.titre || "Cours"}</strong>
                    <small>{nomPersonne(s.enseignant)}{s.salle?.nom ? ` · ${s.salle.nom}` : ""}</small>
                  </div>
                </div>
                <span style={{ color: "#8c9bbd", whiteSpace: "nowrap" }}>{heure(s.debut)}{s.fin ? ` - ${heure(s.fin)}` : ""}</span>
              </div>
            ))}
          </section>

          <section className="dash-carte">
            <h2>Mes inscriptions <Link to="/catalogue">Voir les formations</Link></h2>
            {inscriptions.length === 0 && <p className="dash-vide">Vous n'êtes inscrit à aucune formation.</p>}
            {inscriptions.map((i) => (
              <div className="dash-ligne" key={i._id}>
                <strong>{i.formation?.titre || "Formation supprimée"}</strong>
                <BadgeStatut statut={i.statut} />
              </div>
            ))}
          </section>
        </div>

        <div className="dash-colonne">
          <section className="dash-carte">
            <h2>Notes récentes <Link to="/etudiant/notes">Tout voir</Link></h2>
            {d.notes_recentes.length === 0 && <p className="dash-vide">Aucune note validée pour le moment.</p>}
            {d.notes_recentes.map((n, i) => (
              <div className="dash-ligne" key={i}>
                <div><strong>{n.cours}</strong><small>{dateCourte(n.date)}</small></div>
                <span className={`dash-note${n.moyenne >= 14 ? " bien" : ""}`}>{n.moyenne}/20</span>
              </div>
            ))}
          </section>

          <section className="dash-carte">
            <h2>Mes documents <Link to="/etudiant/documents">Tout voir</Link></h2>
            {d.documents_recents.length === 0 && <p className="dash-vide">Aucun document disponible.</p>}
            {d.documents_recents.map((doc) => (
              <div className="dash-ligne" key={doc._id}>
                <div><strong>{doc.titre}</strong><small>{doc.type}</small></div>
                {doc.fichier && (
                  <a href={urlFichier(doc.fichier)} target="_blank" rel="noreferrer" aria-label={`Télécharger ${doc.titre}`}
                    style={{ color: "#e8761f" }}><Icone nom="download" /></a>
                )}
              </div>
            ))}
          </section>
        </div>
      </div>

      <div className="dash-stats mt-3">
        <Stat petit titre="Alternance" valeur={d.alternance?.entreprise?.nom || "Aucune convention active"}
          sous={d.alternance ? "Convention active" : "Consultez les offres"} />
        <Stat titre="Paiements restants" valeur={d.paiements_restants.nombre}
          sous={<><span>{d.paiements_restants.nombre ? `Montant dû : ${d.paiements_restants.montant.toLocaleString("fr-FR")} · ` : "Tout est à jour · "}</span><Link to="/etudiant/paiements" style={{ color: "#e8761f" }}>Détails</Link></>} />
        <Stat titre="Messages non lus" valeur={d.messages_non_lus} sous="Dans la messagerie" />
      </div>
    </>
  );
}

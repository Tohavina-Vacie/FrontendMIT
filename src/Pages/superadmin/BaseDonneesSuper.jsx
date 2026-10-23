import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { dureeUptime } from "../../services/format";

function Stat({ titre, valeur, sous }) {
  return <div className="dash-carte dash-stat"><div className="titre">{titre}</div><div className="valeur">{valeur}</div><div className="sous">{sous}</div></div>;
}

export default function BaseDonneesSuper() {
  const [vue, setVue] = useState(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    api("/super-admin/vue-ensemble").then(setVue).catch((e) => setErreur(e.message));
  }, []);

  const connectee = vue?.systeme.base_de_donnees === "Connecté";

  return (
    <>
      <h1 className="dash-titre">Base de données</h1>
      <p className="dash-sous">État de la connexion de la base de données académique.</p>
      {erreur && <div className="alert alert-danger">{erreur}</div>}
      {!vue && !erreur && <p className="dash-sous">Chargement…</p>}
      {vue && (
        <>
          <div className="dash-stats">
            <Stat titre="Connexion" valeur={<span className={connectee ? "" : "dash-neg"}>{vue.systeme.base_de_donnees}</span>} sous="État actuel de la connexion" />
            <Stat titre="Serveur" valeur={vue.systeme.serveur} sous={`En ligne depuis ${dureeUptime(vue.systeme.uptime_secondes)}`} />
            <Stat titre="Utilisateurs actifs" valeur={vue.utilisateurs_actifs} sous="Comptes enregistrés et actifs" />
            <Stat titre="Journal du jour" valeur={vue.logs_aujourdhui} sous={`dont ${vue.erreurs_aujourdhui} erreur(s)`} />
          </div>
          <section className="dash-carte"><p className="dash-vide">Les sauvegardes et les statistiques de stockage ne sont pas exposées par l'API pour le moment.</p></section>
        </>
      )}
    </>
  );
}

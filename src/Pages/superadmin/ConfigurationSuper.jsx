import Interrupteur from "../../assets/Components/Interrupteur";
import useConfiguration from "../../services/useConfiguration";

const OPTIONS = [
  ["mode_maintenance", "Mode maintenance", "Bloque l'accès à tous les comptes sauf les super admins."],
  ["inscriptions_ouvertes", "Inscriptions ouvertes", "Autorise la création de nouveaux comptes depuis le site."],
  ["sauvegarde_auto", "Sauvegarde automatique", "Réglage enregistré dans la configuration."],
  ["double_facteur_obligatoire", "Double facteur (2FA) obligatoire", "Réglage enregistré : aucune double authentification n'est encore active sur le site."],
  ["rate_limiting", "Limitation du débit de l'API", "Réglage enregistré dans la configuration."],
  ["notifications_email", "Notifications e-mail", "Réglage enregistré dans la configuration."],
];

export default function ConfigurationSuper() {
  const { config, erreur, enCours, changer } = useConfiguration();

  const modifier = (champ) => (valeur) => {
    if (champ === "mode_maintenance" && valeur && !window.confirm("Activer la maintenance bloquera tous les utilisateurs, sauf les super admins. Continuer ?")) return;
    changer(champ, valeur);
  };

  return (
    <>
      <h1 className="dash-titre">Configuration système</h1>
      <p className="dash-sous">Options globales de la plateforme. Chaque changement est enregistré tout de suite et journalisé.</p>
      {erreur && <div className="alert alert-danger">{erreur}</div>}
      {!config && !erreur && <p className="dash-sous">Chargement…</p>}
      {config && (
        <section className="dash-carte">
          <h2>Options système globales</h2>
          <div className="dash-grille-options">
            {OPTIONS.map(([champ, titre, description]) => (
              <Interrupteur key={champ} id={champ} titre={titre} description={description} checked={config[champ]}
                disabled={enCours === champ} onChange={modifier(champ)} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

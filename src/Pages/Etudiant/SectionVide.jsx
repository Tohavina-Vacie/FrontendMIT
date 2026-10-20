import Icone from "../../assets/Components/Icone";

// Page d'une section du dashboard qui n'a pas encore de données
export default function SectionVide({ titre, description, icone, message = "Aucune donnée à afficher pour le moment." }) {
  return (
    <>
      <h1 className="dash-titre">{titre}</h1>
      <p className="dash-sous">{description}</p>
      <div className="dash-carte dash-vide-page">
        <div className="rond"><Icone nom={icone} taille={28} /></div>
        <p className="mb-0" style={{ color: "#8c9bbd" }}>{message}</p>
      </div>
    </>
  );
}

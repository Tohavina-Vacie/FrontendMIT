import { useState } from "react";
import PanneauDeroulant, { anim } from "./PanneauDeroulant";
import "./MetiersPanel.css";

const COMPETENCES = [
  "Programmation",
  "Résolution de problèmes",
  "Analyse et logique",
  "Travail en équipe",
  "Communication",
];

const AVANTAGES = [
  "Nombreuses opportunités professionnelles",
  "Évolution constante des technologies",
  "Possibilité de travailler à distance",
  "Diversité des spécialisations",
  "Possibilité d’évolution de carrière",
];

const DOMAINES = [
  "Développement Web",
  "Cybersécurité",
  "Réseaux et systèmes",
  "Data et Intelligence Artificielle",
  "Développement Mobile",
];

// <MetiersPanel ouvert={ouvert} onFermer={() => setOuvert(false)} image="/entreprises/metiers-informatique.jpg" />
export default function MetiersPanel({ ouvert, onFermer, image = "/entreprises/metiers-informatique.jpg" }) {
  const [imageOk, setImageOk] = useState(true);

  return (
    <PanneauDeroulant ouvert={ouvert} onFermer={onFermer} titre="Métiers de l’informatique" theme="metiers">
      <h2 {...anim(0, "mt-titre")}>Pourquoi choisir le métier de l’informatique ?</h2>

      <div {...anim(1, `mt-intro${imageOk ? "" : " sans-image"}`)}>
        {imageOk && <img src={image} alt="Ordinateurs portables affichant du code et des outils de travail" onError={() => setImageOk(false)} />}
        <p>
          Le métier de l’informatique est un domaine moderne et passionnant qui offre de nombreuses
          opportunités professionnelles. Il permet de développer ses compétences en technologie, en
          créativité et en résolution de problèmes. Comme l’informatique est présente dans presque
          tous les secteurs, c’est un métier d’avenir qui permet d’évoluer et d’apprendre constamment.
        </p>
      </div>

      <div className="mt-listes">
        <section {...anim(2, "mt-liste")}>
          <h2>Les compétences essentielles</h2>
          <ul>{COMPETENCES.map((c) => <li key={c}>{c}</li>)}</ul>
        </section>
        <section {...anim(3, "mt-liste")}>
          <h2>Quelques avantages</h2>
          <ul>{AVANTAGES.map((a) => <li key={a}>{a}</li>)}</ul>
        </section>
      </div>

      <section {...anim(4, "mt-liste mt-domaines")}>
        <h2>Les différents domaines de l’informatique</h2>
        <ul>{DOMAINES.map((d) => <li key={d}>{d}</li>)}</ul>
      </section>
    </PanneauDeroulant>
  );
}

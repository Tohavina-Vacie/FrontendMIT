import { useState } from "react";
import PanneauDeroulant, { anim } from "./PanneauDeroulant";
import "./FullStackPanel.css";

const CARTES = [
  { titre: "Front-End", texte: "Création des interfaces visibles par les utilisateurs.", points: ["HTML", "CSS", "JavaScript", "React / Vue.js", "Responsive Design"] },
  { titre: "Bases de données", texte: "Stockage et gestion des informations.", points: ["MySQL", "PostgreSQL", "MongoDB", "SQL"] },
  { titre: "Back-End", texte: "Développement de la logique et des fonctionnalités du serveur.", points: ["PHP / Laravel", "Python", "Node.js", "API REST", "Authentification"] },
];

const ATOUTS = [
  "Vision à 360° : Capacité à comprendre l'impact d'un choix technique Back-End sur l'expérience Front-End, et inversement.",
  "Agilité et Time-to-Market : Idéal pour les startups et les équipes réduites pour prototyper et sortir des fonctionnalités rapidement.",
  "Communication facilitée : Sert de pont naturel entre les spécialistes du design, de l'infrastructure et de la donnée.",
];

// <FullStackPanel ouvert={ouvert} onFermer={() => setOuvert(false)} image="/entreprises/dev.jpg" />
export default function FullStackPanel({ ouvert, onFermer, image = "/images/fullstack.jpg" }) {
  const [imageOk, setImageOk] = useState(true);

  return (
    <PanneauDeroulant ouvert={ouvert} onFermer={onFermer} titre="Développement full-stack" theme="fullstack">
      <h2 {...anim(0, "fs-titre-section")}>Pourquoi choisir le Full-Stack ?</h2>

      <div {...anim(1, "fs-intro")}>
        {imageOk && <img src={image} alt="Code de programmation sur un écran" onError={() => setImageOk(false)} />}
        <div className="fs-texte">
          <p>
            Construisez les applications web de demain
            <br />
            La filière Développement Full-Stack forme des professionnels capables de concevoir,
            développer et maintenir une application web complète, de l'interface utilisateur
            jusqu'au serveur et à la base de données.
          </p>
          <p>Le développeur Full-Stack maîtrise les différentes parties d'une application web.</p>
        </div>
      </div>

      <div className="fs-cartes">
        {CARTES.map((c, i) => (
          <section key={c.titre} {...anim(2 + i, "fs-carte")}>
            <h3>{c.titre}</h3>
            <p>{c.texte}</p>
            <ul>{c.points.map((p) => <li key={p}>{p}</li>)}</ul>
          </section>
        ))}
      </div>

      <h2 {...anim(5, "fs-titre-section")}>Pourquoi ce profil est-il prisé ?</h2>
      <ul {...anim(6, "fs-atouts")}>{ATOUTS.map((a) => <li key={a}>{a}</li>)}</ul>
    </PanneauDeroulant>
  );
}

import { useState } from "react";
import PanneauDeroulant, { anim } from "./PanneauDeroulant";
import "./CyberPanel.css";

const BOITES = [
  {
    titre: "Ce que vous apprenez",
    points: [
      "Sécurité des réseaux et systèmes",
      "Sécurité web & applications",
      "Cryptographie",
      "Pentest et tests d'intrusion",
      "Gestion des incidents et crises cyber",
      "Sécurité cloud & infrastructures",
    ],
  },
  {
    titre: "Les parcours possibles",
    points: [
      "Sécurité offensive — devenir pentester / hacker éthique",
      "Sécurité défensive — protection des systèmes, SOC, analyste sécurité",
      "Gouvernance & conformité — normes, audits, gestion des risques",
      "Sécurité cloud — protection des infrastructures hébergées",
    ],
  },
  {
    titre: "Débouchés / Métiers",
    points: [
      "Analyste en cybersécurité",
      "Pentester / Hacker éthique",
      "Responsable sécurité des systèmes d'information (RSSI)",
      "Ingénieur sécurité cloud",
      "Consultant en cybersécurité",
    ],
  },
];

// <CyberPanel ouvert={ouvert} onFermer={() => setOuvert(false)} image="/entreprises/cybersecurite.jpg" />
export default function CyberPanel({ ouvert, onFermer, image = "/entreprises/cybersecurite.jpg" }) {
  const [imageOk, setImageOk] = useState(true);

  return (
    <PanneauDeroulant ouvert={ouvert} onFermer={onFermer} titre="Bachelor Cybersécurité — MIT Madagascar" theme="cyber">
      <h2 {...anim(0, "cy-titre")}>Devenez l'expert que le marché attend</h2>

      <div {...anim(1, `cy-intro${imageOk ? "" : " sans-image"}`)}>
        {imageOk && <img src={image} alt="Étudiants devant des serveurs et du matériel réseau" onError={() => setImageOk(false)} />}
        <p>
          À Madagascar comme ailleurs, les entreprises et institutions font face à une explosion
          des cybermenaces et manquent cruellement de talents formés pour y répondre. Le Bachelor
          Cybersécurité de MIT Madagascar vous prépare à devenir un professionnel complet, capable
          de sécuriser systèmes, réseaux et données dans un monde numérique en constante évolution.
        </p>
      </div>

      <div className="cy-boites">
        {BOITES.map((b, i) => (
          <section key={b.titre} {...anim(2 + i, "cy-boite")}>
            <h2>{b.titre}</h2>
            <ul>{b.points.map((p) => <li key={p}>{p}</li>)}</ul>
          </section>
        ))}
      </div>
    </PanneauDeroulant>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import FullStackPanel from "../FullStack/FullStackPanel";
import CyberPanel from "../FullStack/CyberPanel";
import MetiersPanel from "../FullStack/MetiersPanel";
import "./Home.css";

/* ------------------------------ Données ------------------------------ */

const programs = [
  { badge: "Bachelors (Bac+3)", duration: "3 ans d’études", title: "Développeur Full-Stack", panneau: "fullstack", text: "Maîtrisez les architectures web modernes, le cloud computing et les pipelines de déploiement continu.", highlight: "Alternance dès la 1ère année" },
  { badge: "Masters (Bac+5)", duration: "2 ans d’études", title: "Métiers de l’informatique", panneau: "metiers", text: "Les métiers de l’informatique consistent à concevoir, développer, sécuriser et maintenir les outils.", highlight: "Rythme alterné optimisé" },
  { badge: "Expertise (Bac+5)", duration: "2 ans d’études", title: "Cybersécurité", panneau: "cyber", text: "Protégez les infrastructures critiques et configurez la sécurité des réseaux face aux nouvelles menaces.", highlight: "Immergé 4j en entreprise" },
];

const values = ["Rigueur", "Coopération", "Curiosité", "Audace", "Responsabilité"];

// TODO : vérifiez ces chiffres (certains semblent venir d'un autre site)
const stats = [
  { value: "75.8%", label: "D’embauche avant diplomation" },
  { value: "41,643 €", label: "Salaire moyen de sortie" },
  { value: "242", label: "Entreprises partenaires" },
  { value: "4", label: "Campus en France" },
];

const reasons = [
  { num: "01", title: "L’Alternance dès le 1er jour", text: "Pas besoin d’attendre la 3ème année pour intégrer le monde professionnel. Votre formation est financée et rémunérée immédiatement." },
  { num: "02", title: "Une pédagogie par projet", text: "Chez nous, pas de cours magistraux passifs. Vous apprenez en faisant, à travers de vrais projets calqués sur la réalité des entreprises." },
  { num: "03", title: "Accompagnement personnalisé", text: "Un tuteur dédié vous suit tout au long de votre parcours académique et professionnel pour garantir votre réussite." },
  { num: "04", title: "Insertion garantie à 100%", text: "Grâce à notre puissant réseau d’entreprises partenaires, l’accès à un emploi stable est une certitude avant même d’être diplômé." },
];

const pedagogyStats = [
  { value: "80%", label: "De pratique réelle" },
  { value: "12+", label: "Projets d’envergure" },
];

const stories = [
  { title: "Podcast Éruption", img: "/entreprises/Podcast.jpg", text: "Le podcast qui donne la parole aux esprits les plus brûlants de la tech. Découvrez des parcours atypiques et inspirants d’acteurs clés de l’écosystème numérique." },
  { title: "Conférences", img: "/entreprises/Conférences.jpg", text: "Des conférences régulières avec des experts de pointe pour élargir votre vision du numérique, décrypter les tendances technologiques et mieux comprendre ses enjeux sociétaux." },
  { title: "Concours", img: "/entreprises/Concours.jpg", text: "Le Concours des Grands Projets ETNA (GPE) : un marathon annuel d’innovation, d’esprit d’équipe et d’entrepreneuriat où nos étudiants pitch devant de vrais investisseurs." },
];

const press = [
  { source: "Le Monde Informatique", date: "Jan 2026", title: "Comment MIT bouscule les codes de la formation IT", text: "En proposant une alternance immédiate, l’école attire des profils diversifiés et répond concrètement à la pénurie de talents." },
  { source: "Les Echos Start", date: "Dec 2025", title: "Pourquoi les recruteurs s’arrachent les profils MIT", text: "Grâce à leur formation axée sur la pratique intensive et l’autonomie, les jeunes diplômés sont opérationnels dès le jour de leur embauche." },
  { source: "Le Parisien Etudiant", date: "Oct 2025", title: "Le modèle alterné : clé de voûte de l’insertion pro", text: "Faire confiance aux étudiants et leur confier des responsabilités en entreprise dès le départ est un pari gagnant pour MIT Madagascar." },
];

/* ---------------------------- Petits composants ---------------------------- */

function SectionHead({ label, title, subtitle, sans = false }) {
  return (
    <div className="hm-head text-center">
      {label && <p className={`hm-label ${sans ? "hm-label-sans" : "hm-mono"}`}>{label}</p>}
      <h2>{title}</h2>
      {subtitle && <p className="hm-sub">{subtitle}</p>}
    </div>
  );
}

function Thumb({ img, title }) {
  return (
    <div className="hm-thumb">
      <img src={img} alt={title} />
      {/* TODO : brancher la lecture de la vidéo / du podcast */}
      <button type="button" className="hm-play" aria-label={`Lire : ${title}`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
          <polygon points="6 4 20 12 6 20 6 4" />
        </svg>
      </button>
    </div>
  );
}

/* --------------------------------- Page --------------------------------- */

export default function Home() {
  const [panneau, setPanneau] = useState(null); // "fullstack" | "cyber" | "metiers" | null

  return (
    <div className="hm">
      {/* 1. Hero (existant) */}
      <header className="hm-section hm-hero">
        <div className="container-fluid px-3 px-md-4 px-xl-5">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-12 col-lg-7">
              <h1>Venez vivre une expérience humaine différente</h1>
              <p className="hm-lead">
                L’école leader de l’alternance en informatique depuis 21 ans. Formez-vous aux
                métiers du développement full-stack, de la cybersécurité et de l’intelligence
                artificielle tout en étant immergé en entreprise.
              </p>
              <a href="#formations" className="btn btn-hm">En savoir plus sur nos formations</a>
            </div>
            <div className="col-12 col-md-8 col-lg-5 mx-auto">
              {/* Photo dans public/entreprises/hero-etudiants.jpg */}
              <img src="/entreprises/hero-etudiants.jpg" alt="Étudiants en cours de travail" className="hm-hero-img" />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Formations en alternance */}
      <section className="hm-section" id="formations">
        <div className="container">
          <SectionHead
            title="Nos formations en alternance"
            subtitle="Des parcours adaptés aux exigences réelles du marché de l’emploi technologique, du post-bac au Bac+5."
          />
          <div className="row g-3 hm-prog-row">
            {programs.map((p) => (
              <div className="col-12 col-md-6 col-lg-4" key={p.title}>
                <article className="hm-prog h-100">
                  <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
                    <span className="hm-badge hm-mono">{p.badge}</span>
                    <span className="hm-mono hm-duration">{p.duration}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <p className="hm-text">{p.text}</p>
                  <p className="hm-highlight">{p.highlight}</p>
                  {p.panneau ? (
                    <a
                      href={`#${p.panneau}`}
                      className="hm-more"
                      onClick={(e) => {
                        e.preventDefault();
                        setPanneau(p.panneau);
                      }}
                    >
                      En savoir plus <span aria-hidden="true">→</span>
                    </a>
                  ) : (
                    <Link to="/formations" className="hm-more">
                      En savoir plus <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Valeurs + chiffres */}
      <section className="hm-values">
        <div className="container">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-12 col-lg-6">
              <p className="hm-label hm-mono hm-label-left">Engagements &amp; rentrée</p>
              <h2 className="hm-values-title">5 Valeurs et Science qui guident MIT-Madagascar</h2>
              <p className="hm-text hm-text-lg mb-0">
                Nous allions la rigueur scientifique à des valeurs humaines fortes d’entraide,
                d’éthique et d’esprit d’équipe. C’est ce qui fait de nos étudiants des
                professionnels recherchés par les entreprises.
              </p>
            </div>
            <div className="col-12 col-lg-6">
              <ul className="list-unstyled d-flex flex-wrap gap-3 mb-0">
                {values.map((v) => (
                  <li className="hm-chip" key={v}>
                    <span className="hm-chip-dot" aria-hidden="true" />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="hm-stats">
        <div className="container">
          <div className="row g-4 text-center">
            {stats.map((s) => (
              <div className="col-6 col-lg-3 hm-stat-item" key={s.label}>
                <p className="hm-mono hm-stat-val">{s.value}</p>
                <p className="hm-stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Quatre raisons */}
      <section className="hm-section">
        <div className="container">
          <SectionHead label="Pourquoi nous rejoindre ?" title="Les 4 raisons de choisir MIT-Madagascar" />
          <div className="row g-3">
            {reasons.map((r) => (
              <div className="col-12 col-sm-6 col-lg-3" key={r.num}>
                <article className="hm-reason h-100">
                  <p className="hm-mono hm-num">{r.num}</p>
                  <h3>{r.title}</h3>
                  <p className="hm-text mb-0">{r.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Pédagogie par projet */}
      <section className="hm-section">
        <div className="container">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-12 col-lg-5">
              <div className="hm-frame">
                {/* Photo dans public/entreprises/dev.jpg */}
                <img src="/entreprises/dev.jpg" alt="Étudiants travaillant sur un projet de code" />
              </div>
            </div>
            <div className="col-12 col-lg-7">
              <p className="hm-label hm-mono hm-label-left">Méthode active</p>
              <h2 className="hm-values-title">La pédagogie par projet</h2>
              <p className="hm-text hm-text-lg">
                Nos étudiants ne subissent pas la formation, ils en sont les acteurs principaux.
                Chaque semestre s’articule autour de grands projets de groupe qui développent à la
                fois la technique et le leadership.
              </p>
              <div className="d-flex gap-4">
                {pedagogyStats.map((s) => (
                  <div className="hm-mini" key={s.label}>
                    <p className="hm-mono hm-mini-val">{s.value}</p>
                    <p className="hm-mini-label">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Rencontres */}
      <section className="hm-section">
        <div className="container">
          <SectionHead label="Communauté et échanges" title="MIT-Madagascar, c’est des rencontres" sans />
          <div className="d-flex flex-column gap-5">
            {stories.map((s, i) => (
              <div className={`row align-items-center g-4 g-lg-5 ${i % 2 === 1 ? "flex-lg-row-reverse" : ""}`} key={s.title}>
                <div className="col-12 col-lg-6 hm-story-text">
                  <h3 className="hm-story-title"><span aria-hidden="true">/</span> {s.title}</h3>
                  <p className="hm-text hm-text-lg mb-0">{s.text}</p>
                </div>
                <div className="col-12 col-lg-6">
                  <Thumb img={s.img} title={s.title} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Presse */}
      <section className="hm-section">
        <div className="container">
          <SectionHead label="Revue de presse" title="Ils en parlent" />
          <div className="row g-3">
            {press.map((p) => (
              <div className="col-12 col-md-6 col-lg-4" key={p.source}>
                <article className="hm-press h-100">
                  <div className="d-flex justify-content-between gap-2 mb-3">
                    <span className="hm-mono hm-press-src">{p.source}</span>
                    <span className="hm-press-date">{p.date}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <p className="hm-text mb-0">“{p.text}”</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Appel à l'action */}
      <section className="hm-cta text-center">
        <div className="container">
          <p className="hm-label hm-mono">Votre avenir recruté</p>
          <h2>Prêt à sauter le pas ?</h2>
          <p className="hm-sub mx-auto">
            Inscrivez-vous à nos prochaines journées portes ouvertes ou déposez votre candidature
            en ligne. Notre équipe d’admission est là pour vous accompagner.
          </p>
          <Link to="/inscription" className="btn btn-hm-dark">Déposer mon dossier</Link>
        </div>
      </section>

      {/* Pages de description des filières (se déroulent depuis le haut) */}
      <FullStackPanel
        ouvert={panneau === "fullstack"}
        onFermer={() => setPanneau(null)}
        image="/entreprises/dev.jpg"
      />
      <CyberPanel
        ouvert={panneau === "cyber"}
        onFermer={() => setPanneau(null)}
        image="/entreprises/cybersecurite.jpg"
      />
      <MetiersPanel
        ouvert={panneau === "metiers"}
        onFermer={() => setPanneau(null)}
        image="/entreprises/metiers-informatique.jpg"
      />
    </div>
  );
}

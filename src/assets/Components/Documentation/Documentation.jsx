import { useState } from "react";
import { Link } from "react-router-dom";
import "./Documentation.css";

/* ------------------------------ Données ------------------------------ */

// TODO : placez vos PDF dans public/documents/ et vérifiez les tailles
const brochures = [
  { title: "Livret d’accueil", text: "Informations pratiques pour préparer votre rentrée : accès, logement, outils numériques.", size: "3.5 MB", file: "/documents/livret-accueil.pdf" },
  { title: "Brochure des formations", text: "Présentation des Bachelors et Masters, des programmes et des débouchés.", size: "À définir", file: "/documents/brochure-formations.pdf" },
  { title: "Guide de l’alternance", text: "Comprendre le rythme alterné, le contrat et vos démarches pour trouver une entreprise.", size: "À définir", file: "/documents/guide-alternance.pdf" },
  { title: "Dossier de candidature", text: "Formulaire d’inscription et liste des pièces à fournir pour déposer votre dossier.", size: "À définir", file: "/documents/dossier-candidature.pdf" },
];

const faqs = [
  { q: "Comment s’inscrire à l’MIT Madagascar ?", a: "L’admission se fait sur dossier puis entretien de motivation et tests d’évaluation technique ou logique." },
  { q: "Quels sont les frais de scolarité ?", a: "Grâce au modèle d’alternance, vos frais de formation sont entièrement pris en charge par l’entreprise d’accueil. Vous êtes également rémunéré chaque mois." },
  { q: "Quel est le rythme de l’alternance ?", a: "Le rythme standard est optimisé pour l’immersion : généralement 4 jours par semaine en entreprise et 1 jour de séminaire ou projet intensif sur le campus." },
  { q: "Quels diplômes sont délivrés ?", a: "Nous délivrons des diplômes équivalents Bachelors (Bac+3) et Masters (Bac+5), reconnus par l’État et calqués sur l’ingénierie active européenne." },
  { q: "Comment trouver une entreprise partenaire ?", a: "L’MIT Madagascar dispose d’une cellule de relations entreprises dédiée qui vous accompagne dans la rédaction de votre CV, prépare vos entretiens et vous met directement en relation avec plus de 200 partenaires." },
];

// TODO : remplacez par vos vraies actualités
const news = {
  img: "/documentation/actualite.jpg",
  tag: "Actualité · Admissions",
  title: "Candidatures 2026 : le calendrier d’admission est en ligne",
  text: "Dépôt des dossiers de janvier à avril, tests et entretiens en mai, matchmaking alternance en juin-juillet et rentrée en octobre 2026.",
  to: "/formations",
};

// Ajoutez d'autres plateformes ici (une carte par entrée)
const resources = [
  { title: "Office 365", text: "Messagerie étudiante officielle, stockage cloud et outils bureautiques collaboratifs accessibles gratuitement.", href: "https://www.office.com" },
];

/* ---------------------------- Petits composants ---------------------------- */

function Chevron() {
  return (
    <svg className="doc-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <g className="doc-arrow">
        <path d="M12 3v12" />
        <path d="m8 11 4 4 4-4" />
      </g>
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

function Heading({ title, subtitle }) {
  return (
    <div className="doc-heading">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

/* --------------------------------- Page --------------------------------- */

export default function Documentation() {
  // Toutes les questions sont ouvertes au départ (comme sur la maquette)
  const [openSet, setOpenSet] = useState(() => new Set(faqs.map((_, i) => i)));

  const toggle = (i) =>
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="doc">
      {/* 1. Hero */}
      <header className="doc-section doc-hero">
        <div className="container">
          <h1>Centre de Documentation</h1>
          <p className="doc-lead">
            Retrouvez l’ensemble de nos guides pratiques, formulaires d’inscription et
            documentations pour accompagner votre parcours de formation d’excellence à l’MIT
            Madagascar.
          </p>
        </div>
      </header>

      {/* 2. Brochures & guides */}
      <section className="doc-section">
        <div className="container">
          <Heading title="Brochures & Guides" />
          <div className="row g-3">
            {brochures.map((b) => (
              <div className="col-12 col-md-6" key={b.title}>
                <a href={b.file} download className="doc-card h-100">
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <span className="doc-icon"><DownloadIcon /></span>
                    <span className="doc-mono doc-size">{b.size}</span>
                  </div>
                  <h3>{b.title}</h3>
                  <p className="doc-text mb-0">{b.text}</p>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FAQ */}
      <section className="doc-section doc-dark">
        <div className="container">
          <Heading
            title="Foire Aux Questions"
            subtitle="Des réponses claires à vos questions les plus courantes concernant la vie de l’école et l’alternance."
          />
          <div className="d-flex flex-column gap-3">
            {faqs.map((f, i) => {
              const isOpen = openSet.has(i);
              return (
                <article className={`doc-faq ${isOpen ? "is-open" : ""}`} key={f.q}>
                  <h3>
                    <button
                      type="button"
                      className="doc-faq-q"
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}`}
                      onClick={() => toggle(i)}
                    >
                      <span>{f.q}</span>
                      <Chevron />
                    </button>
                  </h3>
                  <div className="doc-faq-a" id={`faq-${i}`} role="region">
                    <div>
                      <p>{f.a}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Actualités */}
      <section className="doc-section">
        <div className="container">
          <Heading title="Actualités du Campus" />
          <article className="doc-news">
            <div className="doc-news-img">
              {/* Photo dans public/documentation/actualite.jpg */}
              <img src={news.img} alt="" />
              <span className="doc-news-more" aria-hidden="true">Lire la suite →</span>
            </div>
            <div className="doc-news-body">
              <p className="doc-mono doc-tag">{news.tag}</p>
              <h3>
                <Link to={news.to} className="stretched-link">{news.title}</Link>
              </h3>
              <p className="doc-text mb-0">{news.text}</p>
            </div>
          </article>
        </div>
      </section>

      {/* 5. Ressources pédagogiques */}
      <section className="doc-section doc-dark">
        <div className="container">
          <Heading
            title="Ressources Pédagogiques"
            subtitle="Accédez directement aux plateformes d’apprentissage et de collaboration technique utilisées par l’école."
          />
          <div className="row g-3">
            {resources.map((r) => (
              <div className={resources.length === 1 ? "col-12" : "col-12 col-md-6"} key={r.title}>
                <article className="doc-res h-100">
                  <h3>{r.title}</h3>
                  <p className="doc-text">{r.text}</p>
                  <a href={r.href} target="_blank" rel="noopener noreferrer" className="doc-res-link stretched-link">
                    Se connecter <span aria-hidden="true">→</span>
                  </a>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Appel à l'action */}
      <section className="doc-section doc-cta text-center">
        <div className="container">
          <p className="doc-mono doc-label">Une admission accompagnée</p>
          <h2>Prêt à démarrer l’aventure ?</h2>
          <p className="doc-lead mx-auto">
            Nos équipes pédagogiques et relations entreprises sont à votre disposition pour
            analyser votre profil et vous guider pas à pas dans votre démarche.
          </p>
          {/* TODO : adresse ou page de contact de l'admission */}
          <a href="mailto:contact@mit.io" className="btn btn-doc">Contacter un conseiller d’admission</a>
        </div>
      </section>
    </div>
  );
}
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Ecole.css";

/* ------------------------------ Données ------------------------------ */

const milestones = [
  { year: "2005", title: "Fondation de l’École", text: "Lancement de la première école d’informatique active inspirée des meilleures pratiques pédagogiques françaises." },
  { year: "2012", title: "L’Alternance Pionnière", text: "Intégration d’un rythme école-entreprise dès la 1ère année d’études supérieures à Madagascar." },
  { year: "2020", title: "Cybersécurité & Cloud", text: "Inauguration du laboratoire de sécurité offensive et d’architectures cloud avancées." },
  { year: "2026", title: "Cap International", text: "Lancement de la plateforme internationale pour favoriser le placement en remote et en mobilité." },
];

const campus = [
  { img: "/entreprises/colab.jpg", title: "Les Espaces Collaboratifs", text: "Pensés pour le travail d’équipe, nos espaces de co-working permettent d’apprendre en mode projet de façon fluide." },
  { img: "/entreprises/cyber.jpg", title: "Le Lab de Cybersécurité", text: "Un environnement isolé pour tester les vulnérabilités de sécurité et administrer des réseaux en temps réel." },
];

const team = [
  { name: "M. Andrianjafy Toky", role: "Lead Coach Web Development", photo: "/ecole/equipe/toky.jpg", text: "Expert Full-Stack, consultant senior pour des grands comptes internationaux." },
  { name: "Mme Razafindrakoto Lily", role: "Responsable Relations Entreprises", photo: "/ecole/equipe/lily.jpg", text: "Dédiée au placement en alternance et au suivi des apprentis en entreprise." },
  { name: "Mme Ranivoarson Sarah", role: "Responsable des Admissions", photo: "/ecole/equipe/sarah.jpg", text: "Spécialiste de l’accompagnement des étudiants dans leur transition professionnelle." },
  { name: "M. Ravalomanana Thierry", role: "Coach Cybersécurité & Réseaux", photo: "/ecole/equipe/thierry.jpg", text: "Certifié CISSP, expert en audits de sécurité d’infrastructures critiques." },
  { name: "Mme Rambolarson Nina", role: "Formatrice Algorithmique & Data", photo: "/ecole/equipe/nina.jpg", text: "Enseignante-chercheuse passionnée par l’innovation pédagogique active." },
  { name: "Dr. Rakotoarisoa Jean", role: "Directeur Académique", photo: "/ecole/equipe/jean.jpg", text: "Ph.D en Intelligence Artificielle, 15 ans d’expérience dans l’enseignement supérieur." },
];

const partners = ["Orange", "BMOI", "Telma", "SGS", "Ravinala Airports"];

const values = [
  { title: "Innovation", text: "Nous adaptons continuellement nos cursus aux dernières technologies du marché." },
  { title: "Excellence", text: "La rigueur scientifique au service de projets d’envergure professionnelle." },
  { title: "Collaboration", text: "L’apprentissage en équipe et l’entraide sont les piliers de notre modèle." },
  { title: "Inclusivité", text: "Une école ouverte à tous les talents motivés, sans barrière financière." },
  { title: "Engagement", text: "Un accompagnement personnalisé de chaque étudiant vers la réussite." },
];

/* ---------------------------- Petits composants ---------------------------- */

function SectionHeading({ title, subtitle }) {
  return (
    <div className="ecole-heading text-center">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

// Affiche la photo, ou les initiales si l'image est introuvable
function Avatar({ name, photo }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .replace(/^(M\.|Mme|Dr\.)\s+/, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return failed ? (
    <span className="ecole-avatar ecole-avatar-fallback" aria-hidden="true">{initials}</span>
  ) : (
    <img src={photo} alt={name} className="ecole-avatar" onError={() => setFailed(true)} />
  );
}

/* --------------------------------- Page --------------------------------- */

export default function Ecole() {
  return (
    <div className="ecole">
      {/* 1. Hero */}
      <header className="ecole-section ecole-hero">
        <div className="container">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-12 col-lg-6">
              <h1>L’École MIT Madagascar</h1>
              <p className="ecole-lead">
                Propulser les talents tech de Madagascar vers des sommets internationaux grâce à
                une pédagogie d’excellence, calquée sur le modèle de la MIT Madagascar
              </p>
              <Link to="/inscription" className="btn btn-ecole">Rejoindre la rentrée 2026</Link>
            </div>
            <div className="col-12 col-lg-6">
              <img src="/entreprises/ecole.jpg" alt="Salle de travail de l’école MIT Madagascar" className="ecole-img" />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Histoire & jalons */}
      <section className="ecole-section">
        <div className="container">
          <SectionHeading
            title="Notre Histoire & Jalons"
            subtitle="Plus de deux décennies d’engagement à former la nouvelle élite informatique de la région."
          />
          <div className="row g-3">
            {milestones.map((m) => (
              <div className="col-12 col-sm-6 col-lg-3" key={m.year}>
                <article className="ecole-card h-100">
                  <p className="ecole-year">{m.year}</p>
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Campus */}
      <section className="ecole-section">
        <div className="container">
          <SectionHeading
            title="Notre Campus Moderne"
            subtitle="Un cadre de travail stimulant, conçu pour le travail collaboratif, la recherche et l’innovation technologique."
          />
          <div className="row g-4">
            {campus.map((c) => (
              <div className="col-12 col-md-6" key={c.title}>
                <img src={c.img} alt={c.title} className="ecole-img ecole-img-campus" />
                <h3 className="ecole-campus-title">{c.title}</h3>
                <p className="ecole-muted">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Équipe */}
      <section className="ecole-section">
        <div className="container">
          <SectionHeading
            title="Notre Équipe Pédagogique"
            subtitle="Des professionnels de haut niveau et des universitaires engagés pour votre insertion professionnelle."
          />
          <div className="row g-3">
            {team.map((p) => (
              <div className="col-12 col-md-6 col-lg-4" key={p.name}>
                <article className="ecole-card ecole-team-card h-100">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <Avatar name={p.name} photo={p.photo} />
                    <div>
                      <h3 className="mb-1">{p.name}</h3>
                      <p className="ecole-mono ecole-role mb-0">{p.role}</p>
                    </div>
                  </div>
                  <p className="mb-0">{p.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Partenaires + valeurs */}
      <section className="ecole-section ecole-partners">
        <div className="container text-center">
          <p className="ecole-mono ecole-label">Plus de 200 entreprises partenaires</p>
          <ul className="list-unstyled d-flex flex-wrap justify-content-center gap-3 gap-md-5 mb-0">
            {partners.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ecole-section">
        <div className="container">
          <SectionHeading title="Nos Valeurs Fondatrices" subtitle="Ce qui anime notre communauté éducative au quotidien." />
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-5 g-3">
            {values.map((v) => (
              <div className="col" key={v.title}>
                <article className="ecole-card ecole-value h-100">
                  <span className="ecole-dot" aria-hidden="true" />
                  <div>
                    <h3>{v.title}</h3>
                    <p className="mb-0">{v.text}</p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Appel à l'action */}
      <section className="ecole-section ecole-cta text-center">
        <div className="container">
          <p className="ecole-mono ecole-label">Rejoignez-nous dès maintenant</p>
          <h2>Prêt à transformer votre avenir ?</h2>
          <p className="ecole-lead mx-auto">
            Donnez un coup d’accélérateur à votre carrière informatique en intégrant l’un de nos
            bachelors ou masters en alternance.
          </p>
          <Link to="/inscription" className="btn btn-ecole">Déposer mon dossier de candidature</Link>
        </div>
      </section>
    </div>
  );
}
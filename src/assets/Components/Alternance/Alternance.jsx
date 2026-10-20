import { Link } from "react-router-dom";
import "./Alternance.css";

/* ------------------------------ Données ------------------------------ */

const steps = [
  { num: "01", title: "Candidature en ligne", text: "Déposez votre dossier académique et passez nos tests d’évaluation technique en ligne." },
  { num: "02", title: "Sélection & Validation", text: "Un entretien individuel pour valider votre projet professionnel et votre motivation." },
  { num: "03", title: "Placement assisté", text: "Accédez à notre réseau de partenaires et recevez du coaching pour décrocher votre contrat." },
  { num: "04", title: "Formation & Entreprise", text: "Débutez votre rythme alterné : 4 jours en entreprise, 1 jour de formation active." },
];

const days = [
  { day: "Lundi", place: "École", text: "Cours avancés, projet, évaluations", school: true },
  { day: "Mardi", place: "Entreprise", text: "Immersion professionnelle" },
  { day: "Mercredi", place: "Entreprise", text: "Immersion professionnelle" },
  { day: "Jeudi", place: "Entreprise", text: "Immersion professionnelle" },
  { day: "Vendredi", place: "Entreprise", text: "Immersion professionnelle" },
];

const perks = [
  { stat: "0 Ar", title: "Formation Gratuite", text: "Votre entreprise partenaire prend intégralement en charge vos frais de scolarité." },
  { stat: "Mensuel", title: "Salaire Garanti", text: "Bénéficiez d’une rémunération mensuelle fixe tout au long de vos études." },
  { stat: "+5 Ans", title: "Expérience pro solide", text: "Cumulez jusqu’à 5 ans d’expérience concrète à la fin de votre cursus." },
  { stat: "95%", title: "Employabilité assurée", text: "Plus de 75% de nos étudiants signent un CDI avant même d’être diplômés." },
];

const testimonials = [
  {
    quote: "L’alternance m’a permis de financer entièrement mes études tout en travaillant sur des projets cloud passionnants chez Orange Madagascar.",
    name: "Rasoa Fitia",
    promo: "Promo 2025 - Dev FullStack",
  },
  {
    quote: "Être sur le terrain 4 jours par semaine m’a appris à gérer le stress des cyberattaques réelles, ce qu’aucun cours théorique n’aurait pu m’enseigner.",
    name: "Andry Faly",
    promo: "Promo 2024 - Cybersécurité",
  },
  {
    quote: "Dès ma première année, j’ai été intégrée dans une équipe de Business Intelligence. Je me sens utile et prête pour le marché mondial.",
    name: "Mina R.",
    promo: "Promo 2026 - Data Analyst",
  },
];

const initials = (name) =>
  name.replace(".", "").split(" ").map((w) => w[0]).slice(0, 2).join("");

/* ---------------------------- Petit composant ---------------------------- */

function SectionHeading({ title, subtitle }) {
  return (
    <div className="alt-heading text-center">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

/* --------------------------------- Page --------------------------------- */

export default function Alternance() {
  return (
    <div className="alt">
      {/* 1. Hero */}
      <header className="alt-section alt-hero">
        <div className="container">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-12 col-lg-6">
              <h1>L’Alternance chez MIT</h1>
              <p className="alt-lead">
                Associez théorie et pratique professionnelle grâce à notre modèle d’apprentissage
                intensif. Étudiez sans frais, gagnez un salaire et devenez hautement compétitif.
              </p>
              <a href="#processus" className="btn btn-alt">Comment postuler ?</a>
            </div>
            <div className="col-12 col-lg-6">
              {/* Placez votre photo dans public/alternance/hero.jpg */}
              <img
                src="/entreprises/alternance.jpg"
                alt="Alternants au travail dans une entreprise partenaire"
                className="alt-hero-img"
              />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Comment ça marche */}
      <section className="alt-section" id="processus">
        <div className="container">
          <SectionHeading
            title="Comment ça marche ?"
            subtitle="Notre méthode structurée pour vous guider de la sélection jusqu’à votre premier jour en entreprise."
          />
          <div className="row g-3">
            {steps.map((s) => (
              <div className="col-12 col-sm-6 col-lg-3" key={s.num}>
                <article className="alt-step h-100">
                  <p className="alt-num">{s.num}</p>
                  <h3>{s.title}</h3>
                  <p className="alt-text mb-0">{s.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Rythme */}
      <section className="alt-section">
        <div className="container">
          <SectionHeading
            title="Rythme d’alternance optimisé"
            subtitle="Un calendrier conçu pour maximiser votre présence en entreprise tout en conservant une dynamique académique rigoureuse."
          />
          <div className="alt-week">
            <div className="alt-days">
              {days.map((d) => (
                <article className={`alt-day ${d.school ? "is-school" : ""}`} key={d.day}>
                  <h3>{d.day}</h3>
                  <p className="alt-mono alt-place">{d.place}</p>
                  <p className="alt-desc mb-0">{d.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Avantages */}
      <section className="alt-section">
        <div className="container">
          <SectionHeading
            title="Vos Avantages Apprentis"
            subtitle="De multiples opportunités pour concilier autonomie financière et excellence académique."
          />
          <div className="row g-3">
            {perks.map((p) => (
              <div className="col-12 col-sm-6 col-lg-3" key={p.title}>
                <article className="alt-perk h-100">
                  <p className="alt-mono alt-stat">{p.stat}</p>
                  <h3>{p.title}</h3>
                  <p className="alt-text mb-0">{p.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Témoignages */}
      <section className="alt-section">
        <div className="container">
          <SectionHeading
            title="Ce que disent nos étudiants"
            subtitle="Découvrez les retours d’expérience de nos alternants immergés dans le tissu économique tech."
          />
          <div className="row g-3">
            {testimonials.map((t) => (
              <div className="col-12 col-md-6 col-lg-4" key={t.name}>
                <figure className="alt-quote h-100">
                  <blockquote>“{t.quote}”</blockquote>
                  <figcaption className="d-flex align-items-center gap-3">
                    <span className="alt-avatar" aria-hidden="true">{initials(t.name)}</span>
                    <span>
                      <strong>{t.name}</strong>
                      <span className="alt-mono alt-promo">{t.promo}</span>
                    </span>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Appel à l'action */}
      <section className="alt-section alt-cta text-center">
        <div className="container">
          <p className="alt-mono alt-label">Rejoignez l’aventure</p>
          <h2>Postuler en alternance</h2>
          <p className="alt-lead mx-auto">
            Démarrez le processus d’inscription et débloquez l’accès à nos entreprises partenaires
            pour financer vos études.
          </p>
          <Link to="/inscription" className="btn btn-alt">Déposer mon dossier alternant</Link>
        </div>
      </section>
    </div>
  );
}
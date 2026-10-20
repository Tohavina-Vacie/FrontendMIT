import "./Formations.css";

/* ------------------------------ Données ------------------------------ */

const bachelors = [
  {
    title: "Développeur Fullstack & Cloud",
    duration: "3 ans d’études",
    access: "Bac requis",
    requirement: "Bac requis (série math/technique)",
    label: "Modules clés :",
    // TODO : modules à vérifier / compléter (non visibles sur la maquette)
    modules: ["HTML / CSS / JavaScript", "React & Node.js", "Bases de données", "API REST", "Docker & Cloud", "Gestion de projet agile"],
  },
  {
    title: "Cybersécurité & Systèmes",
    duration: "3 ans d’études",
    access: "Bac requis",
    requirement: "Bac requis (série math/technique)",
    label: "Modules clés :",
    // TODO : modules à vérifier / compléter
    modules: ["Administration Linux & Windows", "Réseaux & protocoles", "Sécurité des systèmes", "Virtualisation", "Scripting Bash / PowerShell", "Supervision"],
  },
  {
    title: "Data & Intelligence Artificielle",
    duration: "3 ans d’études",
    access: "Bac requis",
    requirement: "Bac requis (série math/technique)",
    label: "Modules clés :",
    // TODO : modules à vérifier / compléter
    modules: ["Python & algorithmique", "Statistiques & probabilités", "Bases de données SQL", "Machine Learning", "Visualisation de données", "Introduction au Deep Learning"],
  },
];

const masters = [
  {
    title: "Tech Innovation & Strategies",
    duration: "2 ans d’études",
    access: "Bac+3 compatible",
    label: "Enseignement avancé :",
    // TODO : modules à vérifier / compléter (carte non visible sur la maquette)
    modules: ["Management de l’innovation", "Architecture logicielle avancée", "Stratégie digitale", "Gestion de projets complexes", "Cloud-native & DevOps", "Entrepreneuriat tech"],
  },
  {
    title: "Data Science & IA Avancée",
    duration: "2 ans d’études",
    access: "Bac+3 compatible",
    label: "Enseignement avancé :",
    modules: [
      "Réseaux de neurones profonds (Deep Learning)",
      "Traitement automatique du langage (NLP)",
      "Computer Vision",
      "Gestion opérationnelle d’IA (MLOps)",
      "Éthique de l’IA & Biais",
      "Optimisation de pipelines de données",
    ],
  },
];

const careers = [
  { job: "Data Scientist / Ingénieur IA", salary: "44,000 € - 62,000 € / an" },
  // TODO : métiers et salaires à compléter (non visibles sur la maquette)
  { job: "Développeur Full-Stack", salary: "À définir" },
  { job: "Ingénieur Cloud / DevOps", salary: "À définir" },
  { job: "Analyste Cybersécurité", salary: "À définir" },
  { job: "Administrateur Systèmes & Réseaux", salary: "À définir" },
  { job: "Chef de projet Innovation", salary: "À définir" },
];

const steps = [
  { num: "01", period: "Janv - Avril 2026", title: "Candidature en Ligne", text: "Dépôt des dossiers académiques de candidature en quelques clics." },
  { num: "02", period: "Mai 2026", title: "Tests & Entretiens", text: "Évaluation de la logique, tests de code et entretiens de motivation." },
  { num: "03", period: "Juin - Juillet 2026", title: "Matchmaking Alternance", text: "Coaching intensif et entretiens avec nos 200+ entreprises partenaires." },
  { num: "04", period: "Octobre 2026", title: "Rentrée Académique", text: "Démarrage officiel des cours et de l’intégration professionnelle." },
];

/* ---------------------------- Petits composants ---------------------------- */

function SectionHeading({ title, subtitle }) {
  return (
    <div className="fmt-heading">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

function FormationCard({ f }) {
  return (
    <article className="fmt-card">
      <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
        <span className="fmt-badge fmt-mono">{f.duration}</span>
        <span className="fmt-mono fmt-access">{f.access}</span>
      </div>

      <h3>{f.title}</h3>
      {f.requirement && <p className="fmt-muted">{f.requirement}</p>}

      <p className="fmt-mono fmt-label">{f.label}</p>
      <ul className="fmt-chips list-unstyled mb-0">
        {f.modules.map((m, i) => (
          <li key={m} className="fmt-chip" style={{ "--c": i }}>{m}</li>
        ))}
      </ul>
    </article>
  );
}

/* --------------------------------- Page --------------------------------- */

export default function Formations() {
  return (
    <div className="fmt">
      {/* 1. Hero */}
      <header className="fmt-section fmt-hero">
        <div className="container">
          <h1>Nos Formations d’Excellence</h1>
          <p className="fmt-lead">
            Devenez un leader technologique grâce à nos parcours d’ingénierie active, alliant
            théories solides et apprentissage par la pratique en entreprise.
          </p>
        </div>
      </header>

      {/* 2. Bachelors */}
      <section className="fmt-section">
        <div className="container">
          <SectionHeading
            title="Bachelors (Bac+3)"
            subtitle="Ciblez l’employabilité rapide grâce à un cursus structuré d’initiation et de consolidation informatique."
          />
          <div className="d-flex flex-column gap-3">
            {bachelors.map((f) => (
              <FormationCard key={f.title} f={f} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Masters */}
      <section className="fmt-section">
        <div className="container">
          <SectionHeading
            title="Masters (Bac+5)"
            subtitle="Spécialisez-vous pour diriger des équipes techniques de haut vol et maîtriser les architectures de demain."
          />
          <div className="d-flex flex-column gap-3">
            {masters.map((f) => (
              <FormationCard key={f.title} f={f} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Débouchés */}
      <section className="fmt-section fmt-dark">
        <div className="container">
          <SectionHeading
            title="Débouchés & Insertion Professionnelle"
            subtitle="Des salaires moyens de sortie de premier ordre pour des carrières ambitieuses à l’international."
          />
          <div className="row g-3">
            {careers.map((c) => (
              <div className="col-12 col-md-6 col-lg-4" key={c.job}>
                <article className="fmt-job h-100">
                  <h3>{c.job}</h3>
                  <p className="fmt-mono fmt-salary mb-0">
                    <span className="fmt-dot" aria-hidden="true" />
                    {c.salary}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Calendrier d'admission */}
      <section className="fmt-section">
        <div className="container">
          <SectionHeading
            title="Calendrier d’Admission 2026"
            subtitle="Suivez les étapes clés de sélection pour nous rejoindre à la rentrée."
          />
          <div className="row g-3">
            {steps.map((s) => (
              <div className="col-12 col-sm-6 col-lg-3" key={s.num}>
                <article className="fmt-step h-100">
                  <div className="d-flex justify-content-between gap-2 mb-3 fmt-mono fmt-step-top">
                    <span className="fmt-step-num">Étape {s.num}</span>
                    <span className="fmt-muted">{s.period}</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p className="mb-0">{s.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
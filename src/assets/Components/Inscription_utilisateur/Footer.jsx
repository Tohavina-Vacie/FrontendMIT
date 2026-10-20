import "./Footer.css";

const cursus = ["Dev Fullstack & Cloud", "Administrateur Réseaux"];
const masters = ["Tech Innovation & Strategies", "Cybersécurité & Systèmes", "Architecture IA"];

const icon = (children) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

// TODO : remplacer les # par vos vrais liens
const social = [
  {
    label: "LinkedIn",
    href: "#",
    svg: icon(
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
  {
    label: "Twitter",
    href: "#",
    svg: icon(<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />),
  },
  {
    label: "Facebook",
    href: "#",
    svg: icon(<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />),
  },
  {
    label: "YouTube",
    href: "#",
    svg: icon(
      <>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="ft">
      <div className="container">
        {/* À propos + réseaux */}
        <div className="row g-4 ft-top">
          <div className="col-12 col-lg-9">
            <h2 className="ft-about-title">À propos de MIT</h2>
            <p className="ft-about">
              MIT-Madagascar est l’école pionnière de l’alternance en informatique. Implantée sur
              plusieurs campus d’envergure nationale, elle forme les développeurs, administrateurs
              système et experts en cybersécurité les plus agiles de l’écosystème tech.
            </p>
          </div>
          <div className="col-12 col-lg-3">
            <h3 className="ft-title">Suivez-nous</h3>
            <ul className="list-unstyled d-flex gap-3 mb-0">
              {social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="ft-social" aria-label={s.label}>{s.svg}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Colonnes de liens */}
        <div className="row g-4 ft-cols">
          <section className="col-12 col-md-4">
            <h3 className="ft-title">Nous contacter</h3>
            <ul className="list-unstyled mb-0">
              <li><a href="mailto:contact@mit.io">contact@mit.io</a></li>
              <li><a href="tel:+261333333333">+261 33 33 333 33</a></li>
              <li>Madagascar</li>
            </ul>
          </section>

          <section className="col-12 col-md-4">
            <h3 className="ft-title">Cursus Bachelors</h3>
            <ul className="list-unstyled mb-0">
              {cursus.map((c) => (
                <li key={c}><a href="#">{c}</a></li>
              ))}
            </ul>
          </section>

          <section className="col-12 col-md-4">
            <h3 className="ft-title">Master of Science</h3>
            <ul className="list-unstyled mb-0">
              {masters.map((m) => (
                <li key={m}><a href="#">{m}</a></li>
              ))}
            </ul>
          </section>
        </div>

        {/* Bas de page */}
        <div className="ft-bottom d-flex flex-column flex-md-row justify-content-md-between gap-2">
          <p className="mb-0">
            © {new Date().getFullYear()} MIT-Madagascar - École de technologies numériques. Tous droits réservés.
          </p>
          <a href="#">Mentions légales</a>
        </div>
      </div>
    </footer>
  );
}
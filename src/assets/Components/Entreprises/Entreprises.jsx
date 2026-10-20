import { useState } from "react";
import "./Entreprises.css";

/* ------------------------------ Données ------------------------------ */

const reasons = [
  { num: "01", title: "Talents immédiatement opérationnels", text: "Nos formations sont fondées sur la pratique intensive par projet, calquée sur les enjeux de production réels." },
  { num: "02", title: "Financement avantageux", text: "Optimisez vos budgets de formation grâce aux dispositifs d’alternance et d’aide à l’apprentissage numérique." },
  { num: "03", title: "Pré-recrutement stratégique", text: "Formez vos futurs collaborateurs à vos méthodes, votre stack technique et votre culture d’entreprise pendant leurs études." },
  { num: "04", title: "Accompagnement de A à Z", text: "Notre équipe relations entreprises prend en charge la diffusion de vos offres et la pré-sélection des profils." },
];

const profiles = [
  { title: "Développeurs Web & Mobile", count: "120+ candidats", text: "Maîtrisant React, Node.js, Python, les architectures cloud et les bases de données SQL / NoSQL." },
  { title: "Administrateurs Système & Cloud", count: "80+ candidats", text: "Formés à l’intégration de conteneurs Docker/Kubernetes, à l’automatisation CI/CD et à la gestion AWS." },
  { title: "Experts en Cybersécurité", count: "45+ candidats", text: "Réseaux sécurisés, pentesting, gouvernance des risques et supervision de SOC." },
  { title: "Architectes Intelligence Artificielle", count: "30+ candidats", text: "Implémentation de pipelines de Machine Learning, Computer Vision et NLP appliqués." },
];

const process = [
  { num: 1, title: "Définition du besoin", text: "Échange sur vos postes d’alternants ou vos besoins de renfort tech." },
  { num: 2, title: "Pré-sélection ciblée", text: "Notre équipe vous propose un catalogue de profils qualifiés et validés pédagogiquement." },
  { num: 3, title: "Entretiens de matching", text: "Vous rencontrez les candidats sélectionnés et choisissez vos futurs talents." },
  { num: 4, title: "Contractualisation", text: "Prise en charge administrative de la convention d’alternance par notre équipe." },
];

// to = valeur finale du compteur, suffix = symbole affiché après le nombre
const stats = [
  { to: 500, suffix: "+", label: "Alternants placés en entreprise" },
  { to: 95, suffix: "%", label: "Taux de placement post-diplôme" },
  { to: 200, suffix: "+", label: "Entreprises partenaires actives" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---------------------------- Petit composant ---------------------------- */

function SectionHeading({ title, subtitle }) {
  return (
    <div className="ent-heading text-center">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

/* --------------------------------- Page --------------------------------- */

export default function Entreprises() {
  const [form, setForm] = useState({ company: "", contact: "", email: "", need: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
    setSent(false);
  };

  const validate = () => {
    const er = {};
    if (!form.company.trim()) er.company = "Indiquez le nom de l’entreprise.";
    if (!form.contact.trim()) er.contact = "Indiquez le nom du contact.";
    if (!EMAIL_RE.test(form.email)) er.email = "Entrez une adresse e-mail valide.";
    if (form.need.trim().length < 10) er.need = "Décrivez votre besoin en quelques mots.";
    return er;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;

    setSending(true);
    try {
      // TODO : envoyer la demande à votre backend, par exemple :
      // await apiFetch("/api/messages", { method: "POST", body: form });
      // (adaptez les noms de champs à votre modèle Mongoose)
      console.log("Demande de recrutement :", form);
      setSent(true);
      setForm({ company: "", contact: "", email: "", need: "" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="ent">
      {/* 1. Hero */}
      <header className="ent-section ent-hero">
        <div className="container">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-12 col-lg-6">
              <h1>Entreprises, recrutez nos talents</h1>
              <p className="ent-lead">
                Intégrez des profils tech ultra-qualifiés dans vos équipes. Notre processus de
                recrutement en alternance vous assure des collaborateurs agiles, productifs et
                formés aux technologies du futur.
              </p>
              <a href="#contact" className="btn btn-ent">Contacter un conseiller relations entreprises</a>
            </div>
            <div className="col-12 col-lg-6">
              {/* Placez votre photo dans public/entreprises/hero.jpg */}
              <img src="/entreprises/entreprise.jpg" alt="Équipe en réunion devant un tableau de bord" className="ent-hero-img" />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Pourquoi recruter */}
      <section className="ent-section">
        <div className="container">
          <SectionHeading
            title="Pourquoi recruter chez MIT Madagascar ?"
            subtitle="Découvrez comment notre modèle d’alternance crée un impact productif immédiat au sein de vos équipes techniques."
          />
          <div className="row g-3">
            {reasons.map((r) => (
              <div className="col-12 col-sm-6 col-lg-3" key={r.num}>
                <article className="ent-why h-100">
                  <p className="ent-num">{r.num}</p>
                  <h3>{r.title}</h3>
                  <p className="ent-text mb-0">{r.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Profils */}
      <section className="ent-section">
        <div className="container">
          <SectionHeading
            title="Nos Profils Tech Disponibles"
            subtitle="Du niveau Bachelor à l’Expertise MSc, identifiez les compétences stratégiques adaptées à vos besoins."
          />
          <div className="row g-3">
            {profiles.map((p) => (
              <div className="col-12 col-sm-6 col-lg-3" key={p.title}>
                <article className="ent-profile h-100">
                  <h3>{p.title}</h3>
                  <span className="ent-tag">{p.count}</span>
                  <p className="ent-text mb-0">{p.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Processus */}
      <section className="ent-section">
        <div className="container">
          <SectionHeading
            title="Processus de Recrutement Simplifié"
            subtitle="Notre équipe dédiée vous accompagne à chaque étape pour assurer un matching optimal et sans stress."
          />
          <div className="row g-3">
            {process.map((s) => (
              <div className="col-12 col-sm-6 col-lg-3" key={s.num}>
                <article className="ent-proc h-100">
                  <span className="ent-circle">{s.num}</span>
                  <h3>{s.title}</h3>
                  <p className="ent-text mb-0">{s.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Chiffres */}
      <section className="ent-stats">
        <div className="container">
          <div className="row g-4 text-center">
            {stats.map((s) => (
              <div className="col-12 col-md-4 ent-stat-box" key={s.label}>
                <p
                  className="ent-mono ent-stat"
                  style={{ "--to": s.to, "--suffix": `"${s.suffix}"` }}
                >
                  <span className="ent-stat-fallback">{s.to}{s.suffix}</span>
                </p>
                <p className="ent-stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Formulaire */}
      <section className="ent-section" id="contact">
        <div className="container">
          <SectionHeading
            title="Recrutez dès maintenant"
            subtitle="Laissez-nous vos coordonnées et l’un de nos conseillers relations entreprises vous recontactera sous 24h ouvrées."
          />

          <form className="ent-form mx-auto" onSubmit={handleSubmit} noValidate>
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <Field id="company" label="Nom de l’entreprise" placeholder="Ex: Orange Madagascar" value={form.company} error={errors.company} onChange={handleChange} />
              </div>
              <div className="col-12 col-md-6">
                <Field id="contact" label="Nom du contact principal" placeholder="Ex: Mme. Sarah Ranivo" value={form.contact} error={errors.contact} onChange={handleChange} />
              </div>
            </div>

            <div className="mb-3">
              <Field id="email" type="email" label="Adresse e-mail professionnelle" placeholder="Ex: rh@entreprise.mg" value={form.email} error={errors.email} onChange={handleChange} />
            </div>

            <div className="mb-4">
              <Field
                id="need"
                as="textarea"
                label="Décrivez votre besoin en recrutement (profil, compétences clés...)"
                placeholder="Ex: Recherche d’un développeur Fullstack Node/React disponible en alternance dès mars 2026..."
                value={form.need}
                error={errors.need}
                onChange={handleChange}
              />
            </div>

            {sent && (
              <p className="ent-success" role="status">
                Merci ! Votre demande a bien été envoyée, un conseiller vous recontactera sous 24h ouvrées.
              </p>
            )}

            <button type="submit" className="btn btn-ent btn-ent-block" disabled={sending}>
              {sending ? "Envoi…" : "Envoyer ma demande de recrutement"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

/* Champ de formulaire (input ou textarea) avec label et message d'erreur */
function Field({ id, label, as = "input", type = "text", error, ...props }) {
  const Tag = as;
  return (
    <div className="ent-field">
      <label htmlFor={id}>{label}</label>
      <div className="ent-input-wrap">
        <Tag
          id={id}
          name={id}
          type={as === "input" ? type : undefined}
          rows={as === "textarea" ? 4 : undefined}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      </div>
      {error && <p className="ent-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}
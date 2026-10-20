import { useState } from "react";
import { Link } from "react-router-dom";
import "./SignUp.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a18.5 18.5 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const fields = [
  { name: "email", label: "Email", type: "email", placeholder: "adresse@email.mg", autoComplete: "email" },
  { name: "password", label: "Mot de passe", type: "password", placeholder: "********", autoComplete: "new-password" },
  { name: "confirmPassword", label: "Confirmer Mot de passe", type: "password", placeholder: "********", autoComplete: "new-password" },
  { name: "name", label: "Nom", type: "text", placeholder: "Entrez votre nom", autoComplete: "family-name" },
  { name: "firstName", label: "Prénom", type: "text", placeholder: "Entrez votre prénom", autoComplete: "given-name" },
];

export default function SignUp() {
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "", name: "", firstName: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState({ password: false, confirmPassword: false });

  const toggleVisible = (name) => setVisible((v) => ({ ...v, [name]: !v[name] }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!EMAIL_RE.test(form.email)) er.email = "Entrez une adresse email valide.";
    if (form.password.length < 8) er.password = "Le mot de passe doit contenir au moins 8 caractères.";
    if (form.confirmPassword !== form.password) er.confirmPassword = "Les mots de passe ne correspondent pas.";
    if (!form.name.trim()) er.name = "Entrez votre nom.";
    if (!form.firstName.trim()) er.firstName = "Entrez votre prénom.";
    return er;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;

    setLoading(true);
    try {
      // TODO : remplacer par l'appel à votre API
      console.log("Inscription :", form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page container-fluid d-flex justify-content-center px-0">
      <main className="signup-card col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 px-3 px-sm-4 px-md-5 py-4 py-md-5">
        <h1 className="signup-title mb-4">S’inscrire</h1>

        <form onSubmit={handleSubmit} noValidate>
          {fields.map((f) => (
            <div className="mb-3" key={f.name}>
              <label htmlFor={f.name} className="form-label">{f.label}</label>

              <div className="position-relative">
                <input
                  id={f.name}
                  name={f.name}
                  type={f.type === "password" && visible[f.name] ? "text" : f.type}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  autoComplete={f.autoComplete}
                  className={`form-control form-control-lg ${f.type === "password" ? "pe-5" : ""} ${errors[f.name] ? "is-invalid" : ""}`}
                  aria-describedby={errors[f.name] ? `${f.name}-error` : undefined}
                />
                {f.type === "password" && (
                  <button
                    type="button"
                    className="toggle-eye btn p-0"
                    onClick={() => toggleVisible(f.name)}
                    aria-label={visible[f.name] ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {visible[f.name] ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                )}
              </div>

              {errors[f.name] && (
                <div className="invalid-feedback d-block" id={`${f.name}-error`}>
                  {errors[f.name]}
                </div>
              )}
            </div>
          ))}

          <div className="submit-row d-grid d-sm-block">
            <button type="submit" className="btn btn-brand" disabled={loading}>
              {loading ? "Inscription…" : "S’inscrire"}
            </button>
          </div>
        </form>

        <div className="switch-row">
          <span>Vous avez déjà un compte ?</span>
          <Link to="/connexion" className="pill-link">Se connecter</Link>
        </div>
      </main>
    </div>
  );
}
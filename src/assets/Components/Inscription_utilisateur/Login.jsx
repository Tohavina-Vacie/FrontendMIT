import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "./SignUp";
import "./SignUp.css";
import "./Login.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const er = {};
    if (!EMAIL_RE.test(form.email)) er.email = "Entrez une adresse email valide.";
    if (!form.password) er.password = "Entrez votre mot de passe.";
    setErrors(er);
    if (Object.keys(er).length) return;

    setLoading(true);
    try {
      // TODO : remplacer par l'appel à votre API de connexion
      console.log("Connexion :", form);
      // navigate("/tableau-de-bord");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page container-fluid d-flex justify-content-center align-items-center px-3 py-4">
      <main className="signup-card login-card w-20 p-4 p-md-5">
        <h1 className="signup-title mb-4">Se connecter</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="adresse@email.mg"
              autoComplete="email"
              className={`form-control form-control-lg ${errors.email ? "is-invalid" : ""}`}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <div className="invalid-feedback d-block" id="email-error">{errors.email}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <div className="position-relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="********"
                autoComplete="current-password"
                className={`form-control form-control-lg pe-5 ${errors.password ? "is-invalid" : ""}`}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                className="toggle-eye btn p-0"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && (
              <div className="invalid-feedback d-block" id="password-error">{errors.password}</div>
            )}
          </div>

          <div className="submit-row d-grid d-sm-block">
            <button type="submit" className="btn btn-brand" disabled={loading}>
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </div>
        </form>

        <div className="switch-row">
          <span>Vous n’avez pas de compte?</span>
          <Link to="/inscription" className="pill-link">S’inscrire</Link>
        </div>
      </main>
    </div>
  );
}
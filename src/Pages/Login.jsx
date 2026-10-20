import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import ChampMotDePasse from "../assets/Components/ChampMotDePasse";
import "../styles/auth.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form, setForm] = useState({ email: "", mot_de_passe: "" });
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const soumettre = async (e) => {
    e.preventDefault();
    setErreur("");
    setEnvoi(true);
    try {
      const user = await login(form.email, form.mot_de_passe);
      navigate(
        user.role === "super_admin" ? "/super-admin"
          : user.role === "etudiant" ? "/etudiant"
          : ["admin", "super_admin"].includes(user.role) ? "/admin"
          : "/profil",
      );
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={soumettre}>
        <h1>Se connecter</h1>
        {state?.message && <div className="alert alert-success">{state.message}</div>}
        {erreur && <div className="alert alert-danger">{erreur}</div>}

        <div className="mb-3">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="form-control"
            placeholder="exemple@email.com" autoComplete="email"
            value={form.email} onChange={change} required />
        </div>
        <div className="mb-4">
          <label htmlFor="mdp">Mot de passe</label>
          <ChampMotDePasse id="mdp" name="mot_de_passe" placeholder="Entrez votre mot de passe"
            value={form.mot_de_passe} onChange={change} />
        </div>

        <button className="btn btn-orange w-100 py-2" disabled={envoi}>
          {envoi ? "Connexion…" : "Se connecter"}
        </button>

        <p className="text-center mt-4 mb-2">Vous n'avez pas de compte ?</p>
        <Link to="/inscription" className="btn btn-bleu w-100">S'inscrire</Link>
      </form>
    </div>
  );
}

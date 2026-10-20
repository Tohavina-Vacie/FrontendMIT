import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import ChampMotDePasse from "../assets/Components/ChampMotDePasse";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: "", prenom: "", email: "", role: "", mot_de_passe: "", confirmation: "",
  });
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const soumettre = async (e) => {
    e.preventDefault();
    setErreur("");
    if (form.mot_de_passe !== form.confirmation) {
      return setErreur("Les mots de passe ne correspondent pas");
    }
    setEnvoi(true);
    try {
      const { confirmation, ...donnees } = form;
      await api("/users/register", { method: "POST", body: donnees });
      navigate("/connexion", { state: { message: "Compte créé, vous pouvez vous connecter." } });
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={soumettre}>
        <h1>S'inscrire</h1>
        {erreur && <div className="alert alert-danger">{erreur}</div>}

        <div className="mb-3">
          <label htmlFor="nom">Nom</label>
          <input id="nom" name="nom" className="form-control" placeholder="Entrez votre nom"
            autoComplete="family-name" value={form.nom} onChange={change} required />
        </div>
        <div className="mb-3">
          <label htmlFor="prenom">Prénom</label>
          <input id="prenom" name="prenom" className="form-control" placeholder="Entrez votre prénom"
            autoComplete="given-name" value={form.prenom} onChange={change} required />
        </div>
        <div className="mb-3">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="form-control"
            placeholder="exemple@email.com" autoComplete="email"
            value={form.email} onChange={change} required />
        </div>
        <div className="mb-3">
          <label htmlFor="role">Je m'inscris en tant que</label>
          <select id="role" name="role" className="form-select" value={form.role} onChange={change} required>
            <option value="" disabled>Choisissez votre profil</option>
            <option value="etudiant">Étudiant</option>
            <option value="entreprise">Entreprise</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="mdp">Mot de passe</label>
          <ChampMotDePasse id="mdp" name="mot_de_passe" placeholder="Créez un mot de passe"
            autoComplete="new-password" value={form.mot_de_passe} onChange={change} />
        </div>
        <div className="mb-4">
          <label htmlFor="conf">Confirmer le mot de passe</label>
          <ChampMotDePasse id="conf" name="confirmation" placeholder="Confirmez votre mot de passe"
            autoComplete="new-password" value={form.confirmation} onChange={change} />
        </div>

        <button className="btn btn-orange w-100 py-2" disabled={envoi}>
          {envoi ? "Création…" : "Créer mon compte"}
        </button>
        <p className="text-center mt-4 mb-0">
          Déjà un compte ? <Link to="/connexion" className="text-warning">Se connecter</Link>
        </p>
      </form>
    </div>
  );
}

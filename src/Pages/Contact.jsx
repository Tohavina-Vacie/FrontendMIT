import { useState } from "react";
import { api } from "../services/api";
import "../styles/auth.css";

const VIDE = { nom: "", prenom: "", email: "", telephone: "", entreprise: "", sujet: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(VIDE);
  const [erreur, setErreur] = useState("");
  const [envoye, setEnvoye] = useState(false);
  const [envoi, setEnvoi] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const soumettre = async (e) => {
    e.preventDefault();
    setErreur("");
    setEnvoi(true);
    try {
      const corps = Object.fromEntries(Object.entries(form).filter(([, v]) => v.trim() !== ""));
      await api("/messages", { method: "POST", body: corps });
      setEnvoye(true);
      setForm(VIDE);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card large" onSubmit={soumettre}>
        <h1>Nous contacter</h1>
        {envoye && <div className="alert alert-success">Merci, votre message a bien été envoyé. Nous vous répondrons rapidement.</div>}
        {erreur && <div className="alert alert-danger">{erreur}</div>}

        <div className="row">
          <div className="col-sm-6 mb-3"><label htmlFor="nom">Nom</label><input id="nom" name="nom" className="form-control" required placeholder="Votre nom" value={form.nom} onChange={change} /></div>
          <div className="col-sm-6 mb-3"><label htmlFor="prenom">Prénom</label><input id="prenom" name="prenom" className="form-control" placeholder="Votre prénom" value={form.prenom} onChange={change} /></div>
          <div className="col-sm-6 mb-3"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" className="form-control" required placeholder="exemple@email.com" value={form.email} onChange={change} /></div>
          <div className="col-sm-6 mb-3"><label htmlFor="telephone">Téléphone</label><input id="telephone" name="telephone" type="tel" className="form-control" placeholder="034 00 000 00" value={form.telephone} onChange={change} /></div>
          <div className="col-12 mb-3"><label htmlFor="entreprise">Entreprise (optionnel)</label><input id="entreprise" name="entreprise" className="form-control" placeholder="Votre entreprise" value={form.entreprise} onChange={change} /></div>
          <div className="col-12 mb-3"><label htmlFor="sujet">Sujet</label><input id="sujet" name="sujet" className="form-control" required maxLength={200} placeholder="Objet de votre message" value={form.sujet} onChange={change} /></div>
          <div className="col-12 mb-4"><label htmlFor="message">Message</label><textarea id="message" name="message" rows="5" maxLength={5000} className="form-control" required placeholder="Écrivez votre message ici" value={form.message} onChange={change} /></div>
        </div>
        <button className="btn btn-orange w-100 py-2" disabled={envoi}>{envoi ? "Envoi…" : "Envoyer le message"}</button>
      </form>
    </div>
  );
}

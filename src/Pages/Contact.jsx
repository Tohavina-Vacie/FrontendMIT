import { useRef, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../Context/AuthContext";
import Icone from "../assets/Components/Icone";
import "../styles/contact.css";

const OBJETS = ["Inscription", "Alternance", "Admission et orientation", "Partenariat entreprise", "Prise de rendez-vous", "Autre demande"];

// Remplacez "#" par les adresses réelles des pages de l'école
const RESEAUX = [["LinkedIn", "in", "#"], ["Twitter", "t", "#"], ["Facebook", "f", "#"], ["YouTube", "▶", "#"]];

export default function Contact() {
  const { user } = useAuth();
  const formulaire = useRef(null);
  const [form, setForm] = useState({
    nom: user?.nom || "", prenom: user?.prenom || "", email: user?.email || "", telephone: user?.telephone || "",
    sujet: "", entreprise: "", message: "",
  });
  const [etat, setEtat] = useState(null); // { type: "ok" | "ko", texte }
  const [envoi, setEnvoi] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const soumettre = async (e) => {
    e.preventDefault();
    setEtat(null);
    setEnvoi(true);
    try {
      // Seuls les champs remplis sont envoyés ; « entreprise » n'a de sens que pour un partenariat
      const corps = Object.fromEntries(Object.entries(form).filter(([k, v]) => v.trim() !== "" && (k !== "entreprise" || form.sujet === "Partenariat entreprise")));
      await api("/messages", { method: "POST", body: corps });
      setEtat({ type: "ok", texte: "Merci, votre message a bien été envoyé. Notre équipe vous répondra rapidement." });
      setForm({ ...form, sujet: "", entreprise: "", message: "" });
    } catch (err) {
      setEtat({ type: "ko", texte: err.status === 400 ? "Veuillez vérifier les informations saisies (adresse e-mail valide, objet et message renseignés)." : err.message });
    } finally {
      setEnvoi(false);
    }
  };

  const prendreRendezVous = () => {
    setForm((f) => ({ ...f, sujet: "Prise de rendez-vous" }));
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    formulaire.current?.scrollIntoView({ behavior: reduit ? "auto" : "smooth", block: "start" });
    formulaire.current?.querySelector("input")?.focus({ preventScroll: true });
  };

  return (
    <div className="ct">
      <header className="ct-hero">
        <div className="ct-interieur">
          <h1>Contactez-nous</h1>
          <p>Vous avez des questions sur nos cursus, l'alternance ou les admissions ? Nos équipes sont là pour vous répondre et vous orienter.</p>
        </div>
      </header>

      <main className="ct-principal">
        <div className="ct-interieur ct-grille">
          <form className="ct-formulaire" ref={formulaire} onSubmit={soumettre} noValidate={false}>
            <h2>Envoyer un message</h2>
            <div aria-live="polite">{etat && <div className={`ct-message ${etat.type}`}>{etat.texte}</div>}</div>

            <div className="ct-champs">
              <div className="ct-champ"><label htmlFor="ct-nom">Nom</label><input id="ct-nom" name="nom" required placeholder="Votre nom" autoComplete="family-name" value={form.nom} onChange={change} /></div>
              <div className="ct-champ"><label htmlFor="ct-prenom">Prénom</label><input id="ct-prenom" name="prenom" placeholder="Votre prénom" autoComplete="given-name" value={form.prenom} onChange={change} /></div>
              <div className="ct-champ"><label htmlFor="ct-email">Email</label><input id="ct-email" name="email" type="email" required placeholder="adresse@email.mg" autoComplete="email" value={form.email} onChange={change} /></div>
              <div className="ct-champ"><label htmlFor="ct-tel">Téléphone</label><input id="ct-tel" name="telephone" type="tel" placeholder="+261 33 00 000 00" autoComplete="tel" value={form.telephone} onChange={change} /></div>

              <div className="ct-champ large">
                <label htmlFor="ct-sujet">Objet</label>
                <select id="ct-sujet" name="sujet" required value={form.sujet} onChange={change}>
                  <option value="" disabled>Sélectionnez l'objet de votre demande (Ex : Inscription, Partenariat)</option>
                  {OBJETS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>

              {form.sujet === "Partenariat entreprise" && (
                <div className="ct-champ large"><label htmlFor="ct-entreprise">Entreprise</label><input id="ct-entreprise" name="entreprise" placeholder="Nom de votre entreprise" value={form.entreprise} onChange={change} /></div>
              )}

              <div className="ct-champ large">
                <label htmlFor="ct-message">Message</label>
                <textarea id="ct-message" name="message" required maxLength={5000} placeholder="Écrivez votre message ici…" value={form.message} onChange={change} />
              </div>
            </div>

            <button className="ct-envoyer" disabled={envoi}>{envoi ? "Envoi…" : "Envoyer"}</button>
          </form>

          <aside className="ct-coordonnees">
            <h2>Nos coordonnées</h2>
            <div className="ct-info"><div className="ct-icone"><Icone nom="pin" /></div><div><strong>Campus principal</strong><span>Enceinte Ex-Siten, Antananarivo, Madagascar</span></div></div>
            <div className="ct-info"><div className="ct-icone"><Icone nom="phone" /></div><div><strong>Téléphone &amp; Email</strong><span>+261 20 22 456 78 &nbsp;|&nbsp; contact@mit.mg</span></div></div>
            <div className="ct-info"><div className="ct-icone"><Icone nom="clock" /></div><div><strong>Horaires d'ouverture</strong><span>Lundi - Vendredi : 08h00 - 17h30</span></div></div>

            {/* Placez une capture du plan dans public/images/carte-antananarivo.png pour l'afficher à la place du fond */}
            <a className="ct-plan" href="https://www.google.com/maps/search/?api=1&query=Enceinte+Ex-Siten+Antananarivo+Madagascar" target="_blank" rel="noreferrer" aria-label="Ouvrir le campus dans Google Maps">
              <img src="/images/carte-antananarivo.png" alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} />
              <span className="ct-pin"><Icone nom="pin" taille={16} /> MIT Madagascar</span>
              <small>Antananarivo<br />Madagascar</small>
            </a>
          </aside>
        </div>
      </main>

      <section className="ct-rdv">
        <div className="ct-interieur">
          <div>
            <h2>Prendre rendez-vous en ligne</h2>
            <p>Planifiez un échange de 15 minutes en visioconférence avec un conseiller d'orientation pour structurer vos démarches et valider votre dossier d'alternance.</p>
          </div>
          <button type="button" className="ct-bouton" onClick={prendreRendezVous}>Prendre rendez-vous →</button>
        </div>
      </section>

      <section className="ct-reseaux">
        <p>Suivez notre quotidien sur les réseaux sociaux</p>
        <div className="ct-liste">
          {RESEAUX.map(([nom, sigle, url]) => <a key={nom} href={url} target="_blank" rel="noreferrer"><b aria-hidden="true">{sigle}</b> {nom}</a>)}
        </div>
      </section>
    </div>
  );
}

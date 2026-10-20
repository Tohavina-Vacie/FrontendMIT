import { useEffect, useRef } from "react";
import Footer from "../Inscription_utilisateur/Footer";
import "./PanneauDeroulant.css";

// Décalage d'apparition des blocs : <h2 {...anim(0, "ma-classe")}>…</h2>
export const anim = (i, classe = "") => ({
  className: `pd-anim ${classe}`.trim(),
  style: { "--d": `${0.25 + i * 0.12}s` },
});

// Page plein écran qui se déroule depuis le haut. theme : "fullstack" | "cyber"
export default function PanneauDeroulant({ ouvert, onFermer, titre, theme, children }) {
  const panneau = useRef(null);
  const retour = useRef(null);
  const fermerRef = useRef(onFermer);
  fermerRef.current = onFermer;

  useEffect(() => {
    if (!ouvert) return undefined;
    panneau.current?.scrollTo(0, 0);
    const avant = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // le site derrière ne défile plus
    const touche = (e) => e.key === "Escape" && fermerRef.current();
    document.addEventListener("keydown", touche);
    const t = setTimeout(() => retour.current?.focus({ preventScroll: true }), 400);
    return () => {
      document.body.style.overflow = avant;
      document.removeEventListener("keydown", touche);
      clearTimeout(t);
    };
  }, [ouvert]);

  return (
    <div ref={panneau} className={`pd-panneau pd-${theme}${ouvert ? " ouvert" : ""}`}
      role="dialog" aria-modal="true" aria-label={titre} aria-hidden={!ouvert}>
      <header className="pd-entete">
        <button ref={retour} type="button" className="pd-retour" onClick={onFermer}>Retour</button>
        <h1>{titre}</h1>
      </header>
      <main className="pd-contenu">{children}</main>
      <Footer />
    </div>
  );
}

import { useEffect, useState } from "react";
import { api, urlFichier } from "../services/api";
import { useAuth } from "../Context/AuthContext";
import "../styles/auth.css";
import "../styles/formations.css"; // pour le style des pastilles

const CHAMPS = ["nom", "prenom", "telephone", "adresse", "date_naissance"];

export default function Profil() {
  const { majUser, logout } = useAuth();
  const [profil, setProfil] = useState(null);
  const [form, setForm] = useState({});
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState(null); // { type, texte }

  useEffect(() => {
    api("/users/me")
      .then((u) => {
        setProfil(u);
        setForm({
          nom: u.nom || "", prenom: u.prenom || "", telephone: u.telephone || "",
          adresse: u.adresse || "", date_naissance: (u.date_naissance || "").slice(0, 10),
          mot_de_passe: "",
        });
      })
      .catch((e) => setMessage({ type: "danger", texte: e.message }));
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enregistrer = async (e) => {
    e.preventDefault();
    setMessage(null);
    const fd = new FormData();
    [...CHAMPS, "mot_de_passe"].forEach((c) => form[c] && fd.append(c, form[c]));
    if (photo) fd.append("photo", photo);
    try {
      const u = await api("/users/me", { method: "PUT", body: fd });
      setProfil(u);
      majUser(u);
      setForm({ ...form, mot_de_passe: "" });
      setMessage({ type: "success", texte: "Profil mis à jour" });
    } catch (err) {
      setMessage({ type: "danger", texte: err.message });
    }
  };

  if (!profil) return <div className="auth-page">{message ? message.texte : "Chargement…"}</div>;

  return (
    <div className="auth-page">
      <form className="auth-card large" onSubmit={enregistrer}>
        <div className="text-center mb-4">
          {profil.photo ? (
            <img src={urlFichier(profil.photo)} alt="Photo de profil" className="photo-profil" />
          ) : (
            <div className="photo-profil d-inline-flex align-items-center justify-content-center fs-2">
              {profil.prenom?.[0]}{profil.nom?.[0]}
            </div>
          )}
          <h1 className="mt-3 mb-1">{profil.prenom} {profil.nom}</h1>
          <small className="text-info">
            {profil.email} · {profil.role}
            {profil.numero_etudiant && ` · ${profil.numero_etudiant}`}
          </small>
          <div className="mt-2">
            {profil.formation?.titre && <span className="pastille accent">{profil.formation.titre}</span>}
            {profil.niveau && <span className="pastille">{profil.niveau}</span>}
            {profil.specialite && <span className="pastille">{profil.specialite}</span>}
            {profil.type_contrat && <span className="pastille">{profil.type_contrat === "temps_plein" ? "Temps plein" : "Vacataire"}</span>}
          </div>
        </div>

        {message && <div className={`alert alert-${message.type}`}>{message.texte}</div>}

        <div className="row">
          {[["nom", "Nom"], ["prenom", "Prénom"], ["telephone", "Téléphone"], ["adresse", "Adresse"]].map(([n, l]) => (
            <div className="col-sm-6 mb-3" key={n}>
              <label htmlFor={n}>{l}</label>
              <input id={n} name={n} className="form-control" value={form[n]} onChange={change} />
            </div>
          ))}
          <div className="col-sm-6 mb-3">
            <label htmlFor="date_naissance">Date de naissance</label>
            <input id="date_naissance" name="date_naissance" type="date" className="form-control" value={form.date_naissance} onChange={change} />
          </div>
          <div className="col-sm-6 mb-3">
            <label htmlFor="photo">Photo de profil</label>
            <input id="photo" type="file" accept="image/*" className="form-control" onChange={(e) => setPhoto(e.target.files[0])} />
          </div>
          <div className="col-12 mb-4">
            <label htmlFor="mdp">Nouveau mot de passe (laisser vide pour ne pas changer)</label>
            <input id="mdp" name="mot_de_passe" type="password" className="form-control" value={form.mot_de_passe} onChange={change} />
          </div>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-orange flex-grow-1">Enregistrer</button>
          <button type="button" className="btn btn-outline-light" onClick={logout}>Se déconnecter</button>
        </div>
      </form>
    </div>
  );
}

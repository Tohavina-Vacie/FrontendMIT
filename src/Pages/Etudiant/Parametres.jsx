import { useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../Context/AuthContext";
import ChampMotDePasse from "../../assets/Components/ChampMotDePasse";

export default function Parametres() {
  const { user, majUser } = useAuth();
  const [form, setForm] = useState({
    nom: user.nom || "", prenom: user.prenom || "", telephone: user.telephone || "",
    adresse: user.adresse || "", date_naissance: (user.date_naissance || "").slice(0, 10),
  });
  const [photo, setPhoto] = useState(null);
  const [mdp, setMdp] = useState({ nouveau: "", confirmation: "" });
  const [msgInfos, setMsgInfos] = useState(null); // { type, texte }
  const [msgMdp, setMsgMdp] = useState(null);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const envoyer = async (fd) => {
    await api("/users/me", { method: "PUT", body: fd });
    majUser(await api("/users/me")); // recharge le profil complet (formation incluse)
  };

  const enregistrerInfos = async (e) => {
    e.preventDefault();
    setMsgInfos(null);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
    if (photo) fd.append("photo", photo);
    try {
      await envoyer(fd);
      setPhoto(null);
      setMsgInfos({ type: "success", texte: "Informations mises à jour" });
    } catch (err) {
      setMsgInfos({ type: "danger", texte: err.message });
    }
  };

  const changerMdp = async (e) => {
    e.preventDefault();
    setMsgMdp(null);
    if (mdp.nouveau !== mdp.confirmation) {
      return setMsgMdp({ type: "danger", texte: "Les mots de passe ne correspondent pas" });
    }
    const fd = new FormData();
    fd.append("mot_de_passe", mdp.nouveau);
    try {
      await envoyer(fd);
      setMdp({ nouveau: "", confirmation: "" });
      setMsgMdp({ type: "success", texte: "Mot de passe modifié" });
    } catch (err) {
      setMsgMdp({ type: "danger", texte: err.message });
    }
  };

  const champ = (n, l, type = "text", placeholder = "") => (
    <div className="col-sm-6 mb-3">
      <label htmlFor={n}>{l}</label>
      <input id={n} name={n} type={type} className="form-control" placeholder={placeholder} value={form[n]} onChange={change} />
    </div>
  );

  return (
    <>
      <h1 className="dash-titre">Paramètres</h1>
      <p className="dash-sous">Gérez vos informations personnelles et la sécurité de votre compte.</p>

      <form className="dash-carte mb-3" onSubmit={enregistrerInfos}>
        <h2>Informations personnelles</h2>
        {msgInfos && <div className={`alert alert-${msgInfos.type}`}>{msgInfos.texte}</div>}
        <div className="row">
          {champ("nom", "Nom", "text", "Votre nom")}
          {champ("prenom", "Prénom", "text", "Votre prénom")}
          <div className="col-sm-6 mb-3">
            <label htmlFor="email">Adresse e-mail</label>
            <input id="email" className="form-control" value={user.email} disabled />
          </div>
          {champ("telephone", "Téléphone", "tel", "034 00 000 00")}
          {champ("date_naissance", "Date de naissance", "date")}
          {user.role === "etudiant" && (
            <div className="col-sm-6 mb-3">
              <label htmlFor="filiere">Formation et niveau</label>
              <input id="filiere" className="form-control" disabled
                value={[user.formation?.titre, user.niveau].filter(Boolean).join(" - ") || "Non affectée"} />
            </div>
          )}
          <div className="col-sm-6 mb-3">
            <label htmlFor="adresse">Adresse</label>
            <input id="adresse" name="adresse" className="form-control" placeholder="Adresse complète" value={form.adresse} onChange={change} />
          </div>
          <div className="col-sm-6 mb-3">
            <label htmlFor="photo">Photo de profil</label>
            <input id="photo" type="file" accept="image/*" className="form-control" onChange={(e) => setPhoto(e.target.files[0])} />
          </div>
        </div>
        <button className="btn btn-orange">Enregistrer les modifications</button>
      </form>

      <form className="dash-carte" onSubmit={changerMdp}>
        <h2>Sécurité</h2>
        {msgMdp && <div className={`alert alert-${msgMdp.type}`}>{msgMdp.texte}</div>}
        <div className="row">
          <div className="col-sm-6 mb-3">
            <label htmlFor="nouveau">Nouveau mot de passe</label>
            <ChampMotDePasse id="nouveau" name="nouveau" placeholder="Créez un mot de passe" autoComplete="new-password"
              value={mdp.nouveau} onChange={(e) => setMdp({ ...mdp, nouveau: e.target.value })} />
          </div>
          <div className="col-sm-6 mb-3">
            <label htmlFor="confirmation">Confirmer le mot de passe</label>
            <ChampMotDePasse id="confirmation" name="confirmation" placeholder="Confirmez le mot de passe" autoComplete="new-password"
              value={mdp.confirmation} onChange={(e) => setMdp({ ...mdp, confirmation: e.target.value })} />
          </div>
        </div>
        <button className="btn btn-outline-light">Changer le mot de passe</button>
      </form>
    </>
  );
}

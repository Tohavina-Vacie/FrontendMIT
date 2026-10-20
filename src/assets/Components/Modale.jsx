import "../../styles/auth.css";

export function Champ({ id, label, children, className = "mb-3" }) {
  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
}

export default function Modale({ titre, onSubmit, onClose, erreur, large = false, envoi = "Enregistrer", children }) {
  return (
    <div className="overlay">
      <form className={`auth-card${large ? " large" : ""}`} onSubmit={onSubmit} style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <h1>{titre}</h1>
        {children}
        {erreur && <div className="alert alert-danger">{erreur}</div>}
        <div className="d-flex gap-2">
          <button className="btn btn-orange flex-grow-1">{envoi}</button>
          <button type="button" className="btn btn-outline-light" onClick={onClose}>Annuler</button>
        </div>
      </form>
    </div>
  );
}

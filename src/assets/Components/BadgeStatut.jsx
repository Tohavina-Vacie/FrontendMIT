export const STATUTS_INSCRIPTION = [
  ["en_attente", "En attente"],
  ["validee", "Validée"],
  ["annulee", "Annulée"],
];

const STYLES = {
  en_attente: "bg-warning text-dark",
  validee: "bg-success",
  annulee: "bg-danger",
};

export default function BadgeStatut({ statut }) {
  const label = STATUTS_INSCRIPTION.find(([v]) => v === statut)?.[1] || statut;
  return <span className={`badge ${STYLES[statut] || "bg-secondary"}`}>{label}</span>;
}

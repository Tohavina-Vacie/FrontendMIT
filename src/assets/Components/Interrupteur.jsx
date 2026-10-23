export default function Interrupteur({ id, titre, description, checked, onChange, disabled = false }) {
  return (
    <div className="dash-interrupteur">
      <div>
        <strong id={`${id}-titre`}>{titre}</strong>
        <small>{description}</small>
      </div>
      <label className="dash-switch">
        <input id={id} type="checkbox" role="switch" aria-labelledby={`${id}-titre`} checked={!!checked} disabled={disabled}
          onChange={(e) => onChange(e.target.checked)} />
        <span aria-hidden="true" />
      </label>
    </div>
  );
}

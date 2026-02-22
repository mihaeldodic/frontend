import "./checkbox.css"

function CheckBox({ accepted, onChange }) {
  return (
    <div className="form-check mb-0">
      <input
        className="checkbox-input-1 form-check-input"
        type="checkbox"
        id="privacyCheck"
        checked={accepted}
        onChange={onChange}
      />
      <label className="checkbox-1 form-check-label" htmlFor="privacyCheck">
        Prihvaćam{" "}
        <a 
          href="/zastita-privatnosti" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          zaštitu privatnosti
        </a>
      </label>
    </div>
  );
}

export default CheckBox;
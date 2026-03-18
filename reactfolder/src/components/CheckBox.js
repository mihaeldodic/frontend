import { Link } from "react-router-dom";
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
        <Link to="/zastita-podataka">
          zaštitu privatnosti
        </Link>
      </label>
    </div>
  );
}

export default CheckBox;
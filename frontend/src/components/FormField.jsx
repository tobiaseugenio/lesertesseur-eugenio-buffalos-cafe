import "../styles/FormField.css";

function FormField({ label, id, type = "text", value, onChange, ...rest }) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        className="form-field__input"
        value={value}
        onChange={onChange}
        {...rest}
      />
    </div>
  );
}

export default FormField;

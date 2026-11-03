import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { login, register } from "../services/authService";
import "../styles/Auth.css";

function Auth() {
  const [mode, setMode] = useState("login");
  const [nombre, setNombre] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setError("");
    setFieldErrors({});
  };

  const clearFieldError = (field) => {
    setFieldErrors((currentErrors) => {
      if (!currentErrors[field]) return currentErrors;
      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    if (mode === "register") {
      const validationErrors = {};
      if (!nombre.trim()) {
        validationErrors.nombre = "Ingresa tu nombre.";
      } else if (nombre.trim().length > 100) {
        validationErrors.nombre = "El nombre no puede superar los 100 caracteres.";
      }

      const normalizedMail = mail.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedMail) || normalizedMail.length > 254) {
        validationErrors.mail = "Ingresa un email válido de hasta 254 caracteres.";
      }

      if (password.length < 8 || password.length > 128) {
        validationErrors.password = "La contraseña debe tener entre 8 y 128 caracteres.";
      }

      if (Object.keys(validationErrors).length > 0) {
        setFieldErrors(validationErrors);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === "register") {
        await register({ nombre, mail, password });
      } else {
        await login({ mail, password });
      }

      window.location.href = "/";
    } catch (requestError) {
      if (mode === "register" && ["nombre", "mail", "password"].includes(requestError.field)) {
        setFieldErrors({ [requestError.field]: requestError.message });
      } else {
        setError(requestError.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header variant="dark" />
      <main className="auth-page">
        <section className="auth-panel" aria-labelledby="auth-title">
          <h1 id="auth-title">{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</h1>
          <div className="auth-panel__tabs" role="group" aria-label="Tipo de acceso">
            <button
              type="button"
              className={mode === "login" ? "is-active" : ""}
              aria-pressed={mode === "login"}
              onClick={() => handleModeChange("login")}
            >
              Ingresar
            </button>
            <button
              type="button"
              className={mode === "register" ? "is-active" : ""}
              aria-pressed={mode === "register"}
              onClick={() => handleModeChange("register")}
            >
              Registrarme
            </button>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
            noValidate={mode === "register"}
          >
            {mode === "register" && (
              <label htmlFor="auth-name">
                Nombre
                <input
                  id="auth-name"
                  type="text"
                  value={nombre}
                  onChange={(event) => {
                    setNombre(event.target.value);
                    clearFieldError("nombre");
                  }}
                  autoComplete="name"
                  maxLength="100"
                  required
                  aria-invalid={Boolean(fieldErrors.nombre)}
                  aria-describedby={fieldErrors.nombre ? "auth-name-error" : undefined}
                />
                {fieldErrors.nombre && (
                  <span className="auth-form__field-error" id="auth-name-error">
                    {fieldErrors.nombre}
                  </span>
                )}
              </label>
            )}
            <label htmlFor="auth-email">
              Email
              <input
                id="auth-email"
                type="email"
                value={mail}
                onChange={(event) => {
                  setMail(event.target.value);
                  clearFieldError("mail");
                }}
                autoComplete="email"
                required
                aria-invalid={Boolean(fieldErrors.mail)}
                aria-describedby={fieldErrors.mail ? "auth-email-error" : undefined}
              />
              {fieldErrors.mail && (
                <span className="auth-form__field-error" id="auth-email-error">
                  {fieldErrors.mail}
                </span>
              )}
            </label>
            <label htmlFor="auth-password">
              Contraseña
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  clearFieldError("password");
                }}
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                minLength="8"
                maxLength="128"
                required
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? "auth-password-error" : undefined}
              />
              {fieldErrors.password && (
                <span className="auth-form__field-error" id="auth-password-error">
                  {fieldErrors.password}
                </span>
              )}
            </label>
            {error && <p className="auth-form__error" role="alert">{error}</p>}
            <button className="auth-form__submit" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "ESPERA..."
                : mode === "login" ? "INGRESAR" : "CREAR CUENTA"}
            </button>
          </form>
        </section>
      </main>
      <Footer variant="dark" />
    </>
  );
}

export default Auth;
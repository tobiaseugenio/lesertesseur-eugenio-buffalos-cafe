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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (mode === "register") {
        await register({ nombre, mail, password });
      } else {
        await login({ mail, password });
      }

      window.location.href = "/";
    } catch (requestError) {
      setError(requestError.message);
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

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <label>
                Nombre
                <input
                  type="text"
                  value={nombre}
                  onChange={(event) => setNombre(event.target.value)}
                  autoComplete="name"
                  maxLength="100"
                  required
                />
              </label>
            )}
            <label>
              Email
              <input
                type="email"
                value={mail}
                onChange={(event) => setMail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>
            <label>
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                minLength="8"
                maxLength="128"
                required
              />
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
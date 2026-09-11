import { ArrowRight, Dumbbell, LockKeyhole } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { Brand } from "../components/Layout";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { session, login } = useAuth();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  if (session) return <Navigate to="/dashboard" replace />;
  const submit = async (event) => {
    event.preventDefault(); setError(""); setSending(true);
    try { await login(correo, password); } catch (err) { setError(err.message); } finally { setSending(false); }
  };
  return (
    <div className="login-layout">
      <aside className="login-story">
        <Brand />
        <div className="login-copy">
          <span className="eyebrow">HECHO PARA TU GIMNASIO</span>
          <h2>
            Más movimiento.
            <br />
            <span>Menos pendientes.</span>
          </h2>
          <p>
            Un solo espacio para cuidar de tus socios y acompañar cada nueva
            meta.
          </p>
          <div className="login-wordmark" aria-hidden="true">
            <Dumbbell size={60} />
            <span>GC</span>
          </div>
        </div>
        <small>GymControl · Gestión de gimnasios</small>
      </aside>
      <main className="login-main">
        <div className="login-form">
          <span className="stat-icon green">
            <LockKeyhole size={23} />
          </span>
          <p className="eyebrow">ACCESO DEL PERSONAL</p>
          <h1>Bienvenido de nuevo</h1>
          <p className="muted">Entra al espacio de tu gimnasio.</p>
          <form onSubmit={submit}>
              <label className="field">
                Correo electrónico
                <input
                  type="email"
                  autoComplete="username"
                  placeholder="tu@correo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </label>
              <label className="field">
                Contraseña
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <button type="submit" className="button primary" disabled={sending}>
                {sending ? "Ingresando…" : "Iniciar sesión"}
                <ArrowRight size={18} />
              </button>
          </form>
          {error && <p className="form-message error" role="alert">{error}</p>}
        </div>
        <p className="login-bottom">
          Acceso seguro con JWT
        </p>
      </main>
    </div>
  );
}

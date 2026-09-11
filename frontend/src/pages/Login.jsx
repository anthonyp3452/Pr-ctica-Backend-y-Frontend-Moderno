import { ArrowRight, Dumbbell, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";
import { Brand } from "../components/Layout";
import { PhaseNote } from "../components/Ui";

export default function Login() {
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
          <form onSubmit={(e) => e.preventDefault()}>
            <fieldset disabled>
              <legend className="sr-only">
                Formulario de acceso pendiente de integración
              </legend>
              <label className="field">
                Correo electrónico
                <input
                  type="email"
                  autoComplete="username"
                  placeholder="tu@correo.com"
                />
              </label>
              <label className="field">
                Contraseña
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder="Tu contraseña"
                />
              </label>
              <button type="submit" className="button primary">
                Iniciar sesión
                <ArrowRight size={18} />
              </button>
            </fieldset>
          </form>
          <PhaseNote>
            Prototipo de acceso. El login con JWT se conectará en la fase 2. No
            ingreses credenciales reales.
          </PhaseNote>
          <Link className="preview-link" to="/dashboard">
            Explorar la vista de ejemplo
            <ArrowRight size={17} />
          </Link>
        </div>
        <p className="login-bottom">
          Vista de diseño · Sin autenticación todavía
        </p>
      </main>
    </div>
  );
}

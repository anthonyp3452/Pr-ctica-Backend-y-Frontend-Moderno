import { useEffect, useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  Menu,
  Moon,
  Sun,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", text: "Resumen", icon: LayoutDashboard },
  { to: "/socios", text: "Socios", icon: Users },
  { to: "/planes", text: "Planes", icon: CreditCard },
  { to: "/asistencias", text: "Asistencias", icon: Activity },
];

export function Brand() {
  return (
    <Link
      className="brand"
      to="/dashboard"
      aria-label="GymControl, ir al resumen"
    >
      <span className="brand-symbol">
        <Dumbbell size={23} strokeWidth={2.4} />
      </span>
      <span>
        Gym<span className="brand-light">Control</span>
        <small>MENOS GESTIÓN. MÁS MOVIMIENTO.</small>
      </span>
    </Link>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("gymcontrol.theme") === "dark");
  const location = useLocation();
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", darkMode);
    localStorage.setItem("gymcontrol.theme", darkMode ? "dark" : "light");
  }, [darkMode]);
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Saltar al contenido
      </a>
      <aside className={`sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="brand-row">
          <Brand />
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar navegación" : "Abrir navegación"}
            aria-expanded={menuOpen}
            aria-controls="workspace-navigation"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        <div className="sidebar-content" id="workspace-navigation">
          <p className="nav-label">ESPACIO DE TRABAJO</p>
          <nav aria-label="Navegación principal">
            {links.map(({ to, text, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <Icon size={20} aria-hidden="true" />
                <span>{text}</span>
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="sidebar-note">
              <span className="live-dot" />
              Un buen día para entrenar.<p>Tu comunidad empieza aquí.</p>
            </div>
            <div className="workspace-profile">
              <span className="profile-avatar">GC</span>
              <div>
                <strong>{user?.nombre || "Recepción"}</strong>
                <button className="logout-link" onClick={logout}>Cerrar sesión</button>
              </div>
              <Link to="/login" aria-label="Ver pantalla de acceso">
                <ArrowUpRight size={19} />
              </Link>
            </div>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <div className="topbar">
          <span>
            Gimnasio <span className="breadcrumb-separator">/</span>{" "}
            <strong>Recepción</strong>
          </span>
          <div className="topbar-right">
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} aria-label={darkMode ? "Activar modo claro" : "Activar modo oscuro"}>
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <span className="sample-date">
              <CalendarDays size={16} aria-hidden="true" />
              10 sep 2026
            </span>
          </div>
        </div>
        <main id="main" tabIndex={-1}>
          <Outlet />
        </main>
        <footer className="workspace-footer">
          <span>GymControl</span>
          <span>Datos conectados a la API.</span>
        </footer>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import MemberDetail from "./pages/MemberDetail";
import MemberForm from "./pages/MemberForm";
import Plans from "./pages/Plans";
import Attendance from "./pages/Attendance";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    const title = pathname.startsWith("/socios")
      ? "Socios"
      : ({
          "/login": "Acceso",
          "/dashboard": "Resumen",
          "/planes": "Planes",
          "/asistencias": "Asistencias",
        }[pathname] ?? "Página no encontrada");
    document.title = `${title} · GymControl`;
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/socios" element={<Members />} />
        <Route path="/socios/nuevo" element={<MemberForm />} />
        <Route path="/socios/:id" element={<MemberDetail />} />
        <Route path="/socios/:id/editar" element={<MemberForm editing />} />
        <Route path="/planes" element={<Plans />} />
        <Route path="/asistencias" element={<Attendance />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      </Route>
    </Routes>
  );
}

function ProtectedRoute() {
  const { session, checking } = useAuth();
  if (checking) return <main className="center-state">Comprobando sesión…</main>;
  return session ? <Outlet /> : <Navigate to="/login" replace />;
}

import { useEffect, useState } from "react";
import { Activity, CalendarClock, Users } from "lucide-react";
import { PageHeading } from "../components/Ui";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { token } = useAuth(); const [data, setData] = useState(null); const [error, setError] = useState("");
  useEffect(() => { api.dashboard(token).then(setData).catch((e) => setError(e.message)); }, [token]);
  if (error) return <p className="form-message error">{error}</p>;
  if (!data) return <p className="state-message">Cargando indicadores…</p>;
  const stats = [{ label: "Socios activos", value: data.socios_activos, icon: Users, type: "green" }, { label: "Membresías vencidas", value: data.membresias_vencidas, icon: CalendarClock, type: "amber" }, { label: "Asistencias hoy", value: data.asistencias_hoy, icon: Activity, type: "blue" }];
  return <><PageHeading title="Tu gimnasio, al día" description="Indicadores calculados con datos reales."/><section className="stats-grid">{stats.map(({ label, value, icon: Icon, type }) => <article className="stat-card" key={label}><div className="stat-top"><span>{label}</span><span className={`stat-icon ${type}`}><Icon size={20}/></span></div><strong className="stat-value">{String(value).padStart(2, "0")}</strong></article>)}</section><section className="panel padded"><h2>Actividad reciente</h2>{data.actividad_reciente.length ? <ul className="entry-list">{data.actividad_reciente.map((item, index) => <li key={`${item.socio_id}-${index}`}><span>{item.socio_nombre}</span><strong>{new Date(item.ocurrido_en).toLocaleString()}</strong></li>)}</ul> : <p className="state-message">Aún no hay asistencias registradas.</p>}</section></>;
}

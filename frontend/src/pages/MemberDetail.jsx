import { useEffect, useState } from "react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { PageHeading } from "../components/Ui";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function MemberDetail() {
  const { id } = useParams(); const { token } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const [member, setMember] = useState(null); const [memberships, setMemberships] = useState([]); const [plans, setPlans] = useState([]); const [message, setMessage] = useState(location.state?.success || ""); const [error, setError] = useState("");
  const load = async () => { try { const [person, history, catalog] = await Promise.all([api.socio(id, token), api.membresias(id, token), api.planes(token)]); setMember(person); setMemberships(history); setPlans(catalog.filter((p) => p.activo)); } catch (err) { setError(err.message); } };
  useEffect(() => { load(); }, [id, token]);
  const remove = async () => { if (!window.confirm("¿Eliminar este socio y su historial?")) return; try { await api.eliminarSocio(id, token); navigate("/socios", { state: { success: "Socio eliminado." } }); } catch (err) { setError(err.message); } };
  const assign = async (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); try { await api.crearMembresia(id, { plan_id: Number(form.get("plan_id")), fecha_inicio: form.get("fecha_inicio") }, token); setMessage("Membresía asignada correctamente."); load(); } catch (err) { setError(err.message); } };
  if (error && !member) return <p className="form-message error">{error}</p>;
  if (!member) return <p className="state-message">Cargando socio…</p>;
  return <><Link className="back-link" to="/socios"><ArrowLeft size={17}/>Volver a socios</Link><PageHeading title={member.nombre} description={`${member.correo} · ${member.telefono || "Sin teléfono"}`}><Link className="button secondary" to={`/socios/${id}/editar`}><Pencil size={17}/>Editar</Link><button className="button danger" onClick={remove}><Trash2 size={17}/>Eliminar</button></PageHeading>
    {message && <p className="form-message success" role="status">{message}</p>}{error && <p className="form-message error" role="alert">{error}</p>}
    <div className="detail-grid"><section className="panel padded"><h2>Membresías</h2>{memberships.length ? <ul className="entry-list">{memberships.map((m) => <li key={m.id}><span><strong>{m.plan_nombre}</strong><br/>{m.fecha_inicio} al {m.fecha_fin}</span><strong>{m.estado}</strong></li>)}</ul> : <p className="state-message">Este socio no tiene membresías.</p>}</section>
      <section className="panel padded"><h2>Asignar membresía</h2><form onSubmit={assign} className="simple-form"><label className="field">Plan<select name="plan_id" required><option value="">Selecciona un plan</option>{plans.map((p) => <option value={p.id} key={p.id}>{p.nombre} · Q {(p.precio_centavos / 100).toFixed(2)}</option>)}</select></label><label className="field">Fecha de inicio<input name="fecha_inicio" type="date" required defaultValue={new Date().toISOString().slice(0, 10)}/></label><button className="button primary">Asignar plan</button></form></section></div>
  </>;
}

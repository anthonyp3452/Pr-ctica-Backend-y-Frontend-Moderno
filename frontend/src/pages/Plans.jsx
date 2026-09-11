import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeading } from "../components/Ui";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Plans() {
  const { token } = useAuth(); const [plans, setPlans] = useState([]); const [showForm, setShowForm] = useState(false); const [error, setError] = useState(""); const [message, setMessage] = useState("");
  const load = () => api.planes(token).then(setPlans).catch((e) => setError(e.message));
  useEffect(load, [token]);
  const submit = async (event) => { event.preventDefault(); const f = new FormData(event.currentTarget); try { await api.crearPlan({ nombre: f.get("nombre"), precio_centavos: Math.round(Number(f.get("precio")) * 100), duracion_dias: Number(f.get("dias")) }, token); setShowForm(false); setMessage("Plan creado correctamente."); load(); } catch (e) { setError(e.message); } };
  const toggle = async (plan) => { try { await api.editarPlan(plan.id, { activo: !plan.activo }, token); setMessage(`Plan ${plan.activo ? "desactivado" : "activado"}.`); load(); } catch (e) { setError(e.message); } };
  return <><PageHeading title="Planes de membresía" description="Crea y activa los planes disponibles."><button className="button primary" onClick={() => setShowForm(!showForm)}><Plus size={18}/>Nuevo plan</button></PageHeading>{message && <p className="form-message success">{message}</p>}{error && <p className="form-message error">{error}</p>}
    {showForm && <section className="panel padded"><form className="form-grid" onSubmit={submit}><label className="field">Nombre *<input name="nombre" required minLength="2"/></label><label className="field">Precio (Q) *<input name="precio" type="number" min="0" step="0.01" required/></label><label className="field">Duración en días *<input name="dias" type="number" min="1" required/></label><button className="button primary">Guardar plan</button></form></section>}
    <div className="plans-grid">{plans.map((plan) => <section className="panel plan-card" key={plan.id}><h2>{plan.nombre}</h2><div className="plan-price"><span>Q</span> {(plan.precio_centavos / 100).toFixed(2)}<small>/ {plan.duracion_dias} días</small></div><p>{plan.activo ? "Disponible para nuevas membresías." : "No disponible para nuevas membresías."}</p><button className="button secondary" onClick={() => toggle(plan)}>{plan.activo ? "Desactivar" : "Activar"}</button></section>)}</div>
  </>;
}

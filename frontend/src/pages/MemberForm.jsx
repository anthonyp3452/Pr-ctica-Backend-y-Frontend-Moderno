import { useEffect, useState } from "react";
import { ArrowLeft, UserRound } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeading } from "../components/Ui";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function MemberForm({ editing = false }) {
  const { id } = useParams(); const navigate = useNavigate(); const { token } = useAuth();
  const [data, setData] = useState({ nombre: "", correo: "", telefono: "" });
  const [fields, setFields] = useState({}); const [message, setMessage] = useState(""); const [saving, setSaving] = useState(editing);
  useEffect(() => { if (editing) api.socio(id, token).then(setData).catch((e) => setMessage(e.message)).finally(() => setSaving(false)); }, [editing, id, token]);
  const submit = async (event) => { event.preventDefault(); setSaving(true); setMessage(""); setFields({}); try { const member = editing ? await api.editarSocio(id, data, token) : await api.crearSocio(data, token); navigate(`/socios/${member.id}`, { state: { success: editing ? "Socio actualizado correctamente." : "Socio creado correctamente." } }); } catch (err) { setMessage(err.message); setFields(err.fields); } finally { setSaving(false); } };
  const back = editing ? `/socios/${id}` : "/socios";
  return <><Link className="back-link" to={back}><ArrowLeft size={17}/>Volver</Link><PageHeading title={editing ? "Editar socio" : "Nuevo socio"} description="Los campos con * son obligatorios."/>
    <section className="panel padded form-layout"><div className="form-heading"><span className="stat-icon green"><UserRound size={22}/></span><div><h2>Información personal</h2><p className="muted">Los datos se guardan en la base de datos.</p></div></div>
      <form onSubmit={submit} noValidate><div className="form-grid"><Field label="Nombre completo *" error={fields.nombre}><input value={data.nombre} minLength="2" maxLength="120" required onChange={(e) => setData({...data, nombre:e.target.value})}/></Field><Field label="Correo electrónico *" error={fields.correo}><input type="email" value={data.correo} required onChange={(e) => setData({...data, correo:e.target.value})}/></Field><Field label="Teléfono" error={fields.telefono}><input value={data.telefono || ""} maxLength="30" onChange={(e) => setData({...data, telefono:e.target.value})}/></Field></div>{message && <p className="form-message error" role="alert">{message}</p>}<div className="form-actions"><Link className="button secondary" to={back}>Cancelar</Link><button className="button primary" disabled={saving}>{saving ? "Guardando…" : editing ? "Guardar cambios" : "Registrar socio"}</button></div></form>
    </section></>;
}
function Field({ label, error, children }) { return <label className="field">{label}{children}{error && <small className="field-error">{error}</small>}</label>; }

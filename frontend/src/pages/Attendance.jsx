import { useEffect, useState } from "react";
import { PageHeading } from "../components/Ui";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Attendance() {
  const { token } = useAuth(); const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); const [entries, setEntries] = useState([]); const [members, setMembers] = useState([]); const [error, setError] = useState(""); const [message, setMessage] = useState("");
  const load = async () => { try { setEntries(await api.asistencias(token, date)); setMembers(await api.socios(token)); } catch (e) { setError(e.message); } };
  useEffect(() => { load(); }, [token, date]);
  const register = async (event) => { event.preventDefault(); const socioId = Number(new FormData(event.currentTarget).get("socio_id")); try { await api.registrarAsistencia(socioId, token); setMessage("Entrada registrada correctamente."); load(); } catch (e) { setError(e.message); } };
  return <><PageHeading title="Asistencias" description="Registra las entradas de socios con membresía vigente."/>{message && <p className="form-message success">{message}</p>}{error && <p className="form-message error">{error}</p>}<section className="panel padded"><form className="form-grid" onSubmit={register}><label className="field">Socio<select name="socio_id" required><option value="">Selecciona un socio</option>{members.map((m) => <option value={m.id} key={m.id}>{m.nombre}</option>)}</select></label><button className="button primary">Registrar entrada</button></form></section><section className="panel"><div className="list-toolbar"><label className="date-filter">Fecha<input type="date" value={date} onChange={(e) => setDate(e.target.value)}/></label></div>{entries.length ? <div className="table-scroll"><table><thead><tr><th>Socio</th><th>Fecha</th><th>Hora</th></tr></thead><tbody>{entries.map((entry) => <tr key={entry.id}><td>{entry.socio_nombre}</td><td>{entry.dia_local}</td><td>{new Date(entry.registrado_en).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td></tr>)}</tbody></table></div> : <p className="state-message">No hay asistencias para esta fecha.</p>}</section></>;
}

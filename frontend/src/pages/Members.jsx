import { useEffect, useState } from "react";
import { ArrowUpRight, Plus, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeading, SearchInput } from "../components/Ui";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Members() {
  const { token } = useAuth();
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true); setError("");
      try { setMembers(await api.socios(token, search)); } catch (err) { setError(err.message); } finally { setLoading(false); }
    }, 250);
    return () => clearTimeout(timer);
  }, [token, search]);
  return <>
    <PageHeading title="Socios" description="Gestiona las personas que forman parte de tu gimnasio."><Link className="button primary" to="/socios/nuevo"><Plus size={18}/>Nuevo socio</Link></PageHeading>
    <section className="panel"><div className="list-toolbar"><SearchInput value={search} onChange={(e) => setSearch(e.target.value)}/><span className="filter-select"><SlidersHorizontal size={17}/>Búsqueda real</span></div>
      {loading ? <p className="state-message">Cargando socios…</p> : error ? <p className="form-message error" role="alert">{error}</p> : members.length ? <div className="table-scroll"><table><thead><tr><th>Socio</th><th>Correo</th><th>Teléfono</th><th>Alta</th><th><span className="sr-only">Acciones</span></th></tr></thead><tbody>{members.map((member) => <tr key={member.id}><td><strong>{member.nombre}</strong></td><td>{member.correo}</td><td>{member.telefono || "—"}</td><td>{member.fecha_alta}</td><td><Link className="icon-link" to={`/socios/${member.id}`} aria-label={`Ver ${member.nombre}`}><ArrowUpRight size={20}/></Link></td></tr>)}</tbody></table></div> : <p className="state-message">No hay socios para mostrar.</p>}
    </section>
  </>;
}

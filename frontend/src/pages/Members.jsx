import { useState } from "react";
import { ArrowUpRight, Plus, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { members } from "../data/demo";
import {
  Badge,
  EmptyState,
  MemberIdentity,
  PageHeading,
  SearchInput,
} from "../components/Ui";

const normalize = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export default function Members() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Todos");
  const filtered = members.filter(
    (m) =>
      normalize(`${m.name} ${m.email}`).includes(normalize(search.trim())) &&
      (status === "Todos" || m.status === status),
  );
  return (
    <>
      <PageHeading
        title="Socios"
        description="Personas que forman parte de tu comunidad."
      >
        <Link className="button primary" to="/socios/nuevo">
          <Plus size={18} />
          Nuevo socio
        </Link>
      </PageHeading>
      <section className="panel">
        <div className="list-toolbar">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label className="filter-select">
            <SlidersHorizontal size={17} aria-hidden="true" />
            <span className="sr-only">Filtrar por estado</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Todos">Todos los estados</option>
              <option>Activo</option>
              <option>Vencido</option>
              <option>Sin membresía</option>
            </select>
          </label>
        </div>
        {filtered.length ? (
          <div
            className="table-scroll"
            role="region"
            aria-label="Listado de socios de ejemplo"
            tabIndex={0}
          >
            <table>
              <thead>
                <tr>
                  <th>Socio</th>
                  <th>Membresía</th>
                  <th>Vencimiento</th>
                  <th>Estado</th>
                  <th>
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <MemberIdentity member={member} />
                    </td>
                    <td>{member.plan}</td>
                    <td>{member.end}</td>
                    <td>
                      <Badge status={member.status} />
                    </td>
                    <td>
                      <Link
                        className="icon-link"
                        to={`/socios/${member.id}`}
                        aria-label={`Ver detalle de ${member.name}`}
                      >
                        <ArrowUpRight size={20} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No encontramos coincidencias"
            description="Prueba otro nombre o cambia el filtro de estado."
          />
        )}
        <div className="list-footer" role="status">
          {filtered.length} de {members.length} socios de ejemplo
        </div>
      </section>
    </>
  );
}

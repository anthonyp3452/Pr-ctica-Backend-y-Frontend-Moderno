import { useState } from "react";
import { Plus } from "lucide-react";
import { attendance, members } from "../data/demo";
import {
  EmptyState,
  MemberIdentity,
  PageHeading,
  PhaseNote,
  SearchInput,
} from "../components/Ui";

export default function Attendance() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("2026-09-10");
  const filtered = attendance.filter((entry) => {
    const member = members.find((m) => m.id === entry.memberId);
    const text = `${member.name} ${member.email}`
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    const query = search
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
    return (!date || entry.date === date) && text.includes(query);
  });
  return (
    <>
      <PageHeading
        title="Asistencias"
        description="Cada entrenamiento empieza con una entrada."
      >
        <button className="button primary" disabled>
          <Plus size={18} />
          Registrar entrada
        </button>
      </PageHeading>
      <section className="panel">
        <div className="list-toolbar">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label className="date-filter">
            Fecha
            <input
              aria-label="Filtrar por fecha de asistencia"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        </div>
        {filtered.length ? (
          <div
            className="table-scroll"
            role="region"
            aria-label="Asistencias de ejemplo"
            tabIndex={0}
          >
            <table>
              <thead>
                <tr>
                  <th>Socio</th>
                  <th>Plan</th>
                  <th>Fecha</th>
                  <th>Entrada</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => {
                  const member = members.find((m) => m.id === entry.memberId);
                  return (
                    <tr key={entry.id}>
                      <td>
                        <MemberIdentity member={member} />
                      </td>
                      <td>{member.plan}</td>
                      <td>{entry.date}</td>
                      <td className="tabular">{entry.time}</td>
                      <td>
                        <span className="entry-status">
                          <span />
                          Registrada
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="Sin entradas para esta búsqueda"
            description="Prueba otra fecha o consulta otro socio."
          />
        )}
        <div className="list-footer" role="status">
          {filtered.length} asistencias de ejemplo
        </div>
      </section>
      <PhaseNote>
        El registro real y la comprobación de membresía vigente se integrarán en
        la fase 5.
      </PhaseNote>
    </>
  );
}

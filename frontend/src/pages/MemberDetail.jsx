import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Mail,
  Pencil,
  Phone,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { members, attendance } from "../data/demo";
import { Avatar, Badge, PageHeading, PhaseNote } from "../components/Ui";
import NotFound from "./NotFound";

export default function MemberDetail() {
  const { id } = useParams();
  const member = members.find((m) => m.id === id);
  if (!member) return <NotFound entity />;
  const entries = attendance.filter((entry) => entry.memberId === id);
  return (
    <>
      <Link className="back-link" to="/socios">
        <ArrowLeft size={17} />
        Volver a socios
      </Link>
      <PageHeading
        eyebrow={`SOCIO GC-${id.padStart(3, "0")}`}
        title={member.name}
        description="Su información, su membresía y su actividad."
      >
        <Link className="button secondary" to={`/socios/${id}/editar`}>
          <Pencil size={17} />
          Editar socio
        </Link>
      </PageHeading>
      <div className="detail-grid">
        <section className="panel profile-panel">
          <Avatar member={member} large />
          <h2>{member.name}</h2>
          <Badge status={member.status} />
          <dl className="contact-list">
            <div>
              <dt>
                <Mail size={17} />
                Correo electrónico
              </dt>
              <dd>{member.email}</dd>
            </div>
            <div>
              <dt>
                <Phone size={17} />
                Teléfono
              </dt>
              <dd>{member.phone}</dd>
            </div>
            <div>
              <dt>
                <CalendarDays size={17} />
                Fecha de alta
              </dt>
              <dd>01 ago 2026 · ejemplo</dd>
            </div>
          </dl>
        </section>
        <div className="detail-right">
          <section className="panel padded">
            <div className="panel-title">
              <h2>Membresía actual</h2>
              <CreditCard size={23} />
            </div>
            <p className="membership-name">{member.plan}</p>
            <dl className="two-column-info">
              <div>
                <dt>Inicio</dt>
                <dd>{member.start}</dd>
              </div>
              <div>
                <dt>Vencimiento</dt>
                <dd>{member.end}</dd>
              </div>
            </dl>
            <PhaseNote>
              La asignación de membresías se conectará en la fase 4.
            </PhaseNote>
          </section>
          <section className="panel padded">
            <h2>Últimas asistencias</h2>
            {entries.length ? (
              <ul className="entry-list">
                {entries.map((entry) => (
                  <li key={entry.id}>
                    <span>
                      <CalendarDays size={17} />
                      {entry.date}
                    </span>
                    <strong>{entry.time}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">
                No hay asistencias de ejemplo para este socio.
              </p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

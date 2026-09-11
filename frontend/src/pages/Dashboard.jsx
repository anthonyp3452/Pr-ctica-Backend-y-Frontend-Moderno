import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Plus,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { attendance, members } from "../data/demo";
import { MemberIdentity, PageHeading, TextLink } from "../components/Ui";

export default function Dashboard() {
  const today = attendance.filter((entry) => entry.date === "2026-09-10");
  const stats = [
    {
      label: "Socios activos",
      value: members.filter((m) => m.status === "Activo").length,
      text: "Con membresía vigente",
      icon: Users,
      type: "green",
    },
    {
      label: "Membresías vencidas",
      value: members.filter((m) => m.status === "Vencido").length,
      text: "Para retomar el ritmo",
      icon: CalendarClock,
      type: "amber",
    },
    {
      label: "Asistencias hoy",
      value: today.length,
      text: "Cada entrada cuenta",
      icon: Activity,
      type: "blue",
    },
  ];
  const week = [
    { day: "Vie", count: 3 },
    { day: "Sáb", count: 2 },
    { day: "Dom", count: 1 },
    { day: "Lun", count: 4 },
    { day: "Mar", count: 3 },
    { day: "Mié", count: 2 },
    { day: "Jue", count: 4 },
  ];
  return (
    <>
      <PageHeading
        title="Tu gimnasio, al día"
        description="Una mirada a tu comunidad y al movimiento de hoy."
      >
        <Link className="button primary" to="/socios/nuevo">
          <Plus size={18} />
          Nuevo socio
        </Link>
      </PageHeading>
      <section className="stats-grid" aria-label="Indicadores de ejemplo">
        {stats.map(({ label, value, text, icon: Icon, type }) => (
          <article key={label} className="stat-card">
            <div className="stat-top">
              <span>{label}</span>
              <span className={`stat-icon ${type}`}>
                <Icon size={20} />
              </span>
            </div>
            <strong className="stat-value">
              {String(value).padStart(2, "0")}
            </strong>
            <p>
              <span className={`stat-dot ${type}`} />
              {text}
            </p>
          </article>
        ))}
      </section>
      <div className="dashboard-middle">
        <section className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h2>Movimiento de la semana</h2>
              <p>Asistencias del 4 al 10 de septiembre</p>
            </div>
            <span className="small-label">EJEMPLO</span>
          </div>
          <div className="chart-layout">
            <div className="chart-axis" aria-hidden="true">
              <span>4</span>
              <span>3</span>
              <span>2</span>
              <span>1</span>
              <span>0</span>
            </div>
            <ul
              className="bar-chart"
              aria-label="Asistencias de ejemplo por día"
            >
              {week.map(({ day, count }, index) => (
                <li key={day}>
                  <div className="bar-track">
                    <div
                      className={`bar ${index === 6 ? "selected" : ""}`}
                      style={{ height: `${count * 25}%` }}
                    >
                      <span>{count}</span>
                    </div>
                  </div>
                  <span className={index === 6 ? "current-day" : ""}>
                    {day}
                  </span>
                  <span className="sr-only">: {count} asistencias</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="chart-caption">
            <span className="live-dot" />
            Un entrenamiento a la vez.
          </div>
        </section>
        <section className="quick-card">
          <span className="eyebrow">SIGUIENTE PASO</span>
          <h2>
            Más tiempo para
            <br />
            tu comunidad.
          </h2>
          <p>Los accesos que necesitas para acompañar cada entrenamiento.</p>
          <Link className="quick-link" to="/asistencias">
            <span>
              <Activity size={19} />
              Ver asistencias
            </span>
            <ArrowUpRight size={20} />
          </Link>
          <Link className="quick-link" to="/socios/nuevo">
            <span>
              <Plus size={19} />
              Registrar un socio
            </span>
            <ArrowUpRight size={20} />
          </Link>
          <Link className="quick-footer" to="/planes">
            Explorar planes
            <ArrowRight size={17} />
          </Link>
        </section>
      </div>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Últimas entradas</h2>
            <p>Personas que ya se pusieron en movimiento.</p>
          </div>
          <TextLink to="/asistencias">Ver todas</TextLink>
        </div>
        <div
          className="table-scroll"
          role="region"
          aria-label="Últimas entradas"
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                <th>Socio</th>
                <th>Plan</th>
                <th>Hora de entrada</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {today.map((entry) => {
                const member = members.find((m) => m.id === entry.memberId);
                return (
                  <tr key={entry.id}>
                    <td>
                      <MemberIdentity member={member} />
                    </td>
                    <td>{member.plan}</td>
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
      </section>
    </>
  );
}

import { ArrowLeft, UserRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { members } from "../data/demo";
import { PageHeading, PhaseNote } from "../components/Ui";
import NotFound from "./NotFound";

export default function MemberForm({ editing = false }) {
  const { id } = useParams();
  const member = editing ? members.find((m) => m.id === id) : null;
  if (editing && !member) return <NotFound entity />;
  const back = editing ? `/socios/${id}` : "/socios";
  return (
    <>
      <Link className="back-link" to={back}>
        <ArrowLeft size={17} />
        {editing ? "Volver al detalle" : "Volver a socios"}
      </Link>
      <PageHeading
        title={editing ? "Editar socio" : "Nuevo socio"}
        description={
          editing
            ? `Actualiza los datos de ${member.name}.`
            : "El primer paso para formar parte del equipo."
        }
      />
      <div className="form-layout">
        <section className="panel padded">
          <div className="form-heading">
            <span className="stat-icon green">
              <UserRound size={22} />
            </span>
            <div>
              <h2>Información personal</h2>
              <p className="muted">
                Los campos marcados con * son obligatorios.
              </p>
            </div>
          </div>
          <form key={editing ? id : "new"} onSubmit={(e) => e.preventDefault()}>
            <div className="form-grid">
              <label className="field full">
                Nombre completo *
                <input
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={100}
                  placeholder="Nombre y apellido"
                  defaultValue={member?.name ?? ""}
                />
              </label>
              <label className="field">
                Correo electrónico *
                <input
                  name="email"
                  autoComplete="email"
                  type="email"
                  required
                  placeholder="nombre@example.com"
                  defaultValue={member?.email ?? ""}
                />
              </label>
              <label className="field">
                Teléfono *
                <input
                  name="phone"
                  autoComplete="tel"
                  type="tel"
                  required
                  placeholder="5555 0101"
                  defaultValue={member?.phone ?? ""}
                />
              </label>
            </div>
            <PhaseNote>
              Vista previa del formulario. Guardar y eliminar estarán
              disponibles al integrar el CRUD del backend en la fase 3.
            </PhaseNote>
            <div className="form-actions">
              <Link className="button secondary" to={back}>
                Cancelar
              </Link>
              <button className="button primary" type="submit" disabled>
                {editing ? "Guardar cambios" : "Registrar socio"}
              </button>
            </div>
          </form>
        </section>
        <aside className="form-aside">
          <span className="eyebrow">PASO A PASO</span>
          <h2>Una nueva meta empieza aquí.</h2>
          <ol>
            <li>
              <span>01</span>
              <div>
                <strong>Datos del socio</strong>
                <p>Información de contacto para acompañar su progreso.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Una membresía a su medida</strong>
                <p>Después podrás asignar un plan desde su perfil.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>A entrenar</strong>
                <p>Registra su primera entrada desde Asistencias.</p>
              </div>
            </li>
          </ol>
        </aside>
      </div>
    </>
  );
}

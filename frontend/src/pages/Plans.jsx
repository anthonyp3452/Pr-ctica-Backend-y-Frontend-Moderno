import { Check, CreditCard, Plus } from "lucide-react";
import { plans } from "../data/demo";
import { PageHeading, PhaseNote } from "../components/Ui";

export default function Plans() {
  return (
    <>
      <PageHeading
        title="Planes de membresía"
        description="Una opción para cada forma de entrenar."
      >
        <button className="button primary" disabled>
          <Plus size={18} />
          Nuevo plan
        </button>
      </PageHeading>
      <div className="plans-grid">
        {plans.map((plan, index) => (
          <section
            className={`panel plan-card ${index === 1 ? "featured-plan" : ""}`}
            key={plan.id}
          >
            <div className="plan-top">
              <span className="stat-icon green">
                <CreditCard size={21} />
              </span>
              <span className="badge positive">
                <span />
                Activo
              </span>
            </div>
            <h2>{plan.name}</h2>
            <p>{plan.description}</p>
            <div className="plan-price">
              <span>Q</span> {plan.price}
              <small>/ {plan.days} días</small>
            </div>
            <ul className="plan-features">
              <li>
                <Check size={17} />
                Acceso al gimnasio
              </li>
              <li>
                <Check size={17} />
                Registro de asistencias
              </li>
              <li>
                <Check size={17} />
                {plan.members} socios vigentes de ejemplo
              </li>
            </ul>
            <button className="button secondary" disabled>
              Editar plan
            </button>
          </section>
        ))}
      </div>
      <PhaseNote>
        Catálogo de ejemplo. Crear, editar y desactivar planes se habilitará con
        el backend en la fase 4. Moneda de muestra: quetzales; confirmar con el
        equipo.
      </PhaseNote>
    </>
  );
}

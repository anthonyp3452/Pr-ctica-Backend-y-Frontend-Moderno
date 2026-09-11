import { ArrowLeft, MapPinOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound({ entity = false }) {
  return (
    <section className="not-found">
      <MapPinOff size={42} />
      <p className="eyebrow">404 · NO ENCONTRADO</p>
      <h1>
        {entity ? "Este socio no está en la lista" : "Nos salimos de la ruta"}
      </h1>
      <p>
        {entity
          ? "El identificador no corresponde a un socio de ejemplo."
          : "La página que buscas no existe o la dirección cambió."}
      </p>
      <Link className="button primary" to={entity ? "/socios" : "/dashboard"}>
        <ArrowLeft size={17} />
        {entity ? "Volver a socios" : "Volver al resumen"}
      </Link>
    </section>
  );
}

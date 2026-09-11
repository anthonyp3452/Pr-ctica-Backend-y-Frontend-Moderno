import { ArrowUpRight, Info, Search } from "lucide-react";
import { Link } from "react-router-dom";

export function PageHeading({
  eyebrow = "TU ESPACIO DE TRABAJO",
  title,
  description,
  children,
}) {
  return (
    <header className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="muted">{description}</p>
      </div>
      {children && <div className="heading-actions">{children}</div>}
    </header>
  );
}

export function Badge({ status }) {
  const type =
    status === "Activo"
      ? "positive"
      : status === "Vencido"
        ? "warning"
        : "neutral";
  return (
    <span className={`badge ${type}`}>
      <span aria-hidden="true" />
      {status}
    </span>
  );
}

export function Avatar({ member, large = false }) {
  return (
    <span
      aria-hidden="true"
      className={`avatar ${member.color} ${large ? "large" : ""}`}
    >
      {member.initials}
    </span>
  );
}

export function MemberIdentity({ member, linked = true }) {
  return (
    <div className="member-identity">
      <Avatar member={member} />
      <div>
        {linked ? (
          <Link className="member-name" to={`/socios/${member.id}`}>
            {member.name}
          </Link>
        ) : (
          <span className="member-name">{member.name}</span>
        )}
        <small>{member.email}</small>
      </div>
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar por nombre o correo",
  label = "Buscar socios",
}) {
  return (
    <label className="search">
      <Search size={18} aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </label>
  );
}

export function PhaseNote({ children }) {
  return (
    <div className="phase-note">
      <Info size={18} aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="empty-state">
      <Search size={28} aria-hidden="true" />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export function TextLink({ to, children }) {
  return (
    <Link className="text-link" to={to}>
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
    </Link>
  );
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export class ApiError extends Error {
  constructor(message, { status, code, fields } = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields || {};
  }
}

export async function request(path, { token, ...options } = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(body.error?.message || "No se pudo completar la operación.", {
      status: response.status,
      code: body.error?.code,
      fields: body.error?.fields,
    });
  }
  return body.data;
}

export const api = {
  login: (correo, password) => request("/auth/login", { method: "POST", body: JSON.stringify({ correo, password }) }),
  me: (token) => request("/auth/me", { token }),
  dashboard: (token) => request("/dashboard", { token }),
  socios: (token, q = "") => request(`/socios${q ? `?q=${encodeURIComponent(q)}` : ""}`, { token }),
  socio: (id, token) => request(`/socios/${id}`, { token }),
  crearSocio: (data, token) => request("/socios", { method: "POST", body: JSON.stringify(data), token }),
  editarSocio: (id, data, token) => request(`/socios/${id}`, { method: "PATCH", body: JSON.stringify(data), token }),
  eliminarSocio: (id, token) => request(`/socios/${id}`, { method: "DELETE", token }),
  planes: (token) => request("/planes", { token }),
  crearPlan: (data, token) => request("/planes", { method: "POST", body: JSON.stringify(data), token }),
  editarPlan: (id, data, token) => request(`/planes/${id}`, { method: "PATCH", body: JSON.stringify(data), token }),
  asistencias: (token, date) => request(`/asistencias${date ? `?desde=${date}&hasta=${date}` : ""}`, { token }),
  registrarAsistencia: (socio_id, token) => request("/asistencias", { method: "POST", body: JSON.stringify({ socio_id }), token }),
  membresias: (socioId, token) => request(`/socios/${socioId}/membresias`, { token }),
  crearMembresia: (socioId, data, token) => request(`/socios/${socioId}/membresias`, { method: "POST", body: JSON.stringify(data), token }),
};

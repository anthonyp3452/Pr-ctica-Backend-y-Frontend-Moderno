import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);
const storageKey = "gymcontrol.session";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem(storageKey) || "null"));
  const [checking, setChecking] = useState(Boolean(session?.token));

  useEffect(() => {
    if (!session?.token) return;
    api.me(session.token).then((user) => {
      const next = { ...session, user };
      setSession(next);
      localStorage.setItem(storageKey, JSON.stringify(next));
    }).catch(() => {
      setSession(null);
      localStorage.removeItem(storageKey);
    }).finally(() => setChecking(false));
  }, []);

  const login = async (correo, password) => {
    const data = await api.login(correo, password);
    const next = { token: data.token, user: data.usuario };
    setSession(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };
  const logout = () => { setSession(null); localStorage.removeItem(storageKey); };
  return <AuthContext.Provider value={{ session, token: session?.token, user: session?.user, checking, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

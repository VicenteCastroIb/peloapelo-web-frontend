"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { ApiError } from "@/lib/api/client";
import * as authApi from "@/lib/api/auth";
import type { AuthUser } from "@/lib/api/auth";

type Status = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  status: Status;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Seguridad: el token JWT ya NO se persiste en localStorage (era legible por
// cualquier script de la pagina, incluida una dependencia comprometida --
// vulnerable a robo via XSS). El mecanismo real ahora es una cookie httpOnly
// que setea el backend (ver JwtCookieService), inaccesible desde JS. `token`
// se mantiene aca solo en memoria durante la sesion (se pierde al recargar,
// a proposito) como respaldo para mandar el header Authorization; la fuente
// de verdad de "estoy autenticado" es siempre fetchMe(), que depende de la
// cookie, no de este estado.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    authApi
      .fetchMe()
      .then((me) => {
        setUser(me);
        setStatus("authenticated");
      })
      .catch(() => {
        setStatus("unauthenticated");
      });
  }, []);

  const applyAuthResponse = useCallback((res: authApi.AuthResponse) => {
    setToken(res.token);
    setUser(res.user);
    setStatus("authenticated");
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login(email, password);
      applyAuthResponse(res);
    },
    [applyAuthResponse]
  );

  const register = useCallback(
    async (email: string, password: string, fullName: string) => {
      const res = await authApi.register(email, password, fullName);
      applyAuthResponse(res);
    },
    [applyAuthResponse]
  );

  const logout = useCallback(() => {
    // Limpia la cookie del lado del servidor -- el cliente no puede tocarla
    // directamente. Se limpia el estado local igual aunque la request falle
    // (ej. sin red), para no dejar al usuario "atascado" como autenticado.
    authApi.logout().catch(() => {});
    setToken(null);
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(
    () => ({ user, token, status, login, register, logout }),
    [user, token, status, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}

export { ApiError };

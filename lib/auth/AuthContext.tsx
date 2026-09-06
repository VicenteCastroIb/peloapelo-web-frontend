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
  /** Adopta el token+resumen de un AuthResponse sin volver a pasar por
   * login/register -- lo usan "Guardar cambios" de /profile (el email pudo
   * cambiar), cambiar contraseña y "Cerrar todas las sesiones": todos
   * emiten un JWT nuevo que la sesion actual debe empezar a usar de
   * inmediato (ver lib/api/users.ts y lib/api/auth.ts). */
  applySession: (res: authApi.AuthResponse) => void;
  /** Vuelve a pedir el perfil completo (fetchMe) para refrescar campos que
   * el AuthResponse no trae (phone/bio/notify*, ver UserResponse del
   * backend) -- se llama despues de applySession cuando ademas cambiaron
   * esos campos (guardar perfil, actualizar recordatorios). */
  refreshUser: () => Promise<void>;
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

  // res.user es solo un resumen (id/email/fullName/role, ver AuthUserSummary
  // en lib/api/auth.ts) -- login/register necesitan el perfil COMPLETO
  // (phone/bio/notify*/createdAt) para que el resto de la app (ej. el badge
  // "Miembro desde" en /profile) tenga esos datos desde el primer render,
  // asi que se pide aparte con fetchMe() en vez de setUser(res.user) directo.
  const applyAuthResponse = useCallback(async (res: authApi.AuthResponse) => {
    setToken(res.token);
    const me = await authApi.fetchMe(res.token);
    setUser(me);
    setStatus("authenticated");
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login(email, password);
      await applyAuthResponse(res);
    },
    [applyAuthResponse]
  );

  const register = useCallback(
    async (email: string, password: string, fullName: string) => {
      const res = await authApi.register(email, password, fullName);
      await applyAuthResponse(res);
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

  const applySession = useCallback((res: authApi.AuthResponse) => {
    setToken(res.token);
    setUser((prev) => (prev ? { ...prev, ...res.user } : null));
  }, []);

  const refreshUser = useCallback(async () => {
    const me = await authApi.fetchMe();
    setUser(me);
  }, []);

  const value = useMemo(
    () => ({ user, token, status, login, register, logout, applySession, refreshUser }),
    [user, token, status, login, register, logout, applySession, refreshUser]
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

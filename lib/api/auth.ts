import { apiFetch } from "./client";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  expiresInSeconds: number;
  user: AuthUser;
}

export function register(email: string, password: string, fullName: string) {
  return apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: { email, password, fullName },
  });
}

export function login(email: string, password: string) {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

/**
 * token es opcional a proposito: al recargar la pagina ya no hay nada
 * guardado en localStorage (ver AuthContext.tsx), asi que esto se llama sin
 * token y depende enteramente de la cookie httpOnly que manda el navegador.
 */
export function fetchMe(token?: string | null) {
  return apiFetch<AuthUser>("/api/users/me", { token });
}

export function logout() {
  return apiFetch<void>("/api/auth/logout", { method: "POST" });
}

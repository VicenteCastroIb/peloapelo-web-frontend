import { apiFetch } from "./client";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  bio: string | null;
  notifyMoodDaily: boolean;
  notifyWeeklySummary: boolean;
  notifyNewsletter: boolean;
  role: "USER" | "ADMIN";
  createdAt: string;
}

/** Resumen minimo que trae cada AuthResponse (login/register/cambios de
 * sesion) -- a diferencia de AuthUser (lo que devuelve /api/users/me), NO
 * incluye phone/bio/notify*: el backend lo arma aparte (UserSummary, ver
 * AuthResponse.java) porque esos endpoints no necesitan recargar el perfil
 * completo. AuthContext.applySession lo mergea sobre el AuthUser ya
 * cargado. */
export interface AuthUserSummary {
  id: string;
  email: string;
  fullName: string;
  role: "USER" | "ADMIN";
}

export interface AuthResponse {
  token: string;
  expiresInSeconds: number;
  user: AuthUserSummary;
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

/** "Cambiar" contraseña en Seguridad de /profile -- cambia el hash y sube
 * token_version (ver UserService.changePassword en el backend), asi que
 * devuelve un AuthResponse con un JWT fresco para que la sesion actual no
 * se corte con su propio cambio. */
export function changePassword(token: string | null, currentPassword: string, newPassword: string) {
  return apiFetch<AuthResponse>("/api/auth/password", {
    method: "PATCH",
    body: { currentPassword, newPassword },
    token,
  });
}

/** "Cerrar todas las sesiones" en Seguridad de /profile -- invalida
 * cualquier JWT emitido antes de este momento (otros dispositivos, tokens
 * robados) y devuelve uno nuevo para que ESTE dispositivo siga adentro. */
export function revokeOtherSessions(token: string | null) {
  return apiFetch<AuthResponse>("/api/auth/sessions/revoke-others", { method: "POST", token });
}

/** Paso 1 de "Olvidaste tu contraseña" -- el backend siempre responde 200
 * exista o no el correo (ver PasswordResetService), asi que la UI debe
 * mostrar el mismo mensaje generico en ambos casos. */
export function forgotPassword(email: string) {
  return apiFetch<void>("/api/auth/forgot-password", { method: "POST", body: { email } });
}

/** Paso 2: consume el token del link recibido por correo. */
export function resetPassword(token: string, newPassword: string) {
  return apiFetch<void>("/api/auth/reset-password", { method: "POST", body: { token, newPassword } });
}

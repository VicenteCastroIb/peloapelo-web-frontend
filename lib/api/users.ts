import { apiFetch } from "./client";
import type { AuthResponse, AuthUser } from "./auth";

export interface UpdateProfilePayload {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
}

/** "Guardar cambios" del formulario "Datos de la cuenta" en /profile -- el
 * email puede cambiar, asi que el backend devuelve un AuthResponse con un
 * JWT fresco (ver UserService.updateProfile en el backend): la sesion
 * actual debe adoptar ese token nuevo, no solo los datos. */
export function updateProfile(token: string | null, payload: UpdateProfilePayload) {
  return apiFetch<AuthResponse>("/api/users/me", { method: "PATCH", body: payload, token });
}

export interface NotificationPrefs {
  notifyMoodDaily: boolean;
  notifyWeeklySummary: boolean;
  notifyNewsletter: boolean;
}

export function updateNotifications(token: string | null, prefs: NotificationPrefs) {
  return apiFetch<AuthUser>("/api/users/me/notifications", { method: "PATCH", body: prefs, token });
}

export function deleteAccount(token: string | null) {
  return apiFetch<void>("/api/users/me", { method: "DELETE", token });
}

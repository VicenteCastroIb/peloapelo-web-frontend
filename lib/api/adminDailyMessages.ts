import { apiFetch } from "./client";

// Cliente del CRUD de "Mensajes del día" para /admin/mensajes (protegido
// ROLE_ADMIN en el backend, ver AdminDailyMessageController). Mismo patron
// que lib/api/adminBlog.ts.

export interface AdminDailyMessage {
  id: string;
  phrase: string;
  body: string;
  active: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface DailyMessageRequest {
  phrase: string;
  body: string;
  active: boolean;
  displayOrder: number;
}

export function listAdminDailyMessages(token?: string | null) {
  return apiFetch<AdminDailyMessage[]>("/api/admin/daily-messages", { token });
}

export function createDailyMessage(token: string | null | undefined, body: DailyMessageRequest) {
  return apiFetch<AdminDailyMessage>("/api/admin/daily-messages", { method: "POST", body, token });
}

export function updateDailyMessage(token: string | null | undefined, id: string, body: DailyMessageRequest) {
  return apiFetch<AdminDailyMessage>(`/api/admin/daily-messages/${id}`, { method: "PUT", body, token });
}

export function deleteDailyMessage(token: string | null | undefined, id: string) {
  return apiFetch<void>(`/api/admin/daily-messages/${id}`, { method: "DELETE", token });
}

/** Reordena la lista (flechas arriba/abajo en /admin/mensajes, ver AdminDailyMessageController.reorder). */
export function reorderDailyMessages(token: string | null | undefined, messageIds: string[]) {
  return apiFetch<void>("/api/admin/daily-messages/reorder", { method: "PUT", body: { messageIds }, token });
}

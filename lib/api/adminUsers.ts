import { apiFetch } from "./client";
import { API_URL } from "./config";
import type { AlopeciaTypeCode } from "@/lib/data/alopeciaTypes";
import type { ProgressEntry, ProgressSummary } from "./progress";
import type { QuizResultResponse } from "./quiz";

// Cliente del panel de seguimiento de usuarias (/admin/usuarias, protegido
// ROLE_ADMIN en el backend, ver AdminUsersController). Mismo manejo de
// token/errores que lib/api/adminDailyMessages.ts.

export interface AdminSubscriptionSummary {
  status: string;
  planName: string;
  currentPeriodEnd: string | null;
}

export interface AdminUserListItem {
  id: string;
  fullName: string | null;
  email: string;
  createdAt: string;
  role: string;
  subscription: AdminSubscriptionSummary | null;
  /** Tipo de alopecia del quiz, o null si no lo completó / no fue concluyente. */
  quizPrimaryType: AlopeciaTypeCode | null;
  /** Fecha (YYYY-MM-DD) del último registro de ánimo, o null si nunca usó /progress. */
  lastMoodEntryDate: string | null;
}

export interface AdminUserDetail {
  id: string;
  fullName: string | null;
  email: string;
  phone: string | null;
  bio: string | null;
  role: string;
  createdAt: string;
  subscription: AdminSubscriptionSummary | null;
}

export interface AdminProgressPhoto {
  id: string;
  date: string;
  imageUrl: string;
}

export function listAdminUsers(token?: string | null) {
  return apiFetch<AdminUserListItem[]>("/api/admin/users", { token });
}

export function getAdminUser(token: string | null | undefined, id: string) {
  return apiFetch<AdminUserDetail>(`/api/admin/users/${id}`, { token });
}

export function getAdminUserProgressSummary(token: string | null | undefined, id: string) {
  return apiFetch<ProgressSummary>(`/api/admin/users/${id}/progress/summary`, { token });
}

export function getAdminUserProgressEntries(
  token: string | null | undefined,
  id: string,
  days = 14,
) {
  return apiFetch<ProgressEntry[]>(`/api/admin/users/${id}/progress/entries?days=${days}`, { token });
}

export function getAdminUserProgressPhotos(token: string | null | undefined, id: string) {
  return apiFetch<AdminProgressPhoto[]>(`/api/admin/users/${id}/progress/photos`, { token });
}

/** `undefined` cuando la usuaria nunca completó el quiz (el backend responde 204). */
export function getAdminUserQuizResult(token: string | null | undefined, id: string) {
  return apiFetch<QuizResultResponse | undefined>(`/api/admin/users/${id}/quiz-result`, { token });
}

/** URL absoluta de los bytes de una foto de seguimiento -- el backend valida
 *  que la foto pertenezca a esa usuaria antes de servirla (bucket privado). */
export function adminPhotoImageUrl(photo: AdminProgressPhoto) {
  return `${API_URL}${photo.imageUrl}`;
}

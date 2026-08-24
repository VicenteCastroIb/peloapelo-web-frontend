import { apiFetch, ApiError } from "./client";
import { API_URL } from "./config";

export interface ProgressEntry {
  id: string;
  date: string; // ISO yyyy-MM-dd
  mood: number;
  note: string | null;
}

export interface ProgressPhoto {
  id: string;
  date: string; // ISO yyyy-MM-dd
  imageUrl: string; // path relativo, ver photoImageUrl()
}

export interface ProgressSummary {
  streakDays: number;
  photosThisMonth: number;
  monthsWithUs: number;
}

export function getSummary(token?: string | null) {
  return apiFetch<ProgressSummary>("/api/progress/summary", { token });
}

/** undefined cuando todavia no hay registro hoy (el backend responde 204, ver apiFetch). */
export function getTodayEntry(token?: string | null) {
  return apiFetch<ProgressEntry | undefined>("/api/progress/entries/today", { token });
}

export function listEntries(token: string | null | undefined, days = 14) {
  return apiFetch<ProgressEntry[]>(`/api/progress/entries?days=${days}`, { token });
}

export function saveEntry(token: string | null | undefined, date: string, mood: number, note: string) {
  return apiFetch<ProgressEntry>("/api/progress/entries", {
    method: "POST",
    body: { date, mood, note: note.trim() === "" ? null : note },
    token,
  });
}

export function listPhotos(token?: string | null) {
  return apiFetch<ProgressPhoto[]>("/api/progress/photos", { token });
}

export function uploadPhoto(token: string | null | undefined, file: File, date: string) {
  const form = new FormData();
  form.append("file", file);
  form.append("date", date);
  return apiFetch<ProgressPhoto>("/api/progress/photos", { method: "POST", body: form, token });
}

/** URL absoluta de los bytes de la foto -- el backend valida dueno via la cookie httpOnly antes de servirla (bucket privado, ver ProgressPhotoStorageService). */
export function photoImageUrl(photo: ProgressPhoto) {
  return `${API_URL}${photo.imageUrl}`;
}

/**
 * A diferencia del resto (apiFetch + JSON), el reporte es un blob binario:
 * se pide con fetch crudo y se arma un link de descarga temporal en el
 * componente que llama a esto (ver /progress). credentials: "include" es lo
 * que manda la cookie httpOnly -- igual que apiFetch.
 */
export async function downloadReport(token?: string | null): Promise<Blob> {
  const response = await fetch(`${API_URL}/api/progress/report`, {
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    throw new ApiError(response.status, "No se pudo generar el reporte");
  }
  return response.blob();
}

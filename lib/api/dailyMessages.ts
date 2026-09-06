import { apiFetch } from "./client";

export interface DailyMessage {
  id: string | null;
  phrase: string;
  body: string;
}

/** "Mensaje del día" de /dashboard -- publico, rota una vez por dia (ver DailyMessageService en el backend). */
export function fetchTodayMessage() {
  return apiFetch<DailyMessage>("/api/daily-messages/today");
}

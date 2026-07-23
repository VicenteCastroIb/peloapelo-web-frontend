import { apiFetch } from "./client";

export interface Subscription {
  id: string;
  planCode: string;
  planName: string;
  status: "TRIAL" | "PENDING_PAYMENT" | "ACTIVE" | "CANCELED" | "EXPIRED";
  startedAt: string;
  currentPeriodEnd: string | null;
}

export function listMySubscriptions(token: string) {
  return apiFetch<Subscription[]>("/api/subscriptions/me", { token });
}

export function cancelSubscription(token: string, id: string) {
  return apiFetch<Subscription>(`/api/subscriptions/${id}/cancel`, {
    method: "POST",
    token,
  });
}

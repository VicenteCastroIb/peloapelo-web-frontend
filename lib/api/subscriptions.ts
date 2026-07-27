import { apiFetch } from "./client";

export type SubscriptionStatus = "TRIAL" | "PENDING_PAYMENT" | "ACTIVE" | "CANCELED" | "EXPIRED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface Subscription {
  id: string;
  planCode: string;
  planName: string;
  planPriceClp: number;
  planBillingPeriod: string;
  status: SubscriptionStatus;
  startedAt: string;
  currentPeriodEnd: string | null;
  paymentMethodBrand: string | null;
  paymentMethodLast4: string | null;
  checkoutUrl: string | null;
}

export interface Payment {
  id: string;
  amountClp: number;
  status: PaymentStatus;
  dueDate: string;
  paidAt: string | null;
}

// token es opcional en las 4 funciones: la cookie httpOnly (ver
// AuthContext.tsx) ya autentica la request sola. Se sigue aceptando por si
// hay un token en memoria (recien logueado en esta misma sesion), pero
// nunca es obligatorio -- en particular, tras recargar la pagina no hay
// token en memoria y estas llamadas deben seguir funcionando igual.

export function subscribeToPlan(token: string | null | undefined, planCode: string) {
  return apiFetch<Subscription>("/api/subscriptions/subscribe", {
    method: "POST",
    body: { planCode },
    token,
  });
}

export function listMySubscriptions(token?: string | null) {
  return apiFetch<Subscription[]>("/api/subscriptions/me", { token });
}

export function cancelSubscription(token: string | null | undefined, id: string) {
  return apiFetch<Subscription>(`/api/subscriptions/${id}/cancel`, {
    method: "POST",
    token,
  });
}

export function listPayments(token: string | null | undefined, subscriptionId: string) {
  return apiFetch<Payment[]>(`/api/subscriptions/${subscriptionId}/payments`, { token });
}

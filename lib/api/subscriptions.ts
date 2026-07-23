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
}

export interface Payment {
  id: string;
  amountClp: number;
  status: PaymentStatus;
  dueDate: string;
  paidAt: string | null;
}

export function subscribeToPlan(token: string, planCode: string) {
  return apiFetch<Subscription>("/api/subscriptions/subscribe", {
    method: "POST",
    body: { planCode },
    token,
  });
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

export function listPayments(token: string, subscriptionId: string) {
  return apiFetch<Payment[]>(`/api/subscriptions/${subscriptionId}/payments`, { token });
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, Calendar, Shield, AlertCircle, Receipt } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  listMySubscriptions,
  cancelSubscription,
  listPayments,
  type Subscription,
  type Payment,
} from "@/lib/api/subscriptions";
import { formatClp, formatDate } from "@/lib/format";

const STATUS_LABEL: Record<Subscription["status"], string> = {
  TRIAL: "Trial",
  PENDING_PAYMENT: "Pendiente de pago",
  ACTIVE: "Activa",
  CANCELED: "Cancelada",
  EXPIRED: "Expirada",
};

const STATUS_STYLE: Record<Subscription["status"], string> = {
  TRIAL: "bg-accent/10 text-accent",
  PENDING_PAYMENT: "bg-amber-100 text-amber-700",
  ACTIVE: "bg-accent/10 text-accent",
  CANCELED: "bg-navy/10 text-navy/50",
  EXPIRED: "bg-coral-soft text-coral",
};

const PAYMENT_STATUS_LABEL: Record<Payment["status"], string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  FAILED: "Fallido",
  REFUNDED: "Reembolsado",
};

const PAYMENT_STATUS_STYLE: Record<Payment["status"], string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-accent/10 text-accent",
  FAILED: "bg-coral-soft text-coral",
  REFUNDED: "bg-navy/10 text-navy/50",
};

export default function SubscriptionPage() {
  // La cookie httpOnly autentica las requests; `status` (no `token`, que
  // tras recargar la pagina queda null en memoria, ver AuthContext.tsx) es
  // lo que indica si ya se puede pedir datos del usuario.
  const { token, status } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(null);
  const [payments, setPayments] = useState<Payment[] | null>(null);
  const [canceling, setCanceling] = useState(false);

  const current = subscriptions?.[0] ?? null;

  useEffect(() => {
    if (status !== "authenticated") return;
    listMySubscriptions(token)
      .then(setSubscriptions)
      .catch(() => setSubscriptions([]));
  }, [status, token]);

  useEffect(() => {
    if (status !== "authenticated" || !current) return;
    listPayments(token, current.id)
      .then(setPayments)
      .catch(() => setPayments([]));
  }, [status, token, current]);

  async function handleCancel() {
    if (status !== "authenticated" || !current) return;
    setCanceling(true);
    try {
      const updated = await cancelSubscription(token, current.id);
      setSubscriptions((prev) => (prev ? prev.map((s) => (s.id === updated.id ? updated : s)) : prev));
    } finally {
      setCanceling(false);
    }
  }

  const canCancel = current && (current.status === "TRIAL" || current.status === "ACTIVE");
  const pendingPayments = payments?.filter((p) => p.status === "PENDING" || p.status === "FAILED") ?? [];

  return (
    <div className="max-w-3xl">
      <h1 className="text-h3-lg text-navy">Mi Suscripción</h1>
      <p className="mt-1 text-p-body text-navy/60">Gestiona tu plan, método de pago y pagos.</p>

      {subscriptions === null && <p className="mt-6 text-p-small text-navy/50">Cargando…</p>}

      {subscriptions?.length === 0 && (
        <div className="mt-6 rounded-card-md bg-white p-8 text-center shadow-sm">
          <p className="text-p-body text-navy/70">Todavía no tienes una suscripción.</p>
          <Link href="/pricing" className="mt-3 inline-block text-a-inline font-semibold text-accent">
            Ver planes →
          </Link>
        </div>
      )}

      {current && (
        <>
          {/* Plan actual */}
          <div className="mt-6 rounded-card-md bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="flex items-center gap-2 text-h4-label text-navy/50">
                  <Shield size={14} /> Plan actual
                </p>
                <h2 className="mt-2 text-h3-md text-navy">{current.planName}</h2>
              </div>
              <span className={`rounded-pill px-3 py-1 text-p-caption font-semibold ${STATUS_STYLE[current.status]}`}>
                {STATUS_LABEL[current.status]}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-navy/10 pt-4 text-p-small sm:grid-cols-3">
              <div>
                <p className="text-navy/50">Precio</p>
                <p className="mt-0.5 font-semibold">{formatClp(current.planPriceClp)}</p>
              </div>
              <div>
                <p className="text-navy/50">Inicio</p>
                <p className="mt-0.5 font-semibold">{formatDate(current.startedAt)}</p>
              </div>
              {current.currentPeriodEnd && (
                <div>
                  <p className="text-navy/50">
                    {current.status === "TRIAL" ? "Termina el" : "Próximo pago"}
                  </p>
                  <p className="mt-0.5 font-semibold">{formatDate(current.currentPeriodEnd)}</p>
                </div>
              )}
            </div>

            {canCancel && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={canceling}
                className="mt-5 rounded-pill border border-coral/30 px-4 py-2 text-a-inline font-semibold text-coral hover:bg-coral-soft disabled:opacity-50"
              >
                {canceling ? "Cancelando…" : "Cancelar suscripción"}
              </button>
            )}

            <Link href="/pricing" className="mt-5 ml-3 inline-block text-a-inline font-semibold text-accent">
              Cambiar de plan
            </Link>
          </div>

          {/* Metodo de pago */}
          <div className="mt-4 rounded-card-md bg-white p-6 shadow-sm">
            <p className="flex items-center gap-2 text-h4-label text-navy/50">
              <CreditCard size={14} /> Método de pago
            </p>
            {current.paymentMethodBrand && current.paymentMethodLast4 ? (
              <p className="mt-2 text-p-small text-navy">
                {current.paymentMethodBrand} terminada en {current.paymentMethodLast4}
              </p>
            ) : (
              <p className="mt-2 text-p-small text-navy/60">
                Sin método de pago registrado. Se guarda automáticamente cuando
                Mercado Pago confirma tu primer cobro.
              </p>
            )}
          </div>

          {/* Pagos pendientes */}
          {pendingPayments.length > 0 && (
            <div className="mt-4 rounded-card-md border border-amber-200 bg-amber-50 p-6">
              <p className="flex items-center gap-2 text-h4-label text-amber-700">
                <AlertCircle size={14} /> Pagos pendientes
              </p>
              <ul className="mt-3 space-y-2">
                {pendingPayments.map((p) => (
                  <li key={p.id} className="flex items-center justify-between text-p-small">
                    <span>Vence el {formatDate(p.dueDate)}</span>
                    <span className="font-semibold">{formatClp(p.amountClp)}</span>
                  </li>
                ))}
              </ul>
              {current.checkoutUrl ? (
                <a
                  href={current.checkoutUrl}
                  className="mt-3 inline-block rounded-pill bg-amber-600 px-4 py-2 text-a-inline font-semibold text-white hover:opacity-90"
                >
                  Completar pago →
                </a>
              ) : (
                <p className="mt-3 text-p-caption text-amber-700/80">
                  Todavía no se generó un link de pago para este cobro. Intenta de
                  nuevo más tarde o contáctanos.
                </p>
              )}
            </div>
          )}

          {/* Historial de pagos */}
          <div className="mt-4 rounded-card-md bg-white p-6 shadow-sm">
            <p className="flex items-center gap-2 text-h4-label text-navy/50">
              <Receipt size={14} /> Historial de pagos
            </p>

            {payments === null && <p className="mt-3 text-p-small text-navy/50">Cargando…</p>}

            {payments?.length === 0 && (
              <p className="mt-3 text-p-small text-navy/60">Todavía no hay pagos registrados.</p>
            )}

            {payments && payments.length > 0 && (
              <ul className="mt-3 divide-y divide-navy/5">
                {payments.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-3 text-p-small">
                    <div className="flex items-center gap-3">
                      <Calendar size={14} className="text-navy/40" />
                      <span>{formatDate(p.dueDate)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{formatClp(p.amountClp)}</span>
                      <span
                        className={`rounded-pill px-2.5 py-1 text-p-caption font-semibold ${PAYMENT_STATUS_STYLE[p.status]}`}
                      >
                        {PAYMENT_STATUS_LABEL[p.status]}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

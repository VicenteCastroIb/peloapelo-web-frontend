"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { Heart, AlertCircle } from "lucide-react";
import { useAuth, ApiError } from "@/lib/auth/AuthContext";
import {
  listMySubscriptions,
  cancelSubscription,
  listPayments,
  subscribeToPlan,
  type Subscription,
  type Payment,
} from "@/lib/api/subscriptions";
import { plans as PLAN_DATA } from "@/lib/data/plans";
import { formatClp, formatDate } from "@/lib/format";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import RadialProgress from "@/components/shared/RadialProgress";
import Skeleton from "@/components/shared/Skeleton";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import PlanOption from "@/components/subscription/PlanOption";

const STATUS_LABEL: Record<Subscription["status"], string> = {
  TRIAL: "Trial",
  PENDING_PAYMENT: "Pendiente de pago",
  ACTIVE: "Activa",
  CANCELED: "Cancelada",
  EXPIRED: "Expirada",
};

// Sin grises neutros ni amarillo/ambar en la paleta de marca (ver docs/
// design del rediseno): "danger" (coral) es la unica tonalidad reservada
// para estados que necesitan atencion -- pago pendiente y vencimiento
// entran ahi en vez de un amarillo de advertencia generico.
const STATUS_TONE: Record<Subscription["status"], "accent" | "danger" | "neutral"> = {
  TRIAL: "accent",
  ACTIVE: "accent",
  PENDING_PAYMENT: "danger",
  CANCELED: "neutral",
  EXPIRED: "danger",
};

const PAYMENT_STATUS_LABEL: Record<Payment["status"], string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  FAILED: "Fallido",
  REFUNDED: "Reembolsado",
};

const SELECTABLE_PLANS = PLAN_DATA.filter((p) => p.id === "trimestral" || p.id === "mensual");

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

function billingCadence(period: string): string {
  return period === "trimestral" ? "cada 3 meses" : "cada mes";
}

function statusCopy(sub: Subscription, daysRemaining: number | null): { title: string; description: ReactNode } {
  switch (sub.status) {
    case "TRIAL":
      return {
        title: "Estás en tu prueba gratuita",
        description: sub.paymentMethodBrand ? (
          <>Te quedan {daysRemaining ?? 0} días de acceso completo. Después se cobrará tu plan automáticamente.</>
        ) : (
          <>
            Te quedan {daysRemaining ?? 0} días de acceso completo. No hay ninguna tarjeta registrada, así que{" "}
            <strong className="font-bold">no se te va a cobrar nada</strong> cuando termine: simplemente vuelves al
            acceso básico.
          </>
        ),
      };
    case "ACTIVE":
      return {
        title: `Tu plan ${sub.planName} está activo`,
        description:
          daysRemaining !== null ? <>Tu próximo cobro es en {daysRemaining} días.</> : <>Tu acceso está activo.</>,
      };
    case "PENDING_PAYMENT":
      return {
        title: "Tu pago está pendiente",
        description: <>Completa tu pago para no perder el acceso a tu plan.</>,
      };
    case "CANCELED":
      return {
        title: "Tu suscripción está cancelada",
        description:
          daysRemaining !== null && daysRemaining > 0 && sub.currentPeriodEnd ? (
            <>Mantienes el acceso hasta el {formatDate(sub.currentPeriodEnd)}. Después vuelves al acceso básico.</>
          ) : (
            <>Volviste al acceso básico. Puedes elegir un plan cuando quieras.</>
          ),
      };
    case "EXPIRED":
      return {
        title: "Tu acceso venció",
        description: <>Elige un plan para volver a tener acceso completo.</>,
      };
  }
}

export default function SubscriptionPage() {
  // La cookie httpOnly autentica las requests; `status` (no `token`, que
  // tras recargar la pagina queda null en memoria, ver AuthContext.tsx) es
  // lo que indica si ya se puede pedir datos del usuario.
  const { token, status } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(null);
  const [payments, setPayments] = useState<Payment[] | null>(null);
  const [canceling, setCanceling] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [elegido, setElegido] = useState<"trimestral" | "mensual">("trimestral");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);

  const current = subscriptions?.[0] ?? null;
  // Una suscripcion CANCELED/EXPIRED sigue siendo la ultima fila devuelta por
  // /subscriptions/me (historial), pero ya no es "tu plan" en ningun sentido
  // util aca -- sin este chequeo, un plan que ya cancelaste se seguia
  // marcando como "Tu plan" (badge + check) en "Elige tu camino" y desviaba
  // la preseleccion de plan, contradiciendo el banner de arriba que sí dice
  // "cancelada".
  const hasEntitlement =
    !!current && (current.status === "ACTIVE" || current.status === "TRIAL" || current.status === "PENDING_PAYMENT");
  // No hay nada que pedir a /payments sin una suscripcion (evita dejar
  // `payments` en null para siempre, sin necesitar un setState sincrono
  // dentro del efecto de abajo).
  const paymentsToShow = current ? payments : [];

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

  // Preselecciona el plan que la persona NO tiene todavia (para "seguir" en
  // vez de re-elegir lo mismo), una sola vez apenas llega la suscripcion
  // actual. Ajuste de estado durante el render, guardado por choiceSeeded
  // (ver https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)
  // en vez de useEffect: sin el guard, cada refetch (ej. tras cancelar)
  // pisaria la eleccion manual que ya hizo el usuario.
  const [choiceSeeded, setChoiceSeeded] = useState(false);
  if (subscriptions !== null && !choiceSeeded) {
    setChoiceSeeded(true);
    if (hasEntitlement && current?.planCode === "trimestral") setElegido("mensual");
    else if (hasEntitlement && current?.planCode === "mensual") setElegido("trimestral");
  }

  async function handleCancel() {
    if (status !== "authenticated" || !current) return;
    setCanceling(true);
    try {
      const updated = await cancelSubscription(token, current.id);
      setSubscriptions((prev) => (prev ? prev.map((s) => (s.id === updated.id ? updated : s)) : prev));
      setConfirmingCancel(false);
    } finally {
      setCanceling(false);
    }
  }

  async function handleSubscribe() {
    if (status !== "authenticated") return;
    setSubscribeError(null);
    setSubscribing(true);
    try {
      await subscribeToPlan(token, elegido);
      const fresh = await listMySubscriptions(token);
      setSubscriptions(fresh);
    } catch (err) {
      setSubscribeError(err instanceof ApiError ? err.message : "No pudimos conectar con el servidor.");
    } finally {
      setSubscribing(false);
    }
  }

  const canCancel = current && (current.status === "TRIAL" || current.status === "ACTIVE");
  const pendingPayments = paymentsToShow?.filter((p) => p.status === "PENDING" || p.status === "FAILED") ?? [];

  const daysRemaining = current?.currentPeriodEnd
    ? Math.max(0, daysBetween(new Date(), new Date(current.currentPeriodEnd)))
    : null;
  const totalDays = current?.currentPeriodEnd
    ? Math.max(1, daysBetween(new Date(current.startedAt), new Date(current.currentPeriodEnd)))
    : null;
  const percent = daysRemaining !== null && totalDays ? Math.min(100, Math.max(0, (daysRemaining / totalDays) * 100)) : 0;

  if (subscriptions === null) {
    return (
      <div className="mx-auto grid w-full max-w-[860px] gap-8 xl:max-w-[960px]">
        <Skeleton className="h-[34px] w-[220px] rounded-pill" />
        <Skeleton className="h-[200px] w-full rounded-card-lg" />
        <div className="grid gap-5 md:grid-cols-2">
          <Skeleton className="h-[250px] w-full rounded-card-lg" />
          <Skeleton className="h-[250px] w-full rounded-card-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-[860px] gap-8 xl:max-w-[960px]">
      <header>
        <p className="text-h4-label text-navy/50">Tu plan</p>
        <h1 className="mt-1.5 text-h3-lg text-navy">Mi Suscripción</h1>
        <p className="mt-2 max-w-[560px] text-p-body text-navy/60 text-pretty">
          Acá ves en qué estás y qué sigue. Puedes cambiar o parar cuando quieras.
        </p>
      </header>

      {current && (
        <section className="rounded-card-lg border border-accent/25 bg-[linear-gradient(160deg,#ffffff,rgba(143,124,182,0.16))] p-7 shadow-sm">
          <div className="flex flex-wrap items-center gap-[22px]">
            {daysRemaining !== null ? (
              <RadialProgress value={percent} size={78} strokeWidth={7}>
                <div className="text-center leading-none">
                  <p className="text-2xl font-black tabular-nums text-navy">{daysRemaining}</p>
                  <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-navy/50">Días</p>
                </div>
              </RadialProgress>
            ) : (
              <span className="flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-pill bg-accent/10">
                <Image src="/images/icons/metodo-pago-icono.png" alt="" width={56} height={44} className="h-11 w-auto" />
              </span>
            )}
            <div className="min-w-[240px] flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-h3-md text-navy">{statusCopy(current, daysRemaining).title}</h2>
                <Badge tone={STATUS_TONE[current.status]}>{STATUS_LABEL[current.status]}</Badge>
              </div>
              <p className="mt-1.5 max-w-[480px] text-p-small leading-relaxed text-navy/70 text-pretty">
                {statusCopy(current, daysRemaining).description}
              </p>
            </div>
            {current.status === "ACTIVE" && (
              <div className="border-l border-navy/10 pl-[22px] text-right max-sm:hidden">
                <p className="text-data-md text-navy">{formatClp(current.planPriceClp)}</p>
                <p className="mt-0.5 text-p-caption text-navy/50">{billingCadence(current.planBillingPeriod)}</p>
                {current.currentPeriodEnd && (
                  <p className="mt-2 text-p-caption text-navy/50">
                    Próximo cobro
                    <br />
                    <span className="font-semibold text-navy/70">{formatDate(current.currentPeriodEnd)}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {pendingPayments.length > 0 && (
        <section className="rounded-card-lg border border-coral/25 bg-coral-soft p-7 shadow-sm">
          <p className="flex items-center gap-2 text-h4-label text-coral">
            <AlertCircle size={14} /> Pagos pendientes
          </p>
          <ul className="mt-3 space-y-2">
            {pendingPayments.map((p) => (
              <li key={p.id} className="flex items-center justify-between text-p-small text-navy">
                <span>Vence el {formatDate(p.dueDate)}</span>
                <span className="font-semibold tabular-nums">{formatClp(p.amountClp)}</span>
              </li>
            ))}
          </ul>
          {current?.checkoutUrl ? (
            <Button href={current.checkoutUrl} variant="solid" className="mt-4 bg-coral text-white">
              Completar pago →
            </Button>
          ) : (
            <p className="mt-3 text-p-caption text-coral/80">
              Todavía no se generó un link de pago para este cobro. Intenta de nuevo más tarde o contáctanos.
            </p>
          )}
        </section>
      )}

      <section>
        <div className="mb-[18px] flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-h4-label text-navy/50">Si quieres seguir</p>
            <h2 className="mt-1.5 text-h3-md text-navy">Elige tu camino</h2>
          </div>
          <p className="text-p-caption text-navy/50">Cambias o paras cuando quieras</p>
        </div>

        <div role="radiogroup" aria-label="Elegir plan" className="grid items-start gap-5 md:grid-cols-2">
          {SELECTABLE_PLANS.map((p) => (
            <PlanOption
              key={p.id}
              name={p.name}
              price={p.price}
              currency={p.currency}
              period={p.period}
              costPerDay={p.costPerDay}
              features={p.features}
              note={p.id === "trimestral" ? "Garantía de 14 días: si no es para ti, te devolvemos todo." : "Se renueva solo hasta que decidas parar."}
              recommended={p.highlighted}
              current={hasEntitlement && current?.planCode === p.id}
              selected={elegido === p.id}
              onSelect={() => setElegido(p.id as "trimestral" | "mensual")}
            />
          ))}
        </div>

        <div className="mt-[18px] flex flex-wrap items-center justify-between gap-4">
          <p className="flex max-w-[460px] items-start gap-2 text-p-caption leading-relaxed text-navy/60">
            <Heart size={14} className="mt-px shrink-0 text-accent" />
            Somos una fundación sin fines de lucro: lo que pagas permite que otra persona reciba apoyo sin costo.
          </p>
          <div className="flex flex-col items-end gap-2">
            {subscribeError && <p className="text-p-caption text-coral">{subscribeError}</p>}
            <Button variant="gradient" disabled={subscribing} onClick={handleSubscribe}>
              {subscribing
                ? "Un momento…"
                : `${current ? "Cambiar a" : "Continuar con"} ${elegido === "trimestral" ? "3 Meses" : "Mensual"}`}
            </Button>
          </div>
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-[18px] rounded-card-lg border border-navy/10 bg-white p-7 shadow-sm">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-icon bg-navy/5">
          <Image src="/images/icons/metodo-pago-icono.png" alt="" width={40} height={32} className="h-8 w-auto" />
        </span>
        <div className="min-w-[200px] flex-1">
          <p className="text-h3-sm text-navy">Método de pago</p>
          {current?.paymentMethodBrand && current.paymentMethodLast4 ? (
            <p className="mt-1 text-p-small text-navy">
              {current.paymentMethodBrand} terminada en {current.paymentMethodLast4}
            </p>
          ) : (
            <p className="mt-1 text-p-small text-navy/60">
              Todavía no registraste ninguno. Te lo vamos a pedir recién cuando elijas un plan.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-card-lg border border-navy/10 bg-white p-7 shadow-sm">
        <p className="text-h4-label text-navy/50">Historial</p>
        <h2 className="mt-1.5 text-h3-md text-navy">Tus pagos</h2>

        {paymentsToShow === null ? (
          <p className="mt-4 text-p-small text-navy/50">Cargando…</p>
        ) : paymentsToShow.length === 0 ? (
          <p className="mt-4 text-p-small text-navy/60">Todavía no hay pagos: estás en tu prueba gratuita.</p>
        ) : (
          <ul className="mt-4 list-none">
            {paymentsToShow.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 border-t border-navy/10 py-3.5">
                <div className="min-w-0">
                  <p className="text-p-small font-semibold text-navy">{current?.planName ?? "Pago"}</p>
                  <p className="mt-0.5 text-p-caption text-navy/50">{formatDate(p.paidAt ?? p.dueDate)}</p>
                </div>
                <div className="flex items-center gap-3.5">
                  <Badge tone="neutral">{PAYMENT_STATUS_LABEL[p.status]}</Badge>
                  <span className="text-p-small font-bold tabular-nums text-navy">{formatClp(p.amountClp)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {canCancel && (
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-card-md border border-navy/10 px-[22px] py-[18px]">
          <div>
            <p className="text-p-small font-semibold text-navy">¿Necesitas parar?</p>
            <p className="mt-1 max-w-[460px] text-p-caption leading-relaxed text-navy/60">
              Puedes cancelar sin dar explicaciones. Tus registros y tus fotos quedan guardados por si vuelves.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConfirmingCancel(true)}
            className="min-h-11 rounded-pill px-4 text-a-inline font-semibold text-navy/60 hover:bg-navy/5"
          >
            Cancelar suscripción
          </button>
        </section>
      )}

      <ConfirmDialog
        open={confirmingCancel}
        title="¿Cancelar tu suscripción?"
        description="Mantienes el acceso hasta el final del período que ya pagaste. Después vuelves al acceso básico, y tus registros siguen ahí."
        confirmLabel="Sí, cancelar"
        cancelLabel="Mejor no"
        loading={canceling}
        onConfirm={handleCancel}
        onCancel={() => setConfirmingCancel(false)}
      />
    </div>
  );
}

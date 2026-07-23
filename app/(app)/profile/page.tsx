"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Shield, Calendar, Sparkles, Heart } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { listMySubscriptions, cancelSubscription, type Subscription } from "@/lib/api/subscriptions";

const STATUS_LABEL: Record<Subscription["status"], string> = {
  TRIAL: "Trial",
  PENDING_PAYMENT: "Pendiente de pago",
  ACTIVE: "Activa",
  CANCELED: "Cancelada",
  EXPIRED: "Expirada",
};

function daysRemaining(dateIso: string | null): number | null {
  if (!dateIso) return null;
  const diffMs = new Date(dateIso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(null);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (!token) return;
    listMySubscriptions(token)
      .then(setSubscriptions)
      .catch(() => setSubscriptions([]));
  }, [token]);

  const current = subscriptions?.[0] ?? null;
  const canCancel = current && (current.status === "TRIAL" || current.status === "ACTIVE");

  async function handleCancel() {
    if (!token || !current) return;
    setCanceling(true);
    try {
      const updated = await cancelSubscription(token, current.id);
      setSubscriptions((prev) => (prev ? prev.map((s) => (s.id === updated.id ? updated : s)) : prev));
    } finally {
      setCanceling(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">Mi perfil</h1>
      <p className="mt-1 text-navy/60">Gestiona tu cuenta y suscripción</p>

      <div className="mt-6 flex items-center gap-4 rounded-card-md bg-white p-5 shadow-sm">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          <User size={20} />
        </span>
        <div>
          <p className="font-semibold">{user?.fullName}</p>
          <p className="text-sm text-navy/60">{user?.email}</p>
        </div>
      </div>

      <div className="mt-4 rounded-card-md bg-white p-5 shadow-sm">
        <p className="flex items-center gap-2 font-semibold">
          <Shield size={16} className="text-accent" /> Suscripción
        </p>

        {subscriptions === null && <p className="mt-3 text-sm text-navy/50">Cargando…</p>}

        {subscriptions?.length === 0 && (
          <p className="mt-3 text-sm text-navy/60">
            No tienes una suscripción activa.{" "}
            <Link href="/pricing" className="font-semibold text-accent">
              Ver planes
            </Link>
          </p>
        )}

        {current && (
          <div className="mt-3 space-y-2 text-sm">
            <p>
              Plan: <span className="font-semibold">{current.planName}</span>
            </p>
            <p>
              Estado: <span className="font-semibold">{STATUS_LABEL[current.status]}</span>
            </p>
            {current.currentPeriodEnd && (
              <p className="flex items-center gap-1.5 text-navy/60">
                <Calendar size={14} /> {daysRemaining(current.currentPeriodEnd)} días restantes
              </p>
            )}

            {canCancel && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={canceling}
                className="mt-2 rounded-pill border border-coral/30 px-4 py-2 text-sm font-semibold text-coral hover:bg-coral-soft disabled:opacity-50"
              >
                {canceling ? "Cancelando…" : "Cancelar suscripción"}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-card-md bg-white p-5 shadow-sm">
        <p className="flex items-center gap-2 font-semibold">
          <Sparkles size={16} className="text-accent" /> Accesos rápidos
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <span className="flex items-center gap-2 rounded-pill bg-navy/5 px-4 py-2 text-sm text-navy/50">
            <Heart size={14} /> Programa 12 semanas
          </span>
          <Link
            href="/therapist"
            className="flex items-center gap-2 rounded-pill bg-navy/5 px-4 py-2 text-sm hover:bg-navy/10"
          >
            <Calendar size={14} /> Agendar terapeuta
          </Link>
        </div>
      </div>
    </div>
  );
}

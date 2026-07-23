"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Shield, Calendar, Heart, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { listMySubscriptions, type Subscription } from "@/lib/api/subscriptions";

const STATUS_LABEL: Record<Subscription["status"], string> = {
  TRIAL: "Trial",
  PENDING_PAYMENT: "Pendiente de pago",
  ACTIVE: "Activa",
  CANCELED: "Cancelada",
  EXPIRED: "Expirada",
};

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(null);

  useEffect(() => {
    if (!token) return;
    listMySubscriptions(token)
      .then(setSubscriptions)
      .catch(() => setSubscriptions([]));
  }, [token]);

  const current = subscriptions?.[0] ?? null;

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

      <Link
        href="/subscription"
        className="mt-4 flex items-center justify-between rounded-card-md bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-icon bg-accent/10 text-accent">
            <Shield size={18} />
          </span>
          <div>
            <p className="font-semibold">Suscripción</p>
            <p className="text-sm text-navy/60">
              {current ? STATUS_LABEL[current.status] : subscriptions === null ? "Cargando…" : "Sin plan activo"}
            </p>
          </div>
        </div>
        <ChevronRight size={18} className="text-navy/30" />
      </Link>

      <div className="mt-4 rounded-card-md bg-white p-5 shadow-sm">
        <p className="font-semibold">Accesos rápidos</p>
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

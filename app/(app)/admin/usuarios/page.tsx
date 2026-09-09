"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Users } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { listAdminUsers, type AdminUserListItem, type AdminSubscriptionSummary } from "@/lib/api/adminUsers";
import AlopeciaTypeBadge from "@/components/shared/AlopeciaTypeBadge";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/shared/Skeleton";

function memberSince(iso: string): string {
  return new Intl.DateTimeFormat("es-CL", { month: "short", year: "numeric" })
    .format(new Date(iso))
    .replace(".", "");
}

function lastMoodLabel(iso: string | null): string {
  if (!iso) return "Sin registros de ánimo";
  const then = new Date(iso + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((today.getTime() - then.getTime()) / 86_400_000);
  if (days <= 0) return "Ánimo registrado hoy";
  if (days === 1) return "Ánimo hace 1 día";
  if (days < 14) return `Ánimo hace ${days} días`;
  if (days < 60) return `Ánimo hace ${Math.floor(days / 7)} semanas`;
  return `Ánimo hace ${Math.floor(days / 30)} meses`;
}

interface SubState {
  label: string;
  rail: string;
  badge: "accent" | "neutral" | "danger";
}

function subscriptionState(sub: AdminSubscriptionSummary | null): SubState {
  if (!sub) return { label: "Sin plan", rail: "border-navy/15", badge: "neutral" };
  const expired = sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).getTime() < Date.now() : false;
  if (expired) return { label: "Plan vencido", rail: "border-coral", badge: "danger" };
  if (sub.status === "ACTIVE") return { label: "Plan al día", rail: "border-accent", badge: "accent" };
  if (sub.status === "TRIAL") return { label: "En prueba", rail: "border-accent/50", badge: "accent" };
  if (sub.status === "PENDING_PAYMENT")
    return { label: "Pago pendiente", rail: "border-coral/60", badge: "danger" };
  return { label: sub.status, rail: "border-navy/15", badge: "neutral" };
}

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUserListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    listAdminUsers(token)
      .then(setUsers)
      .catch((err) => setError(err instanceof Error ? err.message : "No se pudo cargar la lista"));
  }, [token]);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => (u.fullName ?? "").toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [users, query]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-h3-lg text-navy">Seguimiento de usuarias</h1>
          <p className="mt-1 max-w-[560px] text-p-body text-navy/60 text-pretty">
            El perfil, el ánimo, las fotos y el quiz de cada persona, para acompañar su proceso.
          </p>
        </div>
        {users !== null && (
          <p className="shrink-0 pt-1 text-p-small text-navy/50">
            {users.length} {users.length === 1 ? "persona" : "personas"}
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-pill border border-navy/10 bg-white px-4 py-2.5 focus-within:border-accent">
        <Search size={16} className="shrink-0 text-navy/40" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o correo"
          aria-label="Buscar usuaria"
          className="w-full bg-transparent text-p-small text-navy outline-none placeholder:text-navy/40"
        />
      </div>

      {error && <p className="mt-4 text-p-small text-coral">{error}</p>}

      {users === null && (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[88px] w-full rounded-card-md" />
          ))}
        </div>
      )}

      {users !== null && filtered.length === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={Users}
            title={query ? "Nadie coincide con esa búsqueda" : "Todavía no hay usuarias registradas"}
            description={
              query
                ? "Prueba con otra parte del nombre o del correo."
                : "Cuando alguien cree su cuenta, aparecerá acá."
            }
          />
        </div>
      )}

      {filtered.length > 0 && (
        <ul className="mt-6 divide-y divide-navy/10 overflow-hidden rounded-card-lg border border-navy/10 bg-white shadow-sm">
          {filtered.map((u) => {
            const sub = subscriptionState(u.subscription);
            return (
              <li key={u.id}>
                <Link
                  href={`/admin/usuarios/${u.id}`}
                  className={`flex flex-col gap-3 border-l-4 ${sub.rail} px-4 py-4 transition-colors hover:bg-navy/[0.02] sm:flex-row sm:items-center sm:gap-4`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold text-navy">{u.fullName || "Sin nombre"}</p>
                      {u.role === "ADMIN" && (
                        <span className="shrink-0 rounded-pill bg-navy/5 px-2 py-0.5 text-p-caption font-semibold text-navy/50">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-p-small text-navy/60">{u.email}</p>
                    <p className="mt-1 text-p-caption text-navy/45">
                      Desde {memberSince(u.createdAt)} · {lastMoodLabel(u.lastMoodEntryDate)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-1.5 sm:flex-col sm:items-end">
                    {u.quizPrimaryType ? (
                      <AlopeciaTypeBadge code={u.quizPrimaryType} />
                    ) : (
                      <Badge tone="neutral">Quiz sin completar</Badge>
                    )}
                    <Badge tone={sub.badge}>{sub.label}</Badge>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

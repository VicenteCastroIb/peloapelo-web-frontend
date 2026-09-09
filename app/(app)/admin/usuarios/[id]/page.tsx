"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ClipboardList, Camera, CalendarClock } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getAdminUser,
  getAdminUserProgressEntries,
  getAdminUserProgressPhotos,
  getAdminUserProgressSummary,
  getAdminUserQuizResult,
  adminPhotoImageUrl,
  type AdminUserDetail,
  type AdminProgressPhoto,
} from "@/lib/api/adminUsers";
import type { ProgressEntry, ProgressSummary } from "@/lib/api/progress";
import type { QuizResultResponse } from "@/lib/api/quiz";
import MoodChart, { buildMoodGrid, MoodScaleLegend } from "@/components/progress/MoodChart";
import ProgressPhotoGrid from "@/components/progress/ProgressPhotoGrid";
import UserScoresBreakdown from "@/components/admin/UserScoresBreakdown";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/shared/Skeleton";
import { alopeciaTypeByCode } from "@/lib/data/alopeciaTypes";
import { formatDate } from "@/lib/format";

function memberSince(iso: string): string {
  const label = new Intl.DateTimeFormat("es-CL", { month: "long", year: "numeric" }).format(new Date(iso));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function noteDate(iso: string): string {
  return new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long" }).format(
    new Date(iso + "T00:00:00"),
  );
}

function subscriptionPeriodLabel(currentPeriodEnd: string): string {
  const expired = new Date(currentPeriodEnd).getTime() < Date.now();
  return expired
    ? `Venció el ${formatDate(currentPeriodEnd)}`
    : `Se renueva el ${formatDate(currentPeriodEnd)}`;
}

function Card({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-card-lg border border-navy/10 bg-white p-6 shadow-sm sm:p-7">
      <p className="text-h4-label text-navy/50">{eyebrow}</p>
      {title && <h2 className="mt-1.5 text-h3-md text-navy">{title}</h2>}
      <div className={title ? "mt-4" : "mt-3"}>{children}</div>
    </section>
  );
}

export default function AdminUserDetailPage() {
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();

  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizResultResponse | null | undefined>(undefined);
  const [entries, setEntries] = useState<ProgressEntry[] | null>(null);
  const [photos, setPhotos] = useState<AdminProgressPhoto[] | null>(null);
  const [summary, setSummary] = useState<ProgressSummary | null>(null);

  useEffect(() => {
    if (!id) return;
    getAdminUser(token, id)
      .then(setUser)
      .catch((err) =>
        setLoadError(err instanceof Error ? err.message : "No encontramos a esta usuaria"),
      );
    getAdminUserQuizResult(token, id)
      .then((r) => setQuiz(r ?? null))
      .catch(() => setQuiz(null));
    getAdminUserProgressEntries(token, id, 14)
      .then(setEntries)
      .catch(() => setEntries([]));
    getAdminUserProgressPhotos(token, id)
      .then(setPhotos)
      .catch(() => setPhotos([]));
    getAdminUserProgressSummary(token, id)
      .then(setSummary)
      .catch(() => setSummary(null));
  }, [token, id]);

  if (loadError) {
    return (
      <div className="mx-auto max-w-3xl">
        <BackLink />
        <div className="mt-6">
          <EmptyState
            icon={ClipboardList}
            title="No pudimos abrir esta ficha"
            description={loadError}
          />
        </div>
      </div>
    );
  }

  const notes = (entries ?? [])
    .filter((e) => e.note && e.note.trim().length > 0)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="mx-auto grid max-w-3xl gap-5">
      <BackLink />

      {/* Header: quién es */}
      {user === null ? (
        <Skeleton className="h-[160px] w-full rounded-card-lg" />
      ) : (
        <section className="rounded-card-lg border border-navy/10 bg-white p-6 shadow-sm sm:p-7">
          <h1 className="text-h3-lg text-navy">{user.fullName || "Sin nombre"}</h1>
          <div className="mt-3 grid gap-x-8 gap-y-1.5 text-p-small text-navy/70 sm:grid-cols-2">
            <p>
              <span className="text-navy/45">Correo</span> · {user.email}
            </p>
            <p>
              <span className="text-navy/45">Teléfono</span> · {user.phone || "—"}
            </p>
            <p>
              <span className="text-navy/45">Miembro desde</span> · {memberSince(user.createdAt)}
            </p>
            <p>
              <span className="text-navy/45">Rol</span> ·{" "}
              {user.role === "ADMIN" ? "Administradora" : "Usuaria"}
            </p>
          </div>
          {user.bio && user.bio.trim().length > 0 && (
            <p className="mt-4 border-l-2 border-accent/25 pl-4 text-p-body leading-relaxed text-navy/70 text-pretty">
              {user.bio}
            </p>
          )}
        </section>
      )}

      {/* Quiz de autoevaluación */}
      <Card eyebrow="Autoevaluación" title="Quiz de alopecia">
        {quiz === undefined ? (
          <Skeleton className="h-[120px] w-full rounded-card-md" />
        ) : quiz === null ? (
          <EmptyState
            icon={ClipboardList}
            title="Todavía no completó el quiz de autoevaluación"
            description="Cuando lo haga, acá vas a ver el tipo de alopecia más probable y el desglose de puntaje."
          />
        ) : (
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              {quiz.primaryType ? (
                <>
                  <h2 className="text-h3-md text-navy">
                    {alopeciaTypeByCode(quiz.primaryType).name}
                  </h2>
                  <Badge tone="accent">{alopeciaTypeByCode(quiz.primaryType).tag}</Badge>
                </>
              ) : (
                <Badge tone="neutral">Resultado no concluyente</Badge>
              )}
              <span className="text-p-caption text-navy/45">
                Actualizado el {formatDate(quiz.updatedAt)}
              </span>
            </div>
            <div className="mt-4">
              <p className="mb-2.5 text-p-caption font-semibold uppercase tracking-wide text-navy/40">
                Puntaje por tipo
              </p>
              <UserScoresBreakdown scores={quiz.scores} />
            </div>
          </div>
        )}
      </Card>

      {/* Ánimo */}
      <Card eyebrow="Seguimiento" title="Ánimo · últimas dos semanas">
        {entries === null ? (
          <Skeleton className="h-[120px] w-full rounded-card-md" />
        ) : entries.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Todavía no registró su ánimo"
            description="Cuando empiece a usar el seguimiento diario, acá vas a ver la evolución."
          />
        ) : (
          <div>
            {summary && (summary.streakDays > 0 || summary.photosThisMonth > 0) && (
              <p className="mb-4 text-p-small text-navy/50">
                {summary.streakDays} {summary.streakDays === 1 ? "día seguido" : "días seguidos"}{" "}
                registrando · {summary.photosThisMonth}{" "}
                {summary.photosThisMonth === 1 ? "foto" : "fotos"} este mes
              </p>
            )}
            <div className="mb-4 flex justify-end">
              <MoodScaleLegend />
            </div>
            <MoodChart data={buildMoodGrid(entries)} />

            {notes.length > 0 && (
              <div className="mt-6 border-t border-navy/10 pt-5">
                <p className="mb-3 text-p-caption font-semibold uppercase tracking-wide text-navy/40">
                  Notas del período
                </p>
                <ul className="flex flex-col gap-3">
                  {notes.map((e) => (
                    <li key={e.id} className="text-p-body text-navy/75">
                      <span className="font-semibold text-navy/50">{noteDate(e.date)}</span> — {e.note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Fotos de seguimiento */}
      <Card eyebrow="Seguimiento" title="Fotos de la línea de tiempo">
        {photos === null ? (
          <Skeleton className="h-[160px] w-full rounded-card-md" />
        ) : photos.length === 0 ? (
          <EmptyState
            icon={Camera}
            title="Sin fotos de seguimiento"
            description="Todavía no subió ninguna foto en su línea de tiempo."
          />
        ) : (
          <ProgressPhotoGrid photos={photos} srcFor={adminPhotoImageUrl} />
        )}
      </Card>

      {/* Plan */}
      <Card eyebrow="Cuenta" title="Plan">
        {user === null ? (
          <Skeleton className="h-[52px] w-full rounded-card-md" />
        ) : user.subscription === null ? (
          <p className="text-p-body text-navy/60">Sin plan activo.</p>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-h3-md text-navy">{user.subscription.planName}</span>
            <Badge tone="neutral">{user.subscription.status}</Badge>
            {user.subscription.currentPeriodEnd && (
              <span className="inline-flex items-center gap-1.5 text-p-small text-navy/55">
                <CalendarClock size={14} />
                {subscriptionPeriodLabel(user.subscription.currentPeriodEnd)}
              </span>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/admin/usuarios"
      className="inline-flex items-center gap-2 text-a-inline text-navy/60 hover:text-navy"
    >
      <ArrowLeft size={16} />
      Volver a la lista
    </Link>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart, Calendar, Camera, Check, Lock, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { listMySubscriptions, type Subscription } from "@/lib/api/subscriptions";
import { getSummary, type ProgressSummary } from "@/lib/api/progress";
import { plans } from "@/lib/data/plans";
import { formatClp, formatDate } from "@/lib/format";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Field from "@/components/ui/Field";
import TextInput from "@/components/ui/TextInput";
import Switch from "@/components/ui/Switch";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Skeleton from "@/components/shared/Skeleton";
import DashboardCard from "@/components/dashboard/DashboardCard";

const TRIMESTRAL = plans.find((p) => p.id === "trimestral")!;

function initialsFrom(fullName: string | undefined): string {
  const partes = (fullName ?? "").trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "";
  const primera = partes[0][0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primera + ultima).toUpperCase();
}

function memberSince(iso: string): string {
  return new Intl.DateTimeFormat("es-CL", { month: "short", year: "numeric" }).format(new Date(iso)).replace(".", "");
}

// Telefono/nota no tienen campo propio en el backend todavia (User.java solo
// guarda email/fullName/role) -- se editan como estado local nada mas, igual
// que en el prototipo de diseno (su propio "guardar" tampoco llama a ninguna
// API, ver DCLogic.guardar del handoff). Cuando exista un PATCH real de
// perfil, estos placeholders se reemplazan por los valores que traiga esa
// respuesta.
const TELEFONO_INICIAL = "+56 9 8123 4567";
const NOTA_INICIAL = "";

export default function ProfilePage() {
  const { user, token, status } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(null);
  const [summary, setSummary] = useState<ProgressSummary | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    listMySubscriptions(token).then(setSubscriptions).catch(() => setSubscriptions([]));
    getSummary(token)
      .then(setSummary)
      .catch(() => setSummary({ streakDays: 0, photosThisMonth: 0, monthsWithUs: 0 }));
  }, [status, token]);

  const current = subscriptions?.[0] ?? null;
  const conPlan = current?.status === "ACTIVE";

  const [nombreInicial, apellidoInicial] = useMemo(() => {
    const partes = (user?.fullName ?? "").trim().split(/\s+/).filter(Boolean);
    return [partes[0] ?? "", partes.slice(1).join(" ")];
  }, [user?.fullName]);

  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(nombreInicial);
  const [apellido, setApellido] = useState(apellidoInicial);
  const [correo, setCorreo] = useState(user?.email ?? "");
  const [telefono, setTelefono] = useState(TELEFONO_INICIAL);
  const [nota, setNota] = useState(NOTA_INICIAL);

  function toggleEditar() {
    setEditando((v) => !v);
  }

  function guardar() {
    // Sin PATCH /api/users/me todavia: "guardar" solo cierra el modo
    // edicion, los valores ya viven en el estado de arriba.
    setEditando(false);
  }

  function cancelar() {
    setNombre(nombreInicial);
    setApellido(apellidoInicial);
    setCorreo(user?.email ?? "");
    setTelefono(TELEFONO_INICIAL);
    setNota(NOTA_INICIAL);
    setEditando(false);
  }

  const [animoDiario, setAnimoDiario] = useState(true);
  const [resumenSemanal, setResumenSemanal] = useState(true);
  const [novedades, setNovedades] = useState(false);

  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false);

  const costoPorDia = TRIMESTRAL.costPerDay?.split("/")[0] ?? "";

  return (
    <div className="grid max-w-[1180px] gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-h4-label text-accent">Tu cuenta</p>
          <h1 className="mt-1.5 text-h3-lg text-navy">
            Mi <span className="italic text-accent">perfil</span>
          </h1>
          <p className="mt-2 max-w-[560px] text-p-body text-navy/60 text-pretty">
            Tus datos, tu plan y tus accesos, en un solo lugar. Nada de esto reemplaza a tus doctores.
          </p>
        </div>
        {user?.createdAt && <Badge tone="accent">Miembro desde {memberSince(user.createdAt)}</Badge>}
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-5 min-w-0">
          <div className="flex flex-wrap items-center gap-5 rounded-card-lg border border-navy/10 bg-white p-6 shadow-sm">
            <div className="relative shrink-0">
              <div className="flex h-[76px] w-[76px] items-center justify-center rounded-pill bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] text-2xl font-black tracking-[0.02em] text-white">
                {initialsFrom(user?.fullName)}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-[26px] w-[26px] items-center justify-center rounded-pill border border-navy/10 bg-white text-accent">
                <Heart size={14} />
              </span>
            </div>
            <div className="min-w-[180px] flex-1">
              <h2 className="text-h3-md text-navy">{user?.fullName}</h2>
              <p className="mt-1 text-p-small text-navy/60">{user?.email}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="neutral">Santiago, Chile</Badge>
                <Badge tone="neutral">Alopecia areata</Badge>
                {summary ? (
                  <Badge tone="accent">
                    {summary.streakDays} {summary.streakDays === 1 ? "día" : "días"} registrando tu ánimo
                  </Badge>
                ) : (
                  <Skeleton className="h-[22px] w-[190px] rounded-pill" />
                )}
              </div>
            </div>
            <Button variant="outline" onClick={toggleEditar}>
              Editar datos
            </Button>
          </div>

          <div className="rounded-card-lg border border-navy/10 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-h3-sm text-navy">Datos de la cuenta</h3>
              <p className="text-p-small text-navy/50">Solo los ve el equipo de Pelo a Pelo</p>
            </div>

            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              <Field label="Nombre" htmlFor="perfil-nombre">
                <TextInput
                  id="perfil-nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  readOnly={!editando}
                />
              </Field>
              <Field label="Apellido" htmlFor="perfil-apellido">
                <TextInput
                  id="perfil-apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  readOnly={!editando}
                />
              </Field>
              <Field label="Correo electrónico" htmlFor="perfil-correo">
                <TextInput
                  id="perfil-correo"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  readOnly={!editando}
                />
              </Field>
              <Field label="Teléfono" htmlFor="perfil-telefono">
                <TextInput
                  id="perfil-telefono"
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  readOnly={!editando}
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field
                label="Lo que quieres que sepamos de tu proceso"
                hint="Opcional. Tu terapeuta lo lee antes de la primera sesión."
                htmlFor="perfil-nota"
              >
                <TextInput
                  as="textarea"
                  id="perfil-nota"
                  rows={3}
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  readOnly={!editando}
                  placeholder="Convivo con alopecia areata desde los 5 años. Estoy trabajando en volver a mirarme al espejo sin pelear."
                />
              </Field>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-navy/10 pt-5">
              {editando ? (
                <>
                  <Button variant="gradient" onClick={guardar}>
                    Guardar cambios
                  </Button>
                  <Button variant="ghost" onClick={cancelar}>
                    Cancelar
                  </Button>
                </>
              ) : (
                <p className="text-p-small text-navy/50">
                  Para cambiar algo, usa <span className="font-semibold text-navy/70">Editar datos</span>. Guardamos
                  los cambios al instante.
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-h3-sm text-navy">Accesos rápidos</h3>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
              <DashboardCard
                icon={Heart}
                badge="En curso"
                badgeTone="accent"
                title="Programa 12 semanas"
                description="Semana 4, a tu ritmo"
                href="/courses"
                progress={33}
                progressLabel="4 de 12 semanas"
              />
              <DashboardCard
                icon={Calendar}
                badge="Disponible"
                title="Agendar terapeuta"
                description="Sesiones orientativas, no clínicas"
                href="/therapist"
              />
              <DashboardCard
                icon={Camera}
                badge="Hoy"
                badgeTone="gradient"
                title="Tu espejo honesto"
                description="Registra cómo estás hoy"
                href="/progress"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 min-w-0">
          <div className="rounded-card-lg border border-accent/25 bg-[linear-gradient(160deg,#ffffff,rgba(143,124,182,0.16))] p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-h4-label text-accent">Suscripción</p>
              {subscriptions === null ? (
                <Skeleton className="h-[22px] w-[100px] rounded-pill" />
              ) : conPlan ? (
                <Badge tone="gradient">Activo</Badge>
              ) : (
                <Badge tone="neutral">Sin plan activo</Badge>
              )}
            </div>

            {subscriptions === null ? (
              <div className="mt-4 grid gap-3">
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-16 w-full rounded-md" />
                <Skeleton className="h-11 w-full rounded-pill" />
              </div>
            ) : conPlan && current ? (
              <div>
                <h3 className="mt-3.5 text-h3-md text-navy">
                  Plan <span className="italic text-accent">{current.planName}</span>
                </h3>
                <p className="mt-2 text-p-small leading-relaxed text-navy/60">
                  {current.currentPeriodEnd ? (
                    <>Se renueva el {formatDate(current.currentPeriodEnd)}. Te avisamos por correo tres días antes.</>
                  ) : (
                    <>Tu plan está activo.</>
                  )}
                </p>
                <div className="mb-4 mt-5 flex items-baseline gap-2 border-t border-navy/10 pt-[18px]">
                  <span className="text-data-md text-navy">{formatClp(current.planPriceClp)}</span>
                  <span className="text-p-small text-navy/60">CLP · {current.planBillingPeriod}</span>
                </div>
                <Button variant="solid" href="/subscription" className="w-full">
                  Gestionar mi plan
                </Button>
              </div>
            ) : (
              <div>
                <h3 className="mt-3.5 text-h3-md text-navy">
                  Hoy tienes el <span className="italic text-accent">acceso libre</span>
                </h3>
                <p className="mt-2 text-p-small leading-relaxed text-navy/60 text-pretty">
                  Puedes registrar tu ánimo y leer el blog. Bienestar abre los cursos completos y las sesiones con
                  terapeuta.
                </p>
                <div className="mt-[18px] flex flex-col gap-2.5">
                  {[
                    "Los 3 cursos completos, sin límite de tiempo",
                    "Dos sesiones al mes con tu terapeuta",
                    "Seguimiento de progreso con fotos privadas",
                  ].map((texto) => (
                    <div key={texto} className="flex items-start gap-2.5 text-p-small text-navy/70">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-pill bg-accent/15 text-accent">
                        <Check size={13} />
                      </span>
                      {texto}
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-baseline gap-2 border-t border-navy/10 pt-[18px]">
                  <span className="text-data-md text-navy">{TRIMESTRAL.price}</span>
                  <span className="text-p-small text-navy/60">
                    {TRIMESTRAL.currency} · {TRIMESTRAL.period}
                  </span>
                </div>
                <p className="mb-4 mt-1 text-p-caption text-navy/50">
                  Equivale a {costoPorDia} por día. Puedes cancelar cuando quieras.
                </p>
                <Button variant="gradient" href="/subscription" className="w-full">
                  Elegir Bienestar
                </Button>
                <Button variant="ghost" href="/subscription" className="mt-2 w-full">
                  Comparar planes
                </Button>
              </div>
            )}
          </div>

          <div className="rounded-card-lg border border-navy/10 bg-white p-6 shadow-sm">
            <h3 className="text-h3-sm text-navy">Recordatorios</h3>
            <p className="mb-[18px] mt-1 text-p-small text-navy/50">Te escribimos poco, y solo lo que pediste</p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3.5">
                <div>
                  <p className="text-p-small font-semibold text-navy">Registro diario de ánimo</p>
                  <p className="mt-0.5 text-p-caption text-navy/50">Cada día a las 21:00</p>
                </div>
                <Switch
                  checked={animoDiario}
                  onChange={() => setAnimoDiario((v) => !v)}
                  label="Recordatorio de registro diario"
                />
              </div>
              <div className="flex items-center justify-between gap-3.5">
                <div>
                  <p className="text-p-small font-semibold text-navy">Resumen de tu semana</p>
                  <p className="mt-0.5 text-p-caption text-navy/50">Domingos por la mañana</p>
                </div>
                <Switch checked={resumenSemanal} onChange={() => setResumenSemanal((v) => !v)} label="Resumen semanal" />
              </div>
              <div className="flex items-center justify-between gap-3.5">
                <div>
                  <p className="text-p-small font-semibold text-navy">Novedades de la fundación</p>
                  <p className="mt-0.5 text-p-caption text-navy/50">Nuevos cursos y encuentros</p>
                </div>
                <Switch checked={novedades} onChange={() => setNovedades((v) => !v)} label="Novedades de la fundación" />
              </div>
            </div>
          </div>

          <div className="rounded-card-lg border border-navy/10 bg-white p-6 shadow-sm">
            <h3 className="mb-[18px] text-h3-sm text-navy">Seguridad</h3>
            <div className="flex flex-col">
              <div className="flex items-center gap-3 py-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-icon bg-navy/5 text-navy/70">
                  <Lock size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-p-small font-semibold text-navy">Contraseña</p>
                  <p className="mt-0.5 text-p-caption text-navy/50">Actualizada hace 4 meses</p>
                </div>
                <Button variant="ghost" size="sm">
                  Cambiar
                </Button>
              </div>
              <div className="flex items-center gap-3 border-t border-navy/10 py-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-icon bg-navy/5 text-navy/70">
                  <ShieldCheck size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-p-small font-semibold text-navy">Sesiones activas</p>
                  <p className="mt-0.5 text-p-caption text-navy/50">Este equipo y un teléfono</p>
                </div>
                <Button variant="ghost" size="sm">
                  Cerrar todas
                </Button>
              </div>
            </div>
            <div className="mt-4 border-t border-navy/10 pt-4">
              <button
                type="button"
                onClick={() => setConfirmandoEliminar(true)}
                className="border-none bg-transparent p-0 text-a-inline font-semibold text-coral"
              >
                Eliminar mi cuenta
              </button>
              <p className="mt-1.5 text-p-caption leading-relaxed text-navy/50">
                Borramos tus registros y fotos para siempre. Antes te lo confirmamos por correo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sin endpoint de baja de cuenta todavia -- el dialogo confirma la
          intencion pero por ahora solo se cierra (ver comentario de
          TELEFONO_INICIAL mas arriba sobre el mismo alcance). */}
      <ConfirmDialog
        open={confirmandoEliminar}
        title="¿Eliminar tu cuenta?"
        description="Borramos tus registros y fotos para siempre. Antes te lo confirmamos por correo."
        confirmLabel="Sí, eliminar"
        cancelLabel="Mejor no"
        onConfirm={() => setConfirmandoEliminar(false)}
        onCancel={() => setConfirmandoEliminar(false)}
      />
    </div>
  );
}

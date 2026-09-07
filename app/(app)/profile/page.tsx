"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Calendar, Camera, Check, Lock, ShieldCheck } from "lucide-react";
import { useAuth, ApiError } from "@/lib/auth/AuthContext";
import { listMySubscriptions, type Subscription } from "@/lib/api/subscriptions";
import { getSummary, type ProgressSummary } from "@/lib/api/progress";
import { updateProfile, updateNotifications, deleteAccount } from "@/lib/api/users";
import { changePassword, revokeOtherSessions } from "@/lib/api/auth";
import { plans } from "@/lib/data/plans";
import { formatClp, formatDate } from "@/lib/format";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Field from "@/components/ui/Field";
import TextInput from "@/components/ui/TextInput";
import Switch from "@/components/ui/Switch";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Collapse from "@/components/shared/Collapse";
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

// Par label/valor de solo lectura para la ficha de perfil (ver StaticField
// mas abajo en el render): texto plano, sin borde ni fondo de input, para
// distinguir claramente "viendo tus datos" de "editando tus datos".
function StaticField({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  const display = value.trim().length > 0 ? value : "—";
  return (
    <div>
      <p className="text-p-caption font-semibold uppercase tracking-wide text-navy/40">{label}</p>
      <p
        className={`mt-1.5 text-p-body text-navy ${
          multiline ? "whitespace-pre-wrap leading-relaxed text-pretty" : "truncate"
        }`}
      >
        {display}
      </p>
    </div>
  );
}

export default function ProfilePage() {
  const { user, token, status, applySession, refreshUser, logout } = useAuth();
  const router = useRouter();
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
  const [telefono, setTelefono] = useState(user?.phone ?? "");
  const [nota, setNota] = useState(user?.bio ?? "");
  const [guardando, setGuardando] = useState(false);
  const [guardarError, setGuardarError] = useState<string | null>(null);

  // Sincroniza los campos con el usuario real cuando llega/cambia (login,
  // fetchMe inicial, o el refreshUser() de mas abajo tras guardar) -- salvo
  // que este editando: no queremos pisar lo que la persona esta escribiendo
  // a mitad de una edicion si por algun motivo `user` se refresca solo.
  // Ajuste de estado durante el render (no en un useEffect, ver
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)
  // -- comparar contra la referencia ya sincronizada evita el loop infinito
  // sin depender de un efecto que dispare un render extra.
  const [profileSyncedUser, setProfileSyncedUser] = useState(user);
  if (!editando && user !== profileSyncedUser) {
    setProfileSyncedUser(user);
    const partes = (user?.fullName ?? "").trim().split(/\s+/).filter(Boolean);
    setNombre(partes[0] ?? "");
    setApellido(partes.slice(1).join(" "));
    setCorreo(user?.email ?? "");
    setTelefono(user?.phone ?? "");
    setNota(user?.bio ?? "");
  }

  function toggleEditar() {
    setGuardarError(null);
    setEditando((v) => !v);
  }

  // "Guardar cambios" (ago 2026, a pedido: "el usuario podra editar su
  // perfil y guardarlo, quedando con una vista ordenada del perfil") --
  // PATCH real a /api/users/me. applySession adopta el JWT nuevo (el email
  // pudo cambiar, ver lib/api/users.ts) y refreshUser() vuelve a pedir el
  // perfil completo para que phone/bio queden sincronizados igual que en el
  // backend. Recien cuando las dos resuelven se cierra el modo edicion --
  // si algo falla (ej. "ya existe una cuenta con ese correo"), la persona
  // se queda en modo edicion viendo el error, no pierde lo que escribio.
  async function guardar() {
    if (status !== "authenticated") return;
    setGuardando(true);
    setGuardarError(null);
    try {
      const fullName = [nombre.trim(), apellido.trim()].filter(Boolean).join(" ");
      const res = await updateProfile(token, { fullName, email: correo.trim(), phone: telefono, bio: nota });
      applySession(res);
      await refreshUser();
      setEditando(false);
    } catch (err) {
      setGuardarError(err instanceof ApiError ? err.message : "No pudimos guardar tus datos.");
    } finally {
      setGuardando(false);
    }
  }

  function cancelar() {
    setGuardarError(null);
    setNombre(nombreInicial);
    setApellido(apellidoInicial);
    setCorreo(user?.email ?? "");
    setTelefono(user?.phone ?? "");
    setNota(user?.bio ?? "");
    setEditando(false);
  }

  // Recordatorios: cambio optimista (el switch ya se ve encendido/apagado
  // de inmediato) + persistencia inmediata; si el PATCH falla se revierte
  // al valor anterior, para no dejar a la UI mintiendo sobre lo guardado.
  const [animoDiario, setAnimoDiario] = useState(true);
  const [resumenSemanal, setResumenSemanal] = useState(true);
  const [novedades, setNovedades] = useState(false);

  // Mismo patron de ajuste-durante-el-render que profileSyncedUser arriba.
  const [notifSyncedUser, setNotifSyncedUser] = useState(user);
  if (user !== notifSyncedUser) {
    setNotifSyncedUser(user);
    if (user) {
      setAnimoDiario(user.notifyMoodDaily);
      setResumenSemanal(user.notifyWeeklySummary);
      setNovedades(user.notifyNewsletter);
    }
  }

  async function persistNotification(
    next: { notifyMoodDaily: boolean; notifyWeeklySummary: boolean; notifyNewsletter: boolean },
    revert: () => void
  ) {
    try {
      await updateNotifications(token, next);
    } catch {
      revert();
    }
  }

  function toggleAnimoDiario() {
    const nextValue = !animoDiario;
    setAnimoDiario(nextValue);
    persistNotification(
      { notifyMoodDaily: nextValue, notifyWeeklySummary: resumenSemanal, notifyNewsletter: novedades },
      () => setAnimoDiario(!nextValue)
    );
  }

  function toggleResumenSemanal() {
    const nextValue = !resumenSemanal;
    setResumenSemanal(nextValue);
    persistNotification(
      { notifyMoodDaily: animoDiario, notifyWeeklySummary: nextValue, notifyNewsletter: novedades },
      () => setResumenSemanal(!nextValue)
    );
  }

  function toggleNovedades() {
    const nextValue = !novedades;
    setNovedades(nextValue);
    persistNotification(
      { notifyMoodDaily: animoDiario, notifyWeeklySummary: resumenSemanal, notifyNewsletter: nextValue },
      () => setNovedades(!nextValue)
    );
  }

  // Seguridad: cambio de contraseña
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [guardandoPassword, setGuardandoPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordListo, setPasswordListo] = useState(false);

  function abrirCambioPassword() {
    setPasswordError(null);
    setPasswordListo(false);
    setPasswordActual("");
    setPasswordNueva("");
    setCambiandoPassword(true);
  }

  async function guardarPassword() {
    if (status !== "authenticated") return;
    setGuardandoPassword(true);
    setPasswordError(null);
    try {
      const res = await changePassword(token, passwordActual, passwordNueva);
      applySession(res);
      setPasswordListo(true);
      setPasswordActual("");
      setPasswordNueva("");
      setTimeout(() => setCambiandoPassword(false), 1500);
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : "No pudimos cambiar tu contraseña.");
    } finally {
      setGuardandoPassword(false);
    }
  }

  // Seguridad: cerrar todas las demas sesiones
  const [cerrandoSesiones, setCerrandoSesiones] = useState(false);
  const [sesionesListo, setSesionesListo] = useState(false);

  async function cerrarOtrasSesiones() {
    if (status !== "authenticated") return;
    setCerrandoSesiones(true);
    setSesionesListo(false);
    try {
      const res = await revokeOtherSessions(token);
      applySession(res);
      setSesionesListo(true);
    } catch {
      // Best-effort: si falla, la persona puede simplemente reintentar.
    } finally {
      setCerrandoSesiones(false);
    }
  }

  // Eliminar cuenta: sin paso de confirmacion por correo (no hay
  // infraestructura de email para esto todavia) -- el unico portazo es este
  // ConfirmDialog, que es real: "Si, eliminar" borra la cuenta de inmediato
  // en el backend (ver UserController#deleteAccount) y redirige a /auth.
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [eliminarError, setEliminarError] = useState<string | null>(null);

  async function confirmarEliminar() {
    if (status !== "authenticated") return;
    setEliminando(true);
    setEliminarError(null);
    try {
      await deleteAccount(token);
      logout();
      router.replace("/auth");
    } catch (err) {
      setEliminarError(err instanceof ApiError ? err.message : "No pudimos eliminar tu cuenta.");
      setEliminando(false);
      setConfirmandoEliminar(false);
    }
  }

  const costoPorDia = TRIMESTRAL.costPerDay?.split("/")[0] ?? "";

  return (
    <div className="mx-auto grid max-w-[1180px] gap-6">
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
                {summary === null ? (
                  <Skeleton className="h-[22px] w-[190px] rounded-pill" />
                ) : (
                  summary.streakDays > 0 && (
                    <Badge tone="accent">
                      {summary.streakDays} {summary.streakDays === 1 ? "día" : "días"} registrando tu ánimo
                    </Badge>
                  )
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

            {editando ? (
              <>
                <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                  <Field label="Nombre" htmlFor="perfil-nombre">
                    <TextInput id="perfil-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                  </Field>
                  <Field label="Apellido" htmlFor="perfil-apellido">
                    <TextInput id="perfil-apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} />
                  </Field>
                  <Field label="Correo electrónico" htmlFor="perfil-correo">
                    <TextInput
                      id="perfil-correo"
                      type="email"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                    />
                  </Field>
                  <Field label="Teléfono" htmlFor="perfil-telefono">
                    <TextInput
                      id="perfil-telefono"
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
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
                      placeholder="Convivo con alopecia areata desde los 5 años. Estoy trabajando en volver a mirarme al espejo sin pelear."
                    />
                  </Field>
                </div>
              </>
            ) : (
              <>
                {/* Vista de solo lectura (ago 2026, a pedido: "los datos deben
                    verse de manera ordenada y estatica, no con formato de
                    edicion" -- antes esto mostraba los mismos TextInput con
                    readOnly, que seguian viendose como campos de formulario
                    (borde, pildora, fondo). Ahora es texto plano tipo ficha;
                    el formulario de edicion de arriba solo aparece al
                    clickear "Editar datos" en la tarjeta de cabecera. */}
                <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                  <StaticField label="Nombre" value={nombre} />
                  <StaticField label="Apellido" value={apellido} />
                  <StaticField label="Correo electrónico" value={correo} />
                  <StaticField label="Teléfono" value={telefono} />
                </div>
                <div className="mt-5">
                  <StaticField label="Lo que quieres que sepamos de tu proceso" value={nota} multiline />
                </div>
              </>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-navy/10 pt-5">
              {editando ? (
                <>
                  <Button variant="gradient" onClick={guardar} disabled={guardando}>
                    {guardando ? "Guardando…" : "Guardar cambios"}
                  </Button>
                  <Button variant="ghost" onClick={cancelar} disabled={guardando}>
                    Cancelar
                  </Button>
                  {guardarError && <p className="text-p-caption text-coral">{guardarError}</p>}
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
                <Switch checked={animoDiario} onChange={toggleAnimoDiario} label="Recordatorio de registro diario" />
              </div>
              <div className="flex items-center justify-between gap-3.5">
                <div>
                  <p className="text-p-small font-semibold text-navy">Resumen de tu semana</p>
                  <p className="mt-0.5 text-p-caption text-navy/50">Domingos por la mañana</p>
                </div>
                <Switch checked={resumenSemanal} onChange={toggleResumenSemanal} label="Resumen semanal" />
              </div>
              <div className="flex items-center justify-between gap-3.5">
                <div>
                  <p className="text-p-small font-semibold text-navy">Novedades de la fundación</p>
                  <p className="mt-0.5 text-p-caption text-navy/50">Nuevos cursos y encuentros</p>
                </div>
                <Switch checked={novedades} onChange={toggleNovedades} label="Novedades de la fundación" />
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
                  <p className="mt-0.5 text-p-caption text-navy/50">
                    {cambiandoPassword ? "Elige una contraseña nueva" : "Cámbiala cuando quieras"}
                  </p>
                </div>
                {!cambiandoPassword && (
                  <Button variant="ghost" size="sm" onClick={abrirCambioPassword}>
                    Cambiar
                  </Button>
                )}
              </div>
              <Collapse open={cambiandoPassword}>
                <div className="flex flex-col gap-3 pb-3.5 pl-12">
                  <Field label="Contraseña actual" htmlFor="perfil-password-actual">
                    <TextInput
                      id="perfil-password-actual"
                      type="password"
                      value={passwordActual}
                      onChange={(e) => setPasswordActual(e.target.value)}
                      autoComplete="current-password"
                    />
                  </Field>
                  <Field label="Contraseña nueva" htmlFor="perfil-password-nueva" hint="Mínimo 6 caracteres.">
                    <TextInput
                      id="perfil-password-nueva"
                      type="password"
                      value={passwordNueva}
                      onChange={(e) => setPasswordNueva(e.target.value)}
                      autoComplete="new-password"
                    />
                  </Field>
                  {passwordError && <p className="text-p-caption text-coral">{passwordError}</p>}
                  {passwordListo && <p className="text-p-caption text-accent">Contraseña actualizada.</p>}
                  <div className="flex items-center gap-2.5">
                    <Button
                      variant="gradient"
                      size="sm"
                      onClick={guardarPassword}
                      disabled={guardandoPassword || passwordActual.length === 0 || passwordNueva.length < 6}
                    >
                      {guardandoPassword ? "Guardando…" : "Guardar contraseña"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setCambiandoPassword(false)} disabled={guardandoPassword}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </Collapse>
              <div className="flex items-center gap-3 border-t border-navy/10 py-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-icon bg-navy/5 text-navy/70">
                  <ShieldCheck size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-p-small font-semibold text-navy">Sesiones activas</p>
                  <p className="mt-0.5 text-p-caption text-navy/50">
                    {sesionesListo ? "Listo, cerramos tus otras sesiones." : "Cierra el acceso desde cualquier otro dispositivo"}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={cerrarOtrasSesiones} disabled={cerrandoSesiones}>
                  {cerrandoSesiones ? "Cerrando…" : "Cerrar todas"}
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
                Se borra de inmediato: tus registros, fotos y suscripción no se pueden recuperar.
              </p>
              {eliminarError && <p className="mt-1.5 text-p-caption text-coral">{eliminarError}</p>}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmandoEliminar}
        title="¿Eliminar tu cuenta?"
        description="Se borra de inmediato: tus registros de ánimo, fotos y suscripción no se pueden recuperar."
        confirmLabel="Sí, eliminar"
        cancelLabel="Mejor no"
        loading={eliminando}
        onConfirm={confirmarEliminar}
        onCancel={() => setConfirmandoEliminar(false)}
      />
    </div>
  );
}

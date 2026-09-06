"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Sparkles, Heart, Camera, BookOpen, CreditCard, Check } from "lucide-react";
import { useAuth, ApiError } from "@/lib/auth/AuthContext";
import {
  getSummary,
  getTodayEntry,
  saveEntry,
  type ProgressEntry,
  type ProgressSummary,
} from "@/lib/api/progress";
import { fetchCourses, fetchCourseDetail, type CourseSummary, type CourseDetail } from "@/lib/api/courses";
import { listMySubscriptions, type Subscription } from "@/lib/api/subscriptions";
import { fetchTodayMessage, type DailyMessage } from "@/lib/api/dailyMessages";
import Button from "@/components/ui/Button";
import MoodPicker, { type MoodValue } from "@/components/progress/MoodPicker";
import RadialProgress from "@/components/shared/RadialProgress";
import ProgressBar from "@/components/shared/ProgressBar";
import Skeleton from "@/components/shared/Skeleton";
import DashboardCard from "@/components/dashboard/DashboardCard";

function todayLocalIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function todayEyebrow(): string {
  const raw = new Intl.DateTimeFormat("es-CL", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  return raw.replace(",", "").replace(/^./, (c) => c.toUpperCase());
}

function timeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 20) return "Buenas tardes";
  return "Buenas noches";
}

interface ResumeInfo {
  courseSlug: string;
  courseTitle: string;
  coverImageUrl: string | null;
  lessonSlug: string;
  lessonIndex: number;
  lessonTitle: string;
  totalLessons: number;
  completedLessons: number;
  remainingMinutes: number;
}

// "Continua donde quedaste" necesita la posicion/nombre de la LECCION donde
// retomar, no solo el % del curso (ver docs/design del rediseno /dashboard)
// -- CourseSummary no lo trae, hace falta el detalle con sus lecciones.
function computeResume(detail: CourseDetail, slug: string): ResumeInfo | null {
  const lessons = detail.modules.flatMap((m) => m.lessons);
  if (lessons.length === 0) return null;

  const pendingIndex = lessons.findIndex((l) => !l.completed);
  const targetIndex = pendingIndex === -1 ? lessons.length - 1 : pendingIndex;
  const target = lessons[targetIndex];

  return {
    courseSlug: slug,
    courseTitle: detail.title,
    coverImageUrl: detail.coverImageUrl,
    lessonSlug: target.slug,
    lessonIndex: targetIndex + 1,
    lessonTitle: target.title,
    totalLessons: lessons.length,
    completedLessons: lessons.filter((l) => l.completed).length,
    remainingMinutes: lessons.filter((l) => !l.completed).reduce((sum, l) => sum + l.durationMinutes, 0),
  };
}

export default function DashboardPage() {
  const { user, token, status } = useAuth();
  const firstName = user?.fullName?.split(" ")[0] || user?.email;

  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [todayEntry, setTodayEntry] = useState<ProgressEntry | null | undefined>(undefined);
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(null);
  const [courses, setCourses] = useState<CourseSummary[] | null>(null);
  const [dailyMessage, setDailyMessage] = useState<DailyMessage | null>(null);
  const [resume, setResume] = useState<ResumeInfo | null>(null);
  const [resumeLoading, setResumeLoading] = useState(true);

  const [mood, setMood] = useState<MoodValue | null>(null);
  const [savingMood, setSavingMood] = useState(false);
  const [moodError, setMoodError] = useState<string | null>(null);

  const accionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    getSummary(token).then(setSummary).catch(() => setSummary({ streakDays: 0, photosThisMonth: 0, monthsWithUs: 0 }));

    getTodayEntry(token)
      .then((e) => {
        setTodayEntry(e ?? null);
        if (e) setMood(e.mood as MoodValue);
      })
      .catch(() => setTodayEntry(null));

    listMySubscriptions(token).then(setSubscriptions).catch(() => setSubscriptions([]));

    fetchTodayMessage()
      .then(setDailyMessage)
      .catch(() =>
        setDailyMessage({
          id: null,
          phrase: "No estás sola en esto.",
          body: "Mente, cuerpo y emoción, en un mismo lugar. No reemplaza a tus doctores: te ayuda a llegar a esa consulta con todo más claro.",
        })
      );

    fetchCourses(token)
      .then((list) => {
        setCourses(list);
        const current = list.find((c) => c.progressPercent !== null && c.progressPercent > 0 && c.progressPercent < 100);
        if (!current) {
          setResume(null);
          setResumeLoading(false);
          return;
        }
        fetchCourseDetail(current.slug, token)
          .then((detail) => setResume(computeResume(detail, current.slug)))
          .catch(() => setResume(null))
          .finally(() => setResumeLoading(false));
      })
      .catch(() => {
        setCourses([]);
        setResumeLoading(false);
      });
  }, [status, token]);

  async function handleGuardarMood() {
    if (status !== "authenticated" || mood === null) return;
    setSavingMood(true);
    setMoodError(null);
    try {
      const saved = await saveEntry(token, todayLocalIso(), mood, "");
      setTodayEntry(saved);
      const freshSummary = await getSummary(token);
      setSummary(freshSummary);
    } catch (err) {
      setMoodError(err instanceof ApiError ? err.message : "No pudimos guardar tu registro.");
    } finally {
      setSavingMood(false);
    }
  }

  function scrollToAccion() {
    accionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const loading =
    summary === null ||
    todayEntry === undefined ||
    subscriptions === null ||
    courses === null ||
    resumeLoading ||
    dailyMessage === null;

  if (loading) {
    return (
      <div className="mx-auto grid w-full max-w-[1080px] gap-8 xl:max-w-[1240px]">
        <Skeleton className="h-[90px] w-full rounded-card-lg" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <Skeleton className="h-[290px] w-full rounded-card-lg" />
          <Skeleton className="h-[290px] w-full rounded-card-lg" />
        </div>
        <Skeleton className="h-[122px] w-full rounded-card-lg" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[208px] w-full rounded-card-md" />
          ))}
        </div>
      </div>
    );
  }

  // Sin fotos este mes ni racha activa, y ningun curso en progreso: alguien
  // recien llegando (ver docs/design del rediseno /dashboard, regla dura
  // "nunca mostrar un contador en 0" -- este flag conmuta esos contadores
  // por una invitacion en vez de mostrarlos vacios).
  const isNew = summary.streakDays === 0 && summary.photosThisMonth === 0 && resume === null;

  const now = new Date();
  const diaDelMes = now.getDate();
  const mesLabel = new Intl.DateTimeFormat("es-CL", { month: "long" }).format(now);
  const pctFotos = Math.min(100, Math.round((summary.photosThisMonth / diaDelMes) * 100));

  const current = subscriptions[0] ?? null;
  const badgeSuscripcion = current?.status === "ACTIVE" ? current.planName : current?.status === "TRIAL" ? "Trial" : "Sin plan";
  const toneSuscripcion = current?.status === "ACTIVE" ? "gradient" : current?.status === "TRIAL" ? "accent" : "neutral";

  const moodCta = mood === null ? "Registrar cómo estoy hoy" : savingMood ? "Guardando…" : "Guardar mi registro de hoy";
  const streakPercent = Math.min(100, (summary.streakDays / 30) * 100);

  return (
    <div className="mx-auto grid w-full max-w-[1080px] gap-8 xl:max-w-[1240px]">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-h4-label text-navy/50">{todayEyebrow()}</p>
          <h1 className="mt-1.5 text-h3-lg text-navy">
            {timeGreeting()}, {firstName}
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="outline" href="/progress">
            Ver mi progreso
          </Button>
          <Button variant="gradient" onClick={scrollToAccion}>
            Registrar cómo estoy hoy
          </Button>
        </div>
      </header>

      <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <section className="relative flex min-h-[290px] flex-col justify-center overflow-hidden rounded-card-lg bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] px-10 py-9 text-white shadow-[0_28px_60px_-14px_rgba(96,73,141,0.4),0_8px_20px_-6px_rgba(43,61,79,0.22)]">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "radial-gradient(120% 90% at 6% 0%, rgba(255,255,255,.32), transparent 58%)" }}
          />
          <Image
            aria-hidden
            src="/images/adornos/adorno-rama.png"
            alt=""
            width={290}
            height={290}
            className="pointer-events-none absolute -bottom-11 -right-[34px] w-[290px] opacity-30 mix-blend-soft-light"
          />
          <div className="relative">
            <p className="flex items-center gap-2 text-h4-label text-cream/80">
              <Sparkles size={14} /> Mensaje del día
            </p>
            <h2 className="mt-4 max-w-[560px] text-[44px] font-black italic leading-[1.05] tracking-tight text-pretty drop-shadow-sm">
              {dailyMessage.phrase}
            </h2>
            <p className="mt-3.5 max-w-[470px] text-p-body leading-relaxed text-white/92 text-pretty">
              {dailyMessage.body}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-pill border border-cream/40 px-3.5 py-2.5 text-p-caption text-cream/80">
                <Heart size={13} /> Fundación Pelo a Pelo
              </span>
            </div>
          </div>
        </section>

        {isNew ? (
          <section ref={accionRef} className="flex flex-col gap-[18px] rounded-card-lg border border-navy/10 bg-white p-[26px] shadow-sm">
            <div>
              <p className="text-h4-label text-navy/50">Primeros pasos</p>
              <p className="mt-2 text-h3-sm text-navy text-pretty">Empecemos por hoy. Toma menos de un minuto.</p>
            </div>
            <ProgressBar percent={33} />
            <p className="-mt-2.5 text-p-caption text-navy/50">1 de 3 pasos listos</p>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-pill bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] text-white">
                  <Check size={14} />
                </span>
                <span className="text-p-small text-navy/50 line-through">Crear tu cuenta</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-pill border-2 border-dashed border-accent/25 text-accent">
                  <Camera size={13} />
                </span>
                <span className="text-p-small font-semibold text-navy">Subir tu primera foto</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-pill border border-navy/10 text-navy/50">
                  <Heart size={13} />
                </span>
                <span className="text-p-small text-navy/70">Registrar cómo estás hoy</span>
              </div>
            </div>
            <div className="mt-auto flex flex-col gap-2.5">
              <Button variant="gradient" href="/progress" className="w-full">
                Subir mi primera foto
              </Button>
              <p className="text-center text-p-caption text-navy/50">
                Nadie más ve tus fotos. No hay respuestas correctas.
              </p>
            </div>
          </section>
        ) : (
          <section ref={accionRef} className="flex flex-col gap-[18px] rounded-card-lg border border-navy/10 bg-white p-[26px] shadow-sm">
            <div className="flex items-center gap-4">
              <RadialProgress value={streakPercent} size={72} strokeWidth={7}>
                <div className="text-center leading-none">
                  <p className="text-[23px] font-black tabular-nums text-navy">{summary.streakDays}</p>
                  <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-navy/50">Días</p>
                </div>
              </RadialProgress>
              <div className="min-w-0">
                <p className="text-p-body font-semibold text-navy">
                  Llevas {summary.streakDays} {summary.streakDays === 1 ? "día" : "días"} registrando tu ánimo
                </p>
                <p className="mt-1 text-p-small leading-relaxed text-navy/60 text-pretty">
                  Solo estar presente ya es avanzar.
                </p>
              </div>
            </div>
            <div className="border-t border-navy/10 pt-4">
              <p className="mb-2.5 text-p-small font-semibold text-navy">¿Cómo estás hoy?</p>
              <MoodPicker value={mood} onChange={setMood} size={38} showLabels={false} />
            </div>
            <div className="mt-auto">
              {moodError && <p className="mb-2 text-p-caption text-coral">{moodError}</p>}
              <Button
                variant="gradient"
                className="w-full"
                disabled={mood === null || savingMood}
                onClick={handleGuardarMood}
              >
                {moodCta}
              </Button>
            </div>
          </section>
        )}
      </div>

      <section className="flex flex-wrap items-center gap-[22px] rounded-card-lg border border-navy/10 bg-white p-[18px] pl-[18px] shadow-sm">
        <Image
          src={resume?.coverImageUrl ?? "/images/courses/proyecto-crecimiento.jpg"}
          alt=""
          width={130}
          height={86}
          unoptimized={!!resume?.coverImageUrl}
          className="h-[86px] w-[130px] shrink-0 rounded-icon object-cover"
        />
        <div className="min-w-[220px] flex-1">
          <p className="text-h4-label text-navy/50">{resume ? "Continúa donde quedaste" : "Sugerido para empezar"}</p>
          <p className="mt-1 text-h3-sm text-navy">{resume ? resume.courseTitle : "Proyecto Crecimiento"}</p>
          <p className="mt-1 mb-2.5 text-p-small text-navy/60">
            {resume ? `Lección ${resume.lessonIndex} · ${resume.lessonTitle}` : "8 lecciones cortas · 10 min cada una"}
          </p>
          <ProgressBar percent={resume ? Math.round((resume.completedLessons / resume.totalLessons) * 100) : 0} />
          <p className="mt-1.5 text-p-caption text-navy/50">
            {resume
              ? `${resume.completedLessons} de ${resume.totalLessons} lecciones · ${resume.remainingMinutes} min restantes`
              : "Aún no lo empiezas"}
          </p>
        </div>
        <Button variant="solid" href={resume ? `/courses/${resume.courseSlug}/${resume.lessonSlug}` : "/courses"}>
          {resume ? "Continuar" : "Comenzar"}
        </Button>
      </section>

      <section className="grid gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-h4-label text-navy/50">Tu espacio</p>
            <h2 className="mt-1.5 text-h3-md text-navy">Explora</h2>
          </div>
          <p className="text-p-small text-navy/50">
            {isNew ? "5 secciones · 2 disponibles ahora" : "5 secciones · 2 con avance"}
          </p>
        </div>

        <div className="pap-explora-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            className="pap-explora-a"
            icon={Camera}
            badge={summary.photosThisMonth === 0 ? "Empieza aquí" : "Al día"}
            badgeTone="accent"
            title="Seguimiento de Progreso"
            description="Sube una foto y cuéntanos cómo estuvo tu día"
            href="/progress"
            image="/images/dashboard/card-progreso.png"
            progress={summary.photosThisMonth === 0 ? undefined : pctFotos}
            progressLabel={
              summary.photosThisMonth === 0
                ? undefined
                : `${summary.photosThisMonth} de ${diaDelMes} registros de ${mesLabel}`
            }
          />
          <DashboardCard
            className="pap-explora-c"
            icon={BookOpen}
            badge={resume ? "En curso" : `${courses.length} cursos`}
            badgeTone="accent"
            title="Cursos"
            description="Ansiedad, cuerpo y crecimiento personal, a tu ritmo"
            href="/courses"
            image="/images/dashboard/card-cursos.png"
            progress={resume ? Math.round((resume.completedLessons / resume.totalLessons) * 100) : undefined}
            progressLabel={resume ? `${resume.completedLessons} de ${resume.totalLessons} lecciones · ${resume.courseTitle}` : undefined}
          />
          {/* Protagonista de la grilla (ago 2026, a pedido: "la card de
              agendamiento debe ser la mas grande y central") -- ver
              ".pap-explora-hero" en globals.css: ocupa la columna central en
              2 filas desde lg, con el tratamiento "featured" (degradado de
              marca) de DashboardCard. */}
          <DashboardCard
            className="pap-explora-hero"
            featured
            icon={Heart}
            iconImage="/images/icons/agenda-terapeuta-icono.png"
            badge="Nuevo"
            title="Agenda con Terapeuta"
            description="Una hora para ti, con alguien que sabe escuchar"
            href="/therapist"
            image="/images/dashboard/card-terapeuta.png"
          />
          <DashboardCard
            className="pap-explora-b"
            icon={CreditCard}
            badge={badgeSuscripcion}
            badgeTone={toneSuscripcion}
            title="Mi Suscripción"
            description="Revisa tu plan y tus pagos cuando quieras"
            href="/subscription"
            image="/images/dashboard/card-suscripcion.png"
          />
          <DashboardCard
            className="pap-explora-d"
            icon={Sparkles}
            badge="Premium"
            title="Programa de 3 Meses"
            description="Un viaje guiado de ansiedad, acompañado por una coach"
            href="/planes"
            image="/images/dashboard/card-programa.png"
          />
        </div>
      </section>
    </div>
  );
}

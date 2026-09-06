"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Clock3, BookOpen, Sprout, Bookmark, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchCourses, saveCourse, unsaveCourse, type CourseSummary } from "@/lib/api/courses";
import { COURSE_LEVEL_LABEL } from "@/lib/data/courseLevels";
import ProgressBar from "@/components/shared/ProgressBar";
import CourseCardSkeleton from "@/components/courses/CourseCardSkeleton";

type Tab = "all" | "completed" | "saved";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "Cursos" },
  { id: "completed", label: "Completados" },
  { id: "saved", label: "Guardados" },
];

export default function CoursesPage() {
  const { token, status, user } = useAuth();
  const [courses, setCourses] = useState<CourseSummary[] | null>(null);
  const [tab, setTab] = useState<Tab>("all");
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);

  // Optimizacion de tiempos de carga (ago 2026, a pedido): antes esto
  // esperaba a que useAuth() resolviera ("if status === loading return")
  // antes de recien arrancar a pedir los cursos -- dos requests en cascada
  // (primero /api/auth/me, despues /api/courses) cuando podian salir en
  // paralelo. GET /api/courses es publico y siempre responde (con o sin
  // token, ver fetchCourses) -- se pide de inmediato con el token que haya
  // en ese momento (null mientras el auth esta cargando), y se vuelve a
  // pedir solo si el token cambia (ej. termina de resolver la sesion) para
  // traer progressPercent/saved personalizados.
  useEffect(() => {
    fetchCourses(token)
      .then(setCourses)
      .catch(() => setCourses([]));
  }, [token]);

  const visibleCourses = useMemo(() => {
    if (!courses) return null;
    if (tab === "completed") return courses.filter((c) => c.progressPercent === 100);
    if (tab === "saved") return courses.filter((c) => c.saved);
    return courses;
  }, [courses, tab]);

  async function toggleSaved(course: CourseSummary) {
    if (!courses || pendingSlug) return;
    setPendingSlug(course.slug);
    const nextSaved = !course.saved;
    // Optimista: refleja el cambio de inmediato, revierte si falla la request.
    setCourses(courses.map((c) => (c.slug === course.slug ? { ...c, saved: nextSaved } : c)));
    try {
      await (nextSaved ? saveCourse(token, course.slug) : unsaveCourse(token, course.slug));
    } catch {
      setCourses((prev) =>
        prev ? prev.map((c) => (c.slug === course.slug ? { ...c, saved: course.saved } : c)) : prev
      );
    } finally {
      setPendingSlug(null);
    }
  }

  const emptyMessage: Record<Tab, string> = {
    all:
      user?.role === "ADMIN"
        ? "Crea el primero desde el panel de administración."
        : "Estamos preparando contenido para acompañarte. Vuelve pronto.",
    completed: "Todavía no has completado ningún curso. Sigue avanzando a tu ritmo.",
    saved: "Todavía no has guardado ningún curso. Usa el ícono de guardado en cada curso para encontrarlos aquí después.",
  };

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-h3-lg text-navy">Tu camino de bienestar 🌱</h1>
      <p className="mt-1 text-p-body text-navy/60">
        Cursos diseñados por profesionales para acompañarte en cada etapa.
      </p>

      <div className="mt-6 flex gap-2 border-b border-navy/10">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-3 py-2.5 text-a-nav font-semibold transition-colors ${
              tab === t.id ? "border-accent text-accent" : "border-transparent text-navy/50 hover:text-navy/80"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {courses === null && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      )}

      {visibleCourses?.length === 0 && (
        <div className="mt-8 rounded-card-lg bg-white p-10 text-center shadow-sm">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Sprout size={20} />
          </span>
          <p className="mt-4 text-h3-sm text-navy">
            {tab === "all" ? "Todavía no hay cursos publicados" : "Nada por aquí todavía"}
          </p>
          <p className="mx-auto mt-1 max-w-sm text-p-body text-navy/60">{emptyMessage[tab]}</p>
          {tab === "all" && user?.role === "ADMIN" && (
            <Link
              href="/admin/courses"
              className="mt-5 inline-block rounded-pill bg-navy px-5 py-2.5 text-a-inline font-semibold text-cream"
            >
              Ir al panel de cursos
            </Link>
          )}
        </div>
      )}

      {visibleCourses && visibleCourses.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCourses.map((course) => (
            <div key={course.id} className="group relative overflow-hidden rounded-card-lg bg-white shadow-sm transition-shadow hover:shadow-md">
              <Link href={`/courses/${course.slug}`} className="block">
                {/* Imagen dominante (ago 2026, a pedido: "que la card sea dominada por
                    la imagen, no por el texto") -- mismo aspect-[16/10] que las cards
                    de /admin/courses (ver CourseCardSkeleton), en vez del h-36 fijo
                    que dejaba la foto como una franja chica arriba de un bloque de
                    texto mas alto que ella. */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))]">
                  {course.coverImageUrl && (
                    <Image
                      src={course.coverImageUrl}
                      alt=""
                      fill
                      unoptimized
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <span className="absolute left-3 top-3 rounded-pill bg-white/90 px-2.5 py-1 text-p-small font-semibold text-navy">
                    {COURSE_LEVEL_LABEL[course.level]}
                  </span>
                  {course.progressPercent === 100 && (
                    <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-pill bg-white/90 px-2.5 py-1 text-p-small font-semibold text-accent">
                      <CheckCircle2 size={12} /> Completado
                    </span>
                  )}
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-accent shadow-sm transition-transform duration-300 group-hover:scale-110">
                      <Play size={17} />
                    </span>
                  </span>
                </div>
                {/* Texto compacto a proposito: el titulo y el avance son lo unico
                    que hace falta para decidir si entrar -- la descripcion larga se
                    saco de la card (se sigue viendo completa en /courses/[slug]),
                    asi la foto queda como el elemento dominante de la tarjeta. */}
                <div className="p-4">
                  <p className="text-h3-sm text-navy line-clamp-1">{course.title}</p>
                  <div className="mt-2 flex items-center gap-3.5 text-p-small text-navy/75">
                    <span className="flex items-center gap-1">
                      <Clock3 size={13} /> {course.durationMinutes} min
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={13} /> {course.lessonCount} lecciones
                    </span>
                  </div>
                  {course.progressPercent !== null && (
                    <div className="mt-2.5">
                      <div className="mb-1 flex items-center justify-between text-p-caption text-navy/75">
                        <span>Tu avance</span>
                        <span className="font-semibold text-accent">{course.progressPercent}%</span>
                      </div>
                      <ProgressBar percent={course.progressPercent} />
                    </div>
                  )}
                </div>
              </Link>

              {status === "authenticated" && (
                <button
                  type="button"
                  onClick={() => toggleSaved(course)}
                  disabled={pendingSlug === course.slug}
                  aria-label={course.saved ? "Quitar de guardados" : "Guardar curso"}
                  aria-pressed={course.saved}
                  className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition-colors disabled:opacity-60 ${
                    course.saved ? "bg-accent text-cream" : "bg-white/90 text-navy/60 hover:text-accent"
                  }`}
                >
                  <Bookmark size={16} fill={course.saved ? "currentColor" : "none"} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

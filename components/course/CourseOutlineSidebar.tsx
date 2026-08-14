"use client";

// Panel de contenidos del curso -- inspirado en el sidebar persistente de
// AWS Skill Builder (ver capturas de referencia, ago 2026): header en el
// degradado de marca con el titulo del curso y el avance, y debajo los
// modulos colapsables con la lista de lecciones y su estado (completada /
// en curso / pendiente). Columna fija en pantallas lg+, panel deslizable en
// mobile (ver comentario mas abajo en el JSX).
//
// Ago 2026 (segunda vuelta, a pedido): el circulo de cada leccion ahora es
// clickeable -- marca/desmarca completada sin salir de la pagina en la que
// estas. El circulo de un MODULO, en cambio, no es un toggle real: no existe
// un estado "modulo completado" en el backend, se deriva de si todas sus
// lecciones lo estan. Clickearlo cuando falta alguna muestra una advertencia
// en vez de intentar completarlo (no hay nada que marcar de un solo click a
// proposito: forzar a pasar por cada leccion es parte del diseño del curso).
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronDown, Circle, Clock3, FileText, PlayCircle, X } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { completeLesson, uncompleteLesson, type LessonSummary } from "@/lib/api/courses";
import { useCourseOutline } from "./CourseOutlineContext";
import Collapse from "@/components/shared/Collapse";

export default function CourseOutlineSidebar({
  activeLessonSlug,
  open,
  onClose,
}: {
  activeLessonSlug: string;
  open: boolean;
  onClose: () => void;
}) {
  const { course, refresh } = useCourseOutline();
  const { token } = useAuth();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const initialized = useRef(false);
  const [togglingLessonId, setTogglingLessonId] = useState<string | null>(null);
  const [warningModuleId, setWarningModuleId] = useState<string | null>(null);
  const warningTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!course || course === "not-found") return;
    const activeModuleId = course.modules.find((m) => m.lessons.some((l) => l.slug === activeLessonSlug))?.id;

    setCollapsed((prev) => {
      if (!initialized.current) {
        initialized.current = true;
        return new Set(course.modules.filter((m) => m.id !== activeModuleId).map((m) => m.id));
      }
      if (activeModuleId && prev.has(activeModuleId)) {
        const next = new Set(prev);
        next.delete(activeModuleId);
        return next;
      }
      return prev;
    });
  }, [course, activeLessonSlug]);

  useEffect(() => {
    return () => {
      if (warningTimeout.current) clearTimeout(warningTimeout.current);
    };
  }, []);

  function toggleModule(id: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleToggleLesson(lesson: LessonSummary) {
    if (togglingLessonId) return;
    setTogglingLessonId(lesson.id);
    try {
      if (lesson.completed) {
        await uncompleteLesson(token, lesson.id);
      } else {
        await completeLesson(token, lesson.id);
      }
      refresh();
    } finally {
      setTogglingLessonId(null);
    }
  }

  function handleModuleCircleClick(moduleId: string, moduleComplete: boolean) {
    // Ya completo: no hay nada que hacer (es un estado derivado, no un
    // toggle -- desmarcar el modulo entero de un click seria demasiado
    // destructivo para una sola pulsacion accidental).
    if (moduleComplete) return;
    setWarningModuleId(moduleId);
    if (warningTimeout.current) clearTimeout(warningTimeout.current);
    warningTimeout.current = setTimeout(() => setWarningModuleId(null), 3200);
  }

  return (
    <>
      {/* Backdrop solo tiene sentido en mobile (<lg): en desktop el sidebar
          ya es una columna fija, no un overlay, asi que no hay nada que
          oscurecer detras. */}
      {open && (
        <button
          type="button"
          aria-label="Cerrar contenido del curso"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-navy/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[19rem] max-w-[85vw] flex-col overflow-y-auto bg-white shadow-xl transition-transform duration-200 lg:sticky lg:top-0 lg:z-0 lg:h-screen lg:w-[300px] lg:max-w-none lg:translate-x-0 lg:border-r lg:border-navy/10 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] p-6 text-cream">
          <div className="flex items-center justify-between">
            <Link href="/courses" className="inline-flex items-center gap-1 text-a-inline font-semibold text-cream/80 hover:text-cream">
              <ArrowLeft size={14} /> Aprender
            </Link>
            <button type="button" onClick={onClose} aria-label="Cerrar" className="text-cream/80 hover:text-cream lg:hidden">
              <X size={20} />
            </button>
          </div>

          {(!course || course === "not-found") && (
            <div className="mt-5 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded-pill bg-cream/20" />
              <div className="h-2 w-full animate-pulse rounded-pill bg-cream/20" />
            </div>
          )}

          {course && course !== "not-found" && (
            <>
              <p className="mt-4 text-h3-sm text-cream">{course.title}</p>

              {course.progressPercent !== null && (
                <div className="mt-3">
                  <div className="mb-1.5 flex items-center justify-between text-p-caption text-cream/80">
                    <span>Tu avance</span>
                    <span className="font-semibold text-cream">{course.progressPercent}% completo</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-pill bg-cream/20">
                    <div
                      className="h-full rounded-pill bg-cream transition-all"
                      style={{ width: `${Math.min(100, Math.max(0, course.progressPercent))}%` }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {course && course !== "not-found" && (
          <nav className="flex-1 space-y-1 p-4">
            {course.modules.map((module) => {
              const isCollapsed = collapsed.has(module.id);
              const moduleComplete = module.lessons.length > 0 && module.lessons.every((l) => l.completed);

              return (
                <div key={module.id}>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleModuleCircleClick(module.id, moduleComplete)}
                      aria-label={
                        moduleComplete
                          ? `Módulo "${module.title}" completo`
                          : `Módulo "${module.title}" incompleto -- completa todas sus lecciones`
                      }
                      className="shrink-0 rounded-full p-0.5 hover:bg-navy/5"
                    >
                      {moduleComplete ? (
                        <CheckCircle2 size={15} className="shrink-0 text-accent" />
                      ) : (
                        <span className="block h-[15px] w-[15px] shrink-0 rounded-full border-2 border-navy/20" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleModule(module.id)}
                      className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-card-md px-2 py-2 text-left hover:bg-navy/5"
                      aria-expanded={!isCollapsed}
                    >
                      <span className="truncate text-p-small font-semibold text-navy">{module.title}</span>
                      <ChevronDown
                        size={15}
                        className={`shrink-0 text-navy/40 transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
                      />
                    </button>
                  </div>

                  <Collapse open={warningModuleId === module.id}>
                    <p className="mx-2 mb-1 rounded-card-md bg-coral-soft px-2.5 py-1.5 text-p-caption text-coral">
                      Completa todas las lecciones de este módulo para marcarlo como listo.
                    </p>
                  </Collapse>

                  <Collapse open={!isCollapsed}>
                    <div className="ml-[7px] space-y-0.5 border-l border-navy/10 py-1 pl-4">
                      {module.lessons.length === 0 && (
                        <p className="py-2 text-p-caption text-navy/40">Sin lecciones todavía.</p>
                      )}
                      {module.lessons.map((lesson) => {
                        const isActive = lesson.slug === activeLessonSlug;
                        const TypeIcon = lesson.hasVideo ? PlayCircle : FileText;
                        return (
                          <div
                            key={lesson.id}
                            className={`flex items-start gap-1.5 rounded-card-md pr-1 transition-colors ${
                              isActive ? "bg-accent/10" : "hover:bg-navy/5"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => handleToggleLesson(lesson)}
                              disabled={togglingLessonId === lesson.id}
                              aria-label={
                                lesson.completed
                                  ? `Marcar "${lesson.title}" como pendiente`
                                  : `Marcar "${lesson.title}" como completada`
                              }
                              className="mt-2 shrink-0 rounded-full p-0.5 hover:bg-navy/10 disabled:opacity-40"
                            >
                              {lesson.completed ? (
                                <CheckCircle2 size={15} className="shrink-0 text-accent" />
                              ) : isActive ? (
                                // Leccion actual, todavia sin marcar completada: un
                                // anillo del color de acento (en vez del gris
                                // generico) para que se note de un vistazo donde
                                // estas parada dentro de la lista, como el
                                // indicador "en curso" del sidebar de AWS Skill
                                // Builder.
                                <Circle size={15} className="shrink-0 text-accent" strokeWidth={2.5} />
                              ) : (
                                <Circle size={15} className="shrink-0 text-navy/20" />
                              )}
                            </button>
                            <Link
                              href={`/courses/${course.slug}/${lesson.slug}`}
                              onClick={onClose}
                              className={`min-w-0 flex-1 rounded-card-md px-1.5 py-2 text-p-small ${
                                isActive ? "font-semibold text-accent" : "text-navy/75"
                              }`}
                            >
                              <span className="block">{lesson.title}</span>
                              <span className="mt-0.5 flex items-center gap-2 text-p-caption text-navy/45">
                                <TypeIcon size={11} />
                                <span className="flex items-center gap-1">
                                  <Clock3 size={11} /> {lesson.durationMinutes} min
                                </span>
                              </span>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </Collapse>
                </div>
              );
            })}
          </nav>
        )}
      </aside>
    </>
  );
}

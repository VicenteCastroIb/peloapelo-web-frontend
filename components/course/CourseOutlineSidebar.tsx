"use client";

// Panel de contenidos del curso -- inspirado en el panel lateral de AWS
// Skill Builder: titulo del curso, avance general, modulos colapsables y la
// lista completa de lecciones con su estado (completada / pendiente). Ya no
// es un sidebar persistente (eso ocupaba espacio horizontal permanente y
// duplicaba la navegacion del header, ver LessonImmersiveHeader) -- ahora es
// un panel deslizable que se abre desde el boton "Contenido del curso" del
// header, a cualquier tamano de pantalla, dejando todo el ancho disponible
// para el contenido de la leccion. Colores y tipografia son los de Pelo a
// Pelo (ver globals.css), no los de AWS.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronDown, Circle, Clock3, FileText, PlayCircle, X } from "lucide-react";
import { useCourseOutline } from "./CourseOutlineContext";
import ProgressBar from "@/components/shared/ProgressBar";

export default function CourseOutlineSidebar({
  activeLessonSlug,
  open,
  onClose,
}: {
  activeLessonSlug: string;
  open: boolean;
  onClose: () => void;
}) {
  const { course } = useCourseOutline();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const initialized = useRef(false);

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

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Cerrar contenido del curso"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-navy/30"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[19rem] max-w-[85vw] flex-col overflow-y-auto bg-white p-6 shadow-xl transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-h4-label text-navy/50">Contenido del curso</p>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-navy/50">
            <X size={20} />
          </button>
        </div>

        <Link href="/courses" className="mt-3 inline-flex items-center gap-1 text-a-inline font-semibold text-navy/60">
          <ArrowLeft size={14} /> Aprender
        </Link>

        {(!course || course === "not-found") && (
          <div className="mt-5 space-y-2">
            <div className="h-4 w-3/4 animate-pulse rounded-pill bg-navy/10" />
            <div className="h-2 w-full animate-pulse rounded-pill bg-navy/10" />
          </div>
        )}

        {course && course !== "not-found" && (
          <>
            <p className="mt-4 text-h3-sm text-navy">{course.title}</p>

            {course.progressPercent !== null && (
              <div className="mt-3">
                <div className="mb-1.5 flex items-center justify-between text-p-caption text-navy/50">
                  <span>Tu avance</span>
                  <span className="font-semibold text-accent">{course.progressPercent}% completo</span>
                </div>
                <ProgressBar percent={course.progressPercent} />
              </div>
            )}

            <nav className="mt-6 space-y-1">
              {course.modules.map((module) => {
                const isCollapsed = collapsed.has(module.id);
                const moduleComplete = module.lessons.length > 0 && module.lessons.every((l) => l.completed);

                return (
                  <div key={module.id}>
                    <button
                      type="button"
                      onClick={() => toggleModule(module.id)}
                      className="flex w-full items-center justify-between gap-2 rounded-card-md px-2 py-2 text-left hover:bg-navy/5"
                      aria-expanded={!isCollapsed}
                    >
                      <span className="flex min-w-0 items-center gap-2 text-p-small font-semibold text-navy">
                        {moduleComplete ? (
                          <CheckCircle2 size={15} className="shrink-0 text-accent" />
                        ) : (
                          <span className="h-[15px] w-[15px] shrink-0 rounded-full border-2 border-navy/20" />
                        )}
                        <span className="truncate">{module.title}</span>
                      </span>
                      <ChevronDown
                        size={15}
                        className={`shrink-0 text-navy/40 transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
                      />
                    </button>

                    {!isCollapsed && (
                      <div className="ml-[7px] space-y-0.5 border-l border-navy/10 py-1 pl-4">
                        {module.lessons.length === 0 && (
                          <p className="py-2 text-p-caption text-navy/40">Sin lecciones todavía.</p>
                        )}
                        {module.lessons.map((lesson) => {
                          const isActive = lesson.slug === activeLessonSlug;
                          const TypeIcon = lesson.hasVideo ? PlayCircle : FileText;
                          return (
                            <Link
                              key={lesson.id}
                              href={`/courses/${course.slug}/${lesson.slug}`}
                              onClick={onClose}
                              className={`flex items-start gap-2 rounded-card-md px-2.5 py-2 text-p-small transition-colors ${
                                isActive ? "bg-accent/10 font-semibold text-accent" : "text-navy/75 hover:bg-navy/5"
                              }`}
                            >
                              {lesson.completed ? (
                                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-accent" />
                              ) : (
                                <Circle size={15} className="mt-0.5 shrink-0 text-navy/20" />
                              )}
                              <span className="min-w-0 flex-1">
                                <span className="block">{lesson.title}</span>
                                <span className="mt-0.5 flex items-center gap-2 text-p-caption text-navy/45">
                                  <TypeIcon size={11} />
                                  <span className="flex items-center gap-1">
                                    <Clock3 size={11} /> {lesson.durationMinutes} min
                                  </span>
                                </span>
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </>
        )}
      </aside>
    </>
  );
}

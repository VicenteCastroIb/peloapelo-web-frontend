"use client";

import { BookOpen, Clock3, Image as ImageIcon, Video } from "lucide-react";
import type { AdminCourseModule, LessonRequest } from "@/lib/api/adminCourses";

export interface ActiveLessonDraft {
  moduleId: string;
  moduleTitle: string;
  /** null = leccion nueva, todavia no creada -- se agrega como fila extra al final de su modulo. */
  lessonId: string | null;
  lesson: LessonRequest;
}

interface PreviewRow {
  id: string;
  title: string;
  summary: string;
  durationMinutes: number;
  hasVideo: boolean;
  hasImage: boolean;
  isDraft: boolean;
}

// Vista previa en vivo de MODULOS Y LECCIONES (fase 5, ago 2026: recortada
// de su version original, que tambien mostraba portada/titulo/descripcion
// del curso -- eso ahora lo cubre CourseHeaderPreview.tsx dentro del lienzo
// de bloques de admin/courses/[id]/page.tsx, asi que mostrarlo aca tambien
// era pura redundancia). Lo que queda es lo unico que el lienzo de bloques
// NO puede cubrir: modulos y lecciones son estructura editada por
// formulario (ModuleEditor/LessonEditor), no bloques -- esta vista es su
// unica forma de verse "tal como van a quedar" mientras se editan.
//
// Las lecciones SI se guardan de inmediato al confirmar cada una (ver
// LessonEditor.tsx) -- por eso `modules` son los datos reales del curso (se
// actualizan solos cada vez que se guarda algo) y solo `activeDraft` es un
// borrador de verdad: la UNICA leccion que se esta escribiendo en este
// momento (acordeon abierto), para que esa fila puntual se sienta "en vivo"
// mientras se tipea, igual que el resto del panel.
export default function LiveCoursePreview({
  modules,
  activeDraft,
}: {
  modules: AdminCourseModule[];
  activeDraft?: ActiveLessonDraft | null;
}) {
  const sortedModules = [...modules].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="rounded-card-lg border border-navy/10 bg-white shadow-sm">
      <div className="flex items-center gap-2 rounded-t-card-lg border-b border-navy/10 bg-navy/5 px-4 py-2.5 text-p-caption font-semibold text-navy/60">
        <BookOpen size={14} />
        Módulos y lecciones
      </div>

      <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-6 py-6">
        {sortedModules.length === 0 ? (
          <p className="rounded-card-lg border border-navy/10 bg-cream p-6 text-center text-p-body text-navy/60">
            Todavía no agregaste módulos.
          </p>
        ) : (
          <div className="space-y-6">
            {sortedModules.map((module) => {
              const rows: PreviewRow[] = [...module.lessons]
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((lesson) => {
                  const isActive = activeDraft?.lessonId === lesson.id;
                  const source = isActive ? activeDraft!.lesson : lesson;
                  return {
                    id: lesson.id,
                    title: source.title,
                    summary: source.summary ?? "",
                    durationMinutes: source.durationMinutes,
                    hasVideo: !!source.videoUrl,
                    hasImage: !!source.imageUrl,
                    isDraft: isActive,
                  };
                });

              // Leccion nueva todavia sin guardar (acordeon "Agregar leccion"
              // abierto en este modulo): se agrega como fila extra al final,
              // asi se ve donde va a caer apenas se confirme.
              if (activeDraft && activeDraft.lessonId === null && activeDraft.moduleId === module.id) {
                rows.push({
                  id: "draft-new",
                  title: activeDraft.lesson.title || "Nueva lección",
                  summary: activeDraft.lesson.summary ?? "",
                  durationMinutes: activeDraft.lesson.durationMinutes,
                  hasVideo: !!activeDraft.lesson.videoUrl,
                  hasImage: !!activeDraft.lesson.imageUrl,
                  isDraft: true,
                });
              }

              return (
                <div key={module.id}>
                  <h2 className="text-h3-md text-navy">{module.title}</h2>
                  {module.description && <p className="mt-0.5 text-p-small text-navy/60">{module.description}</p>}

                  <div className="mt-3 space-y-2">
                    {rows.length === 0 && (
                      <p className="rounded-card-md bg-cream px-4 py-3 text-p-caption text-navy/50">
                        Sin lecciones todavía.
                      </p>
                    )}
                    {rows.map((row, i) => (
                      <div
                        key={row.id}
                        className={`flex items-start gap-3 rounded-card-md p-3 text-p-small ${
                          row.isDraft ? "border border-accent/30 bg-accent/5" : "bg-cream"
                        }`}
                      >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy/5 text-p-caption font-semibold text-navy/60">
                          {i + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold text-navy">{row.title || "Sin título"}</span>
                          {row.summary && <span className="mt-0.5 block text-p-caption text-navy/60">{row.summary}</span>}
                          <span className="mt-1 flex items-center gap-3 text-p-caption text-navy/45">
                            <span className="flex items-center gap-1">
                              <Clock3 size={11} /> {row.durationMinutes} min
                            </span>
                            {row.hasVideo && (
                              <span className="flex items-center gap-1">
                                <Video size={11} /> Video
                              </span>
                            )}
                            {row.hasImage && (
                              <span className="flex items-center gap-1">
                                <ImageIcon size={11} /> Imagen
                              </span>
                            )}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

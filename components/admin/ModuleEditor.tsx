"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import {
  updateModule,
  deleteModule,
  updateLesson,
  type AdminCourseModule,
  type ModuleRequest,
  type LessonRequest,
} from "@/lib/api/adminCourses";
import LessonEditor from "@/components/admin/LessonEditor";

const inputClass =
  "mt-1 w-full rounded-card-md border border-navy/15 bg-cream px-3 py-2 text-p-small text-navy outline-none focus:border-accent";

function toLessonRequest(lesson: AdminCourseModule["lessons"][number]): LessonRequest {
  return {
    slug: lesson.slug,
    title: lesson.title,
    videoUrl: lesson.videoUrl ?? "",
    videoOrientation: lesson.videoOrientation,
    imageUrl: lesson.imageUrl ?? "",
    body: lesson.body ?? "",
    objectives: lesson.objectives ?? "",
    summary: lesson.summary ?? "",
    durationMinutes: lesson.durationMinutes,
    published: lesson.published,
    displayOrder: lesson.displayOrder,
  };
}

// Reescrito ago 2026 (a pedido: "la creacion de secciones de cursos debe ser
// simple, con un cambio de orden simple"): antes el titulo/descripcion del
// modulo se guardaban con un boton aparte y el orden de modulo/lecciones se
// escribia a mano en un input numerico -- lo mismo que ya se habia sacado
// del listado de cursos (ver reorderCourses) pero nunca se replico aca
// adentro. Ahora: flechas arriba/abajo (mismo lenguaje visual que
// /admin/courses y /admin/blog) y el titulo se autoguarda al salir del
// campo (onBlur), sin un boton "Guardar modulo" que apretar aparte.
export default function ModuleEditor({
  module,
  token,
  index,
  total,
  onMove,
  moveDisabled,
  onChange,
  onLiveChange,
}: {
  module: AdminCourseModule;
  token: string | null | undefined;
  index: number;
  total: number;
  onMove: (direction: -1 | 1) => void;
  moveDisabled?: boolean;
  onChange: () => void;
  onLiveChange?: (draft: { moduleId: string; moduleTitle: string; lessonId: string | null; lesson: LessonRequest } | null) => void;
}) {
  const [fields, setFields] = useState<ModuleRequest>({
    title: module.title,
    description: module.description ?? "",
    displayOrder: module.displayOrder,
  });
  const [savingModule, setSavingModule] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedLessons = [...module.lessons].sort((a, b) => a.displayOrder - b.displayOrder);

  async function saveModuleField(patch: Partial<ModuleRequest>) {
    const next = { ...fields, ...patch };
    setFields(next);
    if (next.title === module.title && next.description === (module.description ?? "")) return;
    setSavingModule(true);
    setError(null);
    try {
      await updateModule(token, module.id, next);
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el módulo");
    } finally {
      setSavingModule(false);
    }
  }

  async function removeModule() {
    if (!confirm(`¿Eliminar el módulo "${module.title}" y todas sus lecciones?`)) return;
    await deleteModule(token, module.id);
    onChange();
  }

  // Mismo patron que move() en /admin/courses y /admin/blog: swap local del
  // displayOrder de los dos afectados + PUT de ambos (updateLesson ya existe
  // y acepta el LessonRequest completo, asi que no hace falta un endpoint de
  // reorder nuevo para lecciones -- a diferencia de la grilla de cursos/
  // articulos, aca son pocos items por modulo).
  async function moveLesson(lessonIndex: number, direction: -1 | 1) {
    const targetIndex = lessonIndex + direction;
    if (targetIndex < 0 || targetIndex >= sortedLessons.length) return;
    const a = sortedLessons[lessonIndex];
    const b = sortedLessons[targetIndex];
    try {
      await Promise.all([
        updateLesson(token, a.id, { ...toLessonRequest(a), displayOrder: b.displayOrder }),
        updateLesson(token, b.id, { ...toLessonRequest(b), displayOrder: a.displayOrder }),
      ]);
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo reordenar la lección");
    }
  }

  return (
    <div className="rounded-card-lg bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex shrink-0 flex-col pt-1">
          <button
            type="button"
            disabled={index === 0 || moveDisabled}
            onClick={() => onMove(-1)}
            className="rounded p-1.5 text-navy/40 hover:bg-navy/5 disabled:opacity-20"
            aria-label="Mover módulo arriba"
          >
            <ChevronUp size={16} />
          </button>
          <button
            type="button"
            disabled={index === total - 1 || moveDisabled}
            onClick={() => onMove(1)}
            className="rounded p-1.5 text-navy/40 hover:bg-navy/5 disabled:opacity-20"
            aria-label="Mover módulo abajo"
          >
            <ChevronDown size={16} />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-p-caption font-semibold text-navy/60">
              Título del módulo
              <input
                className={inputClass}
                value={fields.title}
                onChange={(e) => setFields({ ...fields, title: e.target.value })}
                onBlur={() => saveModuleField({ title: fields.title })}
              />
            </label>
            <label className="text-p-caption font-semibold text-navy/60">
              Descripción (opcional)
              <input
                className={inputClass}
                value={fields.description}
                onChange={(e) => setFields({ ...fields, description: e.target.value })}
                onBlur={() => saveModuleField({ description: fields.description })}
              />
            </label>
          </div>
          {savingModule && <p className="mt-1 text-p-caption text-navy/40">Guardando…</p>}
        </div>

        <button
          type="button"
          onClick={removeModule}
          className="shrink-0 text-navy/40 hover:text-coral"
          aria-label={`Eliminar módulo ${module.title}`}
        >
          <Trash2 size={15} />
        </button>
      </div>

      {error && <p className="mt-2 text-p-caption text-coral">{error}</p>}

      <div className="mt-4 space-y-2">
        {sortedLessons.length === 0 && !addingLesson && (
          <p className="py-2 text-p-caption text-navy/50">Sin lecciones todavía.</p>
        )}
        {sortedLessons.map((lesson, i) => (
          <LessonEditor
            key={lesson.id}
            moduleId={module.id}
            lesson={lesson}
            token={token}
            index={i}
            total={sortedLessons.length}
            onMove={(direction) => moveLesson(i, direction)}
            onChange={onChange}
            onLiveChange={(draft) =>
              onLiveChange?.(draft ? { moduleId: module.id, moduleTitle: module.title, lessonId: lesson.id, lesson: draft } : null)
            }
          />
        ))}
        {addingLesson && (
          <div className="animate-reveal-in">
            <LessonEditor
              moduleId={module.id}
              lesson={null}
              token={token}
              index={sortedLessons.length}
              total={sortedLessons.length + 1}
              onMove={() => {}}
              onChange={onChange}
              onLiveChange={(draft) =>
                onLiveChange?.(draft ? { moduleId: module.id, moduleTitle: module.title, lessonId: null, lesson: draft } : null)
              }
              startOpen
              onCancelNew={() => setAddingLesson(false)}
            />
          </div>
        )}
      </div>

      {!addingLesson && (
        <button
          type="button"
          onClick={() => setAddingLesson(true)}
          className="mt-3 flex items-center gap-1 text-p-caption font-semibold text-accent"
        >
          <Plus size={14} /> Agregar lección
        </button>
      )}
    </div>
  );
}

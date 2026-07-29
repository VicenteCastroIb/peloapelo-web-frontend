"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Save, Clock3 } from "lucide-react";
import {
  updateModule,
  deleteModule,
  createLesson,
  deleteLesson,
  type AdminCourseModule,
  type ModuleRequest,
  type LessonRequest,
} from "@/lib/api/adminCourses";

const inputClass =
  "mt-1 w-full rounded-card-md border border-navy/15 bg-cream px-3 py-2 text-p-small text-navy outline-none focus:border-accent";

const EMPTY_LESSON: LessonRequest = {
  slug: "",
  title: "",
  videoUrl: "",
  body: "",
  durationMinutes: 0,
  published: false,
  displayOrder: 0,
};

export default function ModuleEditor({
  courseId,
  module,
  token,
  onChange,
}: {
  courseId: string;
  module: AdminCourseModule;
  token: string | null | undefined;
  onChange: () => void;
}) {
  const [fields, setFields] = useState<ModuleRequest>({
    title: module.title,
    description: module.description ?? "",
    displayOrder: module.displayOrder,
  });
  const [savingModule, setSavingModule] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);
  const [newLesson, setNewLesson] = useState<LessonRequest>(EMPTY_LESSON);
  const [savingLesson, setSavingLesson] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveModule() {
    setSavingModule(true);
    setError(null);
    try {
      await updateModule(token, module.id, fields);
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

  async function addLesson(e: React.FormEvent) {
    e.preventDefault();
    setSavingLesson(true);
    setError(null);
    try {
      await createLesson(token, module.id, newLesson);
      setNewLesson(EMPTY_LESSON);
      setAddingLesson(false);
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la lección");
    } finally {
      setSavingLesson(false);
    }
  }

  async function removeLesson(lessonId: string, title: string) {
    if (!confirm(`¿Eliminar la lección "${title}"?`)) return;
    await deleteLesson(token, lessonId);
    onChange();
  }

  return (
    <div className="rounded-card-md bg-white p-5 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <label className="text-p-caption font-semibold text-navy/60">
          Título del módulo
          <input
            className={inputClass}
            value={fields.title}
            onChange={(e) => setFields({ ...fields, title: e.target.value })}
          />
        </label>
        <label className="text-p-caption font-semibold text-navy/60">
          Descripción
          <input
            className={inputClass}
            value={fields.description}
            onChange={(e) => setFields({ ...fields, description: e.target.value })}
          />
        </label>
        <label className="text-p-caption font-semibold text-navy/60">
          Orden
          <input
            type="number"
            className={`${inputClass} w-20`}
            value={fields.displayOrder}
            onChange={(e) => setFields({ ...fields, displayOrder: Number(e.target.value) })}
          />
        </label>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={saveModule}
          disabled={savingModule}
          className="flex items-center gap-1 rounded-pill bg-navy/5 px-3 py-1.5 text-p-caption font-semibold text-navy hover:bg-navy/10 disabled:opacity-50"
        >
          <Save size={13} /> Guardar módulo
        </button>
        <button
          type="button"
          onClick={removeModule}
          className="flex items-center gap-1 rounded-pill px-3 py-1.5 text-p-caption font-semibold text-coral hover:bg-coral-soft"
        >
          <Trash2 size={13} /> Eliminar módulo
        </button>
      </div>

      {error && <p className="mt-2 text-p-caption text-coral">{error}</p>}

      <div className="mt-4 divide-y divide-navy/10 border-t border-navy/10">
        {module.lessons.length === 0 && (
          <p className="py-3 text-p-caption text-navy/50">Sin lecciones todavía.</p>
        )}
        {module.lessons.map((lesson) => (
          <div key={lesson.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-p-small font-semibold text-navy">{lesson.title}</p>
                <span
                  className={`shrink-0 rounded-pill px-2 py-0.5 text-p-caption font-semibold ${
                    lesson.published ? "bg-accent/10 text-accent" : "bg-navy/10 text-navy/50"
                  }`}
                >
                  {lesson.published ? "Publicada" : "Borrador"}
                </span>
              </div>
              <p className="mt-0.5 flex items-center gap-1 text-p-caption text-navy/50">
                <Clock3 size={11} /> {lesson.durationMinutes} min · /{lesson.slug}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Link
                href={`/admin/courses/${courseId}/lessons/${lesson.id}`}
                className="text-p-caption font-semibold text-accent"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => removeLesson(lesson.id, lesson.title)}
                className="text-navy/40 hover:text-coral"
                aria-label={`Eliminar ${lesson.title}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {addingLesson ? (
        <form onSubmit={addLesson} className="mt-4 space-y-3 rounded-card-md bg-cream p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-p-caption font-semibold text-navy/60">
              Título
              <input
                required
                className={inputClass}
                value={newLesson.title}
                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
              />
            </label>
            <label className="text-p-caption font-semibold text-navy/60">
              Slug
              <input
                required
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                className={inputClass}
                value={newLesson.slug}
                onChange={(e) => setNewLesson({ ...newLesson, slug: e.target.value })}
              />
            </label>
            <label className="text-p-caption font-semibold text-navy/60">
              Duración (min)
              <input
                type="number"
                min={0}
                className={inputClass}
                value={newLesson.durationMinutes}
                onChange={(e) => setNewLesson({ ...newLesson, durationMinutes: Number(e.target.value) })}
              />
            </label>
            <label className="text-p-caption font-semibold text-navy/60">
              Orden
              <input
                type="number"
                className={inputClass}
                value={newLesson.displayOrder}
                onChange={(e) => setNewLesson({ ...newLesson, displayOrder: Number(e.target.value) })}
              />
            </label>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={savingLesson}
              className="rounded-pill bg-navy px-4 py-2 text-p-caption font-semibold text-cream disabled:opacity-50"
            >
              {savingLesson ? "Creando…" : "Crear lección"}
            </button>
            <button
              type="button"
              onClick={() => setAddingLesson(false)}
              className="text-p-caption font-semibold text-navy/50"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAddingLesson(true)}
          className="mt-4 flex items-center gap-1 text-p-caption font-semibold text-accent"
        >
          <Plus size={14} /> Agregar lección
        </button>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock3,
  Image as ImageIcon,
  Trash2,
  Video,
} from "lucide-react";
import {
  createLesson,
  updateLesson,
  deleteLesson,
  createLessonBlock,
  updateLessonBlock,
  deleteLessonBlock,
  reorderLessonBlocks,
  type AdminLesson,
  type LessonRequest,
} from "@/lib/api/adminCourses";
import { slugify } from "@/lib/slugify";
import LessonMediaPicker from "@/components/admin/LessonMediaPicker";
import ResourceList from "@/components/admin/ResourceList";
import Collapse from "@/components/shared/Collapse";
import BlockList, { type BlockListApi } from "@/components/admin/blog/BlockList";

// Contenido de la leccion (fase 4 del editor visual, ago 2026): mismo editor
// de bloques que /admin/blog, inyectando el CRUD de lecciones en vez del de
// articulos (ver BlockList.tsx). `body` (texto plano) sigue existiendo como
// fallback -- ver nota en el textarea de abajo.
const LESSON_BLOCK_API: BlockListApi = {
  create: createLessonBlock,
  update: updateLessonBlock,
  remove: deleteLessonBlock,
  reorder: reorderLessonBlocks,
};

const inputClass =
  "mt-1 w-full rounded-card-md border border-navy/15 bg-cream px-3 py-2 text-p-small text-navy outline-none focus:border-accent";

const EMPTY: LessonRequest = {
  slug: "",
  title: "",
  videoUrl: "",
  videoOrientation: "HORIZONTAL",
  imageUrl: "",
  body: "",
  objectives: "",
  summary: "",
  durationMinutes: 0,
  published: false,
  displayOrder: 0,
};

function toRequest(lesson: AdminLesson): LessonRequest {
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

// Una fila = una leccion, colapsada por defecto (acordeon). Reemplaza a
// LessonForm.tsx + la pagina separada /admin/courses/[id]/lessons/[lessonId]
// (ago 2026, a pedido: "quitar tantos scrolls" y que la creacion de
// secciones sea simple) -- antes editar una leccion significaba navegar a
// una pagina nueva y perder de vista el resto del curso; ahora se expande
// en el lugar, sin salir de /admin/courses/[id]. `lesson === null` es el
// modo "agregar leccion nueva": mismo componente, fila que arranca
// expandida y que al guardar se convierte en una fila real (via onChange,
// que recarga el curso completo).
export default function LessonEditor({
  moduleId,
  lesson,
  token,
  index,
  total,
  onMove,
  moveDisabled,
  onChange,
  onLiveChange,
  startOpen,
  onCancelNew,
}: {
  moduleId: string;
  lesson: AdminLesson | null;
  token: string | null | undefined;
  index: number;
  total: number;
  onMove: (direction: -1 | 1) => void;
  moveDisabled?: boolean;
  onChange: () => void;
  onLiveChange?: (draft: LessonRequest | null) => void;
  startOpen?: boolean;
  onCancelNew?: () => void;
}) {
  const isNew = lesson === null;
  const [open, setOpen] = useState(!!startOpen);
  const [values, setValues] = useState<LessonRequest>(lesson ? toRequest(lesson) : EMPTY);
  const [showResources, setShowResources] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reporta el borrador en vivo solo mientras esta fila esta abierta -- el
  // resto de las lecciones (cerradas) se ven en la preview con su ultimo
  // dato guardado, que es lo que ya muestra `course.modules` en la pagina
  // padre. Al cerrar o desmontar, limpia el borrador para no dejar la
  // preview mostrando datos de una leccion que ya no se esta editando.
  useEffect(() => {
    if (open) {
      onLiveChange?.(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, values]);

  useEffect(() => {
    return () => onLiveChange?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleOpen() {
    if (!open) {
      setOpen(true);
      return;
    }
    setOpen(false);
    onLiveChange?.(null);
    if (isNew) onCancelNew?.();
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      if (lesson) {
        await updateLesson(token, lesson.id, values);
      } else {
        await createLesson(token, moduleId, { ...values, displayOrder: total });
      }
      onLiveChange?.(null);
      setOpen(false);
      onChange();
      if (isNew) onCancelNew?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la lección");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!lesson) return;
    if (!confirm(`¿Eliminar la lección "${lesson.title}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(true);
    try {
      await deleteLesson(token, lesson.id);
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la lección");
      setDeleting(false);
    }
  }

  const mediaIcon = values.videoUrl ? Video : values.imageUrl ? ImageIcon : null;

  return (
    <div className={`rounded-card-md border ${open ? "border-accent/30 bg-white" : "border-navy/10 bg-white"}`}>
      <div className="flex items-center gap-2 p-3">
        <div className="flex shrink-0 flex-col">
          <button
            type="button"
            disabled={index === 0 || moveDisabled || isNew}
            onClick={() => onMove(-1)}
            className="rounded p-1.5 text-navy/40 hover:bg-navy/5 disabled:opacity-20"
            aria-label="Mover lección arriba"
          >
            <ChevronUp size={14} />
          </button>
          <button
            type="button"
            disabled={index === total - 1 || moveDisabled || isNew}
            onClick={() => onMove(1)}
            className="rounded p-1.5 text-navy/40 hover:bg-navy/5 disabled:opacity-20"
            aria-label="Mover lección abajo"
          >
            <ChevronDown size={14} />
          </button>
        </div>

        <button type="button" onClick={toggleOpen} className="flex min-w-0 flex-1 items-center gap-2 text-left">
          {open ? (
            <ChevronDown size={15} className="shrink-0 text-navy/40" />
          ) : (
            <ChevronRight size={15} className="shrink-0 text-navy/40" />
          )}
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="truncate text-p-small font-semibold text-navy">
                {isNew ? "Nueva lección" : values.title || "Sin título"}
              </span>
              {lesson && (
                <span
                  className={`shrink-0 rounded-pill px-2 py-0.5 text-p-caption font-semibold ${
                    lesson.published ? "bg-accent/10 text-accent" : "bg-navy/10 text-navy/50"
                  }`}
                >
                  {lesson.published ? "Publicada" : "Borrador"}
                </span>
              )}
            </span>
            {lesson && (
              <span className="mt-0.5 flex items-center gap-2 text-p-caption text-navy/75">
                <Clock3 size={11} /> {lesson.durationMinutes} min
                {mediaIcon &&
                  (mediaIcon === Video ? (
                    <span className="flex items-center gap-1">
                      <Video size={11} /> Video
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <ImageIcon size={11} /> Imagen
                    </span>
                  ))}
              </span>
            )}
          </span>
        </button>

        {lesson && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="shrink-0 text-navy/40 hover:text-coral disabled:opacity-50"
            aria-label={`Eliminar ${lesson.title}`}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <Collapse open={open}>
        <div className="border-t border-navy/10 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-p-caption font-semibold text-navy/60 sm:col-span-2">
              Título
              <input
                required
                className={inputClass}
                value={values.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setValues((v) => ({ ...v, title, slug: slugify(title) }));
                }}
              />
            </label>

            <label className="text-p-caption font-semibold text-navy/60 sm:col-span-2">
              Resumen breve (aparece bajo el título en la lista de lecciones)
              <input
                maxLength={300}
                className={inputClass}
                placeholder="Una frase corta que resuma la lección"
                value={values.summary}
                onChange={(e) => {
                  const summary = e.target.value;
                  setValues((v) => ({ ...v, summary }));
                }}
              />
            </label>

            <label className="text-p-caption font-semibold text-navy/60">
              Duración (minutos)
              <input
                type="number"
                min={0}
                className={inputClass}
                value={values.durationMinutes}
                onChange={(e) => {
                  const durationMinutes = Number(e.target.value);
                  setValues((v) => ({ ...v, durationMinutes }));
                }}
              />
            </label>

            <label className="flex items-center gap-2 pt-6 text-p-caption font-semibold text-navy/60">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={values.published}
                onChange={(e) => {
                  const published = e.target.checked;
                  setValues((v) => ({ ...v, published }));
                }}
              />
              Publicada (visible en Aprender)
            </label>

            <label className="text-p-caption font-semibold text-navy/60 sm:col-span-2">
              Objetivos de la lección (opcional, un objetivo por línea)
              <textarea
                rows={2}
                className={inputClass}
                placeholder={"Identificar los tipos de alopecia más comunes\nReconocer cuándo pedir ayuda profesional"}
                value={values.objectives}
                onChange={(e) => {
                  const objectives = e.target.value;
                  setValues((v) => ({ ...v, objectives }));
                }}
              />
            </label>

          </div>

          <div className="mt-3">
            <p className="text-p-caption font-semibold text-navy/60">Contenido de la lección</p>
            {lesson ? (
              <div className="mt-1">
                <BlockList
                  ownerId={lesson.id}
                  blocks={lesson.blocks}
                  emptyMessage="Todavía no hay contenido. Agregá el primer bloque desde el panel de la izquierda."
                  token={token}
                  api={LESSON_BLOCK_API}
                  onChange={onChange}
                />
              </div>
            ) : (
              <p className="mt-1 rounded-card-md bg-cream p-4 text-center text-p-caption text-navy/75">
                Creá la lección primero (botón &quot;Crear lección&quot; más abajo) para poder agregar
                contenido en bloques.
              </p>
            )}
          </div>

          <label className="mt-3 block text-p-caption font-semibold text-navy/60">
            Texto de respaldo (versión anterior, opcional)
            <textarea
              rows={3}
              className={inputClass}
              placeholder="Texto de la lección. Separa párrafos con una línea en blanco."
              value={values.body}
              onChange={(e) => {
                const body = e.target.value;
                setValues((v) => ({ ...v, body }));
              }}
            />
            <span className="mt-1 block font-normal text-navy/40">
              Solo se muestra en el sitio si esta lección todavía no tiene ningún bloque de contenido
              arriba. Podés dejarlo vacío una vez que termines de pasar el texto a bloques.
            </span>
          </label>

          <div className="mt-3">
            <LessonMediaPicker
              videoUrl={values.videoUrl}
              videoOrientation={values.videoOrientation}
              imageUrl={values.imageUrl}
              onChange={(patch) => setValues((v) => ({ ...v, ...patch }))}
            />
          </div>

          {lesson && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowResources((s) => !s)}
                className="text-p-caption font-semibold text-accent"
              >
                {showResources ? "Ocultar recursos adicionales" : `Recursos adicionales (${lesson.resources.length})`}
              </button>
              <Collapse open={showResources}>
                <ResourceList lessonId={lesson.id} resources={lesson.resources} token={token} onChange={onChange} />
              </Collapse>
            </div>
          )}

          {error && <p className="mt-3 text-p-caption text-coral">{error}</p>}

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !values.title}
              className="rounded-pill bg-navy px-4 py-2 text-p-caption font-semibold text-cream disabled:opacity-50"
            >
              {saving ? "Guardando…" : isNew ? "Crear lección" : "Guardar lección"}
            </button>
            <button type="button" onClick={toggleOpen} className="text-p-caption font-semibold text-navy/50">
              Cancelar
            </button>
          </div>
        </div>
      </Collapse>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getAdminCourse,
  updateCourse,
  deleteCourse,
  createModule,
  updateModule,
  type AdminCourse,
  type CourseRequest,
  type ModuleRequest,
} from "@/lib/api/adminCourses";
import CourseForm from "@/components/admin/CourseForm";
import ModuleEditor from "@/components/admin/ModuleEditor";
import LiveCoursePreview, { type ActiveLessonDraft } from "@/components/admin/LiveCoursePreview";
import PreviewErrorBoundary from "@/components/admin/PreviewErrorBoundary";

const EMPTY_MODULE: ModuleRequest = { title: "", description: "", displayOrder: 0 };

// Vista previa en vivo (ago 2026, mismo patron que admin/blog/[id]/page.tsx):
// draftFields guarda un "borrador" en memoria de los campos generales del
// curso, separado de lo guardado en el backend, para que LiveCoursePreview
// muestre el curso tomando forma mientras Jessica escribe -- CourseForm
// sigue guardando explicitamente con el boton "Guardar cambios". Modulos y
// lecciones, en cambio, se guardan solos apenas se confirman (ver
// ModuleEditor/LessonEditor) -- activeLessonDraft es el unico borrador de
// verdad que queda: la leccion que se esta escribiendo ahora mismo.
export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<AdminCourse | null>(null);
  const [draftFields, setDraftFields] = useState<CourseRequest | null>(null);
  const [activeLessonDraft, setActiveLessonDraft] = useState<ActiveLessonDraft | null>(null);
  const [addingModule, setAddingModule] = useState(false);
  const [newModule, setNewModule] = useState<ModuleRequest>(EMPTY_MODULE);
  const [savingModule, setSavingModule] = useState(false);
  const [moduleError, setModuleError] = useState<string | null>(null);

  const load = useCallback(() => {
    getAdminCourse(token, id).then((loaded) => {
      setCourse(loaded);
      setDraftFields({
        slug: loaded.slug,
        title: loaded.title,
        description: loaded.description ?? "",
        longDescription: loaded.longDescription ?? "",
        level: loaded.level,
        coverImageUrl: loaded.coverImageUrl ?? "",
        published: loaded.published,
        displayOrder: loaded.displayOrder,
      });
    });
  }, [token, id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpdate(values: CourseRequest) {
    await updateCourse(token, id, values);
    load();
  }

  // El ConfirmDialog ya lo pide CourseForm.handleDeleteClick antes de llamar
  // esto (mismo patron que ArticleForm.tsx) -- pedirlo de nuevo aca lo
  // mostraria dos veces.
  async function handleDelete() {
    await deleteCourse(token, id);
    router.push("/admin/courses");
  }

  async function handleAddModule(e: React.FormEvent) {
    e.preventDefault();
    setSavingModule(true);
    try {
      await createModule(token, id, { ...newModule, displayOrder: course?.modules.length ?? 0 });
      setNewModule(EMPTY_MODULE);
      setAddingModule(false);
      load();
    } finally {
      setSavingModule(false);
    }
  }

  // Mismo patron que moveLesson en ModuleEditor.tsx: swap local del
  // displayOrder de los dos modulos afectados + PUT de ambos con
  // updateModule (ya existente), sin necesidad de un endpoint de reorder
  // nuevo -- son pocos modulos por curso.
  async function moveModule(index: number, direction: -1 | 1) {
    if (!course) return;
    const sorted = [...course.modules].sort((a, b) => a.displayOrder - b.displayOrder);
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;
    const a = sorted[index];
    const b = sorted[targetIndex];
    setModuleError(null);
    try {
      await Promise.all([
        updateModule(token, a.id, { title: a.title, description: a.description ?? "", displayOrder: b.displayOrder }),
        updateModule(token, b.id, { title: b.title, description: b.description ?? "", displayOrder: a.displayOrder }),
      ]);
      load();
    } catch (err) {
      setModuleError(err instanceof Error ? err.message : "No se pudo reordenar el módulo");
    }
  }

  if (!course || !draftFields) {
    return <p className="text-p-small text-navy/50">Cargando…</p>;
  }

  const sortedModules = [...course.modules].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0">
        <Link href="/admin/courses" className="inline-flex items-center gap-1 text-a-inline font-semibold text-navy/60">
          <ArrowLeft size={14} /> Panel de cursos
        </Link>
        <h1 className="mt-4 text-h3-lg text-navy">{course.title}</h1>

        <div className="mt-6">
          <CourseForm
            initial={draftFields}
            submitLabel="Guardar cambios"
            onSubmit={handleUpdate}
            onDelete={handleDelete}
            onChange={setDraftFields}
          />
        </div>

        <h2 className="mt-10 text-h3-md text-navy">Módulos y lecciones</h2>
        <p className="mt-1 text-p-small text-navy/60">
          Agrupa las lecciones por módulo. Usa las flechas para cambiar el orden -- se ve al instante en la vista previa.
        </p>

        {moduleError && <p className="mt-2 text-p-small text-coral">{moduleError}</p>}

        <div className="mt-4 space-y-4">
          {sortedModules.map((module, i) => (
            <ModuleEditor
              key={module.id}
              module={module}
              token={token}
              index={i}
              total={sortedModules.length}
              onMove={(direction) => moveModule(i, direction)}
              onChange={load}
              onLiveChange={setActiveLessonDraft}
            />
          ))}
        </div>

        {addingModule ? (
          <form onSubmit={handleAddModule} className="mt-4 animate-reveal-in space-y-3 rounded-card-md bg-white p-5 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-p-caption font-semibold text-navy/60">
                Título del módulo
                <input
                  required
                  className="mt-1 w-full rounded-card-md border border-navy/15 bg-cream px-3 py-2 text-p-small text-navy outline-none focus:border-accent"
                  value={newModule.title}
                  onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                />
              </label>
              <label className="text-p-caption font-semibold text-navy/60">
                Descripción (opcional)
                <input
                  className="mt-1 w-full rounded-card-md border border-navy/15 bg-cream px-3 py-2 text-p-small text-navy outline-none focus:border-accent"
                  value={newModule.description}
                  onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                />
              </label>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={savingModule}
                className="rounded-pill bg-navy px-4 py-2 text-p-caption font-semibold text-cream disabled:opacity-50"
              >
                {savingModule ? "Creando…" : "Crear módulo"}
              </button>
              <button type="button" onClick={() => setAddingModule(false)} className="text-p-caption font-semibold text-navy/50">
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setAddingModule(true)}
            className="mt-4 flex items-center gap-1 text-a-inline font-semibold text-accent"
          >
            <Plus size={16} /> Agregar módulo
          </button>
        )}
      </div>

      <div className="xl:sticky xl:top-6 xl:self-start">
        <PreviewErrorBoundary>
          <LiveCoursePreview fields={draftFields} modules={course.modules} activeDraft={activeLessonDraft} />
        </PreviewErrorBoundary>
      </div>
    </div>
  );
}

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
  type AdminCourse,
  type CourseRequest,
  type ModuleRequest,
} from "@/lib/api/adminCourses";
import CourseForm from "@/components/admin/CourseForm";
import ModuleEditor from "@/components/admin/ModuleEditor";

const EMPTY_MODULE: ModuleRequest = { title: "", description: "", displayOrder: 0 };

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<AdminCourse | null>(null);
  const [addingModule, setAddingModule] = useState(false);
  const [newModule, setNewModule] = useState<ModuleRequest>(EMPTY_MODULE);
  const [savingModule, setSavingModule] = useState(false);

  const load = useCallback(() => {
    getAdminCourse(token, id).then(setCourse);
  }, [token, id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpdate(values: CourseRequest) {
    await updateCourse(token, id, values);
    load();
  }

  async function handleDelete() {
    if (!course) return;
    if (!confirm(`¿Eliminar el curso "${course.title}" con todos sus módulos y lecciones? Esta acción no se puede deshacer.`)) {
      return;
    }
    await deleteCourse(token, id);
    router.push("/admin/courses");
  }

  async function handleAddModule(e: React.FormEvent) {
    e.preventDefault();
    setSavingModule(true);
    try {
      await createModule(token, id, newModule);
      setNewModule(EMPTY_MODULE);
      setAddingModule(false);
      load();
    } finally {
      setSavingModule(false);
    }
  }

  if (!course) {
    return <p className="text-p-small text-navy/50">Cargando…</p>;
  }

  const sortedModules = [...course.modules].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="max-w-3xl">
      <Link href="/admin/courses" className="inline-flex items-center gap-1 text-a-inline font-semibold text-navy/60">
        <ArrowLeft size={14} /> Panel de cursos
      </Link>
      <h1 className="mt-4 text-h3-lg text-navy">{course.title}</h1>

      <div className="mt-6">
        <CourseForm
          initial={{
            slug: course.slug,
            title: course.title,
            description: course.description ?? "",
            longDescription: course.longDescription ?? "",
            level: course.level,
            coverImageUrl: course.coverImageUrl ?? "",
            published: course.published,
            displayOrder: course.displayOrder,
          }}
          submitLabel="Guardar cambios"
          onSubmit={handleUpdate}
          onDelete={handleDelete}
        />
      </div>

      <h2 className="mt-10 text-h3-md text-navy">Módulos y lecciones</h2>
      <p className="mt-1 text-p-small text-navy/60">
        Agrupa las lecciones por módulo. El orden se define con el campo &quot;orden&quot; de cada uno.
      </p>

      <div className="mt-4 space-y-4">
        {sortedModules.map((module) => (
          <ModuleEditor key={module.id} courseId={id} module={module} token={token} onChange={load} />
        ))}
      </div>

      {addingModule ? (
        <form onSubmit={handleAddModule} className="mt-4 space-y-3 rounded-card-md bg-white p-5 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
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
              Descripción
              <input
                className="mt-1 w-full rounded-card-md border border-navy/15 bg-cream px-3 py-2 text-p-small text-navy outline-none focus:border-accent"
                value={newModule.description}
                onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
              />
            </label>
            <label className="text-p-caption font-semibold text-navy/60">
              Orden
              <input
                type="number"
                className="mt-1 w-20 rounded-card-md border border-navy/15 bg-cream px-3 py-2 text-p-small text-navy outline-none focus:border-accent"
                value={newModule.displayOrder}
                onChange={(e) => setNewModule({ ...newModule, displayOrder: Number(e.target.value) })}
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
  );
}

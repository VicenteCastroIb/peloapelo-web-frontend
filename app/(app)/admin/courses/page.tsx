"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, BookOpen, Layers, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { listAdminCourses, reorderCourses, deleteCourse, type AdminCourseSummary } from "@/lib/api/adminCourses";
import { COURSE_LEVEL_LABEL } from "@/lib/data/courseLevels";
import { formatDate } from "@/lib/format";
import CourseCardSkeleton from "@/components/courses/CourseCardSkeleton";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

// Mismo diseño y patron de reordenar que app/(app)/admin/blog/page.tsx (ago
// 2026): grilla de cards cuadradas (foto arriba, info abajo) con flechas
// arriba/abajo -- antes esta pagina eran filas alargadas sin foto y sin
// forma de reordenar. El reorder en si es nuevo aca: no existia backend
// para cursos, se agrego AdminCourseService.reorderCourses +
// PUT /api/admin/courses/reorder espejando reorderArticles.
export default function AdminCoursesPage() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<AdminCourseSummary[] | null>(null);
  const [reordering, setReordering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    listAdminCourses(token)
      .then(setCourses)
      .catch(() => setCourses([]));
  }, [token]);

  const sorted = courses ? [...courses].sort((a, b) => a.displayOrder - b.displayOrder) : [];

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sorted.length || reordering) return;
    const next = [...sorted];
    [next[index], next[target]] = [next[target], next[index]];
    setCourses(next);
    setReordering(true);
    setError(null);
    try {
      await reorderCourses(token, next.map((c) => c.id));
      const fresh = await listAdminCourses(token);
      setCourses(fresh);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo reordenar los cursos");
      listAdminCourses(token)
        .then(setCourses)
        .catch(() => {});
    } finally {
      setReordering(false);
    }
  }

  async function confirmDelete() {
    if (!confirmId) return;
    const id = confirmId;
    setConfirmId(null);
    setDeletingId(id);
    setError(null);
    try {
      await deleteCourse(token, id);
      setCourses((prev) => (prev ? prev.filter((c) => c.id !== id) : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el curso");
    } finally {
      setDeletingId(null);
    }
  }

  const courseToDelete = sorted.find((c) => c.id === confirmId) ?? null;

  return (
    <div className="max-w-6xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-h3-lg text-navy">Panel de cursos</h1>
          <p className="mt-1 text-p-body text-navy/60">
            Crea y edita el contenido de Aprender. Un curso solo se ve en el sitio cuando lo publicas.
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className="flex shrink-0 items-center gap-2 rounded-pill bg-navy px-4 py-2.5 text-a-inline font-semibold text-cream"
        >
          <Plus size={16} /> Nuevo curso
        </Link>
      </div>

      {error && <p className="mt-4 text-p-small text-coral">{error}</p>}

      {courses === null && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      )}

      {courses?.length === 0 && (
        <div className="mt-8 rounded-card-lg bg-white p-10 text-center shadow-sm">
          <p className="text-p-body text-navy/70">Todavía no creaste ningún curso.</p>
        </div>
      )}

      {courses && courses.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((course, i) => (
            <div
              key={course.id}
              className="group relative overflow-hidden rounded-card-lg border border-navy/10 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="absolute left-2 top-2 z-10 flex items-center gap-0.5 rounded-pill bg-white/95 p-1 shadow-sm">
                <button
                  type="button"
                  disabled={i === 0 || reordering}
                  onClick={() => move(i, -1)}
                  className="rounded-pill p-2 text-navy/50 hover:bg-navy/5 disabled:opacity-20"
                  aria-label="Mover a la izquierda"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  disabled={i === sorted.length - 1 || reordering}
                  onClick={() => move(i, 1)}
                  className="rounded-pill p-2 text-navy/50 hover:bg-navy/5 disabled:opacity-20"
                  aria-label="Mover a la derecha"
                >
                  <ChevronRight size={15} />
                </button>
                <span className="mx-0.5 h-4 w-px bg-navy/10" aria-hidden />
                <button
                  type="button"
                  disabled={deletingId === course.id}
                  onClick={() => setConfirmId(course.id)}
                  className="rounded-pill p-2 text-navy/50 hover:bg-coral-soft hover:text-coral disabled:opacity-20"
                  aria-label={`Eliminar ${course.title}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <Link href={`/admin/courses/${course.id}`} className="block">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))]">
                  {course.coverImageUrl && (
                    // unoptimized: URL externa pegada a mano en el formulario, ver nota en ArticleCard.tsx
                    <Image
                      src={course.coverImageUrl}
                      alt=""
                      aria-hidden
                      fill
                      unoptimized
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <span
                    className={`absolute right-2 top-2 rounded-pill px-2.5 py-0.5 text-p-caption font-semibold ${
                      course.published ? "bg-accent text-cream" : "bg-white/90 text-navy/60"
                    }`}
                  >
                    {course.published ? "Publicado" : "Borrador"}
                  </span>
                  <span className="absolute left-2 bottom-2 rounded-pill bg-white/90 px-2.5 py-0.5 text-p-caption font-semibold text-navy">
                    {COURSE_LEVEL_LABEL[course.level]}
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-h3-sm text-navy line-clamp-1">{course.title}</p>
                  <div className="mt-3 flex items-center justify-between text-p-caption text-navy/50">
                    <span>Actualizado {formatDate(course.updatedAt)}</span>
                    <span className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Layers size={13} /> {course.moduleCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen size={13} /> {course.lessonCount}
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        title={`¿Eliminar "${courseToDelete?.title ?? "este curso"}"?`}
        description="Se va a eliminar el curso junto con todos sus módulos y lecciones. Esta acción no se puede deshacer."
        confirmLabel="Eliminar curso"
        loading={deletingId !== null}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getAdminCourse,
  updateLesson,
  deleteLesson,
  type AdminCourse,
  type AdminLesson,
  type LessonRequest,
} from "@/lib/api/adminCourses";
import LessonForm from "@/components/admin/LessonForm";
import ResourceList from "@/components/admin/ResourceList";

export default function EditLessonPage() {
  const { id, lessonId } = useParams<{ id: string; lessonId: string }>();
  const { token } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<AdminCourse | null>(null);

  const load = useCallback(() => {
    getAdminCourse(token, id).then(setCourse);
  }, [token, id]);

  useEffect(() => {
    load();
  }, [load]);

  const lesson: AdminLesson | undefined = course?.modules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === lessonId);

  async function handleUpdate(values: LessonRequest) {
    await updateLesson(token, lessonId, values);
    load();
  }

  async function handleDelete() {
    if (!lesson) return;
    if (!confirm(`¿Eliminar la lección "${lesson.title}"? Esta acción no se puede deshacer.`)) return;
    await deleteLesson(token, lessonId);
    router.push(`/admin/courses/${id}`);
  }

  if (!course || !lesson) {
    return <p className="text-p-small text-navy/50">Cargando…</p>;
  }

  return (
    <div className="max-w-2xl">
      <Link href={`/admin/courses/${id}`} className="inline-flex items-center gap-1 text-a-inline font-semibold text-navy/60">
        <ArrowLeft size={14} /> {course.title}
      </Link>
      <h1 className="mt-4 text-h3-lg text-navy">{lesson.title}</h1>

      <div className="mt-6">
        <LessonForm
          initial={{
            slug: lesson.slug,
            title: lesson.title,
            videoUrl: lesson.videoUrl ?? "",
            body: lesson.body ?? "",
            objectives: lesson.objectives ?? "",
            summary: lesson.summary ?? "",
            durationMinutes: lesson.durationMinutes,
            published: lesson.published,
            displayOrder: lesson.displayOrder,
          }}
          submitLabel="Guardar cambios"
          onSubmit={handleUpdate}
          onDelete={handleDelete}
        />
      </div>

      <ResourceList lessonId={lessonId} resources={lesson.resources} token={token} onChange={load} />
    </div>
  );
}

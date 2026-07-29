"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, BookOpen, Layers } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { listAdminCourses, type AdminCourseSummary } from "@/lib/api/adminCourses";
import { COURSE_LEVEL_LABEL } from "@/lib/data/courseLevels";
import { formatDate } from "@/lib/format";

export default function AdminCoursesPage() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<AdminCourseSummary[] | null>(null);

  useEffect(() => {
    listAdminCourses(token)
      .then(setCourses)
      .catch(() => setCourses([]));
  }, [token]);

  return (
    <div className="max-w-4xl">
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

      {courses === null && <p className="mt-8 text-p-small text-navy/50">Cargando…</p>}

      {courses?.length === 0 && (
        <div className="mt-8 rounded-card-lg bg-white p-10 text-center shadow-sm">
          <p className="text-p-body text-navy/70">Todavía no creaste ningún curso.</p>
        </div>
      )}

      {courses && courses.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-card-md bg-white shadow-sm">
          {courses.map((course, i) => (
            <Link
              key={course.id}
              href={`/admin/courses/${course.id}`}
              className={`flex items-center justify-between gap-4 px-5 py-4 hover:bg-navy/5 ${
                i > 0 ? "border-t border-navy/10" : ""
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-h3-sm text-navy">{course.title}</p>
                  <span
                    className={`rounded-pill px-2.5 py-0.5 text-p-caption font-semibold ${
                      course.published ? "bg-accent/10 text-accent" : "bg-navy/10 text-navy/50"
                    }`}
                  >
                    {course.published ? "Publicado" : "Borrador"}
                  </span>
                </div>
                <p className="mt-1 text-p-caption text-navy/50">
                  {COURSE_LEVEL_LABEL[course.level]} · /{course.slug} · Actualizado {formatDate(course.updatedAt)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4 text-p-caption text-navy/50">
                <span className="flex items-center gap-1">
                  <Layers size={13} /> {course.moduleCount}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen size={13} /> {course.lessonCount}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

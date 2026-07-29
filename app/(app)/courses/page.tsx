"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Clock3, BookOpen, Sprout } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchCourses, type CourseSummary } from "@/lib/api/courses";
import { COURSE_LEVEL_LABEL } from "@/lib/data/courseLevels";
import ProgressBar from "@/components/shared/ProgressBar";

export default function CoursesPage() {
  const { token, status, user } = useAuth();
  const [courses, setCourses] = useState<CourseSummary[] | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    fetchCourses(token)
      .then(setCourses)
      .catch(() => setCourses([]));
  }, [status, token]);

  return (
    <div className="max-w-5xl">
      <h1 className="text-h3-lg text-navy">Tu camino de bienestar 🌱</h1>
      <p className="mt-1 text-p-body text-navy/60">
        Cursos diseñados por profesionales para acompañarte en cada etapa.
      </p>

      {courses === null && <p className="mt-8 text-p-small text-navy/50">Cargando…</p>}

      {courses?.length === 0 && (
        <div className="mt-8 rounded-card-lg bg-white p-10 text-center shadow-sm">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Sprout size={20} />
          </span>
          <p className="mt-4 text-h3-sm text-navy">Todavía no hay cursos publicados</p>
          <p className="mx-auto mt-1 max-w-sm text-p-small text-navy/60">
            {user?.role === "ADMIN"
              ? "Crea el primero desde el panel de administración."
              : "Estamos preparando contenido para acompañarte. Vuelve pronto."}
          </p>
          {user?.role === "ADMIN" && (
            <Link
              href="/admin/courses"
              className="mt-5 inline-block rounded-pill bg-navy px-5 py-2.5 text-a-inline font-semibold text-cream"
            >
              Ir al panel de cursos
            </Link>
          )}
        </div>
      )}

      {courses && courses.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="block overflow-hidden rounded-card-lg bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative flex h-36 items-center justify-center bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))]">
                <span className="absolute left-3 top-3 rounded-pill bg-white/90 px-2.5 py-1 text-p-caption font-semibold text-navy">
                  {COURSE_LEVEL_LABEL[course.level]}
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-accent">
                  <Play size={16} />
                </span>
              </div>
              <div className="p-5">
                <p className="text-h3-sm text-navy">{course.title}</p>
                <p className="mt-1 text-p-small text-navy/60">{course.description}</p>
                <div className="mt-4 flex items-center gap-4 text-p-caption text-navy/50">
                  <span className="flex items-center gap-1">
                    <Clock3 size={14} /> {course.durationMinutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen size={14} /> {course.lessonCount} lecciones
                  </span>
                </div>
                {course.progressPercent !== null && (
                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-p-caption text-navy/50">
                      <span>Tu avance</span>
                      <span className="font-semibold text-accent">{course.progressPercent}%</span>
                    </div>
                    <ProgressBar percent={course.progressPercent} />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

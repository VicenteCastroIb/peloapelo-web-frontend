"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Circle, Clock3 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchCourseDetail, type CourseDetail } from "@/lib/api/courses";
import { COURSE_LEVEL_LABEL } from "@/lib/data/courseLevels";
import ProgressBar from "@/components/shared/ProgressBar";

export default function CourseDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { token, status } = useAuth();
  const [course, setCourse] = useState<CourseDetail | null | "not-found">(null);

  useEffect(() => {
    if (status === "loading") return;
    fetchCourseDetail(slug, token)
      .then(setCourse)
      .catch(() => setCourse("not-found"));
  }, [slug, status, token]);

  if (course === "not-found") {
    return (
      <div className="max-w-3xl">
        <p className="text-h3-sm text-navy">No encontramos este curso</p>
        <Link href="/courses" className="mt-3 inline-flex items-center gap-1 text-a-inline font-semibold text-accent">
          <ArrowLeft size={14} /> Volver a Aprender
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Link href="/courses" className="inline-flex items-center gap-1 text-a-inline font-semibold text-navy/60">
        <ArrowLeft size={14} /> Aprender
      </Link>

      {course === null && <p className="mt-6 text-p-small text-navy/50">Cargando…</p>}

      {course && (
        <>
          <div className="mt-4 flex items-center gap-2">
            <span className="rounded-pill bg-accent/10 px-2.5 py-1 text-p-caption font-semibold text-accent">
              {COURSE_LEVEL_LABEL[course.level]}
            </span>
          </div>
          <h1 className="mt-2 text-h3-lg text-navy">{course.title}</h1>
          {course.description && <p className="mt-1 text-p-body text-navy/60">{course.description}</p>}

          {course.progressPercent !== null && (
            <div className="mt-5 rounded-card-md bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center justify-between text-p-small">
                <span className="text-navy/60">Tu avance en este curso</span>
                <span className="font-semibold text-accent">{course.progressPercent}%</span>
              </div>
              <ProgressBar percent={course.progressPercent} />
            </div>
          )}

          <div className="mt-8 space-y-6">
            {course.modules.length === 0 && (
              <p className="text-p-small text-navy/50">Todavía no hay lecciones en este curso.</p>
            )}

            {course.modules.map((module) => (
              <div key={module.id}>
                <h2 className="text-h3-sm text-navy">{module.title}</h2>
                {module.description && <p className="mt-1 text-p-small text-navy/60">{module.description}</p>}

                <div className="mt-3 overflow-hidden rounded-card-md bg-white shadow-sm">
                  {module.lessons.length === 0 && (
                    <p className="px-5 py-4 text-p-small text-navy/50">Sin lecciones todavía.</p>
                  )}
                  {module.lessons.map((lesson, i) => (
                    <Link
                      key={lesson.id}
                      href={`/courses/${course.slug}/${lesson.slug}`}
                      className={`flex items-center justify-between gap-3 px-5 py-4 text-p-small hover:bg-navy/5 ${
                        i > 0 ? "border-t border-navy/10" : ""
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {lesson.completed ? (
                          <CheckCircle2 size={18} className="shrink-0 text-accent" />
                        ) : (
                          <Circle size={18} className="shrink-0 text-navy/20" />
                        )}
                        <span className="text-navy">{lesson.title}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-1 text-p-caption text-navy/50">
                        <Clock3 size={13} /> {lesson.durationMinutes} min
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

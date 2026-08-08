"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3, BookOpen, PlayCircle } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchCourseDetail, type CourseDetail } from "@/lib/api/courses";
import { COURSE_LEVEL_LABEL } from "@/lib/data/courseLevels";

// Vista de curso -- replica el diseño de la version anterior de peloapelo.cl
// (ver AprenderPaginaVieja.png / capturas enviadas por Vicente): portada a
// la izquierda con overlay "Selecciona una lección" (decorativo, no
// navega -- igual que en el sitio real), info del curso debajo, y a la
// derecha la lista numerada de lecciones. Al hacer clic en una lección se
// entra a la vista nueva con sidebar persistente (ver
// app/(app)/courses/[slug]/[lessonSlug]/layout.tsx).

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
      <div className="mx-auto max-w-3xl">
        <p className="text-h3-sm text-navy">No encontramos este curso</p>
        <Link href="/courses" className="mt-3 inline-flex items-center gap-1 text-a-inline font-semibold text-accent">
          <ArrowLeft size={14} /> Volver a Aprender
        </Link>
      </div>
    );
  }

  const lessons = course ? course.modules.flatMap((m) => m.lessons) : [];
  const totalDuration = lessons.reduce((sum, l) => sum + l.durationMinutes, 0);
  // Primer lección publicada del curso, en el mismo orden que la lista de la
  // derecha -- clickear la carátula entra directo a la inmersión de
  // e-learning (ver app/(app)/courses/[slug]/[lessonSlug]/layout.tsx), igual
  // que clickear cualquier lección de la lista.
  const firstLesson = lessons[0] ?? null;
  const coverCta = !firstLesson
    ? null
    : course?.progressPercent === 100
      ? "Repasar curso"
      : course?.progressPercent && course.progressPercent > 0
        ? "Continuar aprendiendo"
        : "Comenzar curso";

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/courses" className="inline-flex items-center gap-1 text-a-inline font-semibold text-navy/60">
        <ArrowLeft size={14} /> Aprender
      </Link>

      {course === null && <p className="mt-6 text-p-small text-navy/50">Cargando…</p>}

      {course && (
        <div className="mt-4 grid gap-8 lg:grid-cols-[3fr_2fr]">
          <div>
            {/* La carátula ahora es la puerta de entrada a la inmersión de
                e-learning (igual que cualquier lección de la lista de la
                derecha): un clic lleva directo a la primera lección
                publicada del curso, con todo el estilo AWS-Skill-Builder de
                la vista de lección (ver [lessonSlug]/layout.tsx). Sin
                lecciones todavía, se queda como vista decorativa. */}
            {firstLesson ? (
              <Link
                href={`/courses/${course.slug}/${firstLesson.slug}`}
                className="group relative block aspect-[16/10] overflow-hidden rounded-card-lg bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))]"
              >
                {course.coverImageUrl && (
                  <Image
                    src={course.coverImageUrl}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-navy/10 text-center text-cream transition-colors group-hover:bg-navy/25">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/25 text-cream backdrop-blur-sm transition-transform group-hover:scale-110">
                    <PlayCircle size={26} />
                  </span>
                  <p className="text-h3-sm text-cream">{coverCta}</p>
                  <p className="text-p-small text-cream/85">Haz clic para comenzar</p>
                </div>
              </Link>
            ) : (
              <div className="relative aspect-[16/10] overflow-hidden rounded-card-lg bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))]">
                {course.coverImageUrl && (
                  <Image src={course.coverImageUrl} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-navy/10 text-center text-cream">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/25 text-cream backdrop-blur-sm">
                    <PlayCircle size={26} />
                  </span>
                  <p className="text-h3-sm text-cream">Muy pronto</p>
                  <p className="text-p-small text-cream/85">Todavía no hay lecciones en este curso</p>
                </div>
              </div>
            )}

            <h1 className="mt-5 text-h3-lg text-navy">{course.title}</h1>
            {course.description && <p className="mt-1 text-p-body text-navy/60">{course.description}</p>}

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="rounded-pill bg-accent/10 px-2.5 py-1 text-p-caption font-semibold text-accent">
                {COURSE_LEVEL_LABEL[course.level]}
              </span>
              <span className="flex items-center gap-1 text-p-caption text-navy/50">
                <Clock3 size={14} /> {totalDuration} min
              </span>
              <span className="flex items-center gap-1 text-p-caption text-navy/50">
                <BookOpen size={14} /> {lessons.length} lecciones
              </span>
            </div>

            {course.longDescription && (
              <p className="mt-4 text-p-body text-navy/70">{course.longDescription}</p>
            )}
          </div>

          <div>
            <h2 className="text-h3-md text-navy">Lecciones</h2>
            <div className="mt-4 space-y-3">
              {lessons.length === 0 && (
                <p className="rounded-card-md bg-white px-5 py-4 text-p-small text-navy/50 shadow-sm">
                  Todavía no hay lecciones en este curso.
                </p>
              )}
              {lessons.map((lesson, i) => (
                <Link
                  key={lesson.id}
                  href={`/courses/${course.slug}/${lesson.slug}`}
                  className="flex items-start gap-3 rounded-card-md bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  {lesson.completed ? (
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <CheckCircle2 size={16} />
                    </span>
                  ) : (
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy/5 text-p-caption font-semibold text-navy/60">
                      {i + 1}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block text-p-body font-semibold text-navy">{lesson.title}</span>
                    {lesson.summary && (
                      <span className="mt-0.5 block text-p-small text-navy/60">{lesson.summary}</span>
                    )}
                    <span className="mt-1.5 flex items-center gap-1 text-p-caption text-navy/45">
                      <Clock3 size={11} /> {lesson.durationMinutes} min
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

// Barra compacta que reemplaza al Header global + DashboardSidebar dentro
// de una leccion (ver lib/routes.ts + SiteChrome.tsx). Concentra lo que
// antes vivia repartido en el sidebar persistente: volver al curso, titulo
// + posicion de la leccion, avance del curso y el acceso al indice completo
// (ahora un panel deslizable, ver CourseOutlineSidebar). Inspirado en la
// barra superior del reproductor de AWS Skill Builder, con los colores y
// tipografia de Pelo a Pelo.

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, List, X } from "lucide-react";
import { useCourseOutline, useLessonPosition, useTotalLessons } from "./CourseOutlineContext";
import ProgressBar from "@/components/shared/ProgressBar";

export default function LessonImmersiveHeader({
  courseSlug,
  activeLessonSlug,
  onOpenOutline,
}: {
  courseSlug: string;
  activeLessonSlug: string;
  onOpenOutline: () => void;
}) {
  const { course } = useCourseOutline();
  const position = useLessonPosition(activeLessonSlug);
  const totalLessons = useTotalLessons();
  const courseTitle = course && course !== "not-found" ? course.title : null;
  const progressPercent = course && course !== "not-found" ? course.progressPercent : null;

  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-white">
      <div className="mx-auto flex max-w-[88rem] items-center gap-3 px-4 py-3 lg:gap-4 lg:px-8">
        <Link href="/dashboard" className="flex shrink-0 items-center" aria-label="Ir al inicio">
          <Image src="/images/brand/logo.png" alt="" aria-hidden width={32} height={32} className="h-8 w-8" />
        </Link>

        <span className="hidden h-6 w-px shrink-0 bg-navy/10 sm:block" />

        <Link
          href={`/courses/${courseSlug}`}
          className="flex shrink-0 items-center gap-1 text-a-inline font-semibold text-navy/70 hover:text-navy"
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Aprender</span>
        </Link>

        <div className="min-w-0 flex-1">
          {courseTitle && <p className="truncate text-p-small font-semibold text-navy">{courseTitle}</p>}
          {position && totalLessons > 0 && (
            <p className="truncate text-p-caption text-navy/50">
              Lección {position.position} de {totalLessons} · {position.moduleTitle}
            </p>
          )}
        </div>

        {progressPercent !== null && progressPercent !== undefined && (
          <div className="hidden w-32 shrink-0 md:block">
            <div className="mb-1 flex items-center justify-between text-p-caption text-navy/50">
              <span>Avance</span>
              <span className="font-semibold text-accent">{progressPercent}%</span>
            </div>
            <ProgressBar percent={progressPercent} />
          </div>
        )}

        <button
          type="button"
          onClick={onOpenOutline}
          className="flex shrink-0 items-center gap-2 rounded-pill bg-navy/5 px-3 py-2 text-p-caption font-semibold text-navy/70 transition-colors hover:bg-navy/10"
        >
          <List size={15} />
          <span className="hidden sm:inline">Contenido del curso</span>
        </button>

        <Link
          href={`/courses/${courseSlug}`}
          aria-label="Salir de la lección"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-navy/50 transition-colors hover:bg-navy/5 hover:text-navy"
        >
          <X size={18} />
        </Link>
      </div>
    </header>
  );
}

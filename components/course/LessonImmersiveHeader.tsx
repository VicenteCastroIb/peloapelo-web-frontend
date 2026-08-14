"use client";

// Barra compacta arriba del contenido de la leccion (ver capturas de
// referencia de AWS Skill Builder, ago 2026). Antes repetia aca el titulo
// del curso y el avance -- ahora que CourseOutlineSidebar es una columna fija
// en desktop (ver ese componente), esa info ya esta siempre a la vista ahi,
// asi que mostrarla tambien en esta barra era redundante. En pantallas
// chicas (donde el sidebar es un panel que hay que abrir) esta barra sigue
// mostrando titulo + avance, para no perder esa informacion.
import Image from "next/image";
import Link from "next/link";
import { List, X } from "lucide-react";
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
    <header className="sticky top-0 z-30 border-b border-navy/10 bg-white">
      <div className="flex items-center gap-3 px-4 py-3 lg:gap-4 lg:px-6">
        {/* El logo + "volver a Aprender" ya viven en el header del sidebar
            (persistente en lg+) -- en mobile, donde el sidebar arranca
            cerrado, este boton es la unica forma de llegar ahi, por eso solo
            se oculta en lg+. */}
        <button
          type="button"
          onClick={onOpenOutline}
          aria-label="Abrir contenido del curso"
          className="flex shrink-0 items-center justify-center rounded-full p-2 text-navy/60 hover:bg-navy/5 lg:hidden"
        >
          <List size={18} />
        </button>

        <Image
          src="/images/brand/logo.png"
          alt=""
          aria-hidden
          width={28}
          height={28}
          className="hidden h-7 w-7 shrink-0 lg:block"
        />

        <div className="min-w-0 flex-1">
          {/* Titulo + avance: solo en mobile (lg:hidden), donde el sidebar
              con esta misma info empieza cerrado. En desktop el sidebar ya
              esta siempre visible, así que repetirlo aca seria ruido. */}
          <div className="lg:hidden">
            {courseTitle && <p className="truncate text-p-small font-semibold text-navy">{courseTitle}</p>}
          </div>
          {/* Breadcrumb de posicion: visible en todos los tamaños (asi es en
              la referencia de AWS, incluso con el sidebar fijo a la vista en
              desktop -- es contexto de pagina, no un duplicado del sidebar,
              que solo resalta la leccion activa dentro de la lista). */}
          {position && totalLessons > 0 && (
            <p className="truncate text-p-caption text-navy/50">
              Lección {position.position} de {totalLessons} · {position.moduleTitle}
            </p>
          )}
        </div>

        {progressPercent !== null && progressPercent !== undefined && (
          <div className="hidden w-32 shrink-0 sm:block lg:hidden">
            <div className="mb-1 flex items-center justify-between text-p-caption text-navy/50">
              <span>Avance</span>
              <span className="font-semibold text-accent">{progressPercent}%</span>
            </div>
            <ProgressBar percent={progressPercent} />
          </div>
        )}

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

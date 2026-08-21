"use client";

import Image from "next/image";
import type { CourseRequest } from "@/lib/api/adminCourses";
import { COURSE_LEVEL_LABEL } from "@/lib/data/courseLevels";

// Encabezado del curso (portada, titulo, descripcion corta, nivel) tal como
// se ve en /courses/[slug] -- extraido de LiveCoursePreview.tsx (fase 5, ago
// 2026, mismo criterio que ArticleHeaderPreview.tsx para el blog) para que
// el lienzo editable de bloques (ver admin/courses/[id]/page.tsx) pueda
// mostrar este encabezado arriba del contenido en bloques, sin duplicar
// este JSX. Estos campos se siguen editando por formulario (CourseForm,
// panel "Ajustes del curso"), no in-place aca.
export default function CourseHeaderPreview({ fields }: { fields: CourseRequest }) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-card-lg bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))]">
        {fields.coverImageUrl && (
          <Image src={fields.coverImageUrl} alt="" aria-hidden fill unoptimized sizes="600px" className="object-cover" />
        )}
      </div>

      <h1 className="mt-5 text-h2-xl text-navy">{fields.title || "Título del curso"}</h1>
      {fields.description && <p className="mt-4 text-p-lead text-navy/70">{fields.description}</p>}

      <span className="mt-4 inline-block rounded-pill bg-accent/10 px-2.5 py-1 text-p-caption font-semibold text-accent">
        {COURSE_LEVEL_LABEL[fields.level]}
      </span>
    </div>
  );
}

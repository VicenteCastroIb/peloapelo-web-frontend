"use client";

// Shell de la inmersion de leccion, al estilo del reproductor de AWS Skill
// Builder (ago 2026, con sidebar persistente restaurado a pedido -- ver
// CourseOutlineSidebar): en lg+ es un layout de dos columnas, sidebar fijo a
// la izquierda (curso + avance + modulos/lecciones, siempre a la vista
// mientras se navega) y el contenido de la leccion a la derecha, con su
// propia barra superior compacta (LessonImmersiveHeader). En mobile, sin
// espacio para una columna permanente, el sidebar sigue siendo un panel
// deslizable que se abre desde esa barra. lib/routes.ts oculta el
// Header/Footer/DashboardSidebar globales para esta ruta.

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchCourseDetail, type CourseDetail } from "@/lib/api/courses";
import { CourseOutlineProvider } from "@/components/course/CourseOutlineContext";
import CourseOutlineSidebar from "@/components/course/CourseOutlineSidebar";
import LessonImmersiveHeader from "@/components/course/LessonImmersiveHeader";

export default function LessonLayout({ children }: { children: React.ReactNode }) {
  const { slug, lessonSlug } = useParams<{ slug: string; lessonSlug: string }>();
  const { token, status } = useAuth();
  const [course, setCourse] = useState<CourseDetail | null | "not-found">(null);
  const [outlineOpen, setOutlineOpen] = useState(false);

  // refresh (no solo el useEffect de montaje): completar o descompletar una
  // leccion -- desde el circulo del sidebar o desde el boton de la pagina de
  // leccion -- cambia progressPercent y el estado de otras lecciones/modulos,
  // asi que ambos lados necesitan poder pedir el curso de nuevo sin esperar
  // a que cambie el slug.
  const refresh = useCallback(() => {
    if (status === "loading") return;
    fetchCourseDetail(slug, token)
      .then(setCourse)
      .catch(() => setCourse("not-found"));
  }, [slug, status, token]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, status, token]);

  return (
    <CourseOutlineProvider course={course} refresh={refresh}>
      <div className="min-h-screen bg-cream lg:flex">
        <CourseOutlineSidebar activeLessonSlug={lessonSlug} open={outlineOpen} onClose={() => setOutlineOpen(false)} />

        <div className="min-w-0 flex-1">
          <LessonImmersiveHeader courseSlug={slug} activeLessonSlug={lessonSlug} onOpenOutline={() => setOutlineOpen(true)} />
          <div className="px-6 py-10 lg:px-10">{children}</div>
        </div>
      </div>
    </CourseOutlineProvider>
  );
}

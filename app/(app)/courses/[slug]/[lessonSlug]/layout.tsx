"use client";

// Shell de la inmersion de leccion, al estilo del reproductor de AWS Skill
// Builder: una barra superior compacta con toda la navegacion (volver al
// curso, titulo, avance, indice) reemplaza tanto al Header global como al
// sidebar persistente que existia antes -- ver LessonImmersiveHeader,
// CourseOutlineSidebar (ahora un panel deslizable) y lib/routes.ts (que
// oculta Header/Footer/DashboardSidebar para esta ruta). El contenido de la
// leccion queda con todo el ancho de la pantalla debajo de la barra.

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (status === "loading") return;
    fetchCourseDetail(slug, token)
      .then(setCourse)
      .catch(() => setCourse("not-found"));
  }, [slug, status, token]);

  return (
    <CourseOutlineProvider course={course}>
      <div className="min-h-screen bg-cream">
        <LessonImmersiveHeader courseSlug={slug} activeLessonSlug={lessonSlug} onOpenOutline={() => setOutlineOpen(true)} />
        <CourseOutlineSidebar activeLessonSlug={lessonSlug} open={outlineOpen} onClose={() => setOutlineOpen(false)} />

        <div className="px-6 py-10 lg:px-10">{children}</div>
      </div>
    </CourseOutlineProvider>
  );
}

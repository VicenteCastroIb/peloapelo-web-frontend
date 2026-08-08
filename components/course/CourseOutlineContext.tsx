"use client";

// Contexto que expone el curso completo (modulos + lecciones) al arbol de
// la leccion. Se llena una sola vez en el layout de
// app/(app)/courses/[slug]/[lessonSlug]/layout.tsx y lo consumen tanto el
// sidebar persistente (CourseOutlineSidebar) como la propia pagina de
// leccion (para el breadcrumb "Leccion X de Y") -- asi evitamos pedir el
// curso dos veces y repetir la logica de "aplanar modulos en una lista".

import { createContext, useContext, useMemo } from "react";
import type { CourseDetail } from "@/lib/api/courses";

interface CourseOutlineContextValue {
  course: CourseDetail | null | "not-found";
}

const CourseOutlineContext = createContext<CourseOutlineContextValue>({ course: null });

export function CourseOutlineProvider({
  course,
  children,
}: {
  course: CourseDetail | null | "not-found";
  children: React.ReactNode;
}) {
  return <CourseOutlineContext.Provider value={{ course }}>{children}</CourseOutlineContext.Provider>;
}

export function useCourseOutline() {
  return useContext(CourseOutlineContext);
}

export interface FlatLesson {
  slug: string;
  title: string;
  moduleTitle: string;
  position: number;
}

/** Posicion global ("Leccion 3 de 9") y titulo del modulo de una leccion, o null si el curso todavia no cargo / no la contiene. */
export function useLessonPosition(lessonSlug: string | undefined): FlatLesson | null {
  const { course } = useCourseOutline();

  return useMemo(() => {
    if (!course || course === "not-found" || !lessonSlug) return null;

    let position = 0;
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        position += 1;
        if (lesson.slug === lessonSlug) {
          return { slug: lesson.slug, title: lesson.title, moduleTitle: module.title, position };
        }
      }
    }
    return null;
  }, [course, lessonSlug]);
}

export function useTotalLessons(): number {
  const { course } = useCourseOutline();
  return useMemo(() => {
    if (!course || course === "not-found") return 0;
    return course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  }, [course]);
}

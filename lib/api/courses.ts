import { apiFetch } from "./client";
import type { RawArticleBlock } from "@/lib/types/blogBlocks";

export type CourseLevel = "BASICO" | "INTERMEDIO" | "AVANZADO";
export type ResourceType = "PDF" | "AUDIO" | "LINK";
/** Orientacion del video de una leccion (ver LessonMediaPicker.tsx) -- solo importa cuando hay video cargado. */
export type VideoOrientation = "HORIZONTAL" | "VERTICAL";

export interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: CourseLevel;
  coverImageUrl: string | null;
  lessonCount: number;
  durationMinutes: number;
  /** null si no hay sesion activa (endpoint publico, ver CourseController). */
  progressPercent: number | null;
  /** false si no hay sesion activa. */
  saved: boolean;
}

export interface LessonSummary {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  durationMinutes: number;
  displayOrder: number;
  completed: boolean;
  hasVideo: boolean;
}

export interface CourseModuleSummary {
  id: string;
  title: string;
  description: string | null;
  displayOrder: number;
  lessons: LessonSummary[];
}

export interface CourseDetail {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  /** Fallback de texto plano (fase 5 del editor visual, ago 2026): se usa en el sitio publico solo cuando `blocks` viene vacio. */
  longDescription: string | null;
  /** Contenido en bloques (fase 5) -- misma forma cruda que article_blocks/lesson_blocks, ver lib/types/blogBlocks.ts. */
  blocks: RawArticleBlock[];
  level: CourseLevel;
  coverImageUrl: string | null;
  progressPercent: number | null;
  modules: CourseModuleSummary[];
}

export interface LessonResource {
  id: string;
  label: string;
  url: string;
  resourceType: ResourceType;
  displayOrder: number;
}

export interface LessonDetail {
  id: string;
  slug: string;
  title: string;
  videoUrl: string | null;
  videoOrientation: VideoOrientation;
  imageUrl: string | null;
  /** Fallback de texto plano (fase 4 del editor visual, ago 2026): se usa en el sitio publico solo cuando `blocks` viene vacio. */
  body: string | null;
  /** Contenido en bloques (fase 4) -- misma forma cruda que article_blocks, ver lib/types/blogBlocks.ts. */
  blocks: RawArticleBlock[];
  objectives: string[];
  durationMinutes: number;
  completed: boolean;
  resources: LessonResource[];
  courseSlug: string;
  courseTitle: string;
  moduleTitle: string;
  previousLessonSlug: string | null;
  nextLessonSlug: string | null;
}

// token es opcional: la cookie httpOnly ya autentica la request sola (ver
// lib/api/subscriptions.ts). Sin sesion, el backend igual responde -- solo
// que sin progreso (progressPercent/completed en null/false).

export function fetchCourses(token?: string | null) {
  return apiFetch<CourseSummary[]>("/api/courses", { token });
}

export function fetchCourseDetail(slug: string, token?: string | null) {
  return apiFetch<CourseDetail>(`/api/courses/${slug}`, { token });
}

export function fetchLesson(courseSlug: string, lessonSlug: string, token?: string | null) {
  return apiFetch<LessonDetail>(`/api/courses/${courseSlug}/lessons/${lessonSlug}`, { token });
}

export function completeLesson(token: string | null | undefined, lessonId: string) {
  return apiFetch<void>(`/api/courses/lessons/${lessonId}/complete`, { method: "POST", token });
}

export function uncompleteLesson(token: string | null | undefined, lessonId: string) {
  return apiFetch<void>(`/api/courses/lessons/${lessonId}/complete`, { method: "DELETE", token });
}

export function saveCourse(token: string | null | undefined, slug: string) {
  return apiFetch<void>(`/api/courses/${slug}/save`, { method: "POST", token });
}

export function unsaveCourse(token: string | null | undefined, slug: string) {
  return apiFetch<void>(`/api/courses/${slug}/save`, { method: "DELETE", token });
}

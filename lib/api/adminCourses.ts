import { apiFetch } from "./client";
import type { CourseLevel, ResourceType, VideoOrientation } from "./courses";

// Cliente del CRUD de cursos para el panel /admin (protegido ROLE_ADMIN en
// el backend, ver AdminCourseController + SecurityConfig). A diferencia de
// lib/api/courses.ts (lecturas publicas, solo contenido publicado), esto
// siempre requiere sesion de administradora y ve tambien lo despublicado.

export interface AdminLessonResource {
  id: string;
  label: string;
  url: string;
  resourceType: ResourceType;
  displayOrder: number;
}

/** Bloque de contenido de una leccion (fase 4 del editor visual, ago 2026) -- mismo esquema que AdminArticleBlock (ver adminBlog.ts), espejado del lado de lecciones. */
export interface AdminLessonBlock {
  id: string;
  lessonId: string;
  blockType: string;
  position: number;
  dataJson: string;
}

export interface AdminLesson {
  id: string;
  moduleId: string;
  slug: string;
  title: string;
  videoUrl: string | null;
  /** Solo importa cuando videoUrl esta cargado -- ver LessonMediaPicker.tsx. */
  videoOrientation: VideoOrientation;
  /** Alternativa a videoUrl: video e imagen son mutuamente excluyentes en la UI, ninguno es obligatorio. */
  imageUrl: string | null;
  /** Fallback de texto plano (fase 4): lecciones sin bloques propios siguen mostrando esto -- ver LessonEditor.tsx. */
  body: string | null;
  objectives: string | null;
  summary: string | null;
  durationMinutes: number;
  published: boolean;
  displayOrder: number;
  resources: AdminLessonResource[];
  blocks: AdminLessonBlock[];
}

export interface AdminCourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  displayOrder: number;
  lessons: AdminLesson[];
}

/** Bloque de contenido del curso en si (fase 5 del editor visual, ago 2026) -- mismo esquema que AdminArticleBlock/AdminLessonBlock, espejado del lado de cursos. */
export interface AdminCourseBlock {
  id: string;
  courseId: string;
  blockType: string;
  position: number;
  dataJson: string;
}

export interface AdminCourse {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  /** Fallback de texto plano (fase 5): cursos sin bloques propios siguen mostrando esto -- ver admin/courses/[id]/page.tsx. */
  longDescription: string | null;
  level: CourseLevel;
  coverImageUrl: string | null;
  published: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  modules: AdminCourseModule[];
  blocks: AdminCourseBlock[];
}

export interface AdminCourseSummary {
  id: string;
  slug: string;
  title: string;
  level: CourseLevel;
  coverImageUrl: string | null;
  published: boolean;
  displayOrder: number;
  moduleCount: number;
  lessonCount: number;
  updatedAt: string;
}

export interface CourseRequest {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  level: CourseLevel;
  coverImageUrl: string;
  published: boolean;
  displayOrder: number;
}

export interface ModuleRequest {
  title: string;
  description: string;
  displayOrder: number;
}

export interface LessonRequest {
  slug: string;
  title: string;
  videoUrl: string;
  videoOrientation: VideoOrientation;
  imageUrl: string;
  body: string;
  objectives: string;
  summary: string;
  durationMinutes: number;
  published: boolean;
  displayOrder: number;
}

export interface LessonResourceRequest {
  label: string;
  url: string;
  resourceType: ResourceType;
  displayOrder: number;
}

export interface LessonBlockRequest {
  blockType: string;
  position: number;
  dataJson: string;
}

export interface CourseBlockRequest {
  blockType: string;
  position: number;
  dataJson: string;
}

export function listAdminCourses(token?: string | null) {
  return apiFetch<AdminCourseSummary[]>("/api/admin/courses", { token });
}

export function getAdminCourse(token: string | null | undefined, courseId: string) {
  return apiFetch<AdminCourse>(`/api/admin/courses/${courseId}`, { token });
}

export function createCourse(token: string | null | undefined, body: CourseRequest) {
  return apiFetch<AdminCourse>("/api/admin/courses", { method: "POST", body, token });
}

export function updateCourse(token: string | null | undefined, courseId: string, body: CourseRequest) {
  return apiFetch<AdminCourse>(`/api/admin/courses/${courseId}`, { method: "PUT", body, token });
}

export function deleteCourse(token: string | null | undefined, courseId: string) {
  return apiFetch<void>(`/api/admin/courses/${courseId}`, { method: "DELETE", token });
}

// Reordena la grilla de cursos (flechas arriba/abajo en /admin/courses, ver
// AdminCourseController.reorderCourses) -- mismo patron que
// reorderArticles en adminBlog.ts.
export function reorderCourses(token: string | null | undefined, courseIds: string[]) {
  return apiFetch<void>("/api/admin/courses/reorder", {
    method: "PUT",
    body: { courseIds },
    token,
  });
}

export function createModule(token: string | null | undefined, courseId: string, body: ModuleRequest) {
  return apiFetch<AdminCourseModule>(`/api/admin/courses/${courseId}/modules`, { method: "POST", body, token });
}

export function updateModule(token: string | null | undefined, moduleId: string, body: ModuleRequest) {
  return apiFetch<AdminCourseModule>(`/api/admin/courses/modules/${moduleId}`, { method: "PUT", body, token });
}

export function deleteModule(token: string | null | undefined, moduleId: string) {
  return apiFetch<void>(`/api/admin/courses/modules/${moduleId}`, { method: "DELETE", token });
}

export function createLesson(token: string | null | undefined, moduleId: string, body: LessonRequest) {
  return apiFetch<AdminLesson>(`/api/admin/courses/modules/${moduleId}/lessons`, { method: "POST", body, token });
}

export function updateLesson(token: string | null | undefined, lessonId: string, body: LessonRequest) {
  return apiFetch<AdminLesson>(`/api/admin/courses/lessons/${lessonId}`, { method: "PUT", body, token });
}

export function deleteLesson(token: string | null | undefined, lessonId: string) {
  return apiFetch<void>(`/api/admin/courses/lessons/${lessonId}`, { method: "DELETE", token });
}

export function createResource(token: string | null | undefined, lessonId: string, body: LessonResourceRequest) {
  return apiFetch<AdminLessonResource>(`/api/admin/courses/lessons/${lessonId}/resources`, {
    method: "POST",
    body,
    token,
  });
}

export function updateResource(token: string | null | undefined, resourceId: string, body: LessonResourceRequest) {
  return apiFetch<AdminLessonResource>(`/api/admin/courses/resources/${resourceId}`, {
    method: "PUT",
    body,
    token,
  });
}

export function deleteResource(token: string | null | undefined, resourceId: string) {
  return apiFetch<void>(`/api/admin/courses/resources/${resourceId}`, { method: "DELETE", token });
}

// Bloques de contenido de una leccion (fase 4 del editor visual, ago 2026) --
// mismo patron que createBlock/updateBlock/deleteBlock/reorderBlocks en
// adminBlog.ts, espejado del lado de lecciones (ver BlockList.tsx, que
// recibe estas 4 funciones inyectadas via su prop `api`).
export function createLessonBlock(token: string | null | undefined, lessonId: string, body: LessonBlockRequest) {
  return apiFetch<AdminLessonBlock>(`/api/admin/courses/lessons/${lessonId}/blocks`, { method: "POST", body, token });
}

export function updateLessonBlock(token: string | null | undefined, blockId: string, body: LessonBlockRequest) {
  return apiFetch<AdminLessonBlock>(`/api/admin/courses/lessons/blocks/${blockId}`, { method: "PUT", body, token });
}

export function deleteLessonBlock(token: string | null | undefined, blockId: string) {
  return apiFetch<void>(`/api/admin/courses/lessons/blocks/${blockId}`, { method: "DELETE", token });
}

export function reorderLessonBlocks(token: string | null | undefined, lessonId: string, blockIds: string[]) {
  return apiFetch<void>(`/api/admin/courses/lessons/${lessonId}/blocks/reorder`, {
    method: "PUT",
    body: { blockIds },
    token,
  });
}

// Bloques de contenido del curso en si (fase 5 del editor visual, ago 2026)
// -- mismo patron que createLessonBlock/etc. de arriba, espejado del lado
// de cursos (ver BlockList.tsx, que recibe estas 4 funciones inyectadas via
// su prop `api`).
export function createCourseBlock(token: string | null | undefined, courseId: string, body: CourseBlockRequest) {
  return apiFetch<AdminCourseBlock>(`/api/admin/courses/${courseId}/blocks`, { method: "POST", body, token });
}

export function updateCourseBlock(token: string | null | undefined, blockId: string, body: CourseBlockRequest) {
  return apiFetch<AdminCourseBlock>(`/api/admin/courses/blocks/${blockId}`, { method: "PUT", body, token });
}

export function deleteCourseBlock(token: string | null | undefined, blockId: string) {
  return apiFetch<void>(`/api/admin/courses/blocks/${blockId}`, { method: "DELETE", token });
}

export function reorderCourseBlocks(token: string | null | undefined, courseId: string, blockIds: string[]) {
  return apiFetch<void>(`/api/admin/courses/${courseId}/blocks/reorder`, {
    method: "PUT",
    body: { blockIds },
    token,
  });
}

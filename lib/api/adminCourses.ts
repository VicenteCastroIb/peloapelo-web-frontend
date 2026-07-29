import { apiFetch } from "./client";
import type { CourseLevel, ResourceType } from "./courses";

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

export interface AdminLesson {
  id: string;
  moduleId: string;
  slug: string;
  title: string;
  videoUrl: string | null;
  body: string | null;
  durationMinutes: number;
  published: boolean;
  displayOrder: number;
  resources: AdminLessonResource[];
}

export interface AdminCourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  displayOrder: number;
  lessons: AdminLesson[];
}

export interface AdminCourse {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: CourseLevel;
  coverImageUrl: string | null;
  published: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  modules: AdminCourseModule[];
}

export interface AdminCourseSummary {
  id: string;
  slug: string;
  title: string;
  level: CourseLevel;
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
  body: string;
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

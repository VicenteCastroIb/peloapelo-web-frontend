import { apiFetch } from "./client";

// Cliente del CRUD de blog para el panel /admin (protegido ROLE_ADMIN en el
// backend, ver AdminBlogController + SecurityConfig). Mismo patron que
// lib/api/adminCourses.ts: siempre requiere sesion de administradora y ve
// tambien lo despublicado.

export interface AdminArticleBlock {
  id: string;
  articleId: string;
  blockType: string;
  position: number;
  /** JSON crudo (ver lib/types/blogBlocks.ts) -- se parsea/serializa en el componente del editor, no aca. */
  dataJson: string;
}

export interface AdminArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  coverImageUrl: string | null;
  readTime: string | null;
  published: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  blocks: AdminArticleBlock[];
}

export interface AdminArticleSummary {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  coverImageUrl: string | null;
  published: boolean;
  displayOrder: number;
  blockCount: number;
  updatedAt: string;
}

export interface ArticleRequest {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImageUrl: string;
  readTime: string;
  published: boolean;
  displayOrder: number;
}

export interface ArticleBlockRequest {
  blockType: string;
  position: number;
  dataJson: string;
}

export function listAdminArticles(token?: string | null) {
  return apiFetch<AdminArticleSummary[]>("/api/admin/blog", { token });
}

export function getAdminArticle(token: string | null | undefined, articleId: string) {
  return apiFetch<AdminArticle>(`/api/admin/blog/${articleId}`, { token });
}

export function createArticle(token: string | null | undefined, body: ArticleRequest) {
  return apiFetch<AdminArticle>("/api/admin/blog", { method: "POST", body, token });
}

export function updateArticle(token: string | null | undefined, articleId: string, body: ArticleRequest) {
  return apiFetch<AdminArticle>(`/api/admin/blog/${articleId}`, { method: "PUT", body, token });
}

export function deleteArticle(token: string | null | undefined, articleId: string) {
  return apiFetch<void>(`/api/admin/blog/${articleId}`, { method: "DELETE", token });
}

export function createBlock(token: string | null | undefined, articleId: string, body: ArticleBlockRequest) {
  return apiFetch<AdminArticleBlock>(`/api/admin/blog/${articleId}/blocks`, { method: "POST", body, token });
}

export function updateBlock(token: string | null | undefined, blockId: string, body: ArticleBlockRequest) {
  return apiFetch<AdminArticleBlock>(`/api/admin/blog/blocks/${blockId}`, { method: "PUT", body, token });
}

export function deleteBlock(token: string | null | undefined, blockId: string) {
  return apiFetch<void>(`/api/admin/blog/blocks/${blockId}`, { method: "DELETE", token });
}

export function reorderBlocks(token: string | null | undefined, articleId: string, blockIds: string[]) {
  return apiFetch<void>(`/api/admin/blog/${articleId}/blocks/reorder`, {
    method: "PUT",
    body: { blockIds },
    token,
  });
}

// Reordena la lista de articulos del blog (flechas arriba/abajo en
// /admin/blog, ver AdminBlogController.reorderArticles) -- reemplaza al
// viejo input numerico "Orden en el listado" que tenia el formulario.
export function reorderArticles(token: string | null | undefined, articleIds: string[]) {
  return apiFetch<void>("/api/admin/blog/reorder", {
    method: "PUT",
    body: { articleIds },
    token,
  });
}

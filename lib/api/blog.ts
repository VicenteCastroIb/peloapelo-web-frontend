import { apiFetch } from "./client";
import type { ArticleDetail, ArticleSummary } from "@/lib/types/blogBlocks";

// Lecturas publicas del blog (BlogController, GET permitAll -- ver
// SecurityConfig). Antes cache: "no-store" en las dos -- correcto para ver
// los cambios frescos tras publicar, pero como efecto secundario cada visita
// a /blog o /blog/[slug] quedaba bloqueada esperando una respuesta en vivo
// del backend, sin cache alguno (ver comentario largo en apiFetch,
// lib/api/client.ts). revalidate: 30 es el mismo patron ISR de Next --
// Jessica ve sus cambios reflejados en como mucho 30s, y el resto del
// tiempo (la enorme mayoria de las visitas) la pagina se sirve desde cache,
// sin ida y vuelta al backend.

export function listArticles() {
  return apiFetch<ArticleSummary[]>("/api/blog", { revalidate: 30 });
}

export function getArticleBySlug(slug: string) {
  return apiFetch<ArticleDetail>(`/api/blog/${slug}`, { revalidate: 30 });
}

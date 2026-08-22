"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Layers, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { listAdminArticles, reorderArticles, deleteArticle, type AdminArticleSummary } from "@/lib/api/adminBlog";
import { formatDate } from "@/lib/format";
import ArticleCardSkeleton from "@/components/articles/ArticleCardSkeleton";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function AdminBlogPage() {
  const { token } = useAuth();
  const [articles, setArticles] = useState<AdminArticleSummary[] | null>(null);
  const [reordering, setReordering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    listAdminArticles(token)
      .then(setArticles)
      .catch(() => setArticles([]));
  }, [token]);

  const sorted = articles ? [...articles].sort((a, b) => a.displayOrder - b.displayOrder) : [];

  // Mismo patron que BlockList.tsx move(): swap local + reorder completo al
  // backend (rewrite displayOrder 0..n-1), despues refetch. Reemplaza al
  // viejo input numerico "Orden en el listado" del formulario -- Jessica no
  // tiene por que pensar en numeros, solo en "este va antes/despues". Con
  // try/catch (bug real, ago 2026: no lo tenia -- un articulo borrado
  // entremedio hacia que esto tirara un error sin atajar y tumbara la
  // pagina).
  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sorted.length || reordering) return;
    const next = [...sorted];
    [next[index], next[target]] = [next[target], next[index]];
    setArticles(next);
    setReordering(true);
    setError(null);
    try {
      await reorderArticles(token, next.map((a) => a.id));
      const fresh = await listAdminArticles(token);
      setArticles(fresh);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo reordenar los artículos");
      // Sea cual sea el error, la lista local puede haber quedado
      // desincronizada del backend (el swap optimista de arriba ya se
      // aplico) -- se vuelve a pedir para no dejar el orden mostrado
      // mintiendo sobre el real.
      listAdminArticles(token)
        .then(setArticles)
        .catch(() => {});
    } finally {
      setReordering(false);
    }
  }

  async function confirmDelete() {
    if (!confirmId) return;
    const id = confirmId;
    setConfirmId(null);
    setDeletingId(id);
    setError(null);
    try {
      await deleteArticle(token, id);
      setArticles((prev) => (prev ? prev.filter((a) => a.id !== id) : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el artículo");
    } finally {
      setDeletingId(null);
    }
  }

  const articleToDelete = sorted.find((a) => a.id === confirmId) ?? null;

  return (
    <div className="max-w-6xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-h3-lg text-navy">Panel de blog</h1>
          <p className="mt-1 text-p-body text-navy/60">
            Crea y edita los artículos del blog. Un artículo solo se ve en el sitio cuando lo publicas.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex shrink-0 items-center gap-2 rounded-pill bg-navy px-4 py-2.5 text-a-inline font-semibold text-cream"
        >
          <Plus size={16} /> Nuevo artículo
        </Link>
      </div>

      {error && <p className="mt-4 text-p-small text-coral">{error}</p>}

      {articles === null && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      )}

      {articles?.length === 0 && (
        <div className="mt-8 rounded-card-lg bg-white p-10 text-center shadow-sm">
          <p className="text-p-body text-navy/70">Todavía no creaste ningún artículo.</p>
        </div>
      )}

      {/* Grilla de cards cuadradas (ago 2026, a pedido: volver al diseño con
          foto arriba e info abajo, como ArticleCard.tsx en el sitio publico
          -- las filas alargadas de antes no dejaban ubicar cada articulo a
          simple vista). Las flechas de reordenar viven FUERA del <Link>
          (hermanas, posicionadas encima con absolute) porque un boton
          anidado dentro de un <a> es HTML invalido y complica el click. */}
      {articles && articles.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((article, i) => (
            <div
              key={article.id}
              className="group relative overflow-hidden rounded-card-lg border border-navy/10 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="absolute left-2 top-2 z-10 flex items-center gap-0.5 rounded-pill bg-white/95 p-1 shadow-sm">
                <button
                  type="button"
                  disabled={i === 0 || reordering}
                  onClick={() => move(i, -1)}
                  className="rounded-pill p-2 text-navy/50 hover:bg-navy/5 disabled:opacity-20"
                  aria-label="Mover a la izquierda"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  disabled={i === sorted.length - 1 || reordering}
                  onClick={() => move(i, 1)}
                  className="rounded-pill p-2 text-navy/50 hover:bg-navy/5 disabled:opacity-20"
                  aria-label="Mover a la derecha"
                >
                  <ChevronRight size={15} />
                </button>
                <span className="mx-0.5 h-4 w-px bg-navy/10" aria-hidden />
                <button
                  type="button"
                  disabled={deletingId === article.id}
                  onClick={() => setConfirmId(article.id)}
                  className="rounded-pill p-2 text-navy/50 hover:bg-coral-soft hover:text-coral disabled:opacity-20"
                  aria-label={`Eliminar ${article.title}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <Link href={`/admin/blog/${article.id}`} className="block">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))]">
                  {article.coverImageUrl && (
                    // unoptimized: URL externa pegada a mano en el formulario, ver nota en ArticleCard.tsx
                    <Image
                      src={article.coverImageUrl}
                      alt=""
                      aria-hidden
                      fill
                      unoptimized
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <span
                    className={`absolute right-2 top-2 rounded-pill px-2.5 py-0.5 text-p-caption font-semibold ${
                      article.published ? "bg-accent text-cream" : "bg-white/90 text-navy/60"
                    }`}
                  >
                    {article.published ? "Publicado" : "Borrador"}
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-h3-sm text-navy line-clamp-1">{article.title}</p>
                  <p className="mt-1 text-p-caption text-navy/50">{article.category ?? "Sin categoría"}</p>
                  <div className="mt-3 flex items-center justify-between text-p-caption text-navy/50">
                    <span>Actualizado {formatDate(article.updatedAt)}</span>
                    <span className="flex items-center gap-1">
                      <Layers size={13} /> {article.blockCount}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        title={`¿Eliminar "${articleToDelete?.title ?? "este artículo"}"?`}
        description="Se va a eliminar el artículo junto con todo su contenido (todos los bloques). Esta acción no se puede deshacer."
        confirmLabel="Eliminar artículo"
        loading={deletingId !== null}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}

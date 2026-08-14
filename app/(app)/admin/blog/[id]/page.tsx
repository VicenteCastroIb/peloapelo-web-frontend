"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getAdminArticle,
  updateArticle,
  deleteArticle,
  type AdminArticle,
  type ArticleRequest,
} from "@/lib/api/adminBlog";
import { ApiError } from "@/lib/api/client";
import type { BlockData } from "@/lib/types/blogBlocks";
import ArticleForm from "@/components/admin/blog/ArticleForm";
import BlockList from "@/components/admin/blog/BlockList";
import LiveArticlePreview from "@/components/admin/blog/LiveArticlePreview";
import PreviewErrorBoundary from "@/components/admin/PreviewErrorBoundary";

function toArticleRequest(article: AdminArticle): ArticleRequest {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt ?? "",
    category: article.category ?? "",
    coverImageUrl: article.coverImageUrl ?? "",
    readTime: article.readTime ?? "",
    published: article.published,
    displayOrder: article.displayOrder,
  };
}

// Vista previa en vivo (ago 2026): mientras Jessica edita el titulo, los
// campos de portada o cualquier bloque, esta pagina mantiene un "borrador"
// en memoria (draftFields/draftBlocks) separado de lo guardado en el
// backend, y se lo pasa a LiveArticlePreview para que se vea la
// construccion del articulo en tiempo real -- sin necesidad de guardar
// primero. ArticleForm/BlockList siguen guardando explicitamente (botones
// "Guardar cambios"/"Guardar bloque"); el borrador es solo para la
// vista previa, nunca se manda solo por existir.
export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const router = useRouter();
  const [article, setArticle] = useState<AdminArticle | null>(null);
  const [draftFields, setDraftFields] = useState<ArticleRequest | null>(null);
  const [draftBlocks, setDraftBlocks] = useState<BlockData[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Bug real (ago 2026): esta llamada no tenia catch. Se dispara sola al
  // montar Y de nuevo cada vez que BlockList/ArticleForm terminan una accion
  // (onChange), asi que si el articulo dejaba de existir entremedio (se
  // borro desde otra pestaña, o quedo un id viejo en la URL) el 404
  // "Articulo no encontrado" quedaba como promise rejection sin manejar y
  // tumbaba toda la pagina con la pantalla roja de Next.js.
  const load = useCallback(() => {
    getAdminArticle(token, id)
      .then((loaded) => {
        setArticle(loaded);
        setDraftFields(toArticleRequest(loaded));
        setLoadError(null);
      })
      .catch((err) => {
        // 404 = ya no existe -- mismo criterio idempotente que handleDelete
        // de aca abajo: no tiene sentido mostrar un error, se vuelve al
        // listado, que ya no lo va a mostrar.
        if (err instanceof ApiError && err.status === 404) {
          router.push("/admin/blog");
          return;
        }
        setLoadError(err instanceof Error ? err.message : "No se pudo cargar el artículo");
      });
  }, [token, id, router]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpdate(values: ArticleRequest) {
    await updateArticle(token, id, values);
    load();
  }

  // El confirm() ya lo pide ArticleForm.handleDelete antes de llamar esto
  // (junto con la guardia anti-doble-click "deleting") -- pedirlo de nuevo
  // aca mostraria el dialogo dos veces.
  async function handleDelete() {
    try {
      await deleteArticle(token, id);
    } catch (err) {
      // 404 = ya no existe (ej. un doble click, o se elimino desde otra
      // pestaña) -- el resultado que la persona queria ya esta logrado, asi
      // que no tiene sentido mostrarle un error por eso. Cualquier otro
      // error si se propaga para que ArticleForm lo muestre.
      if (!(err instanceof ApiError && err.status === 404)) throw err;
    }
    router.push("/admin/blog");
  }

  if (loadError) {
    return (
      <div className="max-w-md rounded-card-md bg-white p-6 shadow-sm">
        <p className="text-p-small text-coral">{loadError}</p>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={load}
            className="rounded-pill bg-navy px-4 py-2 text-a-inline font-semibold text-cream"
          >
            Reintentar
          </button>
          <Link href="/admin/blog" className="text-a-inline font-semibold text-navy/60 hover:text-navy">
            Volver al panel
          </Link>
        </div>
      </div>
    );
  }

  if (!article || !draftFields) {
    return <p className="text-p-small text-navy/50">Cargando…</p>;
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0">
        <Link href="/admin/blog" className="inline-flex items-center gap-1 text-a-inline font-semibold text-navy/60">
          <ArrowLeft size={14} /> Panel de blog
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <h1 className="text-h3-lg text-navy">{article.title}</h1>
          {article.published && (
            <Link
              href={`/blog/${article.slug}`}
              target="_blank"
              className="flex items-center gap-1 text-p-caption font-semibold text-accent hover:underline"
            >
              <Eye size={13} /> Ver en el sitio
            </Link>
          )}
        </div>

        <div className="mt-6">
          <ArticleForm
            initial={draftFields}
            submitLabel="Guardar cambios"
            onSubmit={handleUpdate}
            onDelete={handleDelete}
            onChange={setDraftFields}
          />
        </div>

        <h2 className="mt-10 text-h3-md text-navy">Contenido del artículo</h2>
        <p className="mt-1 text-p-small text-navy/60">
          Agrega, edita, reordena o elimina los bloques que forman el cuerpo del artículo. Los
          cambios se ven al instante en la vista previa.
        </p>

        <div className="mt-4">
          <BlockList articleId={id} blocks={article.blocks} token={token} onChange={load} onLiveChange={setDraftBlocks} />
        </div>
      </div>

      {/* self-start: sin esto, el grid (align-items: stretch por defecto)
          estira este item a la misma altura que la columna izquierda -- un
          elemento sticky exactamente tan alto como su contenedor scrolleable
          no tiene "margen" para moverse y position:sticky deja de pegarse
          (se mueve 1 a 1 con el scroll, como si fuera position:static). Con
          self-start el item vuelve a su alto natural (el de la preview) y
          sticky si tiene espacio dentro de la fila para quedarse fijo. */}
      <div className="xl:sticky xl:top-6 xl:self-start">
        <PreviewErrorBoundary>
          <LiveArticlePreview fields={draftFields} blocks={draftBlocks} />
        </PreviewErrorBoundary>
      </div>
    </div>
  );
}

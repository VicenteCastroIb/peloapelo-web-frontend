"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  createBlock,
  deleteBlock,
  getAdminArticle,
  reorderBlocks,
  updateArticle,
  updateBlock,
  deleteArticle,
  type AdminArticle,
  type ArticleRequest,
} from "@/lib/api/adminBlog";
import { ApiError } from "@/lib/api/client";
import ArticleForm from "@/components/admin/blog/ArticleForm";
import ArticleHeaderPreview from "@/components/admin/blog/ArticleHeaderPreview";
import BlockList, { type BlockListApi } from "@/components/admin/blog/BlockList";
import Collapse from "@/components/shared/Collapse";
import DesktopOnlyNotice from "@/components/shared/DesktopOnlyNotice";

const BLOCK_API: BlockListApi = {
  create: createBlock,
  update: updateBlock,
  remove: deleteBlock,
  reorder: reorderBlocks,
};

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

// Editor visual de 3 columnas (fase 0, ago 2026): el lienzo central de
// BlockList ya muestra el articulo completo (encabezado + bloques) tal como
// va a quedar publicado, asi que no hace falta un panel de preview aparte
// como antes -- esta pagina solo mantiene el "borrador" en memoria
// (draftFields) de los campos de portada (titulo, resumen, etc.) y se lo
// pasa a BlockList para que el lienzo se actualice en tiempo real mientras
// se escribe en "Ajustes del articulo", sin necesidad de guardar primero.
// ArticleForm/BlockList siguen guardando explicitamente (botones "Guardar
// cambios"/"Guardar bloque"); el borrador nunca se manda solo por existir.
export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const router = useRouter();
  const [article, setArticle] = useState<AdminArticle | null>(null);
  const [draftFields, setDraftFields] = useState<ArticleRequest | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
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
    <div>
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
        <button
          type="button"
          onClick={() => setSettingsOpen((v) => !v)}
          className="flex items-center gap-1.5 text-a-inline font-semibold text-navy/70 hover:text-navy"
        >
          {settingsOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          Ajustes del artículo (título, resumen, portada, categoría…)
        </button>
        <Collapse open={settingsOpen} className="mt-3">
          <ArticleForm
            initial={draftFields}
            submitLabel="Guardar cambios"
            onSubmit={handleUpdate}
            onDelete={handleDelete}
            onChange={setDraftFields}
          />
        </Collapse>
      </div>

      <h2 className="mt-10 text-h3-md text-navy">Contenido del artículo</h2>
      <p className="mt-1 text-p-small text-navy/60">
        Hacé click en cualquier bloque del lienzo para editarlo desde el panel de la derecha,
        arrastralo para reordenarlo, o agregá uno nuevo desde el panel de la izquierda. Los cambios
        se ven al instante tal como van a quedar publicados.
      </p>

      <div className="mt-4">
        <DesktopOnlyNotice>
          Este editor de contenido está pensado para pantallas de escritorio. Podés
          revisarlo desde el celular, pero para armar o reordenar bloques con
          comodidad, usá una computadora.
        </DesktopOnlyNotice>
        <BlockList
          ownerId={id}
          blocks={article.blocks}
          headerPreview={<ArticleHeaderPreview fields={draftFields} />}
          emptyMessage="Este artículo todavía no tiene contenido. Agregá el primer bloque desde el panel de la izquierda."
          token={token}
          api={BLOCK_API}
          onChange={load}
        />
      </div>
    </div>
  );
}

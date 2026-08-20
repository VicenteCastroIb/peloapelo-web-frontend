"use client";

import { Eye } from "lucide-react";
import type { ArticleRequest } from "@/lib/api/adminBlog";
import type { BlockData } from "@/lib/types/blogBlocks";
import BlockDataList from "@/components/articles/BlockDataList";
import ArticleHeaderPreview from "./ArticleHeaderPreview";

// Vista previa en vivo del articulo tal como se veria en /blog/[slug] (ver
// esa pagina para el original) -- reusa ArticleHeaderPreview y BlockDataList,
// el mismo nucleo de render que usa la pagina publica, asi que un cambio en
// el editor se ve aca exactamente como se va a ver publicado, sin
// reimplementar el render. Usada por /admin/blog/new (todavia no hay
// articulo creado, asi que no hay lienzo de bloques editable posible -- ver
// BlockList.tsx para ese caso, usado en /admin/blog/[id]).
export default function LiveArticlePreview({ fields, blocks }: { fields: ArticleRequest; blocks: BlockData[] }) {
  return (
    <div className="rounded-card-lg border border-navy/10 bg-white shadow-sm">
      <div className="flex items-center gap-2 rounded-t-card-lg border-b border-navy/10 bg-navy/5 px-4 py-2.5 text-p-caption font-semibold text-navy/60">
        <Eye size={14} />
        Vista previa en vivo
      </div>

      <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-6 py-8 sm:px-10">
        <ArticleHeaderPreview fields={fields} />

        <div className="mt-10">
          {blocks.length > 0 ? (
            <BlockDataList blocks={blocks} />
          ) : (
            <div className="mx-auto max-w-3xl rounded-card-lg border border-navy/10 bg-cream p-8 text-center">
              <p className="text-p-body text-navy/60">Todavía no agregaste bloques de contenido.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

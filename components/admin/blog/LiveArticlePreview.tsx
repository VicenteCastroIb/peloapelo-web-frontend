"use client";

import Image from "next/image";
import { BadgeCheck, Clock, Eye } from "lucide-react";
import type { ArticleRequest } from "@/lib/api/adminBlog";
import type { BlockData } from "@/lib/types/blogBlocks";
import BlockDataList from "@/components/articles/BlockDataList";

// Vista previa en vivo del articulo tal como se veria en /blog/[slug] (ver
// esa pagina para el original) -- reusa BlockDataList, el mismo nucleo de
// render que usa la pagina publica, asi que un cambio en el editor se ve
// aca exactamente como se va a ver publicado, sin reimplementar el render.
// Deliberadamente MAS simple que la pagina real: sin "volver al blog", sin
// FadeInOnScroll (no tiene sentido una animacion de entrada en un panel que
// ya esta siempre visible) y sin articulos relacionados.
export default function LiveArticlePreview({ fields, blocks }: { fields: ArticleRequest; blocks: BlockData[] }) {
  return (
    <div className="rounded-card-lg border border-navy/10 bg-white shadow-sm">
      <div className="flex items-center gap-2 rounded-t-card-lg border-b border-navy/10 bg-navy/5 px-4 py-2.5 text-p-caption font-semibold text-navy/60">
        <Eye size={14} />
        Vista previa en vivo
      </div>

      <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-6 py-8 sm:px-10">
        <div className="mx-auto max-w-3xl">
          {fields.category && (
            <span className="text-h4-label text-accent">{fields.category}</span>
          )}
          <h1 className="mt-2 text-h2-xl text-navy">{fields.title || "Título del artículo"}</h1>
          {fields.excerpt && <p className="mt-4 text-p-lead text-navy/70">{fields.excerpt}</p>}

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-p-small text-navy/50">
            {fields.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock size={15} />
                {fields.readTime}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-accent">
              <BadgeCheck size={15} />
              Creado por profesionales con evidencia científica
            </span>
          </div>

          {fields.coverImageUrl && (
            <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-card-lg bg-navy/10">
              <Image src={fields.coverImageUrl} alt="" aria-hidden fill unoptimized sizes="600px" className="object-cover" />
            </div>
          )}
        </div>

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

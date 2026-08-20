"use client";

import Image from "next/image";
import { BadgeCheck, Clock } from "lucide-react";
import type { ArticleRequest } from "@/lib/api/adminBlog";

// Encabezado del articulo (categoria, titulo, resumen, meta, portada) tal
// como se ve en /blog/[slug] -- extraido de LiveArticlePreview.tsx (ago
// 2026) para que el lienzo editable de BlockList.tsx pueda mostrar el mismo
// encabezado arriba de los bloques, sin duplicar este JSX. Estos campos se
// siguen editando por formulario (ArticleForm, panel "Ajustes del
// articulo"), no in-place aca -- ver nota de fase 0 en BlockList.tsx.
export default function ArticleHeaderPreview({ fields }: { fields: ArticleRequest }) {
  return (
    <div className="mx-auto max-w-3xl">
      {fields.category && <span className="text-h4-label text-accent">{fields.category}</span>}
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
  );
}

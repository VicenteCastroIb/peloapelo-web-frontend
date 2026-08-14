import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ArticleSummary } from "@/lib/types/blogBlocks";

// Tarjeta compartida entre <RelatedArticles /> (home) y /blog: se separa en
// su propio archivo para no duplicar el markup en ambos lugares. Enlaza a la
// pagina de detalle real /blog/[slug]. Desde que el blog paso a ser
// editable (panel /admin/blog, ago 2026), `article` viene del backend
// (GET /api/blog, ver lib/api/blog.ts) en vez del mock estatico que habia
// antes en lib/data/articles.ts -- por eso coverImageUrl/category/excerpt/
// readTime pueden venir null (Jessica todavia no los completo) y se
// manejan con fallback en vez de asumir que siempre existen.
export default function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-card-lg border border-navy/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))]">
        {article.coverImageUrl && (
          // unoptimized: coverImageUrl es una URL externa que Jessica pega a mano
          // desde /admin/blog (ver nota en components/admin/blog/ArticleForm.tsx) --
          // puede venir de cualquier host, y next/image por defecto exige que cada
          // host este en la whitelist de next.config.ts o tira "Invalid src prop".
          // Sin optimizer no hay lista que mantener ni riesgo de SSRF via el proxy
          // de optimizacion (ver tambien app/blog/[slug]/page.tsx y los bloques
          // icon_card_grid/loop_diagram, mismo caso).
          <Image
            src={article.coverImageUrl}
            alt=""
            aria-hidden
            fill
            unoptimized
            sizes="(min-width: 640px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {article.category && <span className="text-h4-label text-accent">{article.category}</span>}
        <h3 className="mt-2 text-h3-md text-navy">{article.title}</h3>
        <p className="mt-2 flex-1 text-p-small text-navy/70">{article.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-p-caption text-navy/50">
          <span>{article.readTime}</span>
          <span className="flex items-center gap-1 font-bold text-coral">
            Leer más
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

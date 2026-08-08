import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Article } from "@/lib/data/articles";

// Tarjeta compartida entre <RelatedArticles /> (home) y /blog: se separa en
// su propio archivo para no duplicar el markup en ambos lugares. Sin pagina
// de detalle por articulo todavia, ver comentario en lib/data/articles.ts:
// el CTA enlaza a /blog.
export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href="/blog"
      className="group flex flex-col overflow-hidden rounded-card-lg border border-navy/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={article.image}
          alt=""
          aria-hidden
          fill
          sizes="(min-width: 640px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="text-h4-label text-accent">{article.category}</span>
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

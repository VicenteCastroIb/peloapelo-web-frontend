import type { Metadata } from "next";
import ArticleCard from "@/components/sections/ArticleCard";
import EbookGratuito from "@/components/sections/EbookGratuito";
import { articles } from "@/lib/data/articles";

export const metadata: Metadata = {
  title: "Blog · Pelo a Pelo",
  description:
    "Recursos y artículos sobre alopecia, bienestar emocional y autocuidado, escritos con evidencia y sin promesas vacías.",
};

// Pagina nueva "Recursos y Articulos" (ver tarea de reestructuracion, ago
// 2026). Mismos 3 articulos mock que <RelatedArticles /> en el home (ver
// lib/data/articles.ts, fuente unica) para no duplicar datos; esta pagina
// es la version "ver todo" a la que apunta esa seccion.
//
// <EbookGratuito /> se reubica aca (sin tocar su texto): salio del home en
// el reorden porque no estaba en la estructura exacta pedida, pero es un
// recurso real y funcional -- "Recursos y articulos" es su lugar natural,
// no un anexo descartado. Header/Footer/ComoFunciona apuntan a /blog#ebook.
export default function BlogPage() {
  return (
    <section className="px-6 py-20 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="text-h4-label text-navy/50">Recursos</p>
        <h1 className="mx-auto mt-4 max-w-2xl text-h2-lg text-navy">
          Blog <span className="italic text-accent">Pelo a Pelo</span>.
        </h1>
        <p className="mt-4 max-w-lg text-p-body text-navy/70">
          Artículos sobre alopecia, bienestar emocional y autocuidado, escritos con
          evidencia y sin promesas vacías.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>

      <div className="mt-16">
        <EbookGratuito />
      </div>
    </section>
  );
}

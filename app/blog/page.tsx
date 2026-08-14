import type { Metadata } from "next";
import ArticleCard from "@/components/sections/ArticleCard";
import EbookGratuito from "@/components/sections/EbookGratuito";
import { listArticles } from "@/lib/api/blog";

export const metadata: Metadata = {
  title: "Blog · Pelo a Pelo",
  description:
    "Recursos y artículos sobre alopecia, bienestar emocional y autocuidado, escritos con evidencia y sin promesas vacías.",
};

// Pagina "Recursos y Articulos". Blog editable (ago 2026): los articulos se
// piden al backend (GET /api/blog, mismos datos que alimentan
// <RelatedArticles /> en el home) en vez de un mock estatico -- Jessica los
// crea/edita desde /admin/blog.
//
// <EbookGratuito /> vive aca (sin tocar su texto): es un recurso real y
// funcional, "Recursos y articulos" es su lugar natural. Header/Footer/
// ComoFunciona apuntan a /blog#ebook.
export default async function BlogPage() {
  const articles = await listArticles().catch(() => []);

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

        {articles.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <p className="mt-12 text-p-body text-navy/60">
            Estamos preparando los primeros artículos. Vuelve pronto.
          </p>
        )}
      </div>

      <div className="mt-16">
        <EbookGratuito />
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, Clock } from "lucide-react";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import SectionBadge from "@/components/shared/SectionBadge";
import ArticleCard from "@/components/sections/ArticleCard";
import ArticleBlocksRenderer from "@/components/articles/ArticleBlocksRenderer";
import ReadingProgressBar from "@/components/articles/ReadingProgressBar";
import { getArticleBySlug, listArticles } from "@/lib/api/blog";
import { ApiError } from "@/lib/api/client";

// Blog editable (ago 2026): el articulo (metadata + bloques de contenido)
// se pide al backend por slug (GET /api/blog/{slug}, BlogService -- 404 si
// no existe o no esta publicado) en vez del registro estatico
// slug->componente que habia antes. Sin generateStaticParams a proposito:
// el contenido se edita en cualquier momento desde /admin/blog, asi que la
// pagina se renderiza siempre en el momento (SSR), no en build time (ver
// tambien cache: "no-store" en lib/api/blog.ts).

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await getArticleBySlug(slug);
    return {
      title: `${article.title} · Pelo a Pelo`,
      description: article.excerpt ?? undefined,
    };
  } catch {
    return {};
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Paralelo, no en cascada (optimizacion de tiempos de carga, ago 2026):
  // "related" no depende en nada del resultado de "article" (solo se filtra
  // el propio slug despues), asi que no hay razon para esperar a que
  // termine un fetch antes de arrancar el otro -- eso duplicaba el tiempo
  // de espera del SSR sin necesidad.
  const [article, allArticles] = await Promise.all([
    getArticleBySlug(slug).catch((error) => {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }),
    listArticles().catch(() => []),
  ]);
  if (!article) notFound();

  const related = allArticles.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <>
      <ReadingProgressBar />
      <article className="px-6 py-16 lg:px-12 lg:py-20">
        <FadeInOnScroll className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-a-inline font-bold text-navy/50 hover:text-accent"
          >
            <ArrowLeft size={15} />
            Volver al blog
          </Link>

          {article.category && (
            <div className="mt-6">
              <SectionBadge label={article.category} />
            </div>
          )}
          <h1 className="text-h2-xl text-navy">{article.title}</h1>
          {article.excerpt && <p className="mt-4 text-p-lead text-navy/70">{article.excerpt}</p>}

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-p-small text-navy/50">
            {article.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock size={15} />
                {article.readTime}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-accent">
              <BadgeCheck size={15} />
              Creado por profesionales con evidencia científica
            </span>
          </div>

          {article.coverImageUrl && (
            <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-card-lg bg-navy/10">
              {/* unoptimized: URL externa pegada a mano en /admin/blog, ver nota en ArticleCard.tsx */}
              <Image
                src={article.coverImageUrl}
                alt=""
                aria-hidden
                fill
                unoptimized
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          )}
        </FadeInOnScroll>

        {/* Sin FadeInOnScroll aca a proposito (bug real encontrado ago 2026):
            envolver TODO el cuerpo del articulo en un solo fade-in-on-scroll
            requiere que un 15% de su alto total este visible a la vez para
            disparar -- en un articulo largo eso practicamente nunca pasa
            (el 15% de un bloque de 4000px+ es mas que el viewport), asi que
            el observer nunca dispara y el articulo queda con opacity-0
            invisible para siempre. El fade-in tiene sentido para bloques
            cortos tipo landing (headers, tarjetas); no para texto largo de
            lectura, que ademas no deberia depender de una animacion para
            ser legible. */}
        <div className="mt-10">
          {article.blocks.length > 0 ? (
            <ArticleBlocksRenderer blocks={article.blocks} />
          ) : (
            <FadeInOnScroll className="mx-auto max-w-3xl">
              <div className="rounded-card-lg border border-navy/10 bg-white p-8 text-center">
                <p className="text-h3-md text-navy">Este artículo está en preparación.</p>
                <p className="mt-2 text-p-body text-navy/70">
                  Estamos investigando este tema en fuentes médicas y
                  psicológicas para escribirlo con el mismo cuidado que el
                  resto del blog. Vuelve pronto.
                </p>
                <Link
                  href="/blog"
                  className="mt-5 inline-block text-a-inline font-bold text-accent hover:underline"
                >
                  Ver otros artículos →
                </Link>
              </div>
            </FadeInOnScroll>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="px-6 pb-24 lg:px-12">
          <FadeInOnScroll className="mx-auto max-w-6xl border-t border-navy/10 pt-16">
            <SectionBadge label="Sigue leyendo" />
            <h2 className="text-h2-md text-navy">
              Más recursos <span className="italic text-accent">para ti</span>.
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ArticleCard key={item.slug} article={item} />
              ))}
            </div>
          </FadeInOnScroll>
        </section>
      )}
    </>
  );
}

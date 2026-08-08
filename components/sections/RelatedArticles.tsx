import Link from "next/link";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import ArticleCard from "@/components/sections/ArticleCard";
import { articles } from "@/lib/data/articles";

export default function RelatedArticles() {
  return (
    <section className="px-6 py-24 lg:px-12 lg:py-28">
      <FadeInOnScroll className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionBadge label="Recursos" />
            <h2 className="max-w-lg text-h2-lg text-navy">
              Para seguir <span className="italic text-accent">aprendiendo</span>.
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-a-inline font-bold text-accent hover:underline"
          >
            Ver todo el blog →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </FadeInOnScroll>
    </section>
  );
}

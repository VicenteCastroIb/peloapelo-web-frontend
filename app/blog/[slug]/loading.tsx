import Skeleton from "@/components/shared/Skeleton";

// Ver app/blog/loading.tsx -- mismo mecanismo nativo de Next.js, aca para
// la vista de detalle de un articulo mientras getArticleBySlug()/
// listArticles() todavia no responden (ver app/blog/[slug]/page.tsx).
export default function ArticleLoading() {
  return (
    <article className="px-6 py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="mt-6 h-4 w-24 rounded-md" />
        <Skeleton className="mt-3 h-9 w-full rounded-md" />
        <Skeleton className="mt-2 h-9 w-2/3 rounded-md" />
        <Skeleton className="mt-4 h-5 w-full rounded-md" />
        <Skeleton className="mt-2 h-5 w-4/5 rounded-md" />

        <div className="mt-5 flex gap-5">
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-4 w-52 rounded-md" />
        </div>

        <Skeleton className="mt-8 aspect-[16/9] w-full rounded-card-lg" />

        <div className="mt-10 space-y-4">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
        </div>
      </div>
    </article>
  );
}

import ArticleCardSkeleton from "@/components/articles/ArticleCardSkeleton";
import Skeleton from "@/components/shared/Skeleton";

// loading.tsx es un mecanismo nativo de Next.js App Router: mientras
// BlogPage (Server Component, ver app/blog/page.tsx) esta resolviendo su
// fetch, Next muestra esto de inmediato via Suspense -- no hace falta
// ningun estado de carga manual. Misma estructura que la pagina real
// (px-6 py-20, max-w-6xl, grid de 3 columnas) para que no haya salto de
// layout cuando llega el contenido de verdad.
export default function BlogLoading() {
  return (
    <section className="px-6 py-20 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <Skeleton className="h-4 w-20 rounded-md" />
        <Skeleton className="mt-4 h-9 w-72 rounded-md" />
        <Skeleton className="mt-4 h-5 w-96 max-w-full rounded-md" />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

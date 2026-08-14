import Skeleton from "@/components/shared/Skeleton";

// Misma forma que ArticleCard.tsx real (aspect-[16/10] + p-6 con
// categoria/titulo/excerpt/meta) -- se usa mientras listArticles() todavia
// no responde (ver app/blog/loading.tsx).
export default function ArticleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card-lg border border-navy/10 bg-white">
      {/* Sin rounded propio: el overflow-hidden del contenedor ya recorta
          las esquinas superiores igual que la imagen real. */}
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="space-y-3 p-6">
        <Skeleton className="h-3 w-20 rounded-md" />
        <Skeleton className="h-5 w-4/5 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-3 w-14 rounded-md" />
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}

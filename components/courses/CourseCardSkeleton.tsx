import Skeleton from "@/components/shared/Skeleton";

// Misma forma que la card real de curso (ver app/(app)/courses/page.tsx y
// admin/courses/page.tsx: aspect-[16/10] arriba + padding p-5/p-4 abajo) --
// se usa mientras fetchCourses()/listAdminCourses() todavia no responden.
export default function CourseCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card-lg bg-white shadow-sm">
      {/* Sin rounded propio: el overflow-hidden + rounded-card-lg del
          contenedor ya recorta las esquinas superiores igual que la imagen real. */}
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
        <div className="flex gap-4 pt-1">
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="h-3 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}

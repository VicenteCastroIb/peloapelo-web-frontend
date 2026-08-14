import Skeleton from "@/components/shared/Skeleton";

// Reemplaza al spinner centrado que se mostraba mientras useAuth() resuelve
// fetchMe() (ago 2026, a pedido -- "no debe dar sensacion que se demora").
// Ese chequeo de sesion es la primera cosa que corre en CUALQUIER ruta
// autenticada (dashboard, cursos, blog admin, etc, ver app/(app)/layout.tsx)
// y no se puede saltar por seguridad (hay que saber si hay sesion antes de
// mostrar contenido protegido) -- pero un spinner solo en el medio de una
// pantalla vacia se siente mucho mas lento que ver de entrada la silueta del
// panel (sidebar + bloques de contenido) donde va a aparecer todo. Misma
// estructura que el layout real (aside w-56 + columna de contenido) para
// que no haya salto cuando el layout de verdad se monta.
export default function AppShellSkeleton() {
  return (
    <div className="flex h-[calc(100vh-72px)]">
      <aside className="flex h-full w-56 shrink-0 flex-col gap-1 border-r border-navy/10 bg-white px-6 py-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full rounded-pill" />
        ))}
      </aside>
      <div className="flex-1 overflow-hidden px-8 py-10 lg:px-12">
        <Skeleton className="h-7 w-56 rounded-md" />
        <Skeleton className="mt-2 h-4 w-80 max-w-full rounded-md" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[16/10] w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

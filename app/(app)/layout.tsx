"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import CompactFooter from "@/components/layout/CompactFooter";
import AppShellSkeleton from "@/components/layout/AppShellSkeleton";
import { isImmersiveLessonPath } from "@/lib/routes";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  // La leccion (ver lib/routes.ts) ya no lleva Header global ni este
  // DashboardSidebar -- LessonImmersiveHeader los reemplaza a ambos con una
  // barra compacta propia (ver app/(app)/courses/[slug]/[lessonSlug]/layout.tsx).
  const immersive = isImmersiveLessonPath(pathname);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth");
    }
  }, [status, router]);

  if (status !== "authenticated") {
    // La leccion inmersiva sigue con spinner simple (pantalla completa, sin
    // sidebar ni columnas que esbozar); el resto del panel usa el esqueleto
    // de silueta completa (ver AppShellSkeleton.tsx).
    if (immersive) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      );
    }
    return <AppShellSkeleton />;
  }

  if (immersive) {
    return <>{children}</>;
  }

  return (
    // h- (no min-h) a proposito: con min-h, esta fila crecia mas alta que el
    // viewport apenas el contenido era largo, y entonces terminaba
    // scrolleando la VENTANA en vez de este div -- DashboardSidebar se iba
    // scroll arriba con todo lo demas en cualquier pagina larga (bug
    // preexistente, encontrado ago 2026 al agregar la vista previa en vivo
    // del blog: position:sticky dentro de .overflow-y-auto no tiene nada a
    // que "pegarse" si ese div nunca es el que scrollea de verdad). Con
    // altura fija, el div de contenido si contiene su propio overflow y
    // scrollea el solo -- el sidebar queda fijo, como se ve que era la
    // intencion original (aside con h-full + el resto del layout de la app).
    <div className="flex h-[calc(100vh-72px)]">
      <DashboardSidebar />
      {/* CompactFooter vive ADENTRO de esta columna con scroll propio (no
          como hermano a nivel de SiteChrome.tsx) para que aparezca al final
          del contenido de cada pantalla sin depender de que la PAGINA
          entera scrollee -- eso arrastraria a DashboardSidebar con ella (ver
          comentario de mas arriba sobre por que esta fila es h-, no min-h-).
          El padding del contenido vive en un div interno para que el footer
          pueda ir a sangre completa, sin heredar ese padding. */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-10 lg:px-12">{children}</div>
        <CompactFooter />
      </div>
    </div>
  );
}

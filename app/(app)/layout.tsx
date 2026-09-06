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

  // Fondo decorativo del panel completo (ago 2026, a pedido: "aplica el
  // mismo fondo de suscripcion a todo el panel, que tome desde el header
  // hacia abajo"). Nacio en /subscription (ver commits previos) y se subio
  // aca para que las demas pantallas del panel (dashboard, progreso,
  // perfil, cursos, etc.) lo compartan sin repetir el useEffect por pagina.
  // Vive en el <body>, no en un div de este layout, para que llegue de
  // verdad al extremo de la ventana en vez de quedar acotado al ancho de la
  // columna de contenido (ver ".pap-panel-bg" en globals.css). No se activa
  // en la leccion inmersiva (immersive, mas abajo): esa pantalla ya
  // reemplaza este layout entero con su propio header compacto.
  useEffect(() => {
    if (immersive) return;
    document.body.classList.add("pap-panel-bg");
    return () => document.body.classList.remove("pap-panel-bg");
  }, [immersive]);

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
      {/* La franja decorativa que asomaba sobre el header (mix-blend-mode
          sobre la acuarela, ver ".pap-panel-bg-peek", ahora sin uso en
          globals.css) se saco (ago 2026, a pedido: "deja el header blanco
          si no puedes arreglarlo" -- pese al ajuste del degradado a radial,
          seguia viendose un corte de color ahi). El header del panel queda
          blanco solido sin ningun overlay (ver Header.tsx, appPanel); el
          fondo del <body> (ver el useEffect de arriba) sigue cubriendo el
          resto de la pantalla normalmente. */}
      <DashboardSidebar />
      {/* CompactFooter vive ADENTRO de esta columna con scroll propio (no
          como hermano a nivel de SiteChrome.tsx) para que aparezca al final
          del contenido de cada pantalla sin depender de que la PAGINA
          entera scrollee -- eso arrastraria a DashboardSidebar con ella (ver
          comentario de mas arriba sobre por que esta fila es h-, no min-h-).
          El padding del contenido vive en un div interno para que el footer
          pueda ir a sangre completa, sin heredar ese padding.
          flex flex-col + flex-1 en el div de contenido (ago 2026, a pedido
          -- "cuando hay poca info queda un espacio debajo del footer"):
          antes el contenido ocupaba solo su alto natural y el footer
          quedaba pegado justo debajo de el, dejando el resto de esta
          columna (que SI esta estirada a la altura completa del panel via
          el flex del padre) en blanco por debajo del footer. Con
          flex-1 el contenido crece para llenar el espacio disponible
          cuando es corto -- empujando el footer al fondo real, sin hueco --
          y si el contenido es mas alto que la pantalla simplemente sigue
          su alto natural y el footer aparece al final del scroll, como
          corresponde. */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex-1 px-8 py-10 lg:px-12">{children}</div>
        <CompactFooter />
      </div>
    </div>
  );
}

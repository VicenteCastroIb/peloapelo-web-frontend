"use client";

// Punto unico de decision de si esta ruta lleva el chrome global (Header +
// Footer) o entra en modo inmersion (ver lib/routes.ts). Antes Header y
// Footer se renderizaban siempre desde app/layout.tsx -- no habia forma de
// ocultarlos para una ruta especifica sin volver ese layout raiz en client
// component. Este wrapper hace justamente eso, y app/(app)/layout.tsx usa
// la misma funcion isImmersiveLessonPath para decidir si tambien oculta el
// DashboardSidebar.
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PanelSidebarProvider } from "@/components/layout/PanelSidebarContext";
import { isAppPanelPath, isImmersiveLessonPath } from "@/lib/routes";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isImmersiveLessonPath(pathname)) {
    return <main className="flex-1">{children}</main>;
  }

  // El panel interno (dashboard, cursos, perfil, /admin, etc., ver
  // lib/routes.ts) no lleva el Footer publico completo -- tiene su propio
  // CompactFooter, montado adentro de app/(app)/layout.tsx en vez de aca.
  // La razon de que viva ahi y no aca: ese layout tiene su propia columna
  // con scroll interno (h-[calc(100vh-72px)] + overflow-y-auto, ver el
  // comentario en ese archivo) -- si el footer se agregara aca, como
  // hermano de afuera de esa columna, quedaria fuera del alto exacto del
  // viewport y solo se veria haciendo scrollear la PAGINA entera, arrastrando
  // consigo al DashboardSidebar que se supone queda fijo.
  const appPanel = isAppPanelPath(pathname);

  return (
    // El Provider envuelve Header y main (ver PanelSidebarContext.tsx): el
    // boton hamburguesa del panel vive en Header, el drawer que abre vive
    // adentro de main (DashboardSidebar, ver app/(app)/layout.tsx) -- este
    // es el ancestro comun mas cercano a ambos.
    <PanelSidebarProvider>
      <Header />
      <main className="flex-1 pt-[72px]">{children}</main>
      {!appPanel && <Footer />}
    </PanelSidebarProvider>
  );
}

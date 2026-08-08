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
import { isImmersiveLessonPath } from "@/lib/routes";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isImmersiveLessonPath(pathname)) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 pt-[72px]">{children}</main>
      <Footer />
    </>
  );
}

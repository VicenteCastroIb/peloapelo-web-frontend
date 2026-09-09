"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthContext";
import { isAppPanelPath } from "@/lib/routes";

export default function HeaderAuthCta() {
  const { user, status, logout } = useAuth();
  const pathname = usePathname();

  if (status === "loading") {
    return <div className="h-10 w-32 animate-pulse rounded-pill bg-navy/5" aria-hidden />;
  }

  if (status === "authenticated" && user) {
    // "Ingresar" (ago 2026, a pedido): antes, para llegar a su panel desde
    // la pagina de inicio, habia que ir primero a /dashboard -- este Header
    // es global (se ve en "/" tambien), asi que un acceso directo aca
    // ahorra ese paso intermedio. Antes era solo para ADMIN (directo a
    // /admin/blog); ahora tambien para usuarios normales (directo a
    // /dashboard, ya que "Hola, {nombre}" -- que cumplia ese rol -- se
    // saco del header a pedido).
    // "Volver a inicio" (ago 2026, a pedido -- "el 'ingresar' solo debe estar
    // en la pagina principal, no en el panel; en el panel debe decir 'volver
    // a inicio'"): mismo lugar en el layout, pero invertido -- una vez ya
    // adentro del panel, "Ingresar" no tiene sentido (ya entro), lo util ahi
    // es el camino de vuelta al sitio publico. Fuera de "/" y fuera del
    // panel (ej. /blog, /fundacion) no se muestra ninguno de los dos.
    const isHome = pathname === "/";
    const appPanel = isAppPanelPath(pathname);
    const panelHref = user.role === "ADMIN" ? "/admin/blog" : "/dashboard";

    return (
      <div className="flex items-center gap-3">
        {isHome && (
          <Link href={panelHref} className="hidden text-a-nav font-semibold text-accent hover:underline sm:inline">
            Ingresar
          </Link>
        )}
        {appPanel && (
          <Link href="/" className="hidden text-a-nav font-semibold text-accent hover:underline sm:inline">
            Volver a inicio
          </Link>
        )}
        <Button variant="outline" onClick={logout}>
          Cerrar sesión
        </Button>
      </div>
    );
  }

  // CTA destacado a la derecha del Header: "Haz el Quiz" lleva al quiz inicial
  // de autoevaluacion en /quiz (ruta publica, mismo destino que "Haz el quiz
  // gratuito" del Hero). Se deja un link secundario mas discreto a /auth para
  // quien ya tiene cuenta y solo quiere entrar, sin competir visualmente con
  // el CTA principal.
  return (
    <div className="flex items-center gap-4">
      <Link href="/auth" className="hidden text-a-nav text-navy/70 hover:text-navy sm:inline">
        Iniciar sesión
      </Link>
      <Button href="/quiz" variant="gradient">
        Haz el Quiz
      </Button>
    </div>
  );
}

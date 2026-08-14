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
    const firstName = user.fullName?.split(" ")[0] || user.email;
    // "Ingresar" (ago 2026, a pedido): antes, para llegar a /admin/blog desde
    // la pagina de inicio, Jessica tenia que ir primero a /dashboard y ahi
    // recien clickear "Panel de blog" en el sidebar -- este Header es global
    // (se ve en "/" tambien), asi que un acceso directo aca ahorra ese paso
    // intermedio. Solo se muestra a ADMIN; un usuario normal no tiene panel
    // al que entrar.
    // "Volver a inicio" (ago 2026, a pedido -- "el 'ingresar' solo debe estar
    // en la pagina principal, no en el panel; en el panel debe decir 'volver
    // a inicio'"): mismo lugar en el layout, pero invertido -- una vez que
    // Jessica ya esta adentro del panel, "Ingresar" no tiene sentido (ya
    // entro), lo util ahi es el camino de vuelta al sitio publico. Fuera de
    // "/" y fuera del panel (ej. /blog, /fundacion) no se muestra ninguno de
    // los dos, tal como se pidio explicitamente para "Ingresar".
    const isHome = pathname === "/";
    const appPanel = isAppPanelPath(pathname);

    return (
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="hidden text-a-nav text-navy/70 hover:text-navy sm:inline">
          Hola, {firstName}
        </Link>
        {user.role === "ADMIN" && isHome && (
          <Link href="/admin/blog" className="hidden text-a-nav font-semibold text-accent hover:underline sm:inline">
            Ingresar
          </Link>
        )}
        {user.role === "ADMIN" && appPanel && (
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

  // CTA destacado a la derecha del Header (ver tarea de reestructuracion,
  // ago 2026): antes solo "Iniciar sesión". /auth ya maneja login/registro
  // en la misma pantalla (mismo destino que "Haz el quiz gratuito" del
  // Hero), asi que un mismo boton sirve para ambos casos -- se deja un
  // link secundario mas discreto para quien ya tiene cuenta y solo quiere
  // entrar, sin competir visualmente con el CTA principal.
  return (
    <div className="flex items-center gap-4">
      <Link href="/auth" className="hidden text-a-nav text-navy/70 hover:text-navy sm:inline">
        Iniciar sesión
      </Link>
      <Button href="/auth" variant="gradient">
        Haz el Quiz
      </Button>
    </div>
  );
}

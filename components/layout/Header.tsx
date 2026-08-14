"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HeaderAuthCta from "@/components/layout/HeaderAuthCta";
import { useScrolled } from "@/lib/hooks/useScrolled";
import { isAppPanelPath } from "@/lib/routes";

// Nav actualizado para la arquitectura hibrida Multipage + landing larga
// (ver tarea de reestructuracion, ago 2026). "Quiénes somos" y "Planes" ya
// no son anclas del home -- QuienesSomos se movio a /fundacion y Planes
// siempre fue una pagina dedicada (antes /pricing, ver next.config.ts para
// el redirect). "Cómo funciona" y "Preguntas" si siguen siendo secciones
// del home, se mantienen como anclas. "Blog" se agrega como pagina nueva.
// "Inicio" (ago 2026, a pedido): antes la unica forma de volver al home
// desde una pagina como /fundacion o /blog era el logo -- se suma un link
// explicito al principio del nav para que sea obvio.
const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/fundacion", label: "Quiénes somos" },
  { href: "/blog", label: "Blog" },
  { href: "/planes", label: "Planes" },
  { href: "/#preguntas", label: "Preguntas" },
];

export default function Header() {
  const pathname = usePathname();
  // Panel interno (dashboard, cursos, /admin, etc. -- ver lib/routes.ts):
  // este mismo Header tambien se renderiza ahi (SiteChrome.tsx lo pone en
  // todas las rutas salvo la inmersion de leccion), pero el diseño
  // transparente-sobre-hero-que-pasa-a-blur-al-scrollear no tiene sentido
  // sin un hero debajo -- ahi se ve simplemente como un header que cambia
  // de aspecto sin motivo. Ademas, DashboardSidebar.tsx ya es la navegacion
  // del panel: repetir el nav de marketing (Inicio/Blog/Planes/...) arriba
  // es ruido y competencia visual, no ayuda a nadie que ya esta adentro.
  // Ago 2026 (a pedido, "el header, sidebar y sus colores deben combinar a
  // la perfeccion"): en el panel, el Header pasa a ser un bloque solido
  // blanco con el mismo borde inferior que el borde derecho del sidebar
  // (border-navy/10) -- juntos arman un mismo marco en L alrededor del
  // contenido -- y sin el contenedor centrado max-w-[88rem] (que aca no
  // tiene con que alinearse, el panel ocupa todo el ancho), para que el
  // logo quede pegado a la esquina real, en la misma columna que los items
  // del sidebar (ver el mismo px-6 en DashboardSidebar.tsx).
  const appPanel = isAppPanelPath(pathname);

  // Transparente al tope de la pagina; pasa a un cream translucido + blur
  // (no solido) despues de 40px de scroll, para que el nav se lea sobre
  // cualquier imagen de fondo sin perder el efecto de vidrio esmerilado.
  // Solo aplica al sitio publico -- ver comentario de appPanel arriba.
  const scrolled = useScrolled(40);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-out ${
        appPanel
          ? "border-b border-navy/10 bg-white"
          : scrolled
            ? "bg-cream/75 shadow-[0_2px_16px_rgba(43,61,79,0.1)] backdrop-blur-md"
            : "bg-transparent"
      }`}
    >
      <div
        className={`flex items-center justify-between py-3 ${
          appPanel ? "px-6" : "mx-auto max-w-[88rem] px-6 lg:px-12"
        }`}
      >
        <Link href="/" className="flex items-center gap-2 text-lg">
          {/* Logo achicado (26 jul 2026) para adelgazar el header: header
              total pasa de 104px a 72px (48px logo + 12px*2 de padding
              vertical). Ver los otros 104px->72px en layout.tsx, Hero.tsx,
              auth/page.tsx y (app)/layout.tsx -- todos asumen el mismo alto. */}
          <Image src="/images/brand/logo.png" alt="" aria-hidden width={48} height={48} className="h-12 w-12" />
          <span className="font-semibold text-navy">
            Pelo a <span className="italic text-accent">Pelo</span>
          </span>
        </Link>

        {!appPanel && (
          <nav className="hidden items-center gap-8 text-a-nav text-navy/70 md:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-navy">
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <HeaderAuthCta />
      </div>
    </header>
  );
}

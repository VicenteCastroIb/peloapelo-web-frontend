"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import HeaderAuthCta from "@/components/layout/HeaderAuthCta";
import { usePanelSidebar } from "@/components/layout/PanelSidebarContext";
import Collapse from "@/components/shared/Collapse";
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

  // Mobile (ago 2026, a pedido -- "adaptar para telefonos"): antes NAV_LINKS
  // era "hidden md:flex" sin ningun reemplazo por debajo de ese breakpoint
  // -- en el sitio publico, un celular se quedaba sin forma de navegar a
  // Blog/Planes/Fundacion desde el header. mobileNavOpen controla un panel
  // desplegable propio de este componente (no necesita compartirse con
  // nadie mas, a diferencia del sidebar del panel).
  //
  // xl (no md/lg) es el breakpoint real del nav horizontal (ago 2026,
  // auditoria responsive): con 6 links + logo + CTA ("Iniciar sesion" +
  // boton "Haz el Quiz"), el ancho que necesita el nav en una sola fila
  // (~950-985px) no entra en el contenedor disponible ni a 768px (md) ni
  // a 1024px (lg, ancho tipico de iPad en horizontal) -- se desbordaba o
  // se apretaba en toda la franja de tablet. Se corre a xl (1280px) para
  // que tablets e iPads (portrait Y landscape) sigan viendo el menu
  // hamburguesa, que si tiene espacio de sobra.
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Panel interno: el toggle SI se comparte (con DashboardSidebar, que
  // vive en otro punto del arbol -- ver PanelSidebarContext.tsx).
  const { open: panelSidebarOpen, toggle: togglePanelSidebar } = usePanelSidebar();

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
          // px-5 en el panel (ago 2026): igual al nuevo padding de
          // DashboardSidebar.tsx tras adelgazarlo, para que el logo siga
          // alineado en la misma columna que los items del sidebar.
          appPanel ? "px-5" : "mx-auto max-w-[88rem] px-6 lg:px-12"
        }`}
      >
        <div className="flex items-center gap-1">
          {/* Hamburguesa del panel (ago 2026, a pedido): solo bajo lg, solo
              en rutas del panel -- en desktop DashboardSidebar ya es una
              columna fija siempre visible, no hay nada que abrir/cerrar. */}
          {appPanel && (
            <button
              type="button"
              onClick={togglePanelSidebar}
              aria-label={panelSidebarOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={panelSidebarOpen}
              className="-ml-1 rounded-pill p-2 text-navy/70 hover:bg-navy/5 lg:hidden"
            >
              {panelSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          <Link href="/" className={`flex items-center gap-2 ${appPanel ? "text-xl" : "text-lg"}`}>
            {/* Logo achicado (26 jul 2026) para adelgazar el header: header
                total pasa de 104px a 72px (48px logo + 12px*2 de padding
                vertical). Ver los otros 104px->72px en layout.tsx, Hero.tsx,
                auth/page.tsx y (app)/layout.tsx -- todos asumen el mismo alto. */}
            <Image src="/images/brand/logo.png" alt="" aria-hidden width={48} height={48} className="h-12 w-12" />
            <span className="font-semibold text-navy">
              Pelo a <span className="italic text-accent">Pelo</span>
            </span>
          </Link>
        </div>

        {!appPanel && (
          <nav className="hidden items-center gap-6 text-a-nav text-navy/70 xl:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-navy">
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-1">
          <HeaderAuthCta />

          {/* Hamburguesa del sitio publico: cubre mobile Y tablet/iPad
              (portrait y landscape) -- ver comentario largo mas arriba,
              junto a mobileNavOpen, sobre por que es xl:hidden y no
              md:hidden. */}
          {!appPanel && (
            <button
              type="button"
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-label={mobileNavOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileNavOpen}
              className="rounded-pill p-2 text-navy/70 hover:bg-navy/5 xl:hidden"
            >
              {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {!appPanel && (
        <Collapse open={mobileNavOpen} className="xl:hidden">
          <nav className="flex flex-col gap-1 border-t border-navy/10 bg-cream px-6 py-4 text-a-nav text-navy/70">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileNavOpen(false)}
                className="rounded-card-md px-3 py-2.5 hover:bg-navy/5 hover:text-navy"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </Collapse>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Camera,
  BookOpen,
  CreditCard,
  User,
  Users,
  ShieldCheck,
  Newspaper,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { usePanelSidebar } from "@/components/layout/PanelSidebarContext";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/progress", label: "Progreso", icon: Camera },
  { href: "/courses", label: "Aprender", icon: BookOpen },
  { href: "/subscription", label: "Suscripción", icon: CreditCard },
  { href: "/profile", label: "Perfil", icon: User },
];

// "Gestión de contenido" es sobre el CONTENIDO de la fundación (blog, cursos,
// mensajes). El seguimiento de usuarias es sobre PERSONAS -- va en su propio
// grupo, no mezclado acá.
const ADMIN_NAV_ITEMS: NavItem[] = [
  { href: "/admin/courses", label: "Panel de cursos", icon: ShieldCheck },
  { href: "/admin/blog", label: "Panel de blog", icon: Newspaper },
  { href: "/admin/mensajes", label: "Mensajes del día", icon: Sparkles },
];

const ADMIN_TRACKING_NAV_ITEMS: NavItem[] = [
  { href: "/admin/usuarios", label: "Usuarias", icon: Users },
];

function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center gap-2.5 rounded-pill px-2.5 py-2 text-[17px] transition-colors ${
        isActive ? "bg-accent/10 font-semibold text-accent" : "font-medium text-navy/70 hover:bg-navy/5"
      }`}
    >
      <Icon size={19} className="shrink-0" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

// El logo y la sesión (nombre + "Cerrar sesión") ya viven en el Header
// global (ver components/layout/Header.tsx + HeaderAuthCta.tsx, visible en
// todas las rutas incluida esta). Repetirlos aquí abajo era ruido puramente
// redundante -- este sidebar es solo navegación interna de la app.
export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  // Mobile (ago 2026, a pedido -- "adaptar para telefonos"): antes este
  // aside era un simple flex child siempre visible, sin ningun manejo para
  // pantallas chicas -- se apretaba al lado del contenido en vez de
  // ocultarse. Mismo patron que CourseOutlineSidebar.tsx: drawer que se
  // desliza desde la izquierda en mobile (controlado por
  // PanelSidebarContext, ver ese archivo -- el boton que lo abre vive en
  // Header.tsx, en otra rama del arbol), columna fija normal en lg+.
  // top-[72px] en vez de inset-y-0 (a diferencia de CourseOutlineSidebar):
  // aca SI hay un Header global fijo de 72px arriba (la leccion inmersiva
  // no lo tiene), asi que el drawer arranca debajo de el, no lo tapa.
  const { open, close } = usePanelSidebar();

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={close}
          className="fixed inset-x-0 bottom-0 top-[72px] z-30 bg-navy/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-[72px] z-40 flex w-64 max-w-[80vw] shrink-0 flex-col overflow-y-auto border-r border-navy/10 bg-white px-5 py-8 shadow-xl transition-transform duration-200 lg:static lg:z-auto lg:h-full lg:w-56 lg:max-w-none lg:translate-x-0 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} onNavigate={close} />
          ))}
        </nav>

        {/* Rediseño panel interno (ago 2026): antes "Panel de cursos"/"Panel de blog" se concatenaban
            abajo de la lista de un/a admin sin ninguna separacion -- 7 items de
            navegacion mezclados sin jerarquia entre "mi cuenta" y "gestionar
            contenido de la fundacion". Un divisor + label agrupa lo segundo
            como una seccion aparte, sin necesitar un selector de modo completo. */}
        {isAdmin && (
          <>
            <p className="mb-1 mt-6 px-2.5 text-p-caption font-semibold uppercase tracking-wide text-navy/40">
              Seguimiento
            </p>
            <nav className="space-y-1">
              {ADMIN_TRACKING_NAV_ITEMS.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} onNavigate={close} />
              ))}
            </nav>

            <p className="mb-1 mt-6 px-2.5 text-p-caption font-semibold uppercase tracking-wide text-navy/40">
              Gestión de contenido
            </p>
            <nav className="space-y-1">
              {ADMIN_NAV_ITEMS.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} onNavigate={close} />
              ))}
            </nav>
          </>
        )}
      </aside>
    </>
  );
}

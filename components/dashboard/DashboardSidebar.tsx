"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, BookOpen, CreditCard, User, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/progress", label: "Progreso", icon: Camera },
  { href: "/courses", label: "Aprender", icon: BookOpen },
  { href: "/subscription", label: "Suscripción", icon: CreditCard },
  { href: "/profile", label: "Perfil", icon: User },
];

const ADMIN_NAV_ITEM = { href: "/admin/courses", label: "Panel de cursos", icon: ShieldCheck };

// El logo y la sesión (nombre + "Cerrar sesión") ya viven en el Header
// global (ver components/layout/Header.tsx + HeaderAuthCta.tsx, visible en
// todas las rutas incluida esta). Repetirlos aquí abajo era ruido puramente
// redundante -- este sidebar es solo navegación interna de la app.
export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const navItems = user?.role === "ADMIN" ? [...NAV_ITEMS, ADMIN_NAV_ITEM] : NAV_ITEMS;

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-navy/10 bg-white px-4 py-8">
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-pill px-3 py-2.5 text-a-nav transition-colors ${
                isActive
                  ? "bg-accent/10 font-semibold text-accent"
                  : "text-navy/70 hover:bg-navy/5"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

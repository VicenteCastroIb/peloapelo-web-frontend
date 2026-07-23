"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, BookOpen, CreditCard, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/progress", label: "Progreso", icon: Camera },
  { href: "/courses", label: "Aprender", icon: BookOpen },
  { href: "/subscription", label: "Suscripción", icon: CreditCard },
  { href: "/profile", label: "Perfil", icon: User },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col justify-between border-r border-navy/10 bg-white px-4 py-6">
      <div>
        <Link href="/" className="mb-8 flex items-center gap-2 px-2">
          <Image src="/images/logo.png" alt="Pelo a Pelo" width={40} height={40} className="h-10 w-10" />
        </Link>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
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
      </div>

      <div className="border-t border-navy/10 pt-4">
        <p className="truncate px-2 text-p-caption text-navy/50">{user?.email}</p>
        <button
          type="button"
          onClick={logout}
          className="mt-3 flex w-full items-center gap-3 rounded-pill px-3 py-2.5 text-a-nav text-navy/70 hover:bg-navy/5"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

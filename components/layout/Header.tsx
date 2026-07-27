"use client";

import Image from "next/image";
import Link from "next/link";
import HeaderAuthCta from "@/components/layout/HeaderAuthCta";
import { useScrolled } from "@/lib/hooks/useScrolled";

// Tal cual el nav del mockup (26 jul 2026): Quiénes somos / Cómo funciona /
// Planes / Preguntas. "Planes" apunta a /pricing (pagina dedicada, con tabla
// comparativa) en vez de al ancla #planes del home -- decision funcional,
// no de copy.
const NAV_LINKS = [
  { href: "/#quienes-somos", label: "Quiénes somos" },
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/pricing", label: "Planes" },
  { href: "/#preguntas", label: "Preguntas" },
];

export default function Header() {
  // Transparente al tope de la pagina; pasa a un cream translucido + blur
  // (no solido) despues de 40px de scroll, para que el nav se lea sobre
  // cualquier imagen de fondo sin perder el efecto de vidrio esmerilado.
  const scrolled = useScrolled(40);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-out ${
        scrolled
          ? "bg-cream/75 shadow-[0_2px_16px_rgba(43,61,79,0.1)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[88rem] items-center justify-between px-6 py-3 lg:px-12">
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

        <nav className="hidden items-center gap-8 text-a-nav text-navy/70 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-navy">
              {link.label}
            </Link>
          ))}
        </nav>

        <HeaderAuthCta />
      </div>
    </header>
  );
}

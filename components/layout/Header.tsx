import Image from "next/image";
import Link from "next/link";
import HeaderAuthCta from "@/components/layout/HeaderAuthCta";

const NAV_LINKS = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/pricing", label: "Precios" },
  { href: "/#preguntas", label: "Preguntas" },
  { href: "/#testimonios", label: "Testimonios" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-navy/5 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
        <Link href="/" className="flex items-center gap-2 text-lg">
          <Image src="/images/logo.png" alt="" aria-hidden width={44} height={44} className="h-11 w-11" />
          <span className="font-semibold text-navy">
            Pelo a <span className="italic text-accent">Pelo</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-navy/70 md:flex">
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

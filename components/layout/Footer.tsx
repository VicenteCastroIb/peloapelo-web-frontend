import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy text-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="mb-16">
          <p className="text-xs uppercase tracking-widest text-cream/50">
            Cierre · V
          </p>
          <h2 className="mt-4 text-4xl font-normal leading-tight sm:text-5xl">
            No estás <span className="italic text-[var(--color-gradient-to)]">sola</span>.
            <br />
            Escríbenos cuando quieras.
          </h2>
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-cream/80">
            <a href="mailto:jessica.lagno@peloapelo.cl" className="hover:text-cream">
              jessica.lagno@peloapelo.cl
            </a>
            <Link href="/#agendar" className="hover:text-cream">
              Agendar una sesión →
            </Link>
          </div>
        </div>

        <div className="grid gap-10 border-t border-cream/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image src="/images/logo.png" alt="Pelo a Pelo" width={48} height={48} className="h-12 w-12" />
            <p className="mt-3 text-lg">
              Pelo a <span className="italic text-[var(--color-gradient-to)]">Pelo</span>
            </p>
            <p className="mt-2 text-sm text-cream/60">
              Apoyo integral para personas que atraviesan la pérdida de cabello. Sin
              prisa, sin juicios.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-cream/50">Plataforma</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/#propuesta" className="hover:text-cream/80">Funcionalidades</Link></li>
              <li><Link href="/pricing" className="hover:text-cream/80">Precios</Link></li>
              <li><Link href="/#ebook" className="hover:text-cream/80">Ebook gratuito</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-cream/50">Fundación</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/#testimonios" className="hover:text-cream/80">Testimonios</Link></li>
              <li><a href="mailto:jessica.lagno@peloapelo.cl" className="hover:text-cream/80">Contacto</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-cream/50">Síguenos</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#" className="hover:text-cream/80">Instagram</a></li>
              <li><a href="#" className="hover:text-cream/80">TikTok</a></li>
              <li><a href="#" className="hover:text-cream/80">YouTube</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-cream/10 pt-6 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Fundación Pelo a Pelo · Chile</p>
          <p className="italic">Hecho con cuidado, a pelo.</p>
        </div>
      </div>
    </footer>
  );
}

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy text-cream">
      <div className="mx-auto max-w-[88rem] px-6 py-16 lg:px-12">
        <div className="mb-16">
          <p className="text-h4-label text-cream/50">
            Cierre · V
          </p>
          <h2 className="mt-4 text-h2-xl">
            No estás <span className="italic text-[var(--color-gradient-to)]">sola</span>.
            <br />
            Escríbenos cuando quieras.
          </h2>
          <div className="mt-6 flex flex-wrap gap-6 text-a-inline text-cream/80">
            <a href="mailto:jessica.lagno@peloapelo.cl" className="hover:text-cream">
              jessica.lagno@peloapelo.cl
            </a>
            <Link href="/therapist" className="hover:text-cream">
              Agendar una sesión →
            </Link>
          </div>
        </div>

        <div className="grid gap-10 border-t border-cream/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image src="/images/brand/logo.png" alt="Pelo a Pelo" width={48} height={48} className="h-12 w-12" />
            <p className="mt-3 text-h3-sm">
              Pelo a <span className="italic text-[var(--color-gradient-to)]">Pelo</span>
            </p>
            <p className="mt-2 text-p-small text-cream/60">
              Apoyo integral para personas que atraviesan la pérdida de cabello. Sin
              prisa, sin juicios.
            </p>
          </div>

          <div>
            <p className="text-h4-label text-cream/50">Plataforma</p>
            <ul className="mt-3 space-y-2 text-a-inline">
              <li><Link href="/#como-funciona" className="hover:text-cream/80">Cómo funciona</Link></li>
              <li><Link href="/pricing" className="hover:text-cream/80">Precios</Link></li>
              <li><Link href="/#ebook" className="hover:text-cream/80">Ebook gratuito</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-h4-label text-cream/50">Fundación</p>
            <ul className="mt-3 space-y-2 text-a-inline">
              <li><Link href="/#fundadora" className="hover:text-cream/80">Nuestra historia</Link></li>
              <li><a href="mailto:jessica.lagno@peloapelo.cl" className="hover:text-cream/80">Contacto</a></li>
            </ul>
          </div>

          <div>
            <p className="text-h4-label text-cream/50">Síguenos</p>
            <ul className="mt-3 space-y-2 text-a-inline">
              <li><a href="#" className="hover:text-cream/80">Instagram</a></li>
              <li><a href="#" className="hover:text-cream/80">TikTok</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-cream/10 pt-6 text-p-caption text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Fundación Pelo a Pelo · Chile</p>
          <p className="italic">Hecho con cuidado, a pelo.</p>
        </div>
      </div>
    </footer>
  );
}

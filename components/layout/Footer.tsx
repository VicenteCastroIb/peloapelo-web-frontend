import Image from "next/image";
import Link from "next/link";
import { Mail, Calendar } from "lucide-react";
import { gmailComposeUrl } from "@/lib/gmail";

const CONTACTO_EMAIL = "jessica.lagno@peloapelo.cl";

export default function Footer() {
  return (
    <footer className="bg-navy text-cream">
      <div className="mx-auto max-w-[88rem] px-6 py-16 lg:px-12">
        <div className="mb-16">
          <p className="text-h4-label text-cream/70">
            Cierre · V
          </p>
          <h2 className="mt-4 text-h2-xl">
            No estás <span className="italic text-[var(--color-gradient-to)]">sola</span>.
            <br />
            Escríbenos cuando quieras.
          </h2>
          {/* Resaltado (ago 2026, a pedido -- "es importante resaltarlo... para
              insitar a agendar sesiones"): antes eran dos links de texto plano
              que se perdian dentro del parrafo. Ahora son dos "chips"
              clickeables bien diferenciados -- el mail con borde sutil, y
              "Agendar" como boton solido en degrade (el mismo tratamiento que
              el CTA principal del Header, "Haz el Quiz") para que sea
              inequivocamente el llamado a la accion mas importante del cierre. */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={gmailComposeUrl(CONTACTO_EMAIL)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-pill border border-cream/25 bg-cream/5 px-5 py-2.5 text-a-inline text-cream hover:border-cream/40 hover:bg-cream/10"
            >
              <Mail size={16} className="text-[var(--color-gradient-to)]" />
              {CONTACTO_EMAIL}
            </a>
            <Link
              href="/therapist"
              className="inline-flex items-center gap-2 rounded-pill bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] px-5 py-2.5 text-a-inline font-semibold text-white hover:opacity-90"
            >
              <Calendar size={16} />
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
            <p className="text-h4-label text-cream/70">Plataforma</p>
            <ul className="mt-3 space-y-2 text-a-inline">
              <li><Link href="/#como-funciona" className="hover:text-cream/80">Cómo funciona</Link></li>
              <li><Link href="/planes" className="hover:text-cream/80">Precios</Link></li>
              <li><Link href="/blog#ebook" className="hover:text-cream/80">Ebook gratuito</Link></li>
              <li><Link href="/blog" className="hover:text-cream/80">Blog</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-h4-label text-cream/70">Fundación</p>
            <ul className="mt-3 space-y-2 text-a-inline">
              <li><Link href="/fundacion" className="hover:text-cream/80">Quiénes somos</Link></li>
              <li><Link href="/#fundadora" className="hover:text-cream/80">Nuestra historia</Link></li>
              <li><Link href="/contacto" className="hover:text-cream/80">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-h4-label text-cream/70">Síguenos</p>
            {/* Solo Instagram (27 jul 2026, a peticion explicita): la
                fundacion no tiene TikTok, se saca en vez de dejar un link
                muerto. Handle real: @guia.peloapelo. */}
            <ul className="mt-3 space-y-2 text-a-inline">
              <li>
                <a
                  href="https://instagram.com/guia.peloapelo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cream/80"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-cream/10 pt-6 text-p-caption text-cream/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Fundación Pelo a Pelo · Chile</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href="/terminos" className="hover:text-cream/80">Términos y condiciones</Link>
            <Link href="/privacidad" className="hover:text-cream/80">Privacidad</Link>
          </div>
          <p className="italic">Hecho con cuidado, a pelo.</p>
        </div>
      </div>
    </footer>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Mail, Calendar } from "lucide-react";
import { gmailComposeUrl } from "@/lib/gmail";

const CONTACTO_EMAIL = "jessica.lagno@peloapelo.cl";

// Version reducida del Footer publico (ver Footer.tsx) para el panel
// interno -- cualquier ruta autenticada bajo app/(app) (dashboard, cursos,
// perfil, progreso, /admin, etc., ver lib/routes.ts isAppPanelPath y
// app/(app)/layout.tsx). A pedido explicito: "solo esto, en una version mas
// pequenia y delgada" -- se saca el titular emocional grande ("No estas
// sola... Escribenos cuando quieras") y la fila de copyright/terminos de
// abajo, que tienen sentido en el sitio publico pero son ruido repetido en
// una persona que ya esta adentro, usando la plataforma. Se deja el
// contacto directo (mail + agendar sesion) y los mismos 4 bloques de
// navegacion del footer publico, con tipografia y espaciado mas chicos.
export default function CompactFooter() {
  return (
    <footer className="border-t border-navy/10 bg-navy text-cream">
      <div className="mx-auto max-w-[88rem] px-6 py-8 lg:px-8">
        {/* Resaltado (ago 2026, a pedido, mismo criterio que Footer.tsx
            publico): chips diferenciados en vez de texto plano, a escala
            reducida acorde a esta version "mas pequenia y delgada". */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={gmailComposeUrl(CONTACTO_EMAIL)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-pill border border-cream/25 bg-cream/5 px-4 py-2 text-p-small text-cream hover:border-cream/40 hover:bg-cream/10"
          >
            <Mail size={14} className="text-[var(--color-gradient-to)]" />
            {CONTACTO_EMAIL}
          </a>
          <Link
            href="/therapist"
            className="inline-flex items-center gap-1.5 rounded-pill bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] px-4 py-2 text-p-small font-semibold text-white hover:opacity-90"
          >
            <Calendar size={14} />
            Agendar una sesión →
          </Link>
        </div>

        <div className="mt-6 grid gap-8 border-t border-cream/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image src="/images/brand/logo.png" alt="Pelo a Pelo" width={28} height={28} className="h-7 w-7" />
            <p className="mt-2 text-p-small font-semibold">
              Pelo a <span className="italic text-[var(--color-gradient-to)]">Pelo</span>
            </p>
            <p className="mt-1 text-p-caption text-cream/60">
              Apoyo integral para personas que atraviesan la pérdida de cabello. Sin prisa, sin
              juicios.
            </p>
          </div>

          <div>
            <p className="text-h4-label text-cream/70">Plataforma</p>
            <ul className="mt-2 space-y-1.5 text-p-small">
              <li><Link href="/#como-funciona" className="hover:text-cream/80">Cómo funciona</Link></li>
              <li><Link href="/planes" className="hover:text-cream/80">Precios</Link></li>
              <li><Link href="/blog#ebook" className="hover:text-cream/80">Ebook gratuito</Link></li>
              <li><Link href="/blog" className="hover:text-cream/80">Blog</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-h4-label text-cream/70">Fundación</p>
            <ul className="mt-2 space-y-1.5 text-p-small">
              <li><Link href="/fundacion" className="hover:text-cream/80">Quiénes somos</Link></li>
              <li><Link href="/#fundadora" className="hover:text-cream/80">Nuestra historia</Link></li>
              <li><Link href="/contacto" className="hover:text-cream/80">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-h4-label text-cream/70">Síguenos</p>
            <ul className="mt-2 space-y-1.5 text-p-small">
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
      </div>
    </footer>
  );
}

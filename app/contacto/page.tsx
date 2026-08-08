import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Calendar, Instagram } from "lucide-react";
import SectionBadge from "@/components/shared/SectionBadge";
import ContactForm from "@/components/sections/ContactForm";
import { gmailComposeUrl } from "@/lib/gmail";

const CONTACTO_EMAIL = "jessica.lagno@peloapelo.cl";

export const metadata: Metadata = {
  title: "Contacto · Pelo a Pelo",
  description: "Escríbenos, agenda una sesión o síguenos. Estamos para acompañarte.",
};

// Pagina nueva /contacto (ver tarea de reestructuracion, ago 2026). Copy
// minimo y funcional (no hay texto previo de "contacto" en el codebase que
// reutilizar) -- reusa datos reales ya existentes en el sitio: el correo de
// Footer.tsx y el flujo de agendamiento de /therapist.
export default function ContactoPage() {
  return (
    <section className="px-6 py-20 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex justify-center">
          <SectionBadge label="Contacto" />
        </div>
        <h1 className="mx-auto max-w-xl text-center text-h2-lg text-navy">
          Escríbenos <span className="italic text-accent">cuando quieras</span>.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-center text-p-body text-navy/70">
          No estás sola en esto. Cuéntanos tu situación y te respondemos a la brevedad.
        </p>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            <a
              href={gmailComposeUrl(CONTACTO_EMAIL)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-card-md bg-white p-5 shadow-sm transition-colors hover:bg-accent/5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Mail size={18} />
              </span>
              <div>
                <p className="text-h3-sm text-navy">Correo directo</p>
                <p className="text-p-small text-navy/60">{CONTACTO_EMAIL}</p>
              </div>
            </a>

            <Link
              href="/therapist"
              className="flex items-center gap-4 rounded-card-md bg-white p-5 shadow-sm transition-colors hover:bg-accent/5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Calendar size={18} />
              </span>
              <div>
                <p className="text-h3-sm text-navy">Agenda una sesión</p>
                <p className="text-p-small text-navy/60">Con Jessica Lagno, nuestra profesional de salud mental</p>
              </div>
            </Link>

            <a
              href="https://instagram.com/guia.peloapelo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-card-md bg-white p-5 shadow-sm transition-colors hover:bg-accent/5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Instagram size={18} />
              </span>
              <div>
                <p className="text-h3-sm text-navy">Instagram</p>
                <p className="text-p-small text-navy/60">@guia.peloapelo</p>
              </div>
            </a>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}

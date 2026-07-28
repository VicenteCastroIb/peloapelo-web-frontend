"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import Image from "next/image";
import { faqItems } from "@/lib/data/faq";

// La fundacion no tiene TikTok (27 jul 2026, a peticion explicita): solo
// Instagram, con el handle real @guia.peloapelo.
const REDES = [{ label: "Instagram", href: "https://instagram.com/guia.peloapelo" }];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="preguntas" className="relative scroll-mt-24 overflow-hidden px-6 py-24 lg:px-12 lg:py-28">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/backgrounds/fondo-preguntas.jpg"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>

      <FadeInOnScroll className="mx-auto max-w-4xl">
        <SectionBadge label="Preguntas frecuentes" />
        <h2 className="text-h2-lg text-navy">
          Dudas que <span className="italic text-accent">entendemos</span>.
        </h2>

        <div className="mt-10 border-t border-navy/10">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className="border-b border-navy/10">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between py-5 text-left text-h3-sm font-medium"
                >
                  {item.question}
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-navy/50 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && <p className="pb-5 text-p-body text-navy/70">{item.answer}</p>}
              </div>
            );
          })}
        </div>

        {/* Bloque "comunidad" agregado por el rediseno (ver docs de
            handoff): los mismos links de redes ya viven en el Footer, se
            repiten aca a proposito como refuerzo al cierre de las
            preguntas frecuentes, no como reemplazo del footer. Texto
            achicado (27 jul 2026, a peticion explicita) -- antes
            text-h3-md/2xl se sentia demasiado grande para un cierre. */}
        <div id="comunidad" className="mt-16 scroll-mt-24 text-center">
          <p className="text-h3-sm text-navy sm:text-xl">
            Una comunidad te espera, para apoyarte, sin juicios.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-8 text-p-small font-bold uppercase tracking-[0.08em] text-accent">
            {REDES.map((red) => (
              <a
                key={red.label}
                href={red.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {red.label}
              </a>
            ))}
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  );
}

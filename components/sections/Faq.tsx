"use client";

import { useEffect, useRef, useState } from "react";
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
  const sectionRef = useRef<HTMLElement>(null);
  const openIndexRef = useRef<number | null>(null);
  // El fondo (Image con fill + object-cover) vive dentro de la seccion. Si
  // el fondo cubriera el 100% de la altura de la seccion (inset-0 normal),
  // cada vez que un acordeon se abre y la seccion crece, object-cover
  // recalcula el escalado para seguir cubriendo la caja mas alta -> se ve
  // como un leve zoom/paneo del fondo (reportado 10 ago 2026). Fijamos la
  // altura del fondo al alto "en reposo" (todas las preguntas cerradas) y
  // no la tocamos mientras haya una pregunta abierta, para que el fondo
  // quede fisicamente quieto y el contenido que crece de mas simplemente
  // caiga sobre el fondo cream de la pagina.
  const [bgHeight, setBgHeight] = useState<number | null>(null);

  useEffect(() => {
    openIndexRef.current = openIndex;
  }, [openIndex]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const measure = () => setBgHeight(node.offsetHeight);
    measure();

    // Solo re-medimos en resize real de ventana (cambios de breakpoint,
    // orientacion), y solo si no hay una pregunta abierta -- nunca durante
    // la animacion del acordeon.
    const handleResize = () => {
      if (openIndexRef.current === null) measure();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="preguntas"
      className="relative scroll-mt-24 overflow-hidden px-6 py-24 lg:px-12 lg:py-28"
    >
      <div className="absolute inset-x-0 top-0 -z-10" style={{ height: bgHeight ?? "100%" }}>
        <Image
          src="/images/backgrounds/fondo-preguntas.jpg"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover object-top"
        />
        {/* El archivo original se ve medio amarillento comparado con el
            cream del resto del sitio (27 jul 2026, a peticion explicita).
            Overlay blanco, no cream, para enfriar ese tono -- opacidad baja
            para no repetir el error anterior de opacar demasiado el fondo. */}
        <div aria-hidden className="absolute inset-0 bg-white/30" />
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
                    className={`shrink-0 text-navy/50 transition-transform duration-300 ease-in-out ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div className="faq-answer-panel" data-open={isOpen}>
                  <div className="overflow-hidden">
                    <p
                      className={`pb-5 text-p-body text-navy/70 transition-opacity duration-300 ease-in-out ${
                        isOpen ? "opacity-100 delay-100" : "opacity-0"
                      }`}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
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

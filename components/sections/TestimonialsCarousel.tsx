import { Quote, Star } from "lucide-react";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import { homeTestimonials, HomeTestimonial } from "@/lib/data/testimonialsCarousel";

// Se difumina el borde izquierdo/derecho de la cinta (mismo recurso de
// mask-image que ya usan Hero/Fundadora/WhatIsAlopecia para fotos, aplicado
// aca a todo el carrusel) en vez de un corte duro contra el borde del
// contenedor.
const EDGE_FADE_MASK =
  "linear-gradient(to right, transparent, black 6%, black 94%, transparent)";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "fill-[#F2B705] text-[#F2B705]" : "text-navy/15"}
          aria-hidden
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: HomeTestimonial }) {
  return (
    <div className="flex h-full w-80 shrink-0 flex-col gap-4 rounded-card-lg border border-navy/10 bg-white p-6 shadow-sm sm:w-96">
      <div className="flex items-center justify-between">
        <RatingStars rating={testimonial.rating} />
        <Quote size={20} className="text-accent/25" aria-hidden />
      </div>

      <p className="line-clamp-5 text-p-body italic text-navy/85">
        &quot;{testimonial.quote}&quot;
      </p>

      <div className="mt-auto flex items-center gap-3 pt-1">
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] text-p-caption font-bold text-white"
        >
          {initials(testimonial.name)}
        </span>
        <div className="min-w-0">
          <p className="text-h3-sm text-navy">{testimonial.name}</p>
          <p className="truncate text-p-caption uppercase tracking-wide text-navy/50">
            {testimonial.alopeciaType}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * "Historias que inspiran" — de una tarjeta unica navegable a mano (dots +
 * flechas) a una cinta de testimonios en movimiento continuo (ago 2026, a
 * pedido explicito). La lista se duplica una vez y la pista se desliza
 * -50% en loop (ver .animate-marquee en globals.css) para dar la ilusion
 * de una cinta infinita sin salto visible en el corte. Se pausa al pasar
 * el mouse para poder leer sin que el texto se mueva, y respeta
 * prefers-reduced-motion (la animacion se desactiva por completo).
 */
export default function TestimonialsCarousel() {
  const track = [...homeTestimonials, ...homeTestimonials];

  return (
    <section id="testimonios" className="overflow-hidden px-6 py-24 lg:px-12 lg:py-28">
      <FadeInOnScroll className="mx-auto max-w-3xl text-center">
        <div className="flex justify-center">
          <SectionBadge label="Historias que inspiran" />
        </div>
        <h2 className="mx-auto max-w-xl text-h2-lg text-navy">
          No es la <span className="italic text-accent">única</span> historia.
        </h2>
      </FadeInOnScroll>

      <FadeInOnScroll delayMs={120} className="mt-14">
        <div className="-mx-6 lg:-mx-12" style={{ maskImage: EDGE_FADE_MASK, WebkitMaskImage: EDGE_FADE_MASK }}>
          <div className="flex w-max animate-marquee gap-6 px-6 hover:[animation-play-state:paused] lg:px-12">
            {track.map((testimonial, i) => (
              <TestimonialCard key={`${testimonial.name}-${i}`} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  );
}

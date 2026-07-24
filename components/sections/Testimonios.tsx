import Image from "next/image";
import { Quote } from "lucide-react";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import { testimonials } from "@/lib/data/testimonials";

export default function Testimonios() {
  return (
    <section id="testimonios" className="relative overflow-hidden px-6 py-24 lg:px-12 lg:py-28">
      {/* Adorno acuarela (cinta), como flourish detras del titulo —
          puramente decorativo, sin interceptar clics. */}
      <Image
        aria-hidden
        src="/images/adornos/adorno-cinta.png"
        alt=""
        width={1024}
        height={375}
        className="pointer-events-none absolute -top-6 left-1/2 -z-10 hidden w-[640px] -translate-x-1/2 opacity-60 md:block lg:w-[760px]"
      />

      <FadeInOnScroll className="mx-auto max-w-5xl">
        <SectionBadge label="Voces · VI" />
        <h2 className="text-h2-lg text-navy">
          Historias que <span className="italic text-accent">inspiran</span>.
        </h2>

        <div className="mt-12 grid divide-y divide-navy/10 border-t border-navy/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="p-8">
              <Quote size={20} className="text-navy/20" />
              <p className="mt-3 text-p-body italic text-navy/80">&quot;{testimonial.quote}&quot;</p>
              <p className="mt-4 border-t border-navy/10 pt-4 text-h3-sm">
                {testimonial.name}
              </p>
              <p className="text-p-caption uppercase tracking-wide text-navy/50">
                {testimonial.caption}
              </p>
            </div>
          ))}
        </div>
      </FadeInOnScroll>
    </section>
  );
}

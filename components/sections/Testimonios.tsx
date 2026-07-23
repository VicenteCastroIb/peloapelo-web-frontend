import { Quote } from "lucide-react";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import { testimonials } from "@/lib/data/testimonials";

export default function Testimonios() {
  return (
    <section id="testimonios" className="px-6 py-24 lg:px-12 lg:py-28">
      <FadeInOnScroll className="mx-auto max-w-4xl">
        <SectionBadge label="Voces · VI" />
        <h2 className="text-4xl font-normal sm:text-5xl">
          Historias que <span className="italic text-accent">inspiran</span>.
        </h2>

        <div className="mt-12 grid divide-y divide-navy/10 border-t border-navy/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="p-8">
              <Quote size={20} className="text-navy/20" />
              <p className="mt-3 italic text-navy/80">&quot;{testimonial.quote}&quot;</p>
              <p className="mt-4 border-t border-navy/10 pt-4 text-sm font-semibold">
                {testimonial.name}
              </p>
              <p className="text-xs uppercase tracking-wide text-navy/50">
                {testimonial.caption}
              </p>
            </div>
          ))}
        </div>
      </FadeInOnScroll>
    </section>
  );
}

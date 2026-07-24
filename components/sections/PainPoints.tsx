import { Frown } from "lucide-react";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import { painPoints } from "@/lib/data/painPoints";

export default function PainPoints() {
  return (
    <section className="px-6 py-24 text-center lg:px-12 lg:py-28">
      <FadeInOnScroll className="mx-auto max-w-5xl">
        <h2 className="text-h2-md text-navy">
          ¿Quieres decir <span className="italic text-accent">ADIÓS</span> a…?
        </h2>
        <p className="mt-3 text-p-body text-navy/70">Si te identificas, este programa es para ti.</p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {painPoints.map((point) => (
            <div key={point} className="rounded-card-md bg-white p-6 text-center">
              <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-coral-soft text-coral">
                <Frown size={18} />
              </span>
              <p className="text-p-small text-navy/80">{point}</p>
            </div>
          ))}
        </div>
      </FadeInOnScroll>
    </section>
  );
}

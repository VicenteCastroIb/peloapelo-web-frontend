import { Sparkle } from "lucide-react";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import { benefits } from "@/lib/data/benefits";

export default function Beneficios() {
  return (
    <section className="px-6 py-24 text-center lg:px-12 lg:py-28">
      <FadeInOnScroll className="mx-auto max-w-4xl">
        <h2 className="text-h2-md text-navy">Aprenderás a…</h2>
        <p className="mt-3 text-p-body text-navy/70">
          Herramientas reales para reconectar con tu bienestar.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="rounded-card-md bg-white p-6 text-center shadow-sm"
            >
              <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] text-white">
                <Sparkle size={18} />
              </span>
              <p className="text-p-small text-navy/80">{benefit}</p>
            </div>
          ))}
        </div>
      </FadeInOnScroll>
    </section>
  );
}

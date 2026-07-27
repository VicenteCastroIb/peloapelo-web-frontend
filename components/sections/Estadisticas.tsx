import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import { stats } from "@/lib/data/stats";

// Fondos de las tarjetas de datos: ciclan por la paleta de marca (ver
// globals.css) en su version suave, para diferenciarlas entre si sin
// salirse de los colores propios del sitio.
const STAT_BACKGROUNDS = [
  "bg-accent/10",
  "bg-coral-soft",
  "bg-[rgba(137,207,235,0.16)]",
  "bg-navy/8",
  "bg-[linear-gradient(135deg,rgba(143,124,182,0.14),rgba(137,207,235,0.14))]",
];

/**
 * "La realidad que nadie cuenta" — tal cual el mockup: solo cifra + label,
 * sin icono ni cita de fuente (a diferencia de una version anterior de este
 * componente, ver git history si se quiere recuperar esa version).
 */
export default function Estadisticas() {
  return (
    <section className="px-6 py-16 lg:px-12 lg:py-20">
      <FadeInOnScroll className="mx-auto max-w-6xl">
        <div className="flex justify-center">
          <SectionBadge label="La realidad que nadie cuenta" />
        </div>
        <h2 className="text-center text-h2-lg text-navy">
          No estás <span className="italic text-accent">sola</span>.
        </h2>

        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat, index) => {
            const isLast = index === stats.length - 1;
            return (
              <div
                key={stat.label}
                className={`flex flex-col gap-2.5 rounded-card-md p-7 ${STAT_BACKGROUNDS[index % STAT_BACKGROUNDS.length]} ${
                  isLast ? "col-span-2 sm:col-span-1" : ""
                }`}
              >
                <p className="text-data-lg text-navy">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-p-small leading-snug text-navy/85">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </FadeInOnScroll>
    </section>
  );
}

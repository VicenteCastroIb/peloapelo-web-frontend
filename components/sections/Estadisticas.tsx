import Image from "next/image";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import RadialProgress from "@/components/shared/RadialProgress";
import { stats, Stat } from "@/lib/data/stats";

// Un icono propio por dato (antes lucide-react generico, reemplazado ago
// 2026 por line-art a medida en el mismo morado de marca -- ver prompts de
// generacion en el historial de esta tarea). Mapeado por label en vez de
// por posicion para que no se desalinee si el orden de stats.ts cambia.
const STAT_ICONS: Record<string, string> = {
  "reporta impacto en su salud mental": "/images/icons/stats/salud-mental.png",
  "pierde cabello antes de los 50 años": "/images/icons/stats/edad.png",
  "personas conviven con alopecia en el mundo": "/images/icons/stats/alcance-global.png",
  "tarda más de un año en buscar ayuda": "/images/icons/stats/tiempo-ayuda.png",
  "menos angustia con el apoyo adecuado": "/images/icons/stats/apoyo.png",
};

/**
 * "La realidad que nadie cuenta" — rediseno bento (ago 2026, feedback de
 * diseno). Capas sumadas a la primera version del bento para que se lea
 * "profesional" y no solo numeros grandes flotando, mas una segunda pasada
 * (ago 2026) para que la seccion se sienta viva en vez de estatica:
 *
 * 1. Tono de fondo propio (bg-accent/5) + dos manchas difuminadas en los
 *    colores de marca (blobs, position absolute + blur-3xl) en vez de una
 *    imagen -- dan profundidad y movimiento visual sin competir con el
 *    bento ni con sus iconos/anillos.
 * 2. Icono por dato (ver STAT_ICONS) para identificar cada tarjeta sin
 *    tener que leer el numero primero.
 * 3. Anillo de progreso (RadialProgress) en los datos porcentuales chicos:
 *    un numero como texto es una afirmacion, el mismo numero con un anillo
 *    que se llena hasta ahi es una visualizacion real del dato.
 * 4. Entrada escalonada: cada tarjeta tiene su propio FadeInOnScroll con
 *    delay creciente (antes toda la grilla aparecia de un solo golpe) +
 *    hover con lift/sombra/escala en icono, para que la seccion responda
 *    al usuario en vez de ser un cartel estatico.
 *
 * Nota (ver conversacion): no se agrega cita de fuente. Estas cifras vienen
 * del mockup original sin fuente academica real -- inventar una cita para
 * datos de salud seria presentarlos como verificados sin serlo.
 */
export default function Estadisticas() {
  const featured = stats.find((stat) => stat.variant === "featured");
  const rest = stats.filter((stat) => stat.variant !== "featured");

  return (
    <section className="relative overflow-hidden bg-accent/5 px-6 py-16 lg:px-12 lg:py-20">
      {/* Manchas de color difuminadas, puramente decorativas -- le dan
          profundidad al fondo plano sin volver a depender de una imagen. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--color-gradient-from)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--color-gradient-to)" }}
      />

      <FadeInOnScroll className="relative z-10 mx-auto max-w-6xl">
        <div className="flex justify-center">
          <SectionBadge label="La realidad que nadie cuenta" />
        </div>
        <h2 className="text-center text-h2-lg text-navy">
          No estás <span className="italic text-accent">sola</span>.
        </h2>

        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {featured && (
            <FadeInOnScroll delayMs={0} className="col-span-2 sm:row-span-2">
              <FeaturedCard stat={featured} />
            </FadeInOnScroll>
          )}

          {rest.map((stat, index) => (
            <FadeInOnScroll key={stat.label} delayMs={120 * (index + 1)} className="h-full">
              <StatCard stat={stat} />
            </FadeInOnScroll>
          ))}
        </div>
      </FadeInOnScroll>
    </section>
  );
}

function FeaturedCard({ stat }: { stat: Stat }) {
  return (
    <div
      className="group relative flex h-full flex-col justify-center gap-3 overflow-hidden rounded-card-lg p-8 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ background: "linear-gradient(135deg,var(--color-navy),var(--color-accent))" }}
    >
      {/* Ilustracion de linea: representacion conceptual del dato -- una
          silueta con el remolino de pensamientos por encima, no una foto
          literal, para no competir con el numero/texto encima. Gradiente
          mas oscuro (navy -> accent, antes lavanda -> celeste) a proposito:
          se ve "profesional/serio" en vez de pastel, y de paso hace que la
          ilustracion blanca resalte mucho mas sin necesidad de subirle
          tanto la opacidad. */}
      <Image
        src="/images/illustrations/salud-mental-concepto.png"
        alt=""
        aria-hidden
        fill
        sizes="(min-width: 640px) 50vw, 100vw"
        className="scale-110 object-contain object-right opacity-40 pointer-events-none select-none transition-transform duration-500 group-hover:scale-[1.18]"
      />

      <div className="relative z-10 flex flex-col gap-3">
        <p className="text-[56px] font-black leading-none tracking-tight [font-variant-numeric:tabular-nums] sm:text-[64px]">
          <AnimatedCounter value={stat.value} suffix={stat.suffix} className="text-white" />
        </p>
        <p className="max-w-[16rem] text-p-body text-white/90">{stat.label}</p>
      </div>
    </div>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  const iconSrc = STAT_ICONS[stat.label];
  const isHighlight = stat.variant === "highlight";
  const isPercent = stat.suffix === "%";

  return (
    <div
      className={`group flex h-full items-center gap-4 rounded-card-md p-5 transition-all duration-300 hover:-translate-y-1 ${
        isHighlight
          ? "border-2 border-accent/25 bg-accent/10 hover:shadow-lg hover:shadow-accent/15"
          : "border border-navy/10 bg-navy/5 hover:border-navy/20 hover:shadow-md"
      }`}
    >
      {isPercent ? (
        <div className="relative shrink-0" style={{ width: 60, height: 60 }}>
          <RadialProgress
            value={stat.value}
            size={60}
            strokeWidth={5}
            trackClassName={isHighlight ? "stroke-accent/15" : "stroke-navy/10"}
            progressClassName={isHighlight ? "stroke-accent" : "stroke-navy/50"}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-h3-sm font-bold text-navy [font-variant-numeric:tabular-nums]">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} className="text-navy" />
            </p>
          </div>
          {/* Icono propio como badge chico superpuesto en la esquina del
              anillo -- asi los 5 datos tienen su icono (antes solo lo
              tenian el featured y el 147M+, que no usan anillo) sin perder
              la visualizacion de progreso que ya funcionaba bien. */}
          {iconSrc && (
            <span className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white p-1.5 shadow-sm ring-1 ring-navy/10 transition-transform duration-300 group-hover:scale-110">
              <Image src={iconSrc} alt="" width={16} height={16} className="object-contain" />
            </span>
          )}
        </div>
      ) : (
        iconSrc && (
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full p-2.5 transition-transform duration-300 group-hover:scale-110 ${
              isHighlight ? "bg-accent/15" : "bg-navy/10"
            }`}
          >
            <Image src={iconSrc} alt="" width={24} height={24} className="object-contain" />
          </span>
        )
      )}

      <div className="min-w-0">
        {!isPercent && (
          <p className="text-data-md text-navy">
            <AnimatedCounter value={stat.value} suffix={stat.suffix} className="text-navy" />
          </p>
        )}
        <p className="text-p-small leading-snug text-navy/85">{stat.label}</p>
      </div>
    </div>
  );
}

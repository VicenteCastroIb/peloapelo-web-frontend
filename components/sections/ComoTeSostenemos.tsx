import Image from "next/image";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";

// "size" por defecto 116px; Calma y Consistencia se agrandaron un poco a
// pedido (26 jul 2026) -- sus archivos fuente (539x488 y 821x804) tienen
// resolucion de sobra para 136px sin perder nitidez. Compañía se deja igual
// (su archivo es 925x943, pero no se pidio agrandarla).
const AFIRMACIONES = [
  {
    image: "/images/icons/afirmacion-calma-icono.jpg",
    title: "Calma",
    description: "Un espacio donde puedes bajar la guardia, sin explicaciones de más.",
    size: 136,
  },
  {
    image: "/images/icons/afirmacion-compania-icono.jpg",
    title: "Compañía",
    description: "Nunca vuelves a atravesar esto en soledad silenciosa.",
    size: 116,
  },
  {
    image: "/images/icons/afirmacion-consistencia-icono.jpg",
    title: "Consistencia",
    description: "Pequeños pasos sostenidos en el tiempo, ayudamos a generar un cambio real.",
    size: 136,
  },
];

/**
 * "Cómo te sostenemos" — seccion nueva del rediseno, sin equivalente previo
 * en el codebase (ver docs de handoff). Fondo fotografico con un overlay
 * cream muy sutil (bajado de /32 a /12 el 27 jul 2026, a peticion explicita:
 * opacaba demasiado los colores originales del fondo) -- solo lo justo para
 * que el texto siga siendo legible.
 */
export default function ComoTeSostenemos() {
  return (
    <section className="relative overflow-hidden px-6 py-16 lg:px-12 lg:py-20">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/backgrounds/fondo-quienes-somos.jpg"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover object-[center_bottom]"
        />
        <div aria-hidden className="absolute inset-0 bg-cream/12" />
      </div>

      <FadeInOnScroll className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="flex justify-center">
            <SectionBadge label="Cómo te sostenemos" />
          </div>
          <h2 className="mx-auto max-w-xl text-h2-lg text-navy">
            Calma, <span className="italic text-accent">compañía</span> y consistencia.
          </h2>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {AFIRMACIONES.map(({ image, title, description, size }) => (
            <div key={title} className="text-center">
              {/* Iconos reemplazados (26 jul 2026) por versiones ya
                  recortadas a mano -- el zoom por CSS que compensaba el
                  margen blanco de los archivos anteriores ya no hace falta
                  y sobre-recortaria el dibujo, asi que se saca. */}
              <div
                className="relative mx-auto mb-4 overflow-hidden rounded-card-md border-2 border-[var(--color-gradient-from)] bg-cream"
                style={{ height: size, width: size }}
              >
                <Image
                  src={image}
                  alt=""
                  aria-hidden
                  fill
                  sizes={`${size}px`}
                  className="object-cover"
                />
              </div>
              <h3 className="text-h3-md text-navy">{title}</h3>
              <p className="mx-auto mt-2 max-w-[280px] text-p-body text-navy/85">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-xl rounded-card-md bg-[linear-gradient(135deg,rgba(143,124,182,0.12),rgba(137,207,235,0.12))] p-8 text-center">
          <p className="text-p-lead text-navy">
            La soledad y la ansiedad suelen vivir en el pasado que ya no está o en el
            futuro que aún no llega.{" "}
            <span className="italic text-accent">
              Sanar empieza cuando volvemos, con calma, al presente.
            </span>
          </p>
        </div>
      </FadeInOnScroll>
    </section>
  );
}

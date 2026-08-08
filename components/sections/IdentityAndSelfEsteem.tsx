import Image from "next/image";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";

// Seccion nueva (ver tarea de reestructuracion, ago 2026): copy original,
// no existia contenido previo sobre identidad/autoestima en el codebase.
// Tarjetas con foto (26 jul -> ago 2026, a pedido explicito): reemplaza el
// tratamiento con icono lucide en circulo por el formato "foto arriba sin
// borde + texto abajo" (ver referencia de diseno compartida). Las 3 fotos
// son shooting editorial encargado aparte (ver prompts de generacion en el
// historial de esta tarea) -- mismo criterio en las tres: sin pañuelo,
// turbante ni calvicie visible, para no leerse como paciente oncologico.
// Colocar los archivos en public/images/identity/ con estos nombres exactos
// para que las tarjetas dejen de mostrar el icono roto.
const REFLEXIONES = [
  {
    image: "/images/identity/espejo.jpg",
    title: "El espejo cambia",
    description:
      "Dejar de reconocerte al mirarte remueve algo más que una imagen: remueve una certeza sobre quién eres.",
  },
  {
    image: "/images/identity/mirada-demas.jpg",
    title: "La mirada de los demás",
    description:
      "Las preguntas, las miradas y el silencio ajeno pueden pesar tanto como la pérdida misma.",
  },
  {
    image: "/images/identity/reconstruir-identidad.jpg",
    title: "Reconstruir la identidad",
    description:
      "Sanar no significa que el pelo vuelva. Significa volver a reconocerte, con o sin él.",
  },
];

export default function IdentityAndSelfEsteem() {
  return (
    <section className="px-6 py-24 lg:px-12 lg:py-28">
      <FadeInOnScroll className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="flex justify-center">
            <SectionBadge label="Identidad y autoestima" />
          </div>
          <h2 className="mx-auto max-w-xl text-h2-lg text-navy">
            Tu pelo, <span className="italic text-accent">tu historia</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-p-lead text-navy/80">
            El pelo no es solo estética. Es parte de cómo te reconoces al espejo, de tu
            manera de presentarte al mundo y de una historia que has construido, pelo a
            pelo, literalmente. Perderlo no es un cambio cosmético: es una
            transformación profunda que toca tu identidad, tu autoestima y la forma en
            que te relacionas contigo misma.
          </p>
        </div>

        <div className="mt-14 grid gap-7 sm:grid-cols-3">
          {REFLEXIONES.map(({ image, title, description }) => (
            <div
              key={title}
              className="overflow-hidden rounded-card-lg bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={image}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-h3-md text-navy">{title}</h3>
                <p className="mt-2 text-p-body text-navy/70">{description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-xl rounded-card-md bg-[linear-gradient(135deg,rgba(143,124,182,0.12),rgba(137,207,235,0.12))] p-8 text-center">
          <p className="text-p-lead text-navy">
            No estás exagerando.{" "}
            <span className="italic text-accent">
              Lo que sientes tiene nombre, tiene causa y tiene acompañamiento.
            </span>
          </p>
        </div>
      </FadeInOnScroll>
    </section>
  );
}

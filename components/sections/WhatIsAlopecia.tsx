import Image from "next/image";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";

// Rediseno (ago 2026, feedback de diseno): antes fue un acordeon vertical
// (mismo patron que el FAQ mas abajo, sentia repetido), despues una grilla
// 2x2 con icono generico en circulo. Ahora cada tarjeta lleva una foto
// editorial propia por tipo en vez de un icono generico. El icono en
// circulo se saca: la foto real ya cumple ese rol y duplicarlo se sentia
// recargado.
//
// Segunda pasada (ago 2026, "quita el degradado de las imagenes"): la foto
// se disolvia hacia el tinte de la tarjeta con mask-image (mismo recurso
// que Hero.tsx/Fundadora.tsx) -- a pedido se saca, la foto ahora termina en
// un corte limpio contra el borde redondeado de la tarjeta.
//
// Fotos pendientes de subir a public/images/alopecia-types/ con estos
// nombres exactos (ver prompts de generacion en el historial de esta
// tarea): areata.jpg, androgenetica.jpg, efluvio-telogeno.jpg,
// tricotilomania.jpg. Mientras no existan, la zona superior de la tarjeta
// solo muestra el tinte de color (no rompe el layout).
const TIPOS_ALOPECIA = [
  {
    image: "/images/alopecia-types/areata.jpg",
    tag: "Autoinmune",
    name: "Alopecia areata",
    description:
      "El sistema inmune ataca por error los folículos capilares, provocando parches de pérdida repentina. Puede afectar el cuero cabelludo, cejas, pestañas o todo el cuerpo (areata universal). No es contagiosa ni está causada por algo que hayas hecho.",
  },
  {
    image: "/images/alopecia-types/androgenetica.jpg",
    tag: "La más común",
    name: "Alopecia androgenética",
    description:
      "La más común. Determinada genéticamente y ligada a hormonas, se presenta como un adelgazamiento progresivo y gradual del cabello, con un patrón distinto entre hombres y mujeres.",
  },
  {
    image: "/images/alopecia-types/efluvio-telogeno.jpg",
    tag: "Reversible",
    name: "Efluvio telógeno",
    description:
      "Una caída generalizada y temporal, gatillada por estrés físico o emocional intenso, cambios hormonales, o eventos como un parto o una enfermedad. Suele revertir con el tiempo y el cuidado adecuado.",
  },
  {
    image: "/images/alopecia-types/tricotilomania.jpg",
    tag: "Relacionada a la ansiedad",
    name: "Tricotilomanía",
    description:
      "Un trastorno relacionado a la ansiedad que lleva a arrancarse el propio cabello, muchas veces sin plena conciencia del acto. Requiere abordaje psicológico junto con el físico.",
  },
];

// Mismo patron que STEP_GRADIENTS en ComoFunciona.tsx / PLAN_GRADIENTS en
// PlanCard.tsx: base blanca + tinte de marca muy sutil, uno distinto por
// tarjeta. La foto se disuelve hacia este mismo color (ver estilo inline
// del mask de abajo), asi que el tinte tambien define hacia que color se
// funde cada foto.
const TYPE_GRADIENTS = [
  "linear-gradient(160deg,#ffffff,rgba(239,67,67,0.06))",
  "linear-gradient(160deg,#ffffff,rgba(143,124,182,0.12))",
  "linear-gradient(160deg,#ffffff,rgba(137,207,235,0.16))",
  "linear-gradient(160deg,#ffffff,rgba(96,73,141,0.10))",
];

export default function WhatIsAlopecia() {
  return (
    <section className="bg-white/40 px-6 py-24 lg:px-12 lg:py-28">
      <FadeInOnScroll className="mx-auto max-w-5xl">
        <div className="flex justify-center">
          <SectionBadge label="Qué es la alopecia" />
        </div>

        <h2 className="mx-auto max-w-2xl text-center text-h2-lg text-navy">
          Un diagnóstico, <span className="italic text-accent">muchas formas</span>.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-center text-p-lead text-navy/80">
          La alopecia es la pérdida de cabello, total o parcial, que puede tener
          distintas causas: autoinmunes, hormonales, genéticas o relacionadas al
          estrés. No es solo un tema físico — el bienestar emocional influye en su
          evolución, y por eso un abordaje integral, de cuerpo y mente, es tan
          importante como cualquier tratamiento.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {TIPOS_ALOPECIA.map(({ image, tag, name, description }, index) => (
            <div
              key={name}
              className="group relative flex flex-col overflow-hidden rounded-card-lg border border-navy/12 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-lg"
              style={{ background: TYPE_GRADIENTS[index % TYPE_GRADIENTS.length] }}
            >
              <div className="relative h-44 w-full shrink-0">
                <Image
                  src={image}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-5 top-5 rounded-pill bg-white/85 px-3 py-1 text-p-caption font-bold uppercase tracking-wide text-accent backdrop-blur-sm">
                  {tag}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2 px-7 pb-7 pt-4">
                <h3 className="text-h3-md text-navy">{name}</h3>
                <p className="text-p-body text-navy/70">{description}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-p-body italic text-navy/60">
          Sea cual sea tu diagnóstico, ninguno se resuelve solo con champú o promesas
          mágicas. Por eso en Pelo a Pelo integramos evidencia médica con
          acompañamiento emocional real.
        </p>
      </FadeInOnScroll>
    </section>
  );
}

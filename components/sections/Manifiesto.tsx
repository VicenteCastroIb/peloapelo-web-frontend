import Image from "next/image";
import { ArrowDown } from "lucide-react";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";

export default function Manifiesto() {
  return (
    <section className="px-6 py-24 lg:px-12 lg:py-36">
      <FadeInOnScroll className="mx-auto max-w-6xl text-center">
        <SectionBadge label="Manifiesto · I" />

        <h2 className="mx-auto text-h2-lg text-navy">
          Nada te hará cambiar más que <span className="italic text-accent">tú mism@</span>.
        </h2>

        <div className="mx-auto mt-8 max-w-xl space-y-4 text-p-body text-navy/70">
          <p>No pongas afuera lo que debes trabajar por dentro.</p>
          <p>
            La invitación es darte <strong className="text-navy">foco y estructura</strong> a
            tu sanación. Cuando estás pasando por un síntoma, normalmente el foco se
            pierde y comenzamos a buscar soluciones sin una estrategia detrás.
          </p>
          <p>
            Navegamos en el <strong className="text-navy">miedo</strong>, y desde ahí es
            difícil llegar a una solución.
          </p>
        </div>

        <p className="mx-auto mt-12 max-w-3xl text-p-lead italic text-navy">
          Línea predecible de tu realidad conocida
        </p>

        <div className="relative mx-auto mt-6 aspect-[1344/768] w-full max-w-6xl">
          <Image
            src="/images/manifiesto-diagrama.png"
            alt="Diagrama: entre el pasado (programa automático) y el futuro (programa automático) está el momento presente, donde puede ocurrir un evento desconocido que te cambia."
            fill
            sizes="(min-width: 1280px) 1152px, 95vw"
            className="object-contain"
          />

          <div className="absolute right-[6%] top-[16%] flex flex-col items-center gap-1.5">
            <span className="whitespace-nowrap text-p-small text-coral sm:text-h3-sm">
              Evento desconocido
            </span>
            <ArrowDown size={20} className="text-coral sm:size-6" />
          </div>

          <span className="absolute left-[12%] top-[46%] -translate-y-1/2 text-h3-sm text-navy sm:text-h3-md sm:font-bold">
            AYER
          </span>
          <span className="absolute left-[12%] top-[60%] -translate-y-1/2 text-p-caption italic text-navy/50 sm:text-p-small">
            Programa automático
          </span>
          <span className="absolute bottom-[4%] left-[3%] text-p-caption italic text-navy/50 sm:text-p-small">
            Pasado
          </span>

          <span className="absolute right-[10%] top-[46%] -translate-y-1/2 text-h3-sm text-navy sm:text-h3-md sm:font-bold">
            MAÑANA
          </span>
          <span className="absolute right-[8%] top-[60%] -translate-y-1/2 text-p-caption italic text-navy/50 sm:text-p-small">
            Programa automático
          </span>
          <span className="absolute bottom-[4%] right-[2%] text-p-caption italic text-navy/50 sm:text-p-small">
            Futuro
          </span>
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-p-body italic text-navy/50">
          El verdadero cambio ocurre en el <span className="text-navy">momento presente</span>.
        </p>
      </FadeInOnScroll>
    </section>
  );
}

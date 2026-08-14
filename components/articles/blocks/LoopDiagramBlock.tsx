import Image from "next/image";
import { ArrowDown, ArrowRight, RotateCcw } from "lucide-react";
import type { LoopDiagramBlockData } from "@/lib/types/blogBlocks";
import { RichText } from "@/lib/blog/richText";

// Diagrama de ciclo que se retroalimenta (ex LOOP_STEPS en
// ManejoAnsiedadCaida.tsx): pasos con flechas, cierra con RotateCcw de
// vuelta al primero.
export default function LoopDiagramBlock({ data }: { data: LoopDiagramBlockData }) {
  return (
    <div className="rounded-card-lg bg-[linear-gradient(135deg,rgba(143,124,182,0.12),rgba(137,207,235,0.12))] p-6 shadow-sm sm:p-8 lg:p-8">
      <div className="flex flex-col items-center justify-center gap-3 lg:flex-row lg:flex-nowrap lg:gap-x-1">
        {data.steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center gap-2 lg:flex-row">
            <div className="flex w-[139px] shrink-0 flex-col items-center gap-2 text-center">
              <span className="relative h-[139px] w-[139px] overflow-hidden rounded-full bg-white shadow-sm">
                {/* step.image truthy-check: en la vista previa en vivo del admin
                    (/admin/blog) este bloque se re-renderiza en cada tecla mientras
                    Jessica todavia esta pegando la URL -- next/image tira si src
                    es "" (ver tambien nota "unoptimized" en ArticleCard.tsx, mismo
                    caso para el host). Sin guardia, un paso sin imagen todavia
                    rompia el diagrama entero en vez de mostrar el circulo vacio. */}
                {step.image && (
                  <Image src={step.image} alt="" aria-hidden fill unoptimized sizes="139px" className="object-cover" />
                )}
              </span>
              <p className="text-p-small font-semibold leading-snug text-navy">{step.label}</p>
            </div>
            {index < data.steps.length - 1 && (
              <>
                <ArrowDown size={28} className="text-accent/50 lg:hidden" />
                <ArrowRight size={28} className="hidden shrink-0 text-accent/50 lg:block" />
              </>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 text-center text-p-small font-semibold text-accent">
        <RotateCcw size={16} className="shrink-0" />
        {data.loopLabel}
      </div>
      <p className="mt-4 text-center text-p-body text-navy/80">
        <RichText text={data.closingText} />
      </p>
    </div>
  );
}

import type { StatRingRowBlockData } from "@/lib/types/blogBlocks";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import RadialProgress from "@/components/shared/RadialProgress";

// Fila de anillos de progreso animados para destacar cifras citables (ex
// StatRing en ManejoAnsiedadCaida.tsx).
export default function StatRingRowBlock({ data }: { data: StatRingRowBlockData }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {data.items.map((item, index) => (
        <div
          key={index}
          className="flex flex-1 items-center gap-4 rounded-card-md border border-navy/10 bg-navy/5 p-5"
        >
          <div className="relative shrink-0" style={{ width: 60, height: 60 }}>
            <RadialProgress
              value={item.value}
              size={60}
              strokeWidth={5}
              trackClassName="stroke-navy/10"
              progressClassName="stroke-accent"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-h3-sm font-bold text-navy [font-variant-numeric:tabular-nums]">
                <AnimatedCounter value={item.value} suffix="%" className="text-navy" />
              </p>
            </div>
          </div>
          <p className="text-p-small leading-snug text-navy/75">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

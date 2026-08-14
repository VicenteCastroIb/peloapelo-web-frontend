import { XCircle } from "lucide-react";
import type { MythRealityGridBlockData } from "@/lib/types/blogBlocks";
import { RichText } from "@/lib/blog/richText";

// Grid de mitos/realidad (ex MYTHS en MitosComunesAlopecia.tsx): mito con
// fondo coral-soft, realidad en zona blanca/acento separada -- misma altura
// minima en la zona del mito para que la linea divisoria quede alineada
// entre cards de una misma fila.
export default function MythRealityGridBlock({ data }: { data: MythRealityGridBlockData }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {data.items.map((item, index) => (
        <div
          key={index}
          className="flex h-full flex-col overflow-hidden rounded-card-lg border border-navy/10 bg-white shadow-sm"
        >
          <div className="flex min-h-[92px] flex-col gap-1.5 bg-coral-soft px-5 py-4">
            <p className="flex items-center gap-1.5 text-p-caption font-bold uppercase tracking-wide text-coral">
              <XCircle size={14} className="shrink-0" />
              Mito
            </p>
            <p className="text-p-body font-semibold text-navy/90">&quot;{item.myth}&quot;</p>
          </div>
          <div className="flex-1 bg-accent/5 px-5 py-4">
            <p className="text-p-caption font-bold uppercase tracking-wide text-accent">Realidad</p>
            <p className="mt-1.5 text-p-body text-navy/75">
              <RichText text={item.reality} />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

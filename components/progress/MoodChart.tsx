import { MOOD_SCALE } from "@/components/progress/MoodPicker";
import type { ProgressEntry } from "@/lib/api/progress";

// Grafico de barras del animo de las ultimas N semanas. Extraido de
// app/(app)/progress/page.tsx para que la usuaria (en /progress) y Jessica
// (en /admin/usuarias/[id]) vean EXACTAMENTE la misma visualizacion -- no
// una version distinta.

/**
 * Los ultimos `days` dias (incluido hoy) como una grilla fija -- null para
 * los dias sin registro, que se dibujan igual (barra punteada).
 */
export function buildMoodGrid(entries: ProgressEntry[], days = 14): (number | null)[] {
  const byDate = new Map(entries.map((e) => [e.date, e.mood]));
  const grid: (number | null)[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    grid.push(byDate.get(iso) ?? null);
  }
  return grid;
}

export function MoodScaleLegend() {
  return (
    <div className="flex items-center gap-2.5 text-p-small text-navy/50">
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: MOOD_SCALE[0].color }} />
        Muy difícil
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: MOOD_SCALE[4].color }} />
        Muy bien
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-[3px] border border-dashed border-navy/20" />
        Sin registro
      </span>
    </div>
  );
}

export default function MoodChart({
  data,
  fromLabel = "Hace 2 semanas",
  toLabel = "Hoy",
}: {
  data: (number | null)[];
  fromLabel?: string;
  toLabel?: string;
}) {
  return (
    <div>
      <div className="flex h-[84px] items-end gap-[5px]">
        {data.map((v, i) => {
          const m = v ? MOOD_SCALE[v - 1] : null;
          return (
            <div
              key={i}
              className="flex h-full flex-1 flex-col justify-end"
              title={m ? m.label : "Sin registro"}
            >
              {m ? (
                <div
                  className="rounded-lg opacity-90"
                  style={{ height: `${20 + (v! / 5) * 64}%`, background: m.color }}
                />
              ) : (
                <div className="h-[18%] rounded-lg border border-dashed border-navy/20" />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-p-small text-navy/50">
        <span>{fromLabel}</span>
        <span>{toLabel}</span>
      </div>
    </div>
  );
}

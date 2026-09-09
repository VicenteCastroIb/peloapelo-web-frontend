import { alopeciaTypeByCode, ALL_ALOPECIA_CODES } from "@/lib/data/alopeciaTypes";

// Desglose del puntaje del quiz por tipo de alopecia (jsonb `scores`). Barras
// relativas al máximo, para que Jessica vea de un vistazo qué tan marcado
// quedó el resultado y cuánto lo siguió el segundo tipo.
export default function UserScoresBreakdown({ scores }: { scores: Record<string, number> }) {
  const values = ALL_ALOPECIA_CODES.map((code) => scores[code] ?? 0);
  const max = Math.max(1, ...values);

  return (
    <ul className="flex flex-col gap-2.5">
      {ALL_ALOPECIA_CODES.map((code) => {
        const value = scores[code] ?? 0;
        return (
          <li key={code} className="flex items-center gap-3">
            <span className="w-32 shrink-0 text-p-small text-navy/70 sm:w-44">
              {alopeciaTypeByCode(code).name}
            </span>
            <span className="h-2 flex-1 overflow-hidden rounded-pill bg-navy/10">
              <span
                className="block h-full rounded-pill bg-accent/70"
                style={{ width: `${(value / max) * 100}%` }}
              />
            </span>
            <span className="w-6 shrink-0 text-right text-p-small font-semibold tabular-nums text-navy">
              {value}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

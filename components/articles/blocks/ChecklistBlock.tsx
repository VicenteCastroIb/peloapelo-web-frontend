import { CheckCircle2 } from "lucide-react";
import type { ChecklistBlockData } from "@/lib/types/blogBlocks";
import { RichText } from "@/lib/blog/richText";

// Misma paleta rotativa que las cards de habitos, para que las chips de tips
// no se lean todas iguales (ver HAIR_CARE_TIPS original en GuiaAutocuidado.tsx).
const CHIP_TINTS = ["#8F7CB6", "#A3C08B", "#D9A3B0", "#E8B979", "#89CFEB"];

export default function ChecklistBlock({ data }: { data: ChecklistBlockData }) {
  if (data.style === "chips") {
    const isOdd = data.items.length % 2 === 1;
    return (
      <div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {data.items.map((tip, index) => {
            const tint = CHIP_TINTS[index % CHIP_TINTS.length];
            const isLastOdd = isOdd && index === data.items.length - 1;
            return (
              <li
                key={index}
                className={`flex flex-col items-center gap-2 rounded-card-md p-5 text-center text-p-body text-navy/75 ${
                  isLastOdd ? "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-8px)]" : ""
                }`}
                style={{ backgroundColor: `color-mix(in srgb, ${tint} 26%, white)` }}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <CheckCircle2 size={14} style={{ color: tint }} />
                </span>
                <RichText text={tip} />
              </li>
            );
          })}
        </ul>
        {data.sourceNote && (
          <p className="mt-5 text-p-small text-navy/55">
            <RichText text={data.sourceNote} />
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <ul className="flex flex-col gap-3">
        {data.items.map((item, index) => (
          <li key={index} className="flex items-start gap-3 text-p-body text-navy/75">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent" />
            <RichText text={item} />
          </li>
        ))}
      </ul>
      {data.sourceNote && (
        <p className="mt-4 text-p-small text-navy/55">
          <RichText text={data.sourceNote} />
        </p>
      )}
    </div>
  );
}

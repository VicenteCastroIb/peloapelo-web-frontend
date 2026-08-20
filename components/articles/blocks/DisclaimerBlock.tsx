import { BadgeCheck } from "lucide-react";
import type { DisclaimerBlockData } from "@/lib/types/blogBlocks";
import { RichText } from "@/lib/blog/richText";
import { TEXT_COLOR_CLASS, TEXT_SIZE_CLASS } from "@/lib/blog/textStyleTokens";

// Disclaimer clinico: mismo patron en los 3 articulos originales -- informa,
// no reemplaza una evaluacion profesional.
export default function DisclaimerBlock({ data }: { data: DisclaimerBlockData }) {
  const sizeClass = data.fontSize ? TEXT_SIZE_CLASS[data.fontSize] : "text-p-small";
  const colorClass = data.color ? TEXT_COLOR_CLASS[data.color] : "text-navy/70";

  return (
    <div className="flex items-start gap-3 rounded-card-md border border-navy/10 bg-navy/5 p-4">
      <BadgeCheck size={18} className="mt-0.5 shrink-0 text-accent" />
      <p className={`${sizeClass} ${colorClass}`}>
        <RichText text={data.text} />
      </p>
    </div>
  );
}

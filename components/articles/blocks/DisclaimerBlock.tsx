import { BadgeCheck } from "lucide-react";
import type { DisclaimerBlockData } from "@/lib/types/blogBlocks";
import { RichText } from "@/lib/blog/richText";

// Disclaimer clinico: mismo patron en los 3 articulos originales -- informa,
// no reemplaza una evaluacion profesional.
export default function DisclaimerBlock({ data }: { data: DisclaimerBlockData }) {
  return (
    <div className="flex items-start gap-3 rounded-card-md border border-navy/10 bg-navy/5 p-4 text-p-small text-navy/70">
      <BadgeCheck size={18} className="mt-0.5 shrink-0 text-accent" />
      <p>
        <RichText text={data.text} />
      </p>
    </div>
  );
}

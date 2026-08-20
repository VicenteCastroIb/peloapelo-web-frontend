import type { RichTextBlockData } from "@/lib/types/blogBlocks";
import { RichText } from "@/lib/blog/richText";
import { TEXT_COLOR_CLASS, TEXT_SIZE_CLASS } from "@/lib/blog/textStyleTokens";

// Bloque de texto generico: cubre tanto la intro del articulo (variant
// "lead", text-p-lead mas grande) como los parrafos de cuerpo normales
// (variant "body", text-p-body) que antes vivian escritos a mano entre cada
// H2. Varios parrafos en un mismo bloque se separan con mt-4 entre si.
// `fontSize`/`color` (fase 1, ago 2026) pisan el tamaño/color que
// determinaria `variant` cuando estan definidos -- `variant` sigue siendo el
// fallback para articulos publicados antes de que existiera `fontSize`.
export default function RichTextBlock({ data }: { data: RichTextBlockData }) {
  const variant = data.variant ?? "body";
  const defaultSizeClass = variant === "lead" ? "text-p-lead" : "text-p-body";
  const defaultColorClass = variant === "lead" ? "text-navy/80" : "text-navy/75";
  const sizeClass = data.fontSize ? TEXT_SIZE_CLASS[data.fontSize] : defaultSizeClass;
  const colorClass = data.color ? TEXT_COLOR_CLASS[data.color] : defaultColorClass;
  const className = `${sizeClass} ${colorClass}`;

  return (
    <>
      {data.paragraphs.map((paragraph, index) => (
        <p key={index} className={`${index > 0 ? "mt-4 " : ""}${className}`}>
          <RichText text={paragraph} />
        </p>
      ))}
    </>
  );
}

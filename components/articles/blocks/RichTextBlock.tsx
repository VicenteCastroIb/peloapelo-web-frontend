import type { RichTextBlockData } from "@/lib/types/blogBlocks";
import { RichText } from "@/lib/blog/richText";

// Bloque de texto generico: cubre tanto la intro del articulo (variant
// "lead", text-p-lead mas grande) como los parrafos de cuerpo normales
// (variant "body", text-p-body) que antes vivian escritos a mano entre cada
// H2. Varios parrafos en un mismo bloque se separan con mt-4 entre si.
export default function RichTextBlock({ data }: { data: RichTextBlockData }) {
  const variant = data.variant ?? "body";
  const className =
    variant === "lead" ? "text-p-lead text-navy/80" : "text-p-body text-navy/75";

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

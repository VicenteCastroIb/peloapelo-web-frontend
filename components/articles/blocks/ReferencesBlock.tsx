import type { ReferencesBlockData } from "@/lib/types/blogBlocks";

// Lista de referencias numeradas: cada Cite (ver lib/blog/richText.tsx)
// apunta aca via anchor #ref-N. Siempre el ultimo bloque del articulo.
export default function ReferencesBlock({ data }: { data: ReferencesBlockData }) {
  return (
    <div className="mt-16 border-t border-navy/10 pt-8">
      <h2 className="text-h3-lg text-navy">Referencias</h2>
      <ol className="mt-4 flex flex-col gap-2 text-p-small text-navy/60">
        {data.items.map((ref, index) => (
          <li key={ref.url} id={`ref-${index + 1}`} className="flex gap-2 scroll-mt-24">
            <span className="shrink-0 text-navy/40">[{index + 1}]</span>
            <span>
              {ref.text}{" "}
              <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                {(() => {
                  try {
                    return new URL(ref.url).hostname.replace("www.", "");
                  } catch {
                    return ref.url;
                  }
                })()}
              </a>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

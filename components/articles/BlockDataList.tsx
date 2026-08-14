import type { BlockData } from "@/lib/types/blogBlocks";
import DisclaimerBlock from "./blocks/DisclaimerBlock";
import HeadingBlock from "./blocks/HeadingBlock";
import RichTextBlock from "./blocks/RichTextBlock";
import IconCardGridBlock from "./blocks/IconCardGridBlock";
import MythRealityGridBlock from "./blocks/MythRealityGridBlock";
import ChecklistBlock from "./blocks/ChecklistBlock";
import StatRingRowBlock from "./blocks/StatRingRowBlock";
import LoopDiagramBlock from "./blocks/LoopDiagramBlock";
import CtaCardBlock from "./blocks/CtaCardBlock";
import ReferencesBlock from "./blocks/ReferencesBlock";

// Nucleo de render compartido: dado un array de bloques YA parseados
// (BlockData, no el dataJson crudo), decide el componente y el margen entre
// bloques. Extraido de ArticleBlocksRenderer.tsx (ago 2026) para que la
// vista previa en vivo del panel /admin/blog (ver
// components/admin/blog/LiveArticlePreview.tsx) pueda reusar exactamente
// esta misma logica -- misma funcion, mismos componentes, mismas clases --
// en vez de reimplementar el render y arriesgarse a que la vista previa se
// desincronice de como se ve el articulo publicado de verdad.
const TOP_MARGIN_BY_TYPE: Record<string, string> = {
  disclaimer: "",
  heading: "mt-12",
  rich_text: "mt-4",
  icon_card_grid: "mt-6",
  myth_reality_grid: "mt-6",
  checklist: "mt-4",
  stat_ring_row: "mt-5",
  loop_diagram: "mt-6",
  cta_card: "mt-8",
  references: "",
};

export default function BlockDataList({ blocks }: { blocks: BlockData[] }) {
  return (
    <div className="mx-auto max-w-3xl">
      {blocks.map((data, index) => {
        const margin = index === 0 ? "" : (TOP_MARGIN_BY_TYPE[data.type] ?? "mt-6");
        return (
          <div key={index} className={margin || undefined}>
            <RenderBlock data={data} />
          </div>
        );
      })}
    </div>
  );
}

function RenderBlock({ data }: { data: BlockData }) {
  switch (data.type) {
    case "disclaimer":
      return <DisclaimerBlock data={data} />;
    case "heading":
      return <HeadingBlock data={data} />;
    case "rich_text":
      return <RichTextBlock data={data} />;
    case "icon_card_grid":
      return <IconCardGridBlock data={data} />;
    case "myth_reality_grid":
      return <MythRealityGridBlock data={data} />;
    case "checklist":
      return <ChecklistBlock data={data} />;
    case "stat_ring_row":
      return <StatRingRowBlock data={data} />;
    case "loop_diagram":
      return <LoopDiagramBlock data={data} />;
    case "cta_card":
      return <CtaCardBlock data={data} />;
    case "references":
      return <ReferencesBlock data={data} />;
    default:
      return null;
  }
}

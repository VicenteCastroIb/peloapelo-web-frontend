import type { BlockData, BlockType } from "@/lib/types/blogBlocks";

// Catalogo de tipos de bloque que Jessica puede agregar desde /admin/blog, con
// su valor inicial ("en blanco pero valido") al crear uno nuevo. Mismo set de
// 10 tipos que sabe interpretar ArticleBlocksRenderer.tsx (ver
// lib/types/blogBlocks.ts) -- si se agrega un tipo nuevo ahi, agregarlo
// tambien aca para que aparezca en el selector "Agregar bloque".
export const BLOCK_TYPE_LABEL: Record<BlockType, string> = {
  disclaimer: "Aviso / disclaimer",
  heading: "Subtítulo",
  rich_text: "Párrafo de texto",
  icon_card_grid: "Tarjetas con ícono (grilla)",
  myth_reality_grid: "Mito vs. realidad",
  checklist: "Lista / checklist",
  stat_ring_row: "Estadísticas destacadas",
  loop_diagram: "Diagrama circular (pasos)",
  cta_card: "Tarjeta de invitación a contactar",
  references: "Referencias / fuentes",
};

export const BLOCK_TYPE_OPTIONS = Object.keys(BLOCK_TYPE_LABEL) as BlockType[];

export function defaultBlockData(type: BlockType): BlockData {
  switch (type) {
    case "disclaimer":
      return { type, text: "" };
    case "heading":
      return { type, text: "", icon: null };
    case "rich_text":
      return { type, variant: "body", paragraphs: [""] };
    case "icon_card_grid":
      return {
        type,
        layout: "vertical-card",
        columns: 2,
        circleSize: 96,
        bannerStyle: "half",
        bannerHeight: 56,
        centerText: false,
        numberStyle: "none",
        showConfidenceDots: false,
        showTag: false,
        centerLastOdd: false,
        items: [],
      };
    case "myth_reality_grid":
      return { type, items: [] };
    case "checklist":
      return { type, style: "list", sourceNote: null, items: [] };
    case "stat_ring_row":
      return { type, items: [] };
    case "loop_diagram":
      return { type, steps: [], loopLabel: "", closingText: "" };
    case "cta_card":
      return { type, question: "", subtext: "" };
    case "references":
      return { type, items: [] };
  }
}

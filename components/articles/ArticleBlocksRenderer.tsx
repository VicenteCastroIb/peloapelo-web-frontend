import type { BlockData, RawArticleBlock } from "@/lib/types/blogBlocks";
import BlockDataList from "./BlockDataList";

// Render publico de un articulo del blog a partir de sus bloques (ver
// lib/types/blogBlocks.ts para el contrato exacto de cada block_type). Cada
// bloque llega del backend como { blockType, dataJson } -- dataJson es texto
// JSON opaco (ver Article.java / V16) que se parsea aca recien en el borde
// del frontend. El resto del render (que componente usar, margen entre
// bloques) vive en BlockDataList.tsx, compartido con la vista previa en
// vivo del panel /admin/blog.
export function parseBlock(raw: RawArticleBlock): BlockData | null {
  try {
    const parsed = JSON.parse(raw.dataJson);
    return { ...parsed, type: raw.blockType } as BlockData;
  } catch {
    return null;
  }
}

export default function ArticleBlocksRenderer({ blocks }: { blocks: RawArticleBlock[] }) {
  const sorted = [...blocks].sort((a, b) => a.position - b.position);
  const parsed = sorted.map(parseBlock).filter((data): data is BlockData => data !== null);

  return <BlockDataList blocks={parsed} />;
}

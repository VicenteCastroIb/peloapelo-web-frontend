"use client";

import { useState } from "react";
import { GripVertical } from "lucide-react";
import type { BlockData } from "@/lib/types/blogBlocks";
import { blockSectionClassName } from "@/lib/blog/blockStyleTokens";
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
import ImageBlock from "./blocks/ImageBlock";
import VideoEmbedBlock from "./blocks/VideoEmbedBlock";

// Nucleo de render compartido: dado un array de bloques YA parseados
// (BlockData, no el dataJson crudo), decide el componente y el margen entre
// bloques. Usado tanto por la pagina publica del blog (ArticleBlocksRenderer)
// como por el editor visual de /admin/blog (BlockList.tsx) -- misma funcion,
// mismos componentes, mismas clases, para que el editor muestre el contenido
// exactamente como se va a ver publicado.
//
// `editable` (fase 0 del editor visual) agrega la capa de seleccion/drag&drop
// sobre el mismo render, SIN bifurcar el arbol de componentes: cada bloque se
// envuelve en un contenedor clickeable/arrastrable (drag-and-drop nativo
// HTML5, sin libreria nueva) que dispara `onSelect`/`onReorder`. Sin
// `editable` (paginas publicas) el envoltorio ni existe -- cero costo/riesgo
// para el render publico.
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
  image: "mt-8",
  video_embed: "mt-8",
};

export default function BlockDataList({
  blocks,
  editable = false,
  selectedIndex = null,
  onSelect,
  onReorder,
}: {
  blocks: BlockData[];
  /** Modo editor: agrega seleccion y reordenamiento por drag&drop sobre el mismo render. */
  editable?: boolean;
  selectedIndex?: number | null;
  onSelect?: (index: number) => void;
  onReorder?: (from: number, to: number) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-3xl">
      {blocks.map((data, index) => {
        const margin = index === 0 ? "" : (TOP_MARGIN_BY_TYPE[data.type] ?? "mt-6");

        if (!editable) {
          return (
            <div key={index} className={margin || undefined}>
              <StyledBlock data={data} />
            </div>
          );
        }

        const selected = selectedIndex === index;
        return (
          <div key={index} className={margin || undefined}>
            <div
              role="button"
              tabIndex={0}
              draggable
              onDragStart={(e) => {
                setDragIndex(index);
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", String(index));
              }}
              onDragEnd={() => {
                setDragIndex(null);
                setDragOverIndex(null);
              }}
              onDragOver={(e) => {
                // Sin esto el navegador no permite soltar (onDrop nunca dispara) --
                // comportamiento por defecto de HTML5 drag&drop.
                e.preventDefault();
                if (dragOverIndex !== index) setDragOverIndex(index);
              }}
              onDragLeave={() => {
                setDragOverIndex((prev) => (prev === index ? null : prev));
              }}
              onDrop={(e) => {
                e.preventDefault();
                const from = Number(e.dataTransfer.getData("text/plain"));
                setDragOverIndex(null);
                if (!Number.isNaN(from)) onReorder?.(from, index);
              }}
              onClick={() => onSelect?.(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect?.(index);
                }
              }}
              className={`group relative -m-2 cursor-pointer rounded-card-md border-2 p-2 transition-colors ${
                selected
                  ? "border-accent bg-accent/5"
                  : dragOverIndex === index
                    ? "border-accent/40"
                    : "border-transparent hover:border-navy/15"
              } ${dragIndex === index ? "opacity-40" : ""}`}
            >
              <span
                className={`pointer-events-none absolute -top-3 left-1 z-10 flex items-center gap-1 rounded-pill bg-navy px-2 py-0.5 text-[10px] font-semibold text-cream transition-opacity ${
                  selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <GripVertical size={10} />
                {index + 1}
              </span>
              <StyledBlock data={data} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Fondo/padding de seccion (fase 2, ago 2026) -- envuelve el bloque en un
// div con las clases de BlockStyle SOLO si el bloque eligio algo (background
// y/o padding), asi que un bloque sin esa eleccion se ve pixel-a-pixel igual
// que antes de la fase 2.
function StyledBlock({ data }: { data: BlockData }) {
  const sectionClass = blockSectionClassName(data);
  if (!sectionClass) return <RenderBlock data={data} />;
  return (
    <div className={sectionClass}>
      <RenderBlock data={data} />
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
    case "image":
      return <ImageBlock data={data} />;
    case "video_embed":
      return <VideoEmbedBlock data={data} />;
    default:
      return null;
  }
}

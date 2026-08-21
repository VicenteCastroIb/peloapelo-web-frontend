"use client";

import type { BlockType } from "@/lib/types/blogBlocks";
import { BLOCK_TYPE_ICON, BLOCK_TYPE_LABEL, BLOCK_TYPE_OPTIONS } from "@/lib/admin/blogBlockDefaults";

// Panel izquierdo del editor visual (fase 0): galeria de tipos de bloque con
// icono, reemplaza el <select> de texto plano que tenia BlockList.tsx.
// Agregar un bloque lo manda al final del articulo y lo selecciona (ver
// BlockList.addBlock) -- el reordenamiento se hace despues, arrastrando en
// el lienzo.
export default function BlockPalette({
  onAdd,
  disabled,
}: {
  onAdd: (type: BlockType) => void;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-card-md border border-navy/10 bg-white p-3 shadow-sm @5xl:sticky @5xl:top-6 @5xl:max-h-[calc(100vh-3rem)] @5xl:self-start @5xl:overflow-y-auto">
      <p className="px-1 text-p-caption font-semibold text-navy/50">Agregar bloque</p>
      <div className="mt-2 grid grid-cols-2 gap-2 @5xl:grid-cols-1">
        {BLOCK_TYPE_OPTIONS.map((type) => {
          const Icon = BLOCK_TYPE_ICON[type];
          return (
            <button
              key={type}
              type="button"
              disabled={disabled}
              onClick={() => onAdd(type)}
              className="flex flex-col items-center gap-1.5 rounded-card-md border border-navy/10 bg-cream px-2 py-3 text-center text-p-caption font-semibold text-navy/70 transition-colors hover:border-accent hover:bg-accent/5 hover:text-accent disabled:opacity-50 @5xl:flex-row @5xl:justify-start @5xl:text-left"
            >
              <Icon size={18} className="shrink-0" />
              <span>{BLOCK_TYPE_LABEL[type]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Save, Trash2 } from "lucide-react";
import type { AdminArticleBlock } from "@/lib/api/adminBlog";
import type { BlockData, BlockType } from "@/lib/types/blogBlocks";
import { BLOCK_TYPE_LABEL } from "@/lib/admin/blogBlockDefaults";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import BlockDataForm from "./BlockDataForm";

// Panel derecho del editor visual (fase 0): inspector contextual del bloque
// seleccionado en el lienzo (ver BlockDataList editable + BlockList). Vacio
// cuando no hay seleccion. Reemplaza la tarjeta colapsable BlockCard.tsx --
// la edicion sigue siendo por campos (BlockDataForm), no contenteditable en
// el lienzo, para no disparar un esfuerzo mucho mayor en esta fase.
export default function BlockInspector({
  block,
  data,
  index,
  total,
  saving,
  removing,
  moveDisabled,
  onDataChange,
  onSave,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  block: AdminArticleBlock | null;
  data: BlockData | null;
  index: number;
  total: number;
  saving: boolean;
  removing: boolean;
  moveDisabled?: boolean;
  onDataChange: (data: BlockData) => void;
  onSave: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!block || !data) {
    return (
      <div className="rounded-card-md border border-dashed border-navy/15 bg-white p-6 text-center lg:sticky lg:top-6 lg:self-start">
        <p className="text-p-small text-navy/50">Seleccioná un bloque en el lienzo para editarlo acá.</p>
      </div>
    );
  }

  const label = BLOCK_TYPE_LABEL[block.blockType as BlockType] ?? block.blockType;

  return (
    <div className="rounded-card-md border border-navy/10 bg-white shadow-sm lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto">
      <div className="flex items-center gap-1 border-b border-navy/10 px-4 py-3">
        <span className="mr-auto rounded-pill bg-navy/5 px-2.5 py-0.5 text-p-caption font-semibold text-navy/70">
          {label}
        </span>
        <button
          type="button"
          disabled={index <= 0 || moveDisabled}
          onClick={onMoveUp}
          className="rounded-pill p-1.5 text-navy/40 hover:bg-navy/5 disabled:opacity-20"
          aria-label="Subir"
        >
          <ChevronUp size={15} />
        </button>
        <button
          type="button"
          disabled={index < 0 || index === total - 1 || moveDisabled}
          onClick={onMoveDown}
          className="rounded-pill p-1.5 text-navy/40 hover:bg-navy/5 disabled:opacity-20"
          aria-label="Bajar"
        >
          <ChevronDown size={15} />
        </button>
        <button
          type="button"
          disabled={removing}
          onClick={() => setConfirmOpen(true)}
          className="rounded-pill p-1.5 text-navy/40 hover:bg-coral-soft hover:text-coral disabled:opacity-40"
          aria-label="Eliminar bloque"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="p-4">
        <BlockDataForm data={data} onChange={onDataChange} />
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="mt-4 flex items-center gap-1.5 rounded-pill bg-navy px-4 py-2 text-p-caption font-semibold text-cream disabled:opacity-50"
        >
          <Save size={13} /> {saving ? "Guardando…" : "Guardar bloque"}
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={`¿Eliminar este bloque de "${label}"?`}
        description="Esta acción no se puede deshacer."
        confirmLabel="Eliminar bloque"
        loading={removing}
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete();
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

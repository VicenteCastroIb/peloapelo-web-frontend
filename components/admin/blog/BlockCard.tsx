"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Save, GripVertical } from "lucide-react";
import { updateBlock, deleteBlock, type AdminArticleBlock } from "@/lib/api/adminBlog";
import { ApiError } from "@/lib/api/client";
import type { BlockData, BlockType } from "@/lib/types/blogBlocks";
import { BLOCK_TYPE_LABEL } from "@/lib/admin/blogBlockDefaults";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Collapse from "@/components/shared/Collapse";
import BlockDataForm from "./BlockDataForm";

// Una tarjeta = un bloque del articulo. `data`/`parseError` ahora los
// calcula BlockList.tsx (parsea TODOS los bloques apenas llegan, no solo el
// que se expande) y los pasa como props controladas -- asi el bloque sigue
// alimentando la vista previa en vivo (LiveArticlePreview) aunque la
// tarjeta este colapsada. `onDataChange` sube cada tecla al padre para esa
// preview; el guardado real al backend sigue siendo un paso explicito
// (boton "Guardar bloque"), para no disparar un PUT por cada letra.
export default function BlockCard({
  block,
  data,
  parseError,
  token,
  index,
  total,
  moveDisabled,
  onMoveUp,
  onMoveDown,
  onDataChange,
  onChange,
}: {
  block: AdminArticleBlock;
  data: BlockData | null;
  parseError: string | null;
  token: string | null | undefined;
  index: number;
  total: number;
  /** true mientras hay un reorder en vuelo (ver BlockList) -- evita mandar dos PUT /reorder en simultaneo con clicks rapidos. */
  moveDisabled?: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDataChange: (data: BlockData) => void;
  onChange: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function save() {
    if (!data) return;
    setSaving(true);
    setError(null);
    try {
      await updateBlock(token, block.id, {
        blockType: data.type,
        position: block.position,
        dataJson: JSON.stringify(data),
      });
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el bloque");
    } finally {
      setSaving(false);
    }
  }

  function removeClick() {
    // removing evita el doble-click (mismo bug que el delete de articulo en
    // ArticleForm.tsx: sin guardia, un segundo click mientras el primer
    // DELETE todavia esta en vuelo termina pegandole a un bloque que el
    // primer click ya borro -- 404 sin manejar, pantalla roja de Next.js).
    if (removing) return;
    setConfirmOpen(true);
  }

  async function confirmRemove() {
    setConfirmOpen(false);
    setRemoving(true);
    setError(null);
    try {
      await deleteBlock(token, block.id);
      onChange();
    } catch (err) {
      // 404 = ya no existe -- el resultado buscado ya esta logrado.
      if (err instanceof ApiError && err.status === 404) {
        onChange();
        return;
      }
      setError(err instanceof Error ? err.message : "No se pudo eliminar el bloque");
      setRemoving(false);
    }
  }

  const label = BLOCK_TYPE_LABEL[block.blockType as BlockType] ?? block.blockType;

  return (
    <div className="rounded-card-md border border-navy/10 bg-white shadow-sm">
      <div className="flex items-center gap-2 px-4 py-3">
        <GripVertical size={15} className="shrink-0 text-navy/20" />
        <button type="button" onClick={() => setExpanded((v) => !v)} className="flex flex-1 items-center gap-2 text-left">
          <span className="rounded-pill bg-navy/5 px-2.5 py-0.5 text-p-caption font-semibold text-navy/70">{label}</span>
          {expanded ? <ChevronUp size={15} className="text-navy/40" /> : <ChevronDown size={15} className="text-navy/40" />}
        </button>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            disabled={index === 0 || moveDisabled}
            onClick={onMoveUp}
            className="rounded-pill p-2 text-navy/40 hover:bg-navy/5 disabled:opacity-20"
            aria-label="Subir"
          >
            <ChevronUp size={15} />
          </button>
          <button
            type="button"
            disabled={index === total - 1 || moveDisabled}
            onClick={onMoveDown}
            className="rounded-pill p-2 text-navy/40 hover:bg-navy/5 disabled:opacity-20"
            aria-label="Bajar"
          >
            <ChevronDown size={15} />
          </button>
          <button
            type="button"
            onClick={removeClick}
            disabled={removing}
            className="rounded-pill p-2 text-navy/40 hover:bg-coral-soft hover:text-coral disabled:opacity-40"
            aria-label="Eliminar bloque"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {error && <p className="px-4 pb-3 text-p-caption text-coral">{error}</p>}

      <ConfirmDialog
        open={confirmOpen}
        title={`¿Eliminar este bloque de "${label}"?`}
        description="Esta acción no se puede deshacer."
        confirmLabel="Eliminar bloque"
        loading={removing}
        onConfirm={confirmRemove}
        onCancel={() => setConfirmOpen(false)}
      />

      <Collapse open={expanded}>
        <div className="border-t border-navy/10 p-4">
          {parseError && <p className="text-p-caption text-coral">{parseError}</p>}
          {data && (
            <>
              <BlockDataForm data={data} onChange={onDataChange} />
              {error && <p className="mt-3 text-p-caption text-coral">{error}</p>}
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="mt-4 flex items-center gap-1.5 rounded-pill bg-navy px-4 py-2 text-p-caption font-semibold text-cream disabled:opacity-50"
              >
                <Save size={13} /> {saving ? "Guardando…" : "Guardar bloque"}
              </button>
            </>
          )}
        </div>
      </Collapse>
    </div>
  );
}

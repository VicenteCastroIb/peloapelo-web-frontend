"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { createBlock, reorderBlocks, type AdminArticleBlock } from "@/lib/api/adminBlog";
import { ApiError } from "@/lib/api/client";
import type { BlockData, BlockType } from "@/lib/types/blogBlocks";
import { BLOCK_TYPE_LABEL, BLOCK_TYPE_OPTIONS, defaultBlockData } from "@/lib/admin/blogBlockDefaults";
import BlockCard from "./BlockCard";

function parseBlockData(dataJson: string, blockType: string): BlockData | null {
  try {
    const parsed = JSON.parse(dataJson);
    return { ...parsed, type: blockType } as BlockData;
  } catch {
    return null;
  }
}

const PARSE_ERROR_MESSAGE =
  "El contenido de este bloque no se pudo leer (JSON inválido). Puede haberse editado fuera del panel.";

// Dueño del "borrador en vivo" de todos los bloques del articulo: parsea
// cada `dataJson` apenas llega (no solo el que se expande, a diferencia del
// diseño original) y mantiene ese estado actualizado con cada tecla que
// Jessica escribe en cualquier BlockCard. `onLiveChange` sube la lista
// ordenada y ya tipada a la pagina de edicion para alimentar
// LiveArticlePreview -- el guardado real a la API sigue siendo por bloque
// (boton "Guardar bloque"), esto es solo lo que se ve mientras se escribe.
export default function BlockList({
  articleId,
  blocks,
  token,
  onChange,
  onLiveChange,
}: {
  articleId: string;
  blocks: AdminArticleBlock[];
  token: string | null | undefined;
  onChange: () => void;
  onLiveChange?: (blocks: BlockData[]) => void;
}) {
  const [newType, setNewType] = useState<BlockType>("rich_text");
  const [adding, setAdding] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [draft, setDraft] = useState<Record<string, BlockData | null>>({});
  const [error, setError] = useState<string | null>(null);

  const sorted = [...blocks].sort((a, b) => a.position - b.position);

  // Resembrar el borrador cuando cambia la lista de bloques en si (carga
  // inicial, o despues de agregar/eliminar/reordenar, que van directo a la
  // API y recargan) -- NO en cada tecla, eso lo maneja onDataChange abajo
  // actualizando `draft` directamente sin volver a parsear todo.
  useEffect(() => {
    setDraft(Object.fromEntries(sorted.map((b) => [b.id, parseBlockData(b.dataJson, b.blockType)])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks]);

  useEffect(() => {
    const ordered = sorted.map((b) => draft[b.id]).filter((d): d is BlockData => d != null);
    onLiveChange?.(ordered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  // Sin try/catch (bug real, ago 2026): un click en subir/bajar mientras el
  // articulo ya no existe mas (ej. se borro desde otra pestaña) hacia que
  // reorderBlocks tirara 404 "Articulo no encontrado" SIN atajar -- esa
  // excepcion se escapaba de un handler de click (nadie hace await de un
  // onClick), quedaba como promise rejection sin manejar y tumbaba toda la
  // pagina con la pantalla roja de Next.js. `reordering` de paso evita
  // mandar dos reorders en simultaneo si se clickea rapido.
  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sorted.length || reordering) return;
    const reordered = [...sorted];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setReordering(true);
    setError(null);
    try {
      await reorderBlocks(token, articleId, reordered.map((b) => b.id));
      onChange();
    } catch (err) {
      // 404 = el articulo ya no existe -- onChange() dispara el load() de la
      // pagina, que ahora redirige sola a /admin/blog en ese caso (ver
      // app/(app)/admin/blog/[id]/page.tsx).
      if (err instanceof ApiError && err.status === 404) {
        onChange();
        return;
      }
      setError(err instanceof Error ? err.message : "No se pudo reordenar el bloque");
    } finally {
      setReordering(false);
    }
  }

  async function addBlock() {
    setAdding(true);
    setError(null);
    try {
      await createBlock(token, articleId, {
        blockType: newType,
        position: sorted.length,
        dataJson: JSON.stringify(defaultBlockData(newType)),
      });
      onChange();
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        onChange();
        return;
      }
      setError(err instanceof Error ? err.message : "No se pudo agregar el bloque");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div>
      {error && <p className="mb-3 text-p-small text-coral">{error}</p>}

      {sorted.length === 0 && (
        <p className="rounded-card-md bg-white p-6 text-center text-p-small text-navy/50 shadow-sm">
          Este artículo todavía no tiene contenido. Agrega el primer bloque abajo.
        </p>
      )}

      <div className="space-y-3">
        {sorted.map((block, i) => (
          <BlockCard
            key={block.id}
            block={block}
            data={draft[block.id] ?? null}
            parseError={block.id in draft && draft[block.id] === null ? PARSE_ERROR_MESSAGE : null}
            token={token}
            index={i}
            total={sorted.length}
            moveDisabled={reordering}
            onMoveUp={() => move(i, -1)}
            onMoveDown={() => move(i, 1)}
            onDataChange={(data) => setDraft((prev) => ({ ...prev, [block.id]: data }))}
            onChange={onChange}
          />
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-card-md border border-dashed border-navy/20 p-3">
        <select
          className="rounded-card-md border border-navy/15 bg-cream px-3 py-2 text-p-small text-navy outline-none focus:border-accent"
          value={newType}
          onChange={(e) => setNewType(e.target.value as BlockType)}
        >
          {BLOCK_TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>
              {BLOCK_TYPE_LABEL[type]}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addBlock}
          disabled={adding}
          className="flex items-center gap-1.5 rounded-pill bg-navy/5 px-4 py-2 text-p-caption font-semibold text-navy hover:bg-navy/10 disabled:opacity-50"
        >
          <Plus size={14} /> {adding ? "Agregando…" : "Agregar bloque"}
        </button>
      </div>
    </div>
  );
}

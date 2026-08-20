"use client";

import { useEffect, useState } from "react";
import {
  createBlock,
  deleteBlock,
  reorderBlocks,
  updateBlock,
  type AdminArticleBlock,
  type ArticleRequest,
} from "@/lib/api/adminBlog";
import { ApiError } from "@/lib/api/client";
import type { BlockData, BlockType } from "@/lib/types/blogBlocks";
import { BLOCK_TYPE_LABEL, defaultBlockData } from "@/lib/admin/blogBlockDefaults";
import BlockDataList from "@/components/articles/BlockDataList";
import PreviewErrorBoundary from "@/components/admin/PreviewErrorBoundary";
import ArticleHeaderPreview from "./ArticleHeaderPreview";
import BlockPalette from "./BlockPalette";
import BlockInspector from "./BlockInspector";

function parseBlockData(dataJson: string, blockType: string): BlockData | null {
  try {
    const parsed = JSON.parse(dataJson);
    return { ...parsed, type: blockType } as BlockData;
  } catch {
    return null;
  }
}

// Editor visual del contenido de un articulo (fase 0, ago 2026): reemplaza
// el formulario-lista-aparte-de-la-preview por un lienzo de 3 columnas --
// paleta (agregar) | lienzo (encabezado del articulo + BlockDataList en modo
// editable: el contenido real, seleccionable/arrastrable) | inspector
// (editar el bloque seleccionado). El "borrador en vivo" de los bloques se
// mantiene aca (parsea cada `dataJson` apenas llega, actualiza en cada tecla
// que Jessica escribe en el inspector) para que el lienzo se vea siempre
// actualizado -- el guardado real a la API sigue siendo por bloque (boton
// "Guardar bloque" del inspector).
export default function BlockList({
  articleId,
  blocks,
  articleFields,
  token,
  onChange,
}: {
  articleId: string;
  blocks: AdminArticleBlock[];
  /** Borrador en vivo de los campos de portada (titulo, resumen, etc.) -- ver ArticleForm en la pagina de edicion. Se muestra arriba de los bloques para que el lienzo sea el articulo completo, no solo el contenido. */
  articleFields: ArticleRequest;
  token: string | null | undefined;
  onChange: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [draft, setDraft] = useState<Record<string, BlockData | null>>({});
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
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

  // Bloques con dataJson invalido (ej. editado fuera del panel) -- no se
  // pueden renderizar en el lienzo, asi que quedan afuera de `visibleSorted`
  // (que es lo que alimenta BlockDataList/seleccion/reorder) y en cambio se
  // listan aparte con la unica accion posible: eliminarlos.
  const brokenBlocks = sorted.filter((b) => draft[b.id] === null);
  const visibleSorted = sorted.filter((b) => draft[b.id] != null);

  const selectedIndex = selectedBlockId ? visibleSorted.findIndex((b) => b.id === selectedBlockId) : -1;
  const selectedBlock = selectedIndex >= 0 ? visibleSorted[selectedIndex] : null;
  const selectedData = selectedBlock ? (draft[selectedBlock.id] ?? null) : null;

  // Sin try/catch (bug real, ago 2026): un reorder mientras el articulo ya
  // no existe mas (ej. se borro desde otra pestaña) hacia que reorderBlocks
  // tirara 404 "Articulo no encontrado" SIN atajar -- esa excepcion quedaba
  // como promise rejection sin manejar y tumbaba toda la pagina con la
  // pantalla roja de Next.js. `reordering` de paso evita mandar dos reorders
  // en simultaneo con drags/clicks rapidos.
  async function handleReorder(from: number, to: number) {
    if (reordering) return;
    const clampedTo = Math.max(0, Math.min(to, visibleSorted.length - 1));
    if (from === clampedTo || from < 0 || from >= visibleSorted.length) return;

    // `visibleSorted` puede ser un subconjunto de `sorted` si hay bloques
    // rotos (ver brokenBlocks) -- se reordena solo dentro de los indices
    // visibles y despues se reinserta ese nuevo orden en los huecos que
    // ocupaban los bloques visibles dentro del orden completo, dejando los
    // rotos fijos en su posicion.
    const reorderedVisibleIds = visibleSorted.map((b) => b.id);
    const [movedId] = reorderedVisibleIds.splice(from, 1);
    reorderedVisibleIds.splice(clampedTo, 0, movedId);
    let vi = 0;
    const fullOrder = sorted.map((b) => (draft[b.id] != null ? reorderedVisibleIds[vi++] : b.id));

    setReordering(true);
    setError(null);
    try {
      await reorderBlocks(token, articleId, fullOrder);
      onChange();
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        onChange();
        return;
      }
      setError(err instanceof Error ? err.message : "No se pudo reordenar el bloque");
    } finally {
      setReordering(false);
    }
  }

  function moveSelected(direction: -1 | 1) {
    if (selectedIndex < 0) return;
    handleReorder(selectedIndex, selectedIndex + direction);
  }

  async function addBlock(type: BlockType) {
    setAdding(true);
    setError(null);
    try {
      const created = await createBlock(token, articleId, {
        blockType: type,
        position: sorted.length,
        dataJson: JSON.stringify(defaultBlockData(type)),
      });
      setSelectedBlockId(created.id);
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

  async function saveSelected() {
    if (!selectedBlock || !selectedData) return;
    setSaving(true);
    setError(null);
    try {
      await updateBlock(token, selectedBlock.id, {
        blockType: selectedData.type,
        position: selectedBlock.position,
        dataJson: JSON.stringify(selectedData),
      });
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el bloque");
    } finally {
      setSaving(false);
    }
  }

  async function removeBlock(id: string) {
    setRemoving(true);
    setError(null);
    try {
      await deleteBlock(token, id);
      setSelectedBlockId((current) => (current === id ? null : current));
      onChange();
    } catch (err) {
      // 404 = ya no existe -- el resultado buscado ya esta logrado.
      if (err instanceof ApiError && err.status === 404) {
        setSelectedBlockId((current) => (current === id ? null : current));
        onChange();
        return;
      }
      setError(err instanceof Error ? err.message : "No se pudo eliminar el bloque");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div>
      {error && <p className="mb-3 text-p-small text-coral">{error}</p>}

      {brokenBlocks.length > 0 && (
        <div className="mb-4 rounded-card-md border border-coral/30 bg-coral-soft p-3 text-p-caption text-coral">
          <p className="font-semibold">
            {brokenBlocks.length === 1
              ? "Hay 1 bloque con contenido inválido que no se puede mostrar en el lienzo."
              : `Hay ${brokenBlocks.length} bloques con contenido inválido que no se pueden mostrar en el lienzo.`}
          </p>
          <ul className="mt-1.5 space-y-1">
            {brokenBlocks.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-2">
                <span>
                  {BLOCK_TYPE_LABEL[b.blockType as BlockType] ?? b.blockType} (posición {b.position + 1})
                </span>
                <button type="button" className="font-semibold underline" onClick={() => removeBlock(b.id)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[200px_minmax(0,1fr)_320px]">
        <BlockPalette onAdd={addBlock} disabled={adding} />

        <div className="min-w-0 rounded-card-lg border border-navy/10 bg-white p-6 shadow-sm sm:p-8">
          <PreviewErrorBoundary>
            <ArticleHeaderPreview fields={articleFields} />
          </PreviewErrorBoundary>

          <div className="mt-10">
            {visibleSorted.length === 0 ? (
              <p className="mx-auto max-w-3xl rounded-card-md bg-cream p-6 text-center text-p-small text-navy/50">
                Este artículo todavía no tiene contenido. Agregá el primer bloque desde el panel de la
                izquierda.
              </p>
            ) : (
              <PreviewErrorBoundary>
                <BlockDataList
                  blocks={visibleSorted.map((b) => draft[b.id]!)}
                  editable
                  selectedIndex={selectedIndex >= 0 ? selectedIndex : null}
                  onSelect={(i) => setSelectedBlockId(visibleSorted[i]?.id ?? null)}
                  onReorder={handleReorder}
                />
              </PreviewErrorBoundary>
            )}
          </div>
        </div>

        <BlockInspector
          block={selectedBlock}
          data={selectedData}
          index={selectedIndex}
          total={visibleSorted.length}
          saving={saving}
          removing={removing}
          moveDisabled={reordering}
          onDataChange={(data) => {
            if (selectedBlock) setDraft((prev) => ({ ...prev, [selectedBlock.id]: data }));
          }}
          onSave={saveSelected}
          onDelete={() => selectedBlock && removeBlock(selectedBlock.id)}
          onMoveUp={() => moveSelected(-1)}
          onMoveDown={() => moveSelected(1)}
        />
      </div>
    </div>
  );
}
